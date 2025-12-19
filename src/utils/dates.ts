import { MonthOption } from '@/src/types/products';

/**
 * Format date for display (Spanish locale)
 * @example formatDate("2025-11-15") => "15 nov 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date for display with capitalized month
 * @example formatDateCapitalized("2025-11-15") => "15 Nov 2025"
 */
export function formatDateCapitalized(dateString: string): string {
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  // Capitalize the month abbreviation
  return formatted.replace(/\b[a-z]/g, (char) => char.toUpperCase());
}

/**
 * Generate month options for last N months
 * @example generateMonthOptions(3) => [{ value: "2025-12", label: "Diciembre de 2025" }, ...]
 */
export function generateMonthOptions(count: number = 12): MonthOption[] {
  const months: MonthOption[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const label = date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' });
    // Capitalize first letter
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);
    months.push({ value, label: capitalizedLabel });
  }

  return months;
}

/**
 * Check if date range is within allowed months
 */
export function isValidDateRange(startDate: string, endDate: string, maxMonths: number = 3): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // End date must be after or equal to start date
  if (end < start) return false;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= maxMonths * 31;
}

/**
 * Get date N months ago from today in YYYY-MM-DD format
 */
export function getDateMonthsAgo(months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}
