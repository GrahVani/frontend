"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/web-vitals";
import { captureMessage, addBreadcrumb } from "@/lib/monitoring";

const GATEWAY_URL = process.env.NEXT_PUBLIC_CLIENT_SERVICE_URL || 'http://localhost:8080/api/v1';

export default function MonitoringInit() {
    useEffect(() => {
        // Core Web Vitals (BI-009)
        initWebVitals();

        // Health check on app load (BF-016)
        const controller = new AbortController();
        fetch(`${GATEWAY_URL.replace(/\/api\/v1$/, '')}/health`, { signal: controller.signal })
            .then((res) => {
                if (res.ok) {
                    addBreadcrumb('health', 'Backend health check passed');
                } else {
                    captureMessage(`Backend health check returned ${res.status}`, {
                        level: 'warning',
                        tags: { source: 'health-check' },
                    });
                }
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                captureMessage('Backend health check failed — API may be unreachable', {
                    level: 'warning',
                    tags: { source: 'health-check' },
                    extra: { error: err instanceof Error ? err.message : String(err) },
                });
            });

        return () => controller.abort();
    }, []);

    return null;
}
