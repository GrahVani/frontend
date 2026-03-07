"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { captureException } from "@/lib/monitoring";

export default function MatchmakingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, {
      tags: { boundary: 'route', section: 'matchmaking' },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6" role="alert">
        <div className="text-5xl" aria-hidden="true">&#9829;</div>
        <h2 className="text-xl font-serif text-ink">Matchmaking Error</h2>
        <p className="text-secondary text-sm">
          Unable to process compatibility analysis. Please try again.
        </p>
        <Button onClick={reset} icon={RefreshCw}>Retry</Button>
      </div>
    </div>
  );
}
