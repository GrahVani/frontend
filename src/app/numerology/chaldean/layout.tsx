"use client";

import ChaldeanLayout from "@/components/numerology/ChaldeanLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ChaldeanLayout>{children}</ChaldeanLayout>;
}
