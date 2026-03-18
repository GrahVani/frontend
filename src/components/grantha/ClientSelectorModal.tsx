"use client";

import React, { useState } from 'react';
import { Search, X, User, MapPin, Calendar } from 'lucide-react';
import { useClients } from '@/hooks/queries/useClients';
import { formatDate } from '@/lib/date-utils';
import type { Client } from '@/types/client';

interface ClientSelectorModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (client: Client) => void;
}

export default function ClientSelectorModal({ open, onClose, onSelect }: ClientSelectorModalProps) {
    const [search, setSearch] = useState('');
    const { data: searchResults, isLoading } = useClients({ search, limit: 20 });
    const clients = searchResults?.clients || [];

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col animate-in zoom-in-95 duration-300"
                 style={{ border: '1px solid rgba(220,201,166,0.35)' }}>

                {/* Header */}
                <div className="p-5 border-b border-gold-primary/15 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-ink text-[18px]">Select Client</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition-colors">
                        <X className="w-5 h-5 text-ink/50" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or place..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 bg-surface-warm/30 rounded-lg text-[14px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-gold-primary/30 transition-all"
                            style={{ border: '1px solid rgba(220,201,166,0.30)' }}
                        />
                    </div>
                </div>

                {/* Client list */}
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                    {isLoading && (
                        <p className="text-center text-ink/40 text-[14px] font-serif py-8">Searching...</p>
                    )}

                    {!isLoading && clients.length === 0 && (
                        <p className="text-center text-ink/40 text-[14px] font-serif py-8">
                            {search ? 'No clients found' : 'Type to search clients'}
                        </p>
                    )}

                    {clients.map((client) => (
                        <button
                            key={client.id}
                            onClick={() => onSelect(client)}
                            className="w-full text-left p-4 rounded-xl hover:bg-gold-primary/5 transition-all group"
                            style={{ border: '1px solid rgba(220,201,166,0.20)' }}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gold-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-gold-dark" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-ink text-[15px] group-hover:text-gold-dark transition-colors">
                                        {client.fullName}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-[12px] text-ink/55 font-semibold">
                                        {client.birthDate && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(client.birthDate)}
                                            </span>
                                        )}
                                        {client.birthPlace && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {client.birthPlace}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
