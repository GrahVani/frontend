"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Search, X, Loader2, Trash2 } from 'lucide-react';
import type { Client, FamilyLink, RelationshipType } from '@/types/client';
import SectionHeader from './SectionHeader';

const RELATIONSHIP_OPTIONS: { value: RelationshipType; label: string }[] = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'in_law', label: 'In-Law' },
    { value: 'uncle_aunt', label: 'Uncle/Aunt' },
    { value: 'nephew_niece', label: 'Nephew/Niece' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'other', label: 'Other' },
];

interface ClientFamilySectionProps {
    familyLinks: FamilyLink[];
    loadingFamily: boolean;
    availableClients: Client[];
    searchRel: string;
    onSearchRelChange: (val: string) => void;
    onAddFamilyLink: (client: Client, relType: RelationshipType) => void;
    onRemoveFamilyLink: (relatedClientId: string) => void;
    addingFamily: boolean;
}

export default function ClientFamilySection({
    familyLinks,
    loadingFamily,
    availableClients,
    searchRel,
    onSearchRelChange,
    onAddFamilyLink,
    onRemoveFamilyLink,
    addingFamily,
}: ClientFamilySectionProps) {
    const [isAddingRel, setIsAddingRel] = useState(false);
    const [selectedRelType, setSelectedRelType] = useState<RelationshipType>('spouse');

    return (
        <div className="mt-8">
            <SectionHeader
                icon={Heart}
                title="Family Connections"
                action={
                    <button
                        onClick={() => setIsAddingRel(!isAddingRel)}
                        className="px-4 py-2.5 rounded-lg text-[13px] font-semibold text-ink transition-all flex items-center gap-2 hover:bg-surface-warm/50"
                        style={{ border: '1px solid rgba(220,201,166,0.40)' }}
                    >
                        <Plus className="w-4 h-4" /> Add Connection
                    </button>
                }
            />

            {/* Add Connection Panel */}
            {isAddingRel && (
                <div className="prem-card p-5 mb-5">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[14px] font-serif font-bold text-ink">Add Family Connection</h4>
                        <button
                            onClick={() => { setIsAddingRel(false); onSearchRelChange(''); }}
                            className="p-1.5 rounded-lg hover:bg-surface-warm/50 transition-colors"
                        >
                            <X className="w-4 h-4 text-ink/50" />
                        </button>
                    </div>

                    {/* Relationship Type Selector */}
                    <div className="mb-4">
                        <label className="block text-[11px] font-bold text-ink/35 uppercase tracking-[0.10em] mb-2">Relationship Type</label>
                        <select
                            value={selectedRelType}
                            onChange={(e) => setSelectedRelType(e.target.value as RelationshipType)}
                            className="w-full rounded-lg py-2.5 px-4 text-ink text-[14px] font-medium bg-surface-warm/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 transition-all"
                            style={{ border: '1px solid rgba(220,201,166,0.40)' }}
                        >
                            {RELATIONSHIP_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Client Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchRel}
                            onChange={(e) => onSearchRelChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-surface-warm/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-primary/40 text-[14px] text-ink transition-all"
                            style={{ border: '1px solid rgba(220,201,166,0.40)' }}
                        />
                    </div>

                    {/* Available Clients */}
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {availableClients.length > 0 ? availableClients.map((c: Client) => (
                            <button
                                key={c.id}
                                onClick={() => {
                                    onAddFamilyLink(c, selectedRelType);
                                    setIsAddingRel(false);
                                }}
                                disabled={addingFamily}
                                className="w-full flex items-center gap-3 p-3 hover:bg-surface-warm/50 rounded-lg transition-colors text-left disabled:opacity-50"
                            >
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(201,162,77,0.15) 0%, rgba(139,90,43,0.08) 100%)',
                                         border: '1px solid rgba(201,162,77,0.22)',
                                     }}>
                                    <span className="text-[13px] font-serif font-bold text-gold-dark">
                                        {(c.firstName || c.fullName || '?')[0]}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-ink font-medium text-[14px] truncate">{c.firstName || ''} {c.lastName || ''}</p>
                                    <p className="text-ink/50 text-[12px] truncate">{c.placeOfBirth || c.birthPlace || 'No location'}</p>
                                </div>
                                <span className="text-gold-dark text-[12px] font-semibold shrink-0">
                                    {addingFamily ? 'Adding...' : `Add as ${RELATIONSHIP_OPTIONS.find(o => o.value === selectedRelType)?.label}`}
                                </span>
                            </button>
                        )) : searchRel.length >= 2 ? (
                            <p className="text-ink/50 text-[14px] text-center py-4">No clients found</p>
                        ) : (
                            <p className="text-ink/50 text-[14px] text-center py-4">Type at least 2 characters to search</p>
                        )}
                    </div>
                </div>
            )}

            {/* Family Links List */}
            <div className="space-y-3">
                {loadingFamily ? (
                    <div className="prem-card text-center py-16">
                        <Loader2 className="w-6 h-6 text-gold-primary mx-auto mb-3 animate-spin" />
                        <p className="text-ink/60 font-serif text-[15px]">Loading family connections...</p>
                    </div>
                ) : familyLinks.length > 0 ? (
                    familyLinks.map((link: FamilyLink) => (
                        <div key={link.id}
                             className="prem-card p-5 flex items-center hover:border-gold-primary/40 transition-all group"
                             style={{ borderLeft: '3px solid transparent' }}
                             onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'var(--gold-primary)'; }}
                             onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 shrink-0"
                                 style={{
                                     background: 'linear-gradient(135deg, rgba(201,162,77,0.15) 0%, rgba(139,90,43,0.10) 100%)',
                                     border: '1px solid rgba(201,162,77,0.25)',
                                     boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                                 }}>
                                <span className="text-[18px] font-serif font-bold text-gold-dark">
                                    {(link.relatedClient?.firstName || link.relatedClient?.fullName || '?')[0]}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-serif font-bold text-ink text-[16px] truncate">
                                    {link.relatedClient?.firstName || ''} {link.relatedClient?.lastName || link.relatedClient?.fullName || ''}
                                </h3>
                                <p className="text-ink/55 text-[13px] font-semibold truncate mt-0.5">
                                    {RELATIONSHIP_OPTIONS.find(o => o.value === link.relationshipType)?.label || link.relationshipType}
                                    {link.relatedClient?.birthPlace && ` \u2022 ${link.relatedClient.birthPlace}`}
                                </p>
                            </div>
                            <div className="flex items-center gap-2.5 shrink-0">
                                <Link href={`/clients/${link.relatedClientId}`}
                                      className="px-4 py-2 rounded-lg text-[13px] font-semibold text-gold-dark hover:bg-surface-warm/50 transition-all"
                                      style={{ border: '1px solid rgba(220,201,166,0.40)' }}>
                                    View Chart
                                </Link>
                                <button
                                    onClick={() => onRemoveFamilyLink(link.relatedClientId)}
                                    className="opacity-0 group-hover:opacity-100 p-2.5 rounded-lg hover:bg-red-50/60 transition-all"
                                    style={{ border: '1px solid rgba(220,201,166,0.30)' }}
                                    title="Remove relationship"
                                >
                                    <Trash2 className="w-4 h-4 text-ink/40 hover:text-status-error" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="prem-card text-center py-16">
                        <Heart className="w-10 h-10 text-ink/20 mx-auto mb-3" />
                        <p className="text-ink/60 font-serif text-[15px]">No family connections mapped yet.</p>
                        <p className="text-ink/40 text-[13px] mt-1.5">Click &quot;Add Connection&quot; to link family members for Kundali matching.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
