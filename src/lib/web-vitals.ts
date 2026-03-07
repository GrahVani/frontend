// Core Web Vitals reporter — uses the Performance Observer API (no npm dependency).
// Reports LCP, FID, CLS, INP, and TTFB to the monitoring abstraction.

import { reportVital } from './monitoring';

type RatingThresholds = [number, number]; // [good, poor] boundaries in ms

const THRESHOLDS: Record<string, RatingThresholds> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    INP: [200, 500],
    TTFB: [800, 1800],
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const t = THRESHOLDS[name];
    if (!t) return 'good';
    if (value <= t[0]) return 'good';
    if (value <= t[1]) return 'needs-improvement';
    return 'poor';
}

function observeEntries(type: string, callback: (entry: PerformanceEntry) => void) {
    if (typeof PerformanceObserver === 'undefined') return;
    try {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                callback(entry);
            }
        });
        observer.observe({ type, buffered: true });
    } catch {
        // Observer type not supported in this browser
    }
}

export function initWebVitals(): void {
    if (typeof window === 'undefined') return;

    // LCP — Largest Contentful Paint
    observeEntries('largest-contentful-paint', (entry) => {
        reportVital({ name: 'LCP', value: entry.startTime, rating: getRating('LCP', entry.startTime) });
    });

    // FID — First Input Delay
    observeEntries('first-input', (entry) => {
        const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
        reportVital({ name: 'FID', value: fid, rating: getRating('FID', fid) });
    });

    // CLS — Cumulative Layout Shift
    let clsValue = 0;
    observeEntries('layout-shift', (entry) => {
        const ls = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!ls.hadRecentInput) {
            clsValue += ls.value;
            reportVital({ name: 'CLS', value: clsValue, rating: getRating('CLS', clsValue) });
        }
    });

    // TTFB — Time to First Byte
    observeEntries('navigation', (entry) => {
        const nav = entry as PerformanceNavigationTiming;
        const ttfb = nav.responseStart - nav.requestStart;
        if (ttfb > 0) {
            reportVital({ name: 'TTFB', value: ttfb, rating: getRating('TTFB', ttfb) });
        }
    });
}
