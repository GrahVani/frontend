"use client";

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import type { Client } from '@/types/client';
import { useVedicClient } from '@/context/VedicClientContext';

interface ClientListRowProps {
    client: Client;
    onSelect?: (client: Client) => void;
    onEdit?: (client: Client) => void;
    onDelete?: (client: Client) => void;
}

export default function ClientListRow({ client, onSelect, onEdit, onDelete }: ClientListRowProps) {
    const router = useRouter();
    const { setClientDetails } = useVedicClient();

    const displayName = client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Unknown';
    const initial = displayName[0]?.toUpperCase() || '?';
    const birthDate = client.dateOfBirth || client.birthDate;
    const birthPlace = client.placeOfBirth || client.birthPlace;
    const birthTime = client.timeOfBirth || client.birthTime;
    const phone = client.phone || client.phonePrimary;

    const handleClick = useCallback(() => {
        if (onSelect) {
            onSelect(client);
            return;
        }
        setClientDetails({
            id: client.id,
            name: displayName,
            gender: client.gender || "male",
            dateOfBirth: client.dateOfBirth || client.birthDate || '',
            timeOfBirth: client.timeOfBirth || client.birthTime || "12:00",
            placeOfBirth: { city: client.placeOfBirth || client.birthPlace || '' },
            rashi: client.rashi,
        });
        router.push(`/clients/${client.id}`);
    }, [client, displayName, onSelect, router, setClientDetails]);

    return (
        <div
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`Select client ${displayName}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
            className="group relative flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all duration-200 hover:bg-parchment/50"
            style={{ borderLeft: '3px solid transparent' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'rgba(201,162,77,0.60)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}
        >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-[14px] font-serif font-bold text-gold-dark"
                 style={{
                     background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                     border: '1px solid rgba(201,162,77,0.25)',
                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(139,90,43,0.06)',
                 }}>
                {client.avatar ? (
                    <img src={client.avatar} alt={displayName} className="w-full h-full rounded-xl object-cover" />
                ) : (
                    initial
                )}
            </div>

            {/* Name + Meta Row */}
            <div className="flex-1 min-w-0">
                {/* Top line: Name + Rashi badge */}
                <div className="flex items-center gap-2.5">
                    <p className="text-[15px] font-semibold text-ink truncate leading-tight group-hover:text-gold-dark transition-colors">
                        {displayName}
                    </p>
                    {client.rashi && (
                        <span className="shrink-0 text-[10px] font-bold text-gold-dark/80 px-2 py-0.5 rounded-md uppercase tracking-wide"
                              style={{
                                  background: 'linear-gradient(135deg, rgba(201,162,77,0.10) 0%, rgba(201,162,77,0.05) 100%)',
                                  border: '1px solid rgba(201,162,77,0.18)',
                              }}>
                            {client.rashi}
                        </span>
                    )}
                </div>

                {/* Bottom line: Metadata chips */}
                <div className="flex items-center gap-4 mt-1.5">
                    {birthPlace && (
                        <span className="flex items-center gap-1 text-[12px] text-ink/55 font-medium">
                            <MapPin className="w-3 h-3 text-bronze-dark/45 shrink-0" />
                            <span className="truncate max-w-[120px]">{birthPlace}</span>
                        </span>
                    )}
                    {birthDate && (
                        <span className="flex items-center gap-1 text-[12px] text-ink/55 font-medium">
                            <Calendar className="w-3 h-3 text-bronze-dark/45 shrink-0" />
                            {new Date(birthDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    )}
                    {birthTime && (
                        <span className="hidden md:flex items-center gap-1 text-[12px] text-ink/55 font-medium font-mono">
                            <Clock className="w-3 h-3 text-bronze-dark/45 shrink-0" />
                            {birthTime}
                        </span>
                    )}
                    {!birthPlace && !birthDate && (
                        <span className="text-[12px] text-ink/25 italic">No birth details</span>
                    )}
                </div>
            </div>

            {/* Right side: actions + chevron */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Actions — visible on hover */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        className="p-2 rounded-lg transition-all hover:bg-parchment/70"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,201,166,0.35)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                        title="Edit Record"
                        aria-label={`Edit ${displayName}`}
                        onClick={(e) => { e.stopPropagation(); onEdit?.(client); }}
                    >
                        <Edit2 className="w-3.5 h-3.5 text-ink/35 hover:text-gold-dark transition-colors" />
                    </button>
                    <button
                        className="p-2 rounded-lg transition-all hover:bg-red-50/60"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,100,100,0.20)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
                        title="Delete"
                        aria-label={`Delete ${displayName}`}
                        onClick={(e) => { e.stopPropagation(); onDelete?.(client); }}
                    >
                        <Trash2 className="w-3.5 h-3.5 text-ink/35 hover:text-status-error transition-colors" />
                    </button>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-4 h-4 text-ink/15 group-hover:text-gold-dark/50 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
        </div>
    );
}
