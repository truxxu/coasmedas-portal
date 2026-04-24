"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { CarouselArrow, CarouselDots } from "@/src/atoms";
import { CoaspocketProductCard, CreatePocketCard } from "@/src/molecules";
import {
  CoaspocketProduct,
  OnCoaspocketSelect,
  OnCreatePocket,
} from "@/src/types";
import { calculateTotalPages, getVisibleItems } from "@/src/utils";

interface CoaspocketCarouselProps {
  title: string;
  products: CoaspocketProduct[];
  selectedProductId?: string;
  onProductSelect: OnCoaspocketSelect;
  onCreatePocket: OnCreatePocket;
  className?: string;
  accountName?: string;
  accountNumber?: string;
}

export function CoaspocketCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  onCreatePocket,
  className = "",
  accountName,
  accountNumber,
}: CoaspocketCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Include the "create pocket" card in total items count
  const totalItems = products.length + 1;
  const totalPages = calculateTotalPages(totalItems, visibleItems);

  // Update visible items on resize
  useEffect(() => {
    const updateVisibleItems = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleItems(getVisibleItems(width));
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  // Keep latest values in a ref so the scroll handler identity is stable and
  // we don't re-register the listener on every visibleItems/totalPages change.
  const scrollDepsRef = useRef({ visibleItems, totalPages });
  useEffect(() => {
    scrollDepsRef.current = { visibleItems, totalPages };
  }, [visibleItems, totalPages]);

  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const { visibleItems: vi, totalPages: tp } = scrollDepsRef.current;
    const cardWidth = clientWidth / vi;
    const gap = 20;
    const pageStep = vi * (cardWidth + gap);
    const page = pageStep > 0 ? Math.round(scrollLeft / pageStep) : 0;
    setCurrentPage(Math.min(page, Math.max(tp - 1, 0)));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    return () => container.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  // Recompute page indicator when layout inputs change without re-registering listener.
  useEffect(() => {
    updateScrollState();
  }, [visibleItems, totalPages, updateScrollState]);

  // Scroll handlers
  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const { clientWidth, scrollWidth } = containerRef.current;
    const cardWidth = clientWidth / visibleItems;
    const gap = 20; // gap-5 = 20px
    const maxScroll = Math.max(scrollWidth - clientWidth, 0);
    const target = Math.min(page * visibleItems * (cardWidth + gap), maxScroll);
    containerRef.current.scrollTo({
      left: target,
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const scrollRight = () => {
    if (currentPage < totalPages - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-[20px] font-bold text-brand-navy-dark">{title}</h2>
        {accountName && (
          <p className="text-[14px] text-brand-gray-high mt-1">
            {accountName}
            {accountNumber ? ` ${accountNumber}` : ""}
          </p>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow - Hidden on mobile */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          />
        </div>

        {/* Cards Container */}
        <div
          ref={containerRef}
          role="listbox"
          aria-label={title}
          className="
            flex gap-5 overflow-x-auto scroll-smooth
            snap-x snap-mandatory scrollbar-hide
            px-1 py-1
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Product Cards */}
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0 snap-start
                w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
              "
            >
              <CoaspocketProductCard
                product={product}
                isSelected={product.id === selectedProductId}
                onClick={() => onProductSelect(product)}
              />
            </div>
          ))}

          {/* Create Pocket Card */}
          <div
            className="
              flex-shrink-0 snap-start
              w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
            "
          >
            <CreatePocketCard onClick={onCreatePocket} />
          </div>
        </div>

        {/* Right Arrow - Hidden on mobile */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="right"
            onClick={scrollRight}
            disabled={!canScrollRight}
          />
        </div>
      </div>

      {/* Dot Indicators */}
      <CarouselDots
        totalDots={totalPages}
        activeDot={currentPage}
        onDotClick={scrollToPage}
      />
    </div>
  );
}
