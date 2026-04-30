"use client";

import React from 'react';
import ClientForm from "@/components/clients/ClientForm";
import { UserPlus } from 'lucide-react';

export default function NewClientPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
                {/* Page Header */}
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-amber-200/60 shadow-sm mb-4">
                        <UserPlus className="w-7 h-7 text-amber-600" />
                    </div>
                    <h1 className="text-[28px] font-bold text-amber-900 mb-2">
                        New Client
                    </h1>
                    <p className="text-[16px] text-amber-600 max-w-lg mx-auto">
                        Accurately record the birth details for a precise birth chart.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-4 sm:p-6 lg:p-8">
                    <ClientForm />
                </div>
            </div>
        </div>
    );
}
