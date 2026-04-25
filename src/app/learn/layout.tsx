"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, GraduationCap } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/learn", label: "Courses", icon: GraduationCap },
    { href: "/learn/progress", label: "Progress", icon: LayoutDashboard },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Learning Navigation */}
        <div className="fixed top-14 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-amber-200/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-6 h-12">
              <Link href="/learn" className="flex items-center gap-2 text-amber-800 font-bold">
                <BookOpen className="w-5 h-5" />
                <span>Learning</span>
              </Link>
              <div className="h-6 w-px bg-amber-200" />
              <nav className="flex items-center gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-amber-100 text-amber-900"
                        : "text-amber-700 hover:bg-amber-50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-28 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
