"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { CarouselArrow, CarouselDots } from "@/src/atoms";
import { TarjetaCreditoProductCard } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { calculateTotalPages, getVisibleItems } from "@/src/utils";

const SCROLLBAR_HIDE_STYLE: React.CSSProperties = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

interface TarjetaCreditoCarouselProps {
  title: string;
  products: TarjetaCreditoProduct[];
  selectedProductId?: string;
  onProductSelect: (product: TarjetaCreditoProduct) => void;
  className?: string;
}

export function TarjetaCreditoCarousel({
  title,
  products,
  selectedProductId,
  onProductSelect,
  className = "",
}: TarjetaCreditoCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const totalPages = calculateTotalPages(products.length, visibleItems);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setVisibleItems(getVisibleItems(width));
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems, { passive: true });
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const updateScrollState = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = clientWidth / visibleItems;
    const page = Math.round(scrollLeft / cardWidth);
    setCurrentPage(Math.min(page, totalPages - 1));
  }, [visibleItems, totalPages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    return () => container.removeEventListener("scroll", updateScrollState);
  }, [updateScrollState]);

  const scrollToPage = (page: number) => {
    if (!containerRef.current) return;
    const cardWidth = containerRef.current.clientWidth / visibleItems;
    const gap = 20;
    containerRef.current.scrollTo({
      left: page * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  const scrollLeft = () => {
    if (currentPage > 0) scrollToPage(currentPage - 1);
  };

  const scrollRight = () => {
    if (currentPage < totalPages - 1) scrollToPage(currentPage + 1);
  };

  if (products.length === 0) {
    return (
      <div className={`bg-white rounded-2xl p-6 ${className}`}>
        <h2 className="text-[20px] font-bold text-brand-navy-dark mb-4">
          {title}
        </h2>
        <p className="text-[#58585B] text-center py-8">
          No hay tarjetas de crédito disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      <h2 className="text-[20px] font-bold text-brand-navy-dark mb-4">
        {title}
      </h2>

      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="left"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          />
        </div>

        <div
          ref={containerRef}
          role="listbox"
          aria-label={title}
          className="
            flex gap-5 overflow-x-auto scroll-smooth
            snap-x snap-mandatory scrollbar-hide
            px-1 py-1
          "
          style={SCROLLBAR_HIDE_STYLE}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-shrink-0 snap-start
                w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]
              "
            >
              <TarjetaCreditoProductCard
                product={product}
                isSelected={product.id === selectedProductId}
                onClick={() => onProductSelect(product)}
              />
            </div>
          ))}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 hidden sm:block">
          <CarouselArrow
            direction="right"
            onClick={scrollRight}
            disabled={!canScrollRight}
          />
        </div>
      </div>

      <CarouselDots
        totalDots={totalPages}
        activeDot={currentPage}
        onDotClick={scrollToPage}
      />
    </div>
  );
}
