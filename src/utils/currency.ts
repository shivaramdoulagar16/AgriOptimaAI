/**
 * AgriOptima AI - Centralized Currency Utility (Single Source of Truth)
 * Standardizes all monetary representations to Indian Rupees (INR / ₹)
 * using authentic Indian numbering system formatting (e.g. ₹1,00,000).
 */

export const CURRENCY_CONFIG = {
  currency: 'INR',
  symbol: '₹',
  locale: 'en-IN'
};

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const inrFormatterDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

/**
 * Formats a monetary value to Indian Rupees with Indian numbering formatting.
 * Examples:
 *   formatINR(1000) -> "₹1,000"
 *   formatINR(25000) -> "₹25,000"
 *   formatINR(100000) -> "₹1,00,000"
 *   formatINR(1250000) -> "₹12,50,000"
 */
export function formatINR(amount: number | string | undefined | null, includeDecimals = false): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return includeDecimals ? inrFormatterDecimals.format(num) : inrFormatter.format(num);
}
