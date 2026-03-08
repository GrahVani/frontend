"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return <div className="min-h-screen bg-surface-warm flex items-center justify-center text-ink font-serif">Loading...</div>;
}
