/**
 * Formats a post date as "13 September 2026". Dates without a time are
 * read as UTC midnight, so the formatting uses UTC too; otherwise a visitor
 * west of Greenwich would see the day before.
 *
 * @param value An ISO date string from the content, or a Date.
 * @returns The formatted date, or an empty string when it can't be parsed.
 */
export function formatDate(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
}

/**
 * The `YYYY-MM-DD` form of a post date, for a `<time datetime>` attribute.
 *
 * @returns An empty string when the date can't be parsed.
 */
export function isoDate(value: string | Date): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}
