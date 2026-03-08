"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import { captureException } from "@/lib/monitoring";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, {
      tags: { boundary: 'route', section: 'profile' },
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full text-center space-y-6" role="alert">
        <div className="text-5xl" aria-hidden="true">&#128100;</div>
        <h2 className="text-[20px] font-serif text-ink">Profile Error</h2>
        <p className="text-ink/45 text-[13px] font-medium">
          Unable to load profile data. Please try again.
        </p>
        <Button onClick={reset} icon={RefreshCw}>Retry</Button>
      </div>
    </div>
  );
}
