/**
 * Date parsing, formatting, and duration utilities for Dasha calculations.
 */

/** Parse API date string (various formats) to Date object */
export function parseApiDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    // Handle DD-MM-YYYY or DD-MM-YYYY HH:mm:ss
    if (dateStr.includes('-')) {
        const parts = dateStr.split(' ')[0].split('-');
        if (parts[0].length === 2) {
            const timePart = dateStr.split(' ')[1] || '00:00:00';
            const [d, m, y] = parts;
            return new Date(`${y}-${m}-${d}T${timePart.replace(/:/g, ':')}`);
        }
    }

    // Handle "DD MMM YYYY" or other human formats
    const parsed = new Date(dateStr.replace(' ', 'T'));
    if (!isNaN(parsed.getTime())) return parsed;

    return new Date(dateStr);
}

/** Format date for display */
export function formatDateDisplay(dateStr: string): string {
    try {
        if (!dateStr) return '\u2014';
        const date = parseApiDate(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return '\u2014'; }
}

/** Check if a date range includes the current time */
export function isDateRangeCurrent(start: string, end: string): boolean {
    if (!start || !end) return false;
    const now = new Date();
    const s = parseApiDate(start);
    const e = parseApiDate(end);
    return now >= s && now <= e;
}

/** Core formatter for duration in milliseconds */
export function formatDurationMs(totalMs: number): string {
    if (totalMs <= 0) return "0d";

    const MS_PER_MINUTE = 60 * 1000;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    const MS_PER_DAY = 24 * MS_PER_HOUR;
    const MS_PER_MONTH = (365.25 / 12) * MS_PER_DAY;
    const MS_PER_YEAR = 365.25 * MS_PER_DAY;

    if (totalMs >= MS_PER_YEAR) {
        const y = Math.floor(totalMs / MS_PER_YEAR);
        const remaining = totalMs % MS_PER_YEAR;
        const m = Math.round(remaining / MS_PER_MONTH);
        if (m === 0) return `${y}y`;
        if (m === 12) return `${y + 1}y`;
        return `${y}y ${m}m`;
    }

    if (totalMs >= MS_PER_MONTH) {
        const m = Math.floor(totalMs / MS_PER_MONTH);
        const remaining = totalMs % MS_PER_MONTH;
        const d = Math.round(remaining / MS_PER_DAY);
        if (d === 0) return `${m}m`;
        return `${m}m ${d}d`;
    }

    if (totalMs >= MS_PER_DAY) {
        const d = Math.floor(totalMs / MS_PER_DAY);
        const remaining = totalMs % MS_PER_DAY;
        const h = Math.round(remaining / MS_PER_HOUR);
        if (h === 0) return `${d}d`;
        return `${d}d ${h}h`;
    }

    if (totalMs >= MS_PER_HOUR) {
        const h = Math.floor(totalMs / MS_PER_HOUR);
        const remaining = totalMs % MS_PER_HOUR;
        const min = Math.round(remaining / MS_PER_MINUTE);
        if (min === 0) return `${h}h`;
        return `${h}h ${min}m`;
    }

    const min = Math.round(totalMs / MS_PER_MINUTE);
    return `${Math.max(1, min)}m`;
}

/** Calculate duration between two date strings */
export function calculateDuration(startStr: string, endStr: string): string {
    if (!startStr || !endStr) return "\u2014";
    const start = parseApiDate(startStr).getTime();
    const end = parseApiDate(endStr).getTime();
    return formatDurationMs(end - start);
}

/** Standardize durations like 2.5 years -> "2y 6m" */
export function standardizeDuration(years: number, days?: number): string {
    if (years <= 0 && (!days || days <= 0)) return "0d";
    const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
    const totalMs = (years > 0 ? years * msPerYear : 0) + (days && days > 0 ? days * 24 * 60 * 60 * 1000 : 0);
    return formatDurationMs(totalMs);
}

/** Convert Date to API date string format */
export function toApiDateString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
