// Monitoring abstraction — captures errors and performance metrics.
// Replace the console-based implementation with Sentry when ready:
//   npm install @sentry/nextjs
//   Then swap the function bodies below.

interface ErrorContext {
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
    level?: 'fatal' | 'error' | 'warning' | 'info';
}

interface VitalMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    id?: string;
}

const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Capture an exception for error tracking.
 * In production, this would forward to Sentry/Datadog/etc.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
    if (IS_DEV) {
        const level = context?.level ?? 'error';
        const tags = context?.tags ? ` [${Object.entries(context.tags).map(([k, v]) => `${k}:${v}`).join(', ')}]` : '';
        console.error(`[Monitor:${level}]${tags}`, error);
    }
    // Production: Sentry.captureException(error, { tags: context?.tags, extra: context?.extra, level: context?.level });
}

/**
 * Capture a message (non-exception) for tracking.
 */
export function captureMessage(message: string, context?: ErrorContext): void {
    if (IS_DEV) {
        const level = context?.level ?? 'info';
        console.warn(`[Monitor:${level}] ${message}`);
    }
    // Production: Sentry.captureMessage(message, { ...context });
}

/**
 * Report a Core Web Vital metric.
 * Called by the web-vitals reporter in the app layout.
 */
export function reportVital(metric: VitalMetric): void {
    if (IS_DEV) {
        const color = metric.rating === 'good' ? '32' : metric.rating === 'poor' ? '31' : '33';
        console.log(`[Vital] \x1b[${color}m${metric.name}: ${metric.value.toFixed(1)}ms (${metric.rating})\x1b[0m`);
    }
    // Production: Sentry.captureEvent({ ... }) or analytics.track(...)
}

/**
 * Set user context for error tracking (call after login).
 */
export function setUser(user: { id: string; email?: string } | null): void {
    if (IS_DEV && user) {
        console.log(`[Monitor] User context set: ${user.id}`);
    }
    // Production: Sentry.setUser(user);
}

/**
 * Add a breadcrumb for debugging context.
 */
export function addBreadcrumb(category: string, message: string, data?: Record<string, unknown>): void {
    if (IS_DEV) {
        console.debug(`[Breadcrumb:${category}] ${message}`, data ?? '');
    }
    // Production: Sentry.addBreadcrumb({ category, message, data, level: 'info' });
}
