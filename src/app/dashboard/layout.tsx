"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useVedicClient } from '@/context/VedicClientContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { openClients } = useVedicClient();
    const hasClientBar = openClients.length > 0;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
                <div className={`${hasClientBar ? 'pt-24' : 'pt-14'} relative z-10 w-full min-h-screen`}>
                    <main className="flex-1">
                        <PageContainer variant="full">
                            <DashboardTabs />
                            {children}
                        </PageContainer>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
