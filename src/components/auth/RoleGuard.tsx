"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Routes that don't need role checks (public routes)
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

// Routes exclusive to professionals — learners get redirected to /learn
const PROFESSIONAL_ONLY_ROUTES = [
  "/dashboard",
  "/clients",
  "/vedic-astrology",
  "/muhurta",
  "/matchmaking",
  "/numerology",
  "/calendar",
  "/settings",
];

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { isLearner, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || !pathname) return;

    // Public routes — no checks needed
    if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) return;

    // Not logged in — let the page handle redirect (e.g., login page)
    if (!isAuthenticated) return;

    const isProfessionalRoute = PROFESSIONAL_ONLY_ROUTES.some((r) =>
      pathname.startsWith(r)
    );
    const isLearnerRoute = pathname.startsWith("/learn");

    if (isLearner && isProfessionalRoute) {
      router.replace("/learn");
      return;
    }

    if (!isLearner && isLearnerRoute) {
      router.replace("/dashboard");
      return;
    }
  }, [pathname, isLearner, loading, isAuthenticated, router]);

  // Only show loading spinner while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-amber-700 font-medium">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
