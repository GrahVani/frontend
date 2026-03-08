"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

export default function ComparisonError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        captureException(error, {
            tags: { boundary: 'route', section: 'comparison' },
            extra: { digest: error.digest },
        });
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="max-w-md w-full text-center space-y-6" role="alert">
                <div className="text-5xl" aria-hidden="true">&#9878;</div>
                <h2 className="text-[20px] font-serif text-amber-900">
                    Chart Comparison Error
                </h2>
                <p className="text-amber-800/70 text-[14px]">
                    Unable to load comparison data. Please try again.
                </p>
                <button
                    onClick={reset}
                    aria-label="Retry chart comparison"
                    className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-[14px] font-medium"
                >
                    Retry Comparison
                </button>
            </div>
        </div>
    );
}
