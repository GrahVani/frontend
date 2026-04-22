"use client";

import React from 'react';
import SectionSidebar from '@/components/layout/SectionSidebar';
import PageContainer from '@/components/layout/PageContainer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { SETTINGS_Sidebar } from '@/config/sidebarConfig';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useVedicClient } from '@/context/VedicClientContext';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { openClients } = useVedicClient();
    const hasClientBar = openClients.length > 0;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-luxury-radial relative">
                <div
                    className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] [background-blend-mode:multiply]"
                />
                <div className={`${hasClientBar ? 'pt-24' : 'pt-14'} relative z-10 w-full min-h-screen`}>
                    <div className={`hidden md:block fixed left-0 ${hasClientBar ? 'top-24' : 'top-14'} bottom-0 md:w-16 lg:w-64 overflow-y-auto z-20`}>
                        <SectionSidebar title="Settings" basePath="/settings" items={SETTINGS_Sidebar} />
                    </div>
                    <div className="flex-1 flex flex-col w-full md:pl-16 lg:pl-64">
                        <main className="flex-1 p-4 sm:p-6 lg:p-8">
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
