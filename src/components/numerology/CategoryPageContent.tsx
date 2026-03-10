"use client";

import React from "react";
import { CHALDEAN_ENDPOINTS, CHALDEAN_CATEGORIES } from "@/lib/numerology-constants";
import ServiceEndpointCard from "@/components/numerology/ServiceEndpointCard";
import CategoryPageHeader from "@/components/numerology/CategoryPageHeader";
import CalculatorWorkspace from "@/components/numerology/CalculatorWorkspace";

interface CategoryPageContentProps {
    categoryKey: string;
}

export default function CategoryPageContent({ categoryKey }: CategoryPageContentProps) {
    const [activeSlug, setActiveSlug] = React.useState<string | null>(null);
    const meta = CHALDEAN_CATEGORIES.find(c => c.key === categoryKey)!;
    const endpoints = CHALDEAN_ENDPOINTS[categoryKey];
    const activeEndpoint = activeSlug ? endpoints.find(e => e.slug === activeSlug) : null;

    if (activeEndpoint) {
        return (
            <CalculatorWorkspace
                endpoint={activeEndpoint}
                category={categoryKey}
                onBack={() => setActiveSlug(null)}
            />
        );
    }

    return (
        <div className="space-y-5">
            <CategoryPageHeader category={meta} endpoints={endpoints} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {endpoints.map((endpoint) => (
                    <ServiceEndpointCard
                        key={endpoint.slug}
                        endpoint={endpoint}
                        onClick={() => setActiveSlug(endpoint.slug)}
                    />
                ))}
            </div>
        </div>
    );
}
