export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function maskCurrency(): string {
  return '$ ****';
}

/**
 * Mask account/product number showing only last N digits
 * @example maskNumber("123456789") => "***6789"
 * @example maskNumber("5488", 4) => "***5488"
 */
export function maskNumber(number: string, visibleDigits = 4): string {
  if (number.length <= visibleDigits) return `***${number}`;
  return `***${number.slice(-visibleDigits)}`;
}
