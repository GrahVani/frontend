/**
 * Shared date/time formatting utilities for consistent display across the app.
 * Handles ISO strings, timezone-aware dates, and naive date strings.
 */

/**
 * Normalize a date string to YYYY-MM-DD format.
 * Handles full ISO strings (with T/Z/+), timezone offsets, and naive date strings.
 */
export function formatDate(dateStr?: string): string | undefined {
    if (!dateStr) return undefined;
    // If it's a full ISO string or has TZ info, parse it properly
    if (dateStr.includes('T') || dateStr.includes('Z') || dateStr.includes('+')) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
    }
    // Fallback: Extract YYYY-MM-DD literal
    return dateStr.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || dateStr;
}

/**
 * Normalize a time string to HH:mm:ss format.
 * Handles ISO datetimes, timezone suffixes, and naive time strings.
 */
export function formatTime(timeStr?: string): string | undefined {
    if (!timeStr) return undefined;

    // If it's an ISO datetime or has Z/+ suffixes, convert to local time
    const hasDate = timeStr.includes('-') && timeStr.includes(':');
    const parseable = hasDate ? timeStr : `1970-01-01T${timeStr}`;

    if (timeStr.includes('T') || timeStr.includes('Z') || timeStr.includes('+')) {
        const d = new Date(parseable);
        if (!isNaN(d.getTime())) {
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            const s = String(d.getSeconds()).padStart(2, '0');
            return `${h}:${m}:${s}`;
        }
    }

    // Fallback: Extract HH:mm:ss literal, stripping timezone/ms suffixes
    return timeStr.split('.')[0].split('+')[0].split('Z')[0];
}
