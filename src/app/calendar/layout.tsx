"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-luxury-radial relative">
                <div
                    className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] bg-blend-multiply"
                />
                <div className="pt-14 relative z-10 w-full min-h-screen">
                    <div className="flex-1 flex flex-col w-full">
                        <main className="flex-1 p-2 sm:p-3 lg:p-4">
                            <PageContainer>
                                <Breadcrumbs />
                                {children}
                            </PageContainer>
                        </main>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
