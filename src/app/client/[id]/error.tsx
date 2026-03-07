"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

export default function ClientDetailError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        captureException(error, {
            tags: { boundary: 'route', section: 'client-detail' },
            extra: { digest: error.digest },
        });
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full text-center space-y-6" role="alert">
                <div className="text-5xl" aria-hidden="true">&#9788;</div>
                <h2 className="text-xl font-serif text-amber-900">
                    Chart & Analysis Error
                </h2>
                <p className="text-amber-800/70 text-sm">
                    Unable to load chart data for this client. This may be a temporary
                    issue with the calculation engine.
                </p>
                <button
                    onClick={reset}
                    aria-label="Retry loading client charts"
                    className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
                >
                    Reload Charts
                </button>
            </div>
        </div>
    );
}
