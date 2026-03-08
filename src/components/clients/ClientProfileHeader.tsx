"use client";

import React from 'react';
import { MapPin, Save, Edit2, Loader2, X, Star } from 'lucide-react';
import type { Client } from '@/types/client';

interface ClientProfileHeaderProps {
    client: Client;
    isEditing: boolean;
    isSaving: boolean;
    error: string | null;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
    onClearError: () => void;
}

export default function ClientProfileHeader({
    client,
    isEditing,
    isSaving,
    error,
    onEdit,
    onCancel,
    onSave,
    onClearError,
}: ClientProfileHeaderProps) {
    const displayName = client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Client';
    const initial = (client.firstName || client.fullName || 'C')[0];

    return (
        <>
            {/* Profile Hero Card */}
            <div className="prem-card glass-shimmer overflow-hidden relative mb-6">
                {/* Top accent gradient */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-primary via-gold-soft to-gold-primary" />

                <div className="p-6 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-5">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                             style={{
                                 background: 'linear-gradient(135deg, rgba(201,162,77,0.20) 0%, rgba(139,90,43,0.12) 100%)',
                                 border: '1px solid rgba(201,162,77,0.30)',
                                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 8px rgba(139,90,43,0.10)',
                             }}>
                            <span className="text-2xl font-serif font-bold text-gold-dark">{initial}</span>
                        </div>

                        {/* Name & Meta */}
                        <div>
                            <h1 className="text-[26px] font-serif text-ink font-bold leading-tight">{displayName}</h1>
                            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                                <span className="text-[12px] font-mono font-semibold text-ink/50">#{client.id.slice(0, 8)}</span>
                                {client.rashi && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-border-divider" />
                                        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-gold-dark">
                                            <Star className="w-3.5 h-3.5" /> {client.rashi} Rashi
                                        </span>
                                    </>
                                )}
                                {client.birthPlace && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-border-divider" />
                                        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink/70">
                                            <MapPin className="w-3.5 h-3.5 text-bronze-dark/60" /> {client.birthPlace}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={onCancel}
                                    className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-ink/70 transition-colors hover:bg-parchment/50"
                                    style={{ border: '1px solid rgba(220,201,166,0.35)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={isSaving}
                                    className="px-5 py-2.5 bg-gold-primary text-white rounded-lg text-[13px] font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onEdit}
                                className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-ink transition-all flex items-center gap-2 hover:bg-parchment/50"
                                style={{ border: '1px solid rgba(220,201,166,0.35)' }}
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-6 prem-card p-4 flex items-center justify-between"
                     style={{ borderLeft: '3px solid var(--status-error)', background: 'rgba(155,44,44,0.06)' }}>
                    <div className="flex items-center gap-3">
                        <X className="w-4 h-4 text-status-error shrink-0" />
                        <p className="text-[14px] font-medium text-status-error">{error}</p>
                    </div>
                    <button onClick={onClearError} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" aria-label="Dismiss error">
                        <X className="w-3.5 h-3.5 text-status-error/60" />
                    </button>
                </div>
            )}
        </>
    );
}
