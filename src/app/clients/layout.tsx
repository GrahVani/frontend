"use client";

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-luxury-radial relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-15 pointer-events-none z-0 bg-[url('/textures/aged-paper.png')] [background-blend-mode:multiply]"
                />
                {/* Liquid glass ambient orbs */}
                <div className="glass-orb glass-orb-gold" />
                <div className="glass-orb glass-orb-amber" />
                <div className="glass-orb glass-orb-blue" />
                <div className="pt-14 relative z-10 w-full min-h-screen">
                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        <PageContainer>
                            <Breadcrumbs />
                            {children}
                        </PageContainer>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
