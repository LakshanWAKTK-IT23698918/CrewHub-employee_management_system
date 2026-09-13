const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Returns true if the trimmed value is a syntactically valid email address.
 */
export function validateEmail(value) {
  if (!value) return false;
  return EMAIL_REGEX.test(String(value).trim());
}

/**
 * Returns true if the value is present (not null/undefined/empty after trimming).
 */
export function validateRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length > 0;
}

/**
 * Returns true if the (trimmed) string value has at least `min` characters.
 */
export function validateMinLength(value, min) {
  if (value === null || value === undefined) return false;
  return String(value).trim().length >= min;
}

/**
 * Returns true if the value, when parsed as a number, is strictly greater than 0.
 */
export function validatePositive(value) {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !Number.isNaN(num) && num > 0;
}

/**
 * Returns true if the given date (a dayjs instance, Date, or ISO string) is
 * today or earlier — i.e. NOT in the future.
 */
export function validateNotFuture(date) {
  if (!date) return true;

  const value = typeof date === 'object' && typeof date.toDate === 'function'
    ? date.toDate()
    : new Date(date);

  if (Number.isNaN(value.getTime())) return false;

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return value.getTime() <= endOfToday.getTime();
}
