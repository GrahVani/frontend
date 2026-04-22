"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useVedicClient } from '@/context/VedicClientContext';

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
    const { openClients } = useVedicClient();
    const hasClientBar = openClients.length > 0;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-luxury-radial relative">
                <div
                    className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] bg-blend-multiply"
                />
                <div className={`${hasClientBar ? 'pt-24' : 'pt-14'} relative z-10 w-full min-h-screen`}>
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
