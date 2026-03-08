"use client";

import React from 'react';
import { Sparkles, MapPin, User, Phone, Tag, Loader2 } from 'lucide-react';
import type { Client, LocationSuggestion } from '@/types/client';
import DetailItem from './DetailItem';
import SectionHeader from './SectionHeader';

interface ClientPersonalCardsProps {
    client: Client;
    editData: Partial<Client>;
    isEditing: boolean;
    onFieldChange: (field: string, value: unknown) => void;
    locationSuggestions: LocationSuggestion[];
    isSearchingLocation: boolean;
    onLocationSearch: (query: string) => void;
    onLocationSelect: (suggestion: LocationSuggestion) => void;
}

export default function ClientPersonalCards({
    client,
    editData,
    isEditing,
    onFieldChange,
    locationSuggestions,
    isSearchingLocation,
    onLocationSearch,
    onLocationSelect,
}: ClientPersonalCardsProps) {
    return (
        <>
            {/* TOP ROW: Personal Details, Birth Location, Astrological Signature */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                {/* Personal Details Card */}
                <div className="prem-card p-5 h-fit">
                    <SectionHeader icon={User} title="Personal Details" compact />
                    <div className="space-y-4">
                        <DetailItem
                            label="Full Name"
                            value={isEditing ? (editData.fullName || `${editData.firstName || ''} ${editData.lastName || ''}`.trim()) : (client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim())}
                            isEditing={isEditing}
                            onChange={(val) => onFieldChange('fullName', val)}
                        />
                        <DetailItem
                            label="Gender"
                            value={(isEditing ? editData.gender : client.gender) || "female"}
                            isEditing={isEditing}
                            type="select"
                            options={[{ v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'other', l: 'Other' }]}
                            onChange={(val) => onFieldChange('gender', val)}
                        />
                        <DetailItem
                            label="Date of Birth"
                            value={(isEditing ? editData.birthDate : client.birthDate) || ''}
                            isEditing={isEditing}
                            type="date"
                            onChange={(val) => onFieldChange('birthDate', val)}
                        />
                        <DetailItem
                            label="Time of Birth"
                            value={(isEditing ? editData.birthTime : client.birthTime) || ""}
                            isEditing={isEditing}
                            type="time"
                            onChange={(val) => onFieldChange('birthTime', val)}
                        />
                    </div>
                </div>

                {/* Birth Location Card */}
                <div className="prem-card p-5 h-fit">
                    <SectionHeader icon={MapPin} title="Birth Location" compact />
                    <div className="space-y-4">
                        <div className="relative">
                            <p className="text-[11px] uppercase tracking-[0.10em] text-ink/35 font-bold mb-1.5">Place of Birth</p>
                            {isEditing ? (
                                <>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editData.birthPlace || ''}
                                            onChange={(e) => onLocationSearch(e.target.value)}
                                            className="w-full text-[15px] font-serif text-ink font-medium rounded-lg px-3 py-2.5 bg-surface-warm/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 transition-all"
                                            style={{ border: '1px solid rgba(220,201,166,0.40)' }}
                                            placeholder="Search birth city..."
                                        />
                                        {isSearchingLocation && (
                                            <Loader2 className="absolute right-3 top-3 w-4 h-4 text-gold-primary animate-spin" />
                                        )}
                                    </div>
                                    {locationSuggestions.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden"
                                             style={{
                                                 background: 'rgba(255,249,240,0.98)',
                                                 backdropFilter: 'blur(16px)',
                                                 border: '1px solid rgba(220,201,166,0.30)',
                                                 boxShadow: '0 8px 32px rgba(42,24,16,0.15)',
                                             }}>
                                            {locationSuggestions.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => onLocationSelect(s)}
                                                    className="w-full text-left px-3.5 py-2.5 hover:bg-surface-warm/50 transition-colors flex items-center gap-2.5"
                                                    style={{ borderBottom: '1px solid rgba(220,201,166,0.15)' }}
                                                >
                                                    <MapPin className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                                                    <div>
                                                        <p className="text-[13px] font-medium text-ink">{s.formatted}</p>
                                                        <p className="text-[10px] text-ink/30 font-bold uppercase tracking-wider">
                                                            {s.latitude.toFixed(4)}&deg;, {s.longitude.toFixed(4)}&deg;
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-[15px] font-serif text-ink font-semibold pb-2"
                                   style={{ borderBottom: '1px solid rgba(220,201,166,0.30)' }}>
                                    {client.birthPlace || 'N/A'}
                                </p>
                            )}
                        </div>
                        <DetailItem
                            label="Latitude"
                            value={editData.birthLatitude?.toString() || client.birthLatitude?.toString() || ""}
                            isEditing={isEditing}
                            onChange={(val) => onFieldChange('birthLatitude', parseFloat(val) || 0)}
                        />
                        <DetailItem
                            label="Longitude"
                            value={editData.birthLongitude?.toString() || client.birthLongitude?.toString() || ""}
                            isEditing={isEditing}
                            onChange={(val) => onFieldChange('birthLongitude', parseFloat(val) || 0)}
                        />
                        <DetailItem
                            label="Timezone"
                            value={editData.birthTimezone || client.birthTimezone || ""}
                            isEditing={isEditing}
                            onChange={(val) => onFieldChange('birthTimezone', val)}
                        />
                    </div>
                </div>

                {/* Astrological Signature Card — Read-only (auto-computed from birth data) */}
                <div className="prem-card p-5 h-fit" style={{ borderTop: '3px solid var(--gold-primary)' }}>
                    <SectionHeader icon={Sparkles} title="Astrological Signature" compact />
                    <div className="space-y-4">
                        <DetailItem label="Rashi (Moon Sign)" value={client.rashi || "—"} />
                        <DetailItem label="Nakshatra" value={client.nakshatra || "—"} />
                        <DetailItem label="Pada" value={"—"} />
                        <DetailItem label="Lagna (Ascendant)" value={"—"} />
                        <DetailItem label="Lagna Lord" value={"—"} />
                        <DetailItem label="Nakshatra Lord" value={"—"} />
                    </div>
                </div>
            </div>

            {/* SECOND ROW: Contact Info & Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <div className="prem-card p-5">
                    <SectionHeader icon={Phone} title="Contact Information" compact />
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem
                            label="Email Address"
                            value={(isEditing ? editData.email : client.email) || ""}
                            isEditing={isEditing}
                            onChange={(val) => onFieldChange('email', val)}
                        />
                        <DetailItem
                            label="Phone Number"
                            value={(isEditing ? editData.phonePrimary : client.phonePrimary) || ""}
                            isEditing={isEditing}
                            onChange={(val) => onFieldChange('phonePrimary', val)}
                        />
                    </div>
                </div>

                <div className="prem-card p-5">
                    <SectionHeader icon={Tag} title="Tags" compact />
                    <div className="flex flex-wrap gap-2">
                        {client.tags?.map(t => (
                            <span key={t} className="px-3 py-1.5 rounded-full text-[12px] font-bold text-gold-dark"
                                  style={{ background: 'rgba(201,162,77,0.12)', border: '1px solid rgba(201,162,77,0.22)' }}>
                                {t}
                            </span>
                        ))}
                        {isEditing && (
                            <button className="px-3 py-1.5 rounded-full text-[12px] font-bold text-gold-primary hover:bg-gold-primary/10 transition-colors"
                                    style={{ border: '1px dashed rgba(201,162,77,0.40)' }}>
                                + Add Tag
                            </button>
                        )}
                        {(!client.tags || client.tags.length === 0) && !isEditing && (
                            <span className="text-ink/50 text-[14px]">No tags yet</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
