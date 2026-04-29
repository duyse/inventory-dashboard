import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { jest } from '@jest/globals';
import {
  daysInInventory,
  formatPrice,
  statusLabel,
  statusColor,
} from '../src/utils';

describe('daysInInventory', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-29T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns 0 for a date earlier today', () => {
    expect(daysInInventory('2026-04-29T00:00:00.000Z')).toBe(0);
  });

  it('returns the number of full days between received and now', () => {
    expect(daysInInventory('2026-04-19T12:00:00.000Z')).toBe(10);
  });

  it('handles dates more than a year old', () => {
    expect(daysInInventory('2025-04-29T12:00:00.000Z')).toBe(365);
  });

  it('returns a negative-ish value (floored) for future dates', () => {
    expect(daysInInventory('2026-05-04T12:00:00.000Z')).toBe(-5);
  });
});

describe('formatPrice', () => {
  it('formats whole-dollar amounts with no decimals', () => {
    expect(formatPrice(29439)).toBe('$29,439');
  });

  it('rounds fractional amounts', () => {
    expect(formatPrice(29439.6)).toBe('$29,440');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0');
  });

  it('formats large amounts with thousands separators', () => {
    expect(formatPrice(1234567)).toBe('$1,234,567');
  });
});

describe('statusLabel', () => {
  it.each([
    ['PRICE_REDUCTION_PLANNED', 'Price Reduction'],
    ['SEND_TO_AUCTION', 'Send to Auction'],
    ['IN_REPAIR', 'In Repair'],
  ])('maps %s to %s', (status, label) => {
    expect(statusLabel(status)).toBe(label);
  });

  it('falls back to "No Action" for null', () => {
    expect(statusLabel(null)).toBe('No Action');
  });

  it('falls back to "No Action" for unknown statuses', () => {
    expect(statusLabel('SOMETHING_ELSE')).toBe('No Action');
  });
});

describe('statusColor', () => {
  it('returns amber palette for PRICE_REDUCTION_PLANNED', () => {
    const c = statusColor('PRICE_REDUCTION_PLANNED');
    expect(c.bg).toContain('amber');
    expect(c.text).toContain('amber');
    expect(c.dot).toContain('amber');
  });

  it('returns red palette for SEND_TO_AUCTION', () => {
    const c = statusColor('SEND_TO_AUCTION');
    expect(c.bg).toContain('red');
    expect(c.text).toContain('red');
    expect(c.dot).toContain('red');
  });

  it('returns sky palette for IN_REPAIR', () => {
    const c = statusColor('IN_REPAIR');
    expect(c.bg).toContain('sky');
    expect(c.text).toContain('sky');
    expect(c.dot).toContain('sky');
  });

  it('returns muted/surface palette for null', () => {
    const c = statusColor(null);
    expect(c.text).toContain('muted');
    expect(c.dot).toContain('muted');
  });

  it('returns muted/surface palette for unknown status', () => {
    const c = statusColor('UNKNOWN_STATUS');
    expect(c.text).toContain('muted');
  });

  it('always returns the same shape', () => {
    for (const s of [
      'PRICE_REDUCTION_PLANNED',
      'SEND_TO_AUCTION',
      'IN_REPAIR',
      null,
      'X',
    ]) {
      const c = statusColor(s as string | null);
      expect(Object.keys(c).sort()).toEqual(['bg', 'dot', 'text']);
    }
  });
});
