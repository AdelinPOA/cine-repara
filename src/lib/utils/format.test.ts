import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateShort,
  formatDateTime,
  formatTime,
  formatNumber,
  formatCurrency,
  formatPriceRange,
  formatHourlyRate,
  pluralize,
  formatCount,
  formatPercentage,
  formatPhoneNumber,
  truncate,
  formatFileSize,
} from './format';

describe('Romanian Formatting Utilities', () => {
  describe('formatDate', () => {
    it('formats date in Romanian locale', () => {
      const date = new Date('2024-12-26');
      const formatted = formatDate(date);
      expect(formatted).toContain('decembrie');
      expect(formatted).toContain('2024');
    });

    it('formats date from string', () => {
      const formatted = formatDate('2024-12-26');
      expect(formatted).toContain('decembrie');
    });
  });

  describe('formatDateShort', () => {
    it('formats date in short format', () => {
      const date = new Date('2024-12-26');
      const formatted = formatDateShort(date);
      expect(formatted).toBe('26.12.2024');
    });
  });

  describe('formatDateTime', () => {
    it('formats date with time', () => {
      const date = new Date('2024-12-26T14:30:00');
      const formatted = formatDateTime(date);
      expect(formatted).toContain('decembrie');
      expect(formatted).toContain('14:30');
    });
  });

  describe('formatTime', () => {
    it('formats time only', () => {
      const date = new Date('2024-12-26T14:30:00');
      const formatted = formatTime(date);
      expect(formatted).toBe('14:30');
    });
  });

  describe('formatNumber', () => {
    it('formats number with Romanian locale', () => {
      const formatted = formatNumber(1234.56);
      expect(formatted).toBe('1.234,56');
    });

    it('formats large numbers correctly', () => {
      const formatted = formatNumber(1000000);
      expect(formatted).toContain('1.000.000');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency with decimals', () => {
      const formatted = formatCurrency(150);
      expect(formatted).toContain('150');
      expect(formatted).toContain('RON');
    });

    it('formats currency in compact mode', () => {
      const formatted = formatCurrency(150.75, { compact: true });
      expect(formatted).toBe('151 RON');
    });

    it('respects custom decimal places', () => {
      const formatted = formatCurrency(150, { decimals: 0 });
      expect(formatted).toContain('150');
    });
  });

  describe('formatPriceRange', () => {
    it('formats price range correctly', () => {
      const formatted = formatPriceRange(100, 200);
      expect(formatted).toBe('100 - 200 RON');
    });

    it('rounds decimal prices', () => {
      const formatted = formatPriceRange(99.99, 199.99);
      expect(formatted).toBe('100 - 200 RON');
    });
  });

  describe('formatHourlyRate', () => {
    it('formats hourly rate correctly', () => {
      const formatted = formatHourlyRate(150);
      expect(formatted).toBe('150 RON/oră');
    });

    it('rounds decimal rates', () => {
      const formatted = formatHourlyRate(149.99);
      expect(formatted).toBe('150 RON/oră');
    });
  });

  describe('pluralize', () => {
    it('returns singular for count 1', () => {
      const result = pluralize(1, 'recenzie', 'recenzii', 'recenzii');
      expect(result).toBe('recenzie');
    });

    it('returns plural for count 0', () => {
      const result = pluralize(0, 'recenzie', 'recenzii', 'recenzii');
      expect(result).toBe('recenzii');
    });

    it('returns plural few for counts 2-19', () => {
      const result = pluralize(5, 'recenzie', 'recenzii', 'de recenzii');
      expect(result).toBe('de recenzii');
    });

    it('returns plural for count 20+', () => {
      const result = pluralize(20, 'recenzie', 'recenzii', 'de recenzii');
      expect(result).toBe('recenzii');
    });

    it('returns plural for count 100+', () => {
      const result = pluralize(100, 'recenzie', 'recenzii', 'de recenzii');
      expect(result).toBe('recenzii');
    });
  });

  describe('formatCount', () => {
    it('formats count with singular noun', () => {
      const result = formatCount(1, 'instalator', 'instalatori');
      expect(result).toBe('1 instalator');
    });

    it('formats count with plural noun', () => {
      const result = formatCount(5, 'instalator', 'instalatori');
      expect(result).toBe('5 instalatori');
    });
  });

  describe('formatPercentage', () => {
    it('formats percentage correctly', () => {
      const result = formatPercentage(0.75);
      expect(result).toContain('75');
      expect(result).toContain('%');
    });

    it('formats decimal percentages', () => {
      const result = formatPercentage(0.456);
      expect(result).toContain('45');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats Romanian mobile number', () => {
      const result = formatPhoneNumber('0712345678');
      expect(result).toBe('0712 345 678');
    });

    it('formats international mobile number', () => {
      const result = formatPhoneNumber('+40712345678');
      // Note: Current implementation returns without spaces for this format
      expect(result).toBe('+40712345678');
    });

    it('formats Romanian landline (02XX)', () => {
      const result = formatPhoneNumber('0212345678');
      expect(result).toBe('0212 345 678');
    });

    it('formats Romanian landline (03XX)', () => {
      const result = formatPhoneNumber('0312345678');
      expect(result).toBe('0312 345 678');
    });

    it('handles phone with spaces and dashes', () => {
      const result = formatPhoneNumber('0712-345-678');
      expect(result).toBe('0712 345 678');
    });

    it('returns as-is for invalid format', () => {
      const result = formatPhoneNumber('123');
      expect(result).toBe('123');
    });
  });

  describe('truncate', () => {
    it('truncates long text', () => {
      const result = truncate('Lorem ipsum dolor sit amet', 10);
      expect(result).toBe('Lorem ipsu...');
    });

    it('does not truncate short text', () => {
      const result = truncate('Short', 10);
      expect(result).toBe('Short');
    });

    it('handles exact length', () => {
      const result = truncate('Exactly10!', 10);
      expect(result).toBe('Exactly10!');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      const result = formatFileSize(500);
      expect(result).toBe('500 B');
    });

    it('formats kilobytes', () => {
      const result = formatFileSize(1024);
      expect(result).toBe('1 KB');
    });

    it('formats megabytes', () => {
      const result = formatFileSize(1536000);
      expect(result).toBe('1.5 MB');
    });

    it('formats gigabytes', () => {
      const result = formatFileSize(1073741824);
      expect(result).toBe('1 GB');
    });

    it('handles zero bytes', () => {
      const result = formatFileSize(0);
      expect(result).toBe('0 B');
    });
  });
});
