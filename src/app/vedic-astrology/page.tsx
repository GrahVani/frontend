"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, Star } from 'lucide-react';
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { useClients } from "@/hooks/queries/useClients";
import { useVedicClient } from '@/context/VedicClientContext';
import { Client } from "@/types/client";

export default function VedicClientSelectionPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect');
    const { setClientDetails, isClientSet, isInitialized } = useVedicClient();

    // Smart Redirect: If a client is already set, don't show the selection registry
    React.useEffect(() => {
        if (isInitialized && isClientSet) {
            router.push(redirectPath || '/vedic-astrology/overview');
        }
    }, [isInitialized, isClientSet, router, redirectPath]);

    const handleSelectForVedic = useCallback((client: Client) => {
        setClientDetails({
            id: client.id,
            name: client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
            gender: client.gender || "male",
            dateOfBirth: client.dateOfBirth || client.birthDate || '',
            timeOfBirth: client.timeOfBirth || client.birthTime || "12:00",
            placeOfBirth: { city: client.placeOfBirth || client.birthPlace || '' },
            rashi: client.rashi,
        });
        router.push(redirectPath || '/vedic-astrology/overview');
    }, [router, setClientDetails, redirectPath]);

    const { data: clientsData, isLoading: loading, error: clientsError } = useClients({
        myClientsOnly: true,
        limit: 100
    });
    const clients = clientsData?.clients || [];
    const error = clientsError ? (clientsError as Error).message : null;

    const filteredClients = clients.filter(client =>
        (client.firstName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.lastName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.placeOfBirth?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (client.birthPlace?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700 py-4 px-0">
            <div className="px-4 text-[11px] font-bold uppercase tracking-widest text-gold-dark">
                Vedic Astrology
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <h1 className="font-serif text-[30px] font-bold text-ink tracking-tight leading-tight mb-2">
                        Client Registry
                    </h1>
                    <p className="font-serif text-[16px] text-ink/50 italic leading-relaxed">
                        Client records and their astrological profiles.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/clients/new"
                          className="px-8 py-4 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-transform hover:scale-105"
                          style={{
                              background: 'linear-gradient(135deg, rgba(201,162,77,0.90) 0%, rgba(139,90,43,0.85) 100%)',
                              boxShadow: '0 4px 12px rgba(139,90,43,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                              border: '1px solid rgba(255,255,255,0.10)',
                          }}>
                        + Add Client
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mx-0 prem-card glass-shimmer relative overflow-hidden p-4">
                <ParchmentInput
                    placeholder="Search clients by name or city..."
                    icon={<Search className="w-5 h-5 text-gold-dark" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-ink placeholder:text-ink/30 h-14 text-[16px] rounded-2xl"
                />
            </div>

            {/* Client List */}
            <div className="space-y-4">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-gold-primary animate-spin mb-4" />
                        <p className="font-serif text-[14px] text-ink/45">Loading clients...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16 rounded-2xl"
                         style={{
                             background: 'rgba(220,38,38,0.05)',
                             border: '1px solid rgba(220,38,38,0.15)',
                         }}>
                        <p className="font-serif text-[17px] text-status-error leading-tight mb-2">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[11px] font-semibold uppercase tracking-wider text-gold-dark underline decoration-gold-primary decoration-2 underline-offset-4 hover:text-gold-primary"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && filteredClients.length > 0 && (
                    <div className="prem-card glass-shimmer relative overflow-hidden">
                        {filteredClients.map((client, idx) => (
                            <React.Fragment key={client.id}>
                                {idx > 0 && (
                                    <div className="mx-5" style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,77,0.12) 20%, rgba(220,201,166,0.20) 50%, rgba(201,162,77,0.12) 80%, transparent 100%)' }} />
                                )}
                                <ClientListRow client={client} onSelect={handleSelectForVedic} />
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {!loading && !error && filteredClients.length === 0 && (
                    <div className="text-center py-16 prem-card">
                        {searchQuery ? (
                            <p className="font-serif text-[17px] italic text-ink/45 leading-relaxed">
                                No clients match your search.
                            </p>
                        ) : (
                            <>
                                <p className="font-serif text-[17px] italic text-ink/45 leading-relaxed mb-4">
                                    No clients yet. Create your first client to begin charting.
                                </p>
                                <Link
                                    href="/clients/new"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-white font-serif font-bold rounded-xl transition-colors"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(201,162,77,0.90) 0%, rgba(139,90,43,0.85) 100%)',
                                        boxShadow: '0 2px 8px rgba(139,90,43,0.20)',
                                    }}
                                >
                                    + Create First Client
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Count */}
            {!loading && !error && (
                <div className="pt-8 text-center" style={{ borderTop: '1px solid rgba(220,201,166,0.20)' }}>
                    <span className="text-[11px] text-ink/40 font-semibold uppercase tracking-wider">
                        {filteredClients.length} clients
                    </span>
                </div>
            )}
        </div>
    );
}
