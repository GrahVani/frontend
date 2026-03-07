"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Plus, Search, X, Loader2, Trash2 } from 'lucide-react';
import type { Client, FamilyLink, RelationshipType } from '@/types/client';

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
        <div className="mt-16">
            <h2 className="text-2xl font-serif text-ink font-bold mb-6">Family Connections</h2>
            <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-muted">Manage known connections for this client.</p>
                    <button
                        onClick={() => setIsAddingRel(!isAddingRel)}
                        className="px-5 py-2.5 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Connection
                    </button>
                </div>

                {/* Add Area */}
                {isAddingRel && (
                    <div className="mb-6 p-5 bg-softwhite rounded-xl border border-antique">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-primary font-serif font-bold">Add Family Connection</h4>
                            <button onClick={() => { setIsAddingRel(false); onSearchRelChange(''); }} className="text-muted-refined hover:text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Relationship Type Selector */}
                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Relationship Type</label>
                            <select
                                value={selectedRelType}
                                onChange={(e) => setSelectedRelType(e.target.value as RelationshipType)}
                                className="w-full bg-parchment border border-antique rounded-lg py-2.5 px-4 text-ink text-sm focus:outline-none focus:border-gold-primary"
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
                                className="w-full pl-9 pr-4 py-2 bg-white/50 border border-antique rounded-lg focus:border-gold-primary outline-none"
                            />
                        </div>

                        {/* Available Clients List */}
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {availableClients.length > 0 ? availableClients.map((c: Client) => (
                                <button
                                    key={c.id}
                                    onClick={() => {
                                        onAddFamilyLink(c, selectedRelType);
                                        setIsAddingRel(false);
                                    }}
                                    disabled={addingFamily}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-parchment rounded-lg transition-colors text-left disabled:opacity-50"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-gold-dark font-serif font-bold text-sm shrink-0">
                                        {(c.firstName || c.fullName || '?')[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-ink font-medium text-sm truncate" title={`${c.firstName || ''} ${c.lastName || ''}`.trim()}>{c.firstName || ''} {c.lastName || ''}</p>
                                        <p className="text-muted text-xs truncate" title={c.placeOfBirth || c.birthPlace || 'No location'}>{c.placeOfBirth || c.birthPlace || 'No location'}</p>
                                    </div>
                                    <span className="text-gold-dark text-xs font-medium shrink-0">
                                        {addingFamily ? 'Adding...' : `Add as ${RELATIONSHIP_OPTIONS.find(o => o.value === selectedRelType)?.label}`}
                                    </span>
                                </button>
                            )) : searchRel.length >= 2 ? (
                                <p className="text-muted text-sm text-center py-4">No clients found</p>
                            ) : (
                                <p className="text-muted text-sm text-center py-4">Type at least 2 characters to search</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Family Links List */}
                <div className="space-y-3">
                    {loadingFamily ? (
                        <div className="text-center py-16">
                            <Loader2 className="w-8 h-8 text-gold-primary mx-auto mb-3 animate-spin" />
                            <p className="text-muted font-serif">Loading family connections...</p>
                        </div>
                    ) : familyLinks.length > 0 ? (
                        familyLinks.map((link: FamilyLink) => (
                            <div key={link.id} className="flex items-center p-5 bg-softwhite border border-antique rounded-xl hover:border-gold-primary/50 transition-all group">
                                <div className="w-12 h-12 rounded-lg bg-gold-primary/10 flex items-center justify-center font-serif text-lg text-gold-dark mr-4 shrink-0">
                                    {(link.relatedClient?.firstName || link.relatedClient?.fullName || '?')[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-serif font-bold text-ink truncate" title={`${link.relatedClient?.firstName || ''} ${link.relatedClient?.lastName || link.relatedClient?.fullName || ''}`.trim()}>
                                        {link.relatedClient?.firstName || ''} {link.relatedClient?.lastName || link.relatedClient?.fullName || ''}
                                    </h3>
                                    <p className="text-muted text-sm truncate">
                                        {RELATIONSHIP_OPTIONS.find(o => o.value === link.relationshipType)?.label || link.relationshipType}
                                        {link.relatedClient?.birthPlace && ` \u2022 ${link.relatedClient.birthPlace}`}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link href={`/clients/${link.relatedClientId}`} className="px-4 py-2 rounded-lg border border-antique text-gold-dark text-xs font-semibold hover:bg-gold-primary hover:text-white transition-all">
                                        View Chart
                                    </Link>
                                    <button
                                        onClick={() => onRemoveFamilyLink(link.relatedClientId)}
                                        className="opacity-0 group-hover:opacity-100 p-2.5 hover:bg-red-50 text-red-400 rounded-lg transition-all"
                                        title="Remove relationship"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 border border-dashed border-antique rounded-xl bg-parchment/30">
                            <Heart className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                            <p className="text-muted font-serif">No family connections mapped yet.</p>
                            <p className="text-muted/70 text-sm mt-1">Click &quot;Add Connection&quot; to link family members for Kundali matching.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
