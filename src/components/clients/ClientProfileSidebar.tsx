"use client";

import React from 'react';
import {
    User,
    Heart,
    StickyNote,
    ArrowLeft,
    Map,
    Clock,
    History,
    Target,
    Gem,
    Users,
    FileText,
    CreditCard,
    Edit3
} from 'lucide-react';
import { Client } from "@/types/client";
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface ClientProfileSidebarProps {
    client: Client;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function ClientProfileSidebar({ client, activeTab, onTabChange }: ClientProfileSidebarProps) {

    const menuItems = [
        { id: 'profile', label: 'Birth Details', icon: User },
        { id: 'sessions', label: 'Past Sessions', icon: History },
        { id: 'predictions', label: 'Predictions Made', icon: Target },
        { id: 'remedies', label: 'Remedies Given', icon: Gem },
        { id: 'family', label: 'Family Links', icon: Users },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'payments', label: 'Payment History', icon: CreditCard },
        { id: 'notes', label: 'Session Notes', icon: Edit3 },
    ];

    return (
        <aside className="w-full lg:w-72 h-full flex flex-col bg-header-gradient border-r border-gold-primary/15 pb-6 relative z-30 shadow-2xl">
            {/* Header / Back Link */}
            <div className="p-6 pb-2">
                <Link href="/clients" className="flex items-center gap-2 text-gold-dark hover:text-active-glow transition-colors mb-6 font-serif text-[14px]">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Archives
                </Link>

                {/* Minified Profile Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full border border-gold-primary/30 p-1 mb-3 relative">
                        <div className="w-full h-full rounded-full bg-ink flex items-center justify-center overflow-hidden border border-white/10">
                            {client.avatar ? (
                                <img src={client.avatar} alt={client.firstName || client.fullName || 'Client'} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[24px] font-serif text-active-glow">{(client.firstName || client.fullName || '?')[0]}</span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-ink-abyss rounded-full" />
                    </div>
                    <h2 className="text-[20px] font-serif text-white font-bold text-center leading-none mb-1">{client.firstName || client.fullName || 'Client'}</h2>
                    <p className="text-gold-dark text-[10px] uppercase tracking-widest">#{client.id}</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={cn(
                                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden text-left",
                                isActive
                                    ? "bg-gradient-to-r from-gold-dark/20 to-transparent text-active-glow border-l-2 border-gold-primary"
                                    : "text-white/90 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-active-glow" : "text-gold-dark")} />
                            <span className="font-serif text-[14px] tracking-wide font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Meta */}
            <div className="px-6 py-4 border-t border-gold-primary/10 text-center">
                <p className="text-[9px] text-white/60 uppercase tracking-widest">Grahvani v2.0</p>
            </div>
        </aside >
    );
}
