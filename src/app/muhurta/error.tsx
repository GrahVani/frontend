"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";

export default function MuhurtaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error logged by Next.js error boundary
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6" role="alert">
        <div className="text-5xl" aria-hidden="true">&#9788;</div>
        <h2 className="text-xl font-serif text-ink">Muhurta Calculation Error</h2>
        <p className="text-secondary text-sm">
          Unable to calculate auspicious timings. Please try again.
        </p>
        <Button onClick={reset} icon={RefreshCw}>Retry</Button>
      </div>
    </div>
  );
}
