"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, {
      level: 'fatal',
      tags: { boundary: 'route', section: 'global' },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment-light px-4">
      <div className="max-w-md w-full text-center space-y-6" role="alert">
        <div className="text-6xl" aria-hidden="true">&#9788;</div>
        <h1 className="text-2xl font-serif text-amber-900">
          Something went wrong
        </h1>
        <p className="text-amber-800/70">
          An unexpected error occurred. Please try again or contact support if
          the issue persists.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            aria-label="Retry loading"
            className="px-6 py-2.5 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
          >
            Try Again
          </button>
          <a
            href="/dashboard"
            className="px-6 py-2.5 text-amber-700 border border-amber-700/30 rounded-lg hover:bg-amber-50 transition-colors font-medium"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
