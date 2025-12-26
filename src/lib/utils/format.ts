/**
 * Romanian Localization Utilities
 * Formatting for dates, numbers, currency, and relative time
 */

const LOCALE = 'ro-RO';
const CURRENCY = 'RON';

/**
 * Format date in Romanian locale
 *
 * @example
 * formatDate('2024-12-26') // "26 decembrie 2024"
 */
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat(LOCALE, options || defaultOptions).format(dateObj);
}

/**
 * Format date in short format
 *
 * @example
 * formatDateShort('2024-12-26') // "26.12.2024"
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

/**
 * Format date with time
 *
 * @example
 * formatDateTime('2024-12-26T14:30:00') // "26 decembrie 2024, 14:30"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format time only
 *
 * @example
 * formatTime('2024-12-26T14:30:00') // "14:30"
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "acum 2 ore", "ieri", "săptămâna trecută")
 *
 * @example
 * formatRelativeTime('2024-12-26T12:00:00') // "acum 2 ore"
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Future dates
  if (diffSeconds < 0) {
    return 'în viitor';
  }

  // Just now (< 1 minute)
  if (diffSeconds < 60) {
    return 'acum';
  }

  // Minutes ago
  if (diffMinutes < 60) {
    return `acum ${diffMinutes} ${pluralize(diffMinutes, 'minut', 'minute', 'minute')}`;
  }

  // Hours ago
  if (diffHours < 24) {
    return `acum ${diffHours} ${pluralize(diffHours, 'oră', 'ore', 'ore')}`;
  }

  // Yesterday
  if (diffDays === 1) {
    return 'ieri';
  }

  // Days ago
  if (diffDays < 7) {
    return `acum ${diffDays} ${pluralize(diffDays, 'zi', 'zile', 'zile')}`;
  }

  // Last week
  if (diffWeeks === 1) {
    return 'săptămâna trecută';
  }

  // Weeks ago
  if (diffWeeks < 4) {
    return `acum ${diffWeeks} ${pluralize(diffWeeks, 'săptămână', 'săptămâni', 'săptămâni')}`;
  }

  // Last month
  if (diffMonths === 1) {
    return 'luna trecută';
  }

  // Months ago
  if (diffMonths < 12) {
    return `acum ${diffMonths} ${pluralize(diffMonths, 'lună', 'luni', 'luni')}`;
  }

  // Last year
  if (diffYears === 1) {
    return 'anul trecut';
  }

  // Years ago
  return `acum ${diffYears} ${pluralize(diffYears, 'an', 'ani', 'ani')}`;
}

/**
 * Format number with Romanian locale
 *
 * @example
 * formatNumber(1234.56) // "1.234,56"
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(LOCALE, options).format(value);
}

/**
 * Format currency (RON)
 *
 * @example
 * formatCurrency(150) // "150,00 RON"
 * formatCurrency(150, { compact: true }) // "150 RON"
 */
export function formatCurrency(
  amount: number,
  options?: { compact?: boolean; decimals?: number }
): string {
  if (options?.compact) {
    return `${Math.round(amount)} ${CURRENCY}`;
  }

  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: options?.decimals ?? 2,
    maximumFractionDigits: options?.decimals ?? 2,
  }).format(amount);
}

/**
 * Format price range
 *
 * @example
 * formatPriceRange(100, 200) // "100 - 200 RON"
 */
export function formatPriceRange(min: number, max: number): string {
  return `${Math.round(min)} - ${Math.round(max)} ${CURRENCY}`;
}

/**
 * Format hourly rate
 *
 * @example
 * formatHourlyRate(150) // "150 RON/oră"
 */
export function formatHourlyRate(rate: number): string {
  return `${Math.round(rate)} ${CURRENCY}/oră`;
}

/**
 * Romanian plural rules
 *
 * @example
 * pluralize(1, 'recenzie', 'recenzii', 'recenzii') // "recenzie"
 * pluralize(5, 'recenzie', 'recenzii', 'recenzii') // "recenzii"
 * pluralize(20, 'recenzie', 'recenzii', 'recenzii') // "recenzii"
 */
export function pluralize(
  count: number,
  singular: string,
  plural: string,
  pluralFew?: string
): string {
  if (count === 1) {
    return singular;
  }

  // Romanian plural rules:
  // - 1: singular (handled above)
  // - 0, 2-19, 101-119, etc.: few form (if provided) or plural
  // - 20+, 100+, etc.: plural

  const mod100 = count % 100;
  if (pluralFew && (count === 0 || (mod100 >= 2 && mod100 <= 19))) {
    return pluralFew;
  }

  return plural;
}

/**
 * Format count with plural noun
 *
 * @example
 * formatCount(5, 'recenzie', 'recenzii') // "5 recenzii"
 * formatCount(1, 'instalator', 'instalatori') // "1 instalator"
 */
export function formatCount(
  count: number,
  singular: string,
  plural: string,
  pluralFew?: string
): string {
  return `${count} ${pluralize(count, singular, plural, pluralFew)}`;
}

/**
 * Format percentage
 *
 * @example
 * formatPercentage(0.75) // "75%"
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Format phone number (Romanian format)
 *
 * @example
 * formatPhoneNumber('0712345678') // "0712 345 678"
 * formatPhoneNumber('+40712345678') // "+40 712 345 678"
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // Romanian mobile: 07XX XXX XXX
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  // International format: +40 7XX XXX XXX
  if (cleaned.startsWith('+407') && cleaned.length === 13) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }

  // Romanian landline: 02XX XXX XXX or 03XX XXX XXX
  if ((cleaned.startsWith('02') || cleaned.startsWith('03')) && cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  // Return as-is if doesn't match expected patterns
  return phone;
}

/**
 * Truncate text with ellipsis
 *
 * @example
 * truncate('Lorem ipsum dolor sit amet', 10) // "Lorem ipsu..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Format file size
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536000) // "1,5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
