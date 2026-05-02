"use client";

import React from 'react';
import ClientForm from "@/components/clients/ClientForm";
import { UserPlus } from 'lucide-react';

export default function NewClientPage() {
    return (
        <div className="min-h-screen pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Page Header */}
                <div className="mb-5">
                    <h1 className="text-[24px] font-bold text-amber-900">
                        New Client
                    </h1>
                    <p className="text-[14px] text-amber-600 mt-1">
                        Accurately record the birth details for a precise birth chart.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 sm:p-6">
                    <ClientForm />
                </div>
            </div>
        </div>
    );
}
