/**
 * Calculate total pages for carousel pagination
 */
export function calculateTotalPages(totalItems: number, visibleItems: number): number {
  if (visibleItems <= 0) return 0;
  return Math.ceil(totalItems / visibleItems);
}

/**
 * Get current page index based on scroll position
 */
export function getCurrentPage(
  scrollLeft: number,
  cardWidth: number,
  gap: number
): number {
  const itemWidth = cardWidth + gap;
  if (itemWidth <= 0) return 0;
  return Math.round(scrollLeft / itemWidth);
}

/**
 * Calculate scroll position for a specific page
 */
export function getScrollPositionForPage(
  page: number,
  cardWidth: number,
  gap: number
): number {
  return page * (cardWidth + gap);
}

/**
 * Get number of visible items based on container width
 */
export function getVisibleItems(containerWidth: number): number {
  if (containerWidth < 640) return 1;      // Mobile
  if (containerWidth < 1024) return 2;     // Tablet
  return 3;                                 // Desktop
}
