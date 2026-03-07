"use client";

import React from 'react';
import SectionSidebar from '@/components/layout/SectionSidebar';
import PageContainer from '@/components/layout/PageContainer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { MUHURTA_Sidebar } from '@/config/sidebarConfig';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MuhurtaLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
        <div className="min-h-screen bg-luxury-radial relative">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] [background-blend-mode:multiply]"
            />

            <div className="pt-12 relative z-10 w-full min-h-screen">
                <div className="hidden md:block fixed left-0 top-12 bottom-0 md:w-16 lg:w-64 overflow-y-auto z-20">
                    <SectionSidebar title="Muhurta" basePath="/muhurta" items={MUHURTA_Sidebar} />
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
