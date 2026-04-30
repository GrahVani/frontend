"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-amber-700 font-medium">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
