import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

/**
 * Malaysia time is UTC+8 (480 minutes ahead of UTC).
 * All check_in / check_out values from the database are stored as UTC.
 * This constant is used to convert them to Malaysia local time for display.
 */
const MYT_OFFSET_MINUTES = 8 * 60;

/**
 * Convert a UTC time string ("HH:MM:SS" or "HH:MM") to Malaysia time ("HH:MM").
 * Use this whenever displaying check_in / check_out values from the database.
 * Returns null for empty/null input so call sites can supply their own fallback.
 *
 * Example: "06:00:00" UTC → "14:00" MYT
 */
export function utcTimeToMyt(utcTime: string | null | undefined): string | null {
    if (!utcTime) return null;
    const [h, m] = utcTime.split(':').map(Number);
    const totalMinutes = (h * 60 + m + MYT_OFFSET_MINUTES) % (24 * 60);
    return [
        Math.floor(totalMinutes / 60).toString().padStart(2, '0'),
        (totalMinutes % 60).toString().padStart(2, '0'),
    ].join(':');
}

/**
 * Format a date string (YYYY-MM-DD or ISO 8601) as "7 April 2026".
 * Parses as a local date to avoid timezone shifts.
 */
export function formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    const [datePart] = value.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}
