/**
 * Calculate the number of days between the given ISO date and today.
 */
export function daysInInventory(receivedAt: string): number {
  const received = new Date(receivedAt);
  const now = new Date();
  const diff = now.getTime() - received.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format a price number as USD currency string.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Human-readable status label from the status code.
 */
export function statusLabel(status: string | null): string {
  switch (status) {
    case 'PRICE_REDUCTION_PLANNED':
      return 'Price Reduction';
    case 'SEND_TO_AUCTION':
      return 'Send to Auction';
    case 'IN_REPAIR':
      return 'In Repair';
    default:
      return 'No Action';
  }
}

/**
 * CSS color class mapping for status badges.
 */
export function statusColor(status: string | null): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case 'PRICE_REDUCTION_PLANNED':
      return {
        bg: 'bg-amber-100 dark:bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        dot: 'bg-amber-500 dark:bg-amber-400',
      };
    case 'SEND_TO_AUCTION':
      return {
        bg: 'bg-red-100 dark:bg-red-500/10',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500 dark:bg-red-400',
      };
    case 'IN_REPAIR':
      return {
        bg: 'bg-sky-100 dark:bg-sky-500/10',
        text: 'text-sky-700 dark:text-sky-400',
        dot: 'bg-sky-500 dark:bg-sky-400',
      };
    default:
      return {
        bg: 'bg-surface-600/20 dark:bg-surface-600/40',
        text: 'text-text-muted',
        dot: 'bg-text-muted',
      };
  }
}
