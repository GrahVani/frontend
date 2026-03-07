"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Save, Edit2, Loader2, X } from 'lucide-react';
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
            <div className="mb-6 flex items-center justify-between bg-softwhite border border-antique rounded-2xl p-5 flex-wrap gap-4">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center shrink-0">
                        <span className="text-2xl font-serif font-bold text-gold-dark">{initial}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif text-ink font-bold">{displayName}</h1>
                        <p className="text-muted text-xs mt-0.5 flex items-center gap-2 flex-wrap">
                            <span className="text-gold-dark">#{client.id.slice(0, 8)}...</span>
                            <span>&#8226;</span>
                            <span>{client.rashi || 'Leo'} Rashi</span>
                            {client.birthPlace && (
                                <>
                                    <span>&#8226;</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {client.birthPlace}</span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 bg-parchment border border-antique text-muted rounded-lg font-medium text-sm hover:bg-softwhite transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onEdit}
                                className="px-4 py-2 bg-softwhite border border-antique text-ink rounded-lg font-medium text-sm hover:bg-gold-primary/10 hover:border-gold-primary/50 transition-colors flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <Link href="/clients" className="px-4 py-2 border border-antique rounded-lg text-muted hover:text-ink hover:border-gold-primary transition-colors text-sm">
                                Back
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50/50 border border-red-200/50 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4">
                    <div className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-500" />
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                    <button
                        onClick={onClearError}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Dismiss error"
                    >
                        <X className="w-4 h-4 text-red-400" />
                    </button>
                </div>
            )}
        </>
    );
}
