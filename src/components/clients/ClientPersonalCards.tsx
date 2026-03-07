"use client";

import React from 'react';
import { Sparkles, MapPin, User, Phone, Loader2 } from 'lucide-react';
import type { Client, LocationSuggestion } from '@/types/client';
import DetailItem from './DetailItem';

interface ClientPersonalCardsProps {
    client: Client;
    editData: Partial<Client>;
    isEditing: boolean;
    onFieldChange: (field: string, value: unknown) => void;
    // Location search
    locationSuggestions: LocationSuggestion[];
    isSearchingLocation: boolean;
    onLocationSearch: (query: string) => void;
    onLocationSelect: (suggestion: LocationSuggestion) => void;
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
    return (
        <h3 className="text-base font-serif text-ink mb-4 flex items-center gap-2 font-semibold">
            <div className="p-1.5 bg-parchment rounded-lg border border-antique">
                <Icon className="w-3.5 h-3.5 text-gold-dark" />
            </div>
            {title}
        </h3>
    );
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 animate-in slide-in-from-bottom-4 duration-500">
                {/* Personal Details Card */}
                <div className="bg-softwhite border border-antique rounded-2xl p-5 h-fit">
                    <SectionHeader icon={User} title="Personal Details" />
                    <div className="space-y-3">
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
                <div className="bg-softwhite border border-antique rounded-2xl p-5 h-fit">
                    <SectionHeader icon={MapPin} title="Birth Location" />
                    <div className="space-y-3">
                        <div className="relative">
                            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1 font-serif">Place of Birth</p>
                            {isEditing ? (
                                <>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editData.birthPlace || ''}
                                            onChange={(e) => onLocationSearch(e.target.value)}
                                            className="w-full text-sm font-serif text-ink font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                                            placeholder="Search birth city..."
                                        />
                                        {isSearchingLocation && (
                                            <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-gold-primary animate-spin" />
                                        )}
                                    </div>
                                    {locationSuggestions.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-white border border-antique shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            {locationSuggestions.map((s, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => onLocationSelect(s)}
                                                    className="w-full text-left px-3 py-2 hover:bg-parchment transition-colors border-b border-antique last:border-0 flex items-center gap-2"
                                                >
                                                    <MapPin className="w-3 h-3 text-gold-dark shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-medium text-ink">{s.formatted}</p>
                                                        <p className="text-[9px] text-muted font-bold uppercase tracking-wider">
                                                            {s.latitude.toFixed(4)}&deg;, {s.longitude.toFixed(4)}&deg;
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm font-serif text-ink font-medium border-b border-antique pb-2">
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

                {/* Astrological Signature Card */}
                <div className="bg-softwhite border border-antique rounded-2xl p-5 h-fit">
                    <SectionHeader icon={Sparkles} title="Astrological Signature" />
                    <div className="space-y-3">
                        <DetailItem label="Rashi (Moon Sign)" value={client.rashi || "Leo"} isEditing={isEditing} />
                        <DetailItem label="Nakshatra" value={client.nakshatra || "Magha"} isEditing={isEditing} />
                        <DetailItem label="Pada" value={"3"} isEditing={isEditing} />
                        <DetailItem label="Lagna (Ascendant)" value={"Scorpio"} isEditing={isEditing} />
                        <DetailItem label="Lagna Lord" value={"Mars"} isEditing={isEditing} />
                        <DetailItem label="Nakshatra Lord" value={"Ketu"} isEditing={isEditing} />
                    </div>
                </div>
            </div>

            {/* SECOND ROW: Contact Info & Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Contact Card */}
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <SectionHeader icon={Phone} title="Contact Information" />
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

                {/* Tags */}
                <div className="bg-softwhite border border-antique rounded-2xl p-5">
                    <h3 className="text-base font-serif text-ink mb-4 font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {client.tags?.map(t => (
                            <span key={t} className="px-3 py-1.5 rounded-full bg-parchment border border-antique text-gold-dark text-xs font-bold">{t}</span>
                        ))}
                        {isEditing && (
                            <button className="px-3 py-1.5 rounded-full border border-dashed border-gold-primary/50 text-gold-primary text-xs font-bold hover:bg-gold-primary/10 transition-colors">
                                + Add Tag
                            </button>
                        )}
                        {(!client.tags || client.tags.length === 0) && !isEditing && (
                            <span className="text-muted text-sm italic">No tags yet</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
