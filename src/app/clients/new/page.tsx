"use client";

import React from 'react';
import ClientForm from "@/components/clients/ClientForm";

export default function NewClientPage() {
    return (
        <div className="text-ink">
            {/* Main Container */}
            <div className="max-w-4xl mx-auto">

                {/* Page Content */}
                <div className="relative">
                    <div className="mb-4 text-center">
                        <h1 className="text-[24px] font-serif font-bold text-ink-deep mb-1">
                            New Client
                        </h1>
                        <p className="text-body font-serif italic text-[14px]">
                            Accurately record the birth details for a precise birth chart.
                        </p>
                    </div>

                    <ClientForm />
                </div>

            </div>
        </div>
    );
}
