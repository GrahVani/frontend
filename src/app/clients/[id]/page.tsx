"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Plus, Save, Loader2, StickyNote, CreditCard, TrendingUp, Shield, FileText, Clock } from 'lucide-react';
import type { Client, FamilyLinkPayload, RelationshipType } from '@/types/client';
import { useClientMutations } from "@/hooks/mutations/useClientMutations";
import { useFamilyLinks, useFamilyMutations } from "@/hooks/queries/useFamily";
import { useClients, useClient } from "@/hooks/queries/useClients";
import { useLocationSuggestions } from "@/hooks/queries/useLocations";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { formatDate, formatTime } from '@/lib/date-utils';
import ClientProfileHeader from '@/components/clients/ClientProfileHeader';
import ClientPersonalCards from '@/components/clients/ClientPersonalCards';
import ClientFamilySection from '@/components/clients/ClientFamilySection';
import SectionHeader from '@/components/clients/SectionHeader';

// ─── Status Badge ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const normalized = status.toLowerCase();
    const isSuccess = ['verified', 'completed', 'paid'].includes(normalized);
    const isPending = ['pending', 'active'].includes(normalized);

    const bg = isSuccess ? 'rgba(45,106,79,0.10)' : isPending ? 'rgba(201,162,77,0.14)' : 'rgba(201,162,77,0.10)';
    const border = isSuccess ? 'rgba(45,106,79,0.25)' : isPending ? 'rgba(201,162,77,0.28)' : 'rgba(201,162,77,0.22)';
    const textClass = isSuccess ? 'text-status-success' : 'text-gold-dark';

    return (
        <span className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full shrink-0 ${textClass}`}
              style={{ background: bg, border: `1px solid ${border}` }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

// ─── Client Data Normalization ───────────────────────────────────────

/** Normalizes dual-named fields (birthDate/dateOfBirth, phone/phonePrimary, etc.) */
function deriveNames(c: Client): Client {
    let firstName = c.firstName;
    let lastName = c.lastName;

    if (!firstName && !lastName && c.fullName) {
        const parts = c.fullName.split(' ');
        firstName = parts[0] || '';
        lastName = parts.slice(1).join(' ') || '';
    }

    const normalizedDate = formatDate(c.birthDate || c.dateOfBirth);
    const normalizedTime = formatTime(c.birthTime || c.timeOfBirth);

    return {
        ...c,
        firstName: firstName || '',
        lastName: lastName || '',
        birthPlace: c.birthPlace || c.placeOfBirth,
        birthDate: normalizedDate,
        birthTime: normalizedTime,
        placeOfBirth: c.birthPlace || c.placeOfBirth,
        dateOfBirth: normalizedDate,
        timeOfBirth: normalizedTime,
        phone: c.phonePrimary || c.phone,
    };
}

// ─── Page Component ──────────────────────────────────────────────────

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const clientId = params.id as string;

    // Core state
    const { data: rawClient, isLoading: loading, error: queryError } = useClient(clientId);
    const client = useMemo(() => rawClient ? deriveNames(rawClient) : undefined, [rawClient]);

    const [editData, setEditData] = useState<Partial<Client>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notes, setNotes] = useState("");
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    const { updateClient } = useClientMutations();
    const { confirm, dialog: confirmDialog } = useConfirmDialog();
    const toast = useToast();
    const [localError, setLocalError] = useState<string | null>(null);
    const error = localError || (queryError ? (queryError as Error).message : updateClient.error?.message) || null;
    const setError = (msg: string | null) => setLocalError(msg);

    // Sync editing state when client loads
    useEffect(() => {
        if (client && !isEditing) {
            setEditData(deriveNames(client));
            if (client.metadata?.quickNotes) {
                setNotes(client.metadata.quickNotes);
            } else if (client.notes && client.notes.length > 0) {
                setNotes(client.notes[0].noteContent);
            }
        }
    }, [client, isEditing]);

    // ── Location Search ──────────────────────────────────────────────

    const [searchLocationQuery, setSearchLocationQuery] = useState("");
    const { data: locationData, isLoading: loadingLocations } = useLocationSuggestions(searchLocationQuery);
    const locationSuggestions = locationData?.suggestions || [];

    const handleLocationSearch = (query: string) => {
        setEditData(prev => ({ ...prev, birthPlace: query }));
        setSearchLocationQuery(query);
    };

    const handleLocationSelect = (suggestion: { formatted: string; latitude: number; longitude: number; timezone?: string; city?: string; state?: string; country?: string }) => {
        setEditData(prev => ({
            ...prev,
            birthPlace: suggestion.formatted,
            birthLatitude: suggestion.latitude,
            birthLongitude: suggestion.longitude,
            birthTimezone: suggestion.timezone,
            city: suggestion.city || prev.city,
            state: suggestion.state || prev.state,
            country: suggestion.country || prev.country,
        }));
        setSearchLocationQuery("");
    };

    // ── Family Links ─────────────────────────────────────────────────

    const { data: familyLinks = [], isLoading: loadingFamily } = useFamilyLinks(clientId);
    const { linkFamily, unlinkFamily } = useFamilyMutations();
    const [searchRel, setSearchRel] = useState("");
    const [addingFamily, setAddingFamily] = useState(false);
    const { data: searchResults } = useClients({ search: searchRel, limit: 10 });
    const availableClients = (searchResults?.clients || [])
        .filter(c => c.id !== clientId && !familyLinks.some(l => l.relatedClientId === c.id))
        .map(deriveNames);

    const handleAddFamilyLink = async (relatedClient: Client, relType: RelationshipType) => {
        setAddingFamily(true);
        try {
            const payload: FamilyLinkPayload = { relatedClientId: relatedClient.id, relationshipType: relType };
            await linkFamily.mutateAsync({ clientId, payload });
            setSearchRel("");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to add family member');
        } finally {
            setAddingFamily(false);
        }
    };

    const handleRemoveFamilyLink = async (relatedClientId: string) => {
        const link = familyLinks.find(l => l.relatedClientId === relatedClientId);
        const linkName = link?.relatedClient?.fullName || "this family member";
        const confirmed = await confirm({
            title: "Remove Relationship",
            description: `Remove the family link to ${linkName}? This won't delete their client record.`,
            confirmLabel: "Remove",
            variant: "warning",
        });
        if (!confirmed) return;
        try {
            await unlinkFamily.mutateAsync({ clientId, relatedClientId });
            toast.success("Family link removed.");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Failed to remove family link.");
        }
    };

    // ── Save Handlers ────────────────────────────────────────────────

    const handleSave = async () => {
        if (!client) return;
        setIsSaving(true);
        setError(null);
        try {
            const updatedFullName = `${editData.firstName || ''} ${editData.lastName || ''}`.trim();
            const {
                firstName: _fn, lastName: _ln, phone: _ph, dateOfBirth: _dob, timeOfBirth: _tob,
                placeOfBirth: _pob, avatar: _av,
                familyLinksFrom: _flf, familyLinksTo: _flt, consultations: _con,
                notes: _clientNotes, remedies: _rem,
                ...cleanData
            } = editData;

            const payload: Record<string, unknown> = {
                ...cleanData,
                fullName: updatedFullName,
                birthDate: editData.birthDate || undefined,
                birthTime: editData.birthTime || undefined,
            };

            if (payload.birthLatitude !== undefined && payload.birthLatitude !== null) {
                payload.birthLatitude = Number(payload.birthLatitude);
            }
            if (payload.birthLongitude !== undefined && payload.birthLongitude !== null) {
                payload.birthLongitude = Number(payload.birthLongitude);
            }

            await updateClient.mutateAsync({ id: clientId, data: payload }, {
                onSuccess: (updated) => {
                    setEditData(deriveNames(updated));
                    setIsEditing(false);
                },
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update client profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!clientId) return;
        setIsSavingNotes(true);
        try {
            await updateClient.mutateAsync({
                id: clientId,
                data: { metadata: { ...client?.metadata, quickNotes: notes } },
            });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to save notes');
        } finally {
            setIsSavingNotes(false);
        }
    };

    const handleFieldChange = (field: string, value: unknown) => {
        if (field === 'fullName') {
            const val = value as string;
            setEditData(prev => ({ ...prev, fullName: val, firstName: val.split(' ')[0] || '', lastName: val.split(' ').slice(1).join(' ') || '' }));
        } else if (field === 'gender') {
            setEditData(prev => ({ ...prev, gender: value as 'male' | 'female' | 'other' }));
        } else {
            setEditData(prev => ({ ...prev, [field]: value }));
        }
    };

    // ── Guard Clauses ────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gold-primary mx-auto mb-4 animate-spin" />
                    <p className="font-serif text-xl text-ink/60">Loading client...</p>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="font-serif text-xl text-status-error mb-4">{error || 'Client not found'}</p>
                    <button onClick={() => router.push('/clients')} className="text-gold-dark hover:underline font-serif text-[15px]">
                        Return to Registry
                    </button>
                </div>
            </div>
        );
    }

    // ── Render ───────────────────────────────────────────────────────

    return (
        <div className="animate-in fade-in duration-500">
            {/* Profile Header */}
            <ClientProfileHeader
                client={client}
                isEditing={isEditing}
                isSaving={isSaving}
                error={error}
                onEdit={() => { setEditData(client); setIsEditing(true); }}
                onCancel={() => setIsEditing(false)}
                onSave={handleSave}
                onClearError={() => setError(null)}
            />

            {/* Personal Info Cards */}
            <ClientPersonalCards
                client={client}
                editData={editData}
                isEditing={isEditing}
                onFieldChange={handleFieldChange}
                locationSuggestions={locationSuggestions}
                isSearchingLocation={loadingLocations}
                onLocationSearch={handleLocationSearch}
                onLocationSelect={handleLocationSelect}
            />

            {/* Family Connections */}
            <ClientFamilySection
                familyLinks={familyLinks}
                loadingFamily={loadingFamily}
                availableClients={availableClients}
                searchRel={searchRel}
                onSearchRelChange={setSearchRel}
                onAddFamilyLink={handleAddFamilyLink}
                onRemoveFamilyLink={handleRemoveFamilyLink}
                addingFamily={addingFamily}
            />

            {/* ── Session Notes ─────────────────────────────────────── */}
            <div className="mt-8">
                <SectionHeader
                    icon={StickyNote}
                    title="Session Notes"
                    action={
                        <button
                            onClick={handleSaveNotes}
                            disabled={isSavingNotes}
                            className="px-5 py-2.5 bg-gold-primary text-white rounded-lg text-[13px] font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSavingNotes ? "Saving..." : "Save Notes"}
                        </button>
                    }
                />
                <div className="prem-card p-5">
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Write your observations, notes, and reminders for this client..."
                        className="w-full h-[320px] bg-parchment/30 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-gold-primary/30 font-serif text-[15px] text-ink leading-relaxed placeholder:text-ink/30 transition-all"
                        style={{ border: '1px solid rgba(220,201,166,0.30)' }}
                        aria-label="Client notes"
                    />
                </div>
            </div>

            {/* ── Past Sessions ──────────────────────────────────────── */}
            <div className="mt-8">
                <SectionHeader
                    icon={Calendar}
                    title="Past Sessions"
                    description="Previous consultation history"
                />
                <div className="space-y-3">
                    {[
                        { id: 1, date: "2026-01-05", topic: "Career Guidance", notes: "Discussed job change during Saturn Antardasha", duration: "45 min" },
                        { id: 2, date: "2025-11-20", topic: "Marriage Timing", notes: "Favorable periods in 2026 identified", duration: "30 min" },
                        { id: 3, date: "2025-09-15", topic: "Health Concerns", notes: "Rahu transit impact on 6th house reviewed", duration: "40 min" },
                    ].map(session => (
                        <div key={session.id} className="prem-card p-5 hover:border-gold-primary/40 transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-serif font-bold text-ink text-[16px]">{session.topic}</h3>
                                    <p className="text-[12px] text-ink/55 font-semibold flex items-center gap-2 mt-1">
                                        <Clock className="w-3.5 h-3.5" /> {session.date} &#8226; {session.duration}
                                    </p>
                                </div>
                                <button className="text-[13px] text-gold-dark font-semibold hover:underline underline-offset-2 px-3 py-1.5 rounded-lg hover:bg-parchment/40 transition-all">
                                    View Full
                                </button>
                            </div>
                            <p className="text-[14px] text-ink/85 leading-relaxed">{session.notes}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Predictions Made ───────────────────────────────────── */}
            <div className="mt-8">
                <SectionHeader
                    icon={TrendingUp}
                    title="Predictions Made"
                    description="Track prediction accuracy over time"
                    action={
                        <button className="px-4 py-2.5 rounded-lg text-[13px] font-semibold text-ink transition-all flex items-center gap-2 hover:bg-parchment/50"
                                style={{ border: '1px solid rgba(220,201,166,0.40)' }}>
                            <Plus className="w-4 h-4" /> Add Prediction
                        </button>
                    }
                />
                <div className="space-y-3">
                    {[
                        { id: 1, date: "2026-01-05", prediction: "Job change expected by Feb 2025", status: "pending", category: "Career" },
                        { id: 2, date: "2025-11-20", prediction: "Marriage likely between June-August 2026", status: "pending", category: "Marriage" },
                        { id: 3, date: "2025-09-15", prediction: "Health improvement after Oct 2025", status: "verified", category: "Health" },
                    ].map(pred => (
                        <div key={pred.id} className="prem-card p-5 hover:border-gold-primary/40 transition-all">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2.5 mb-2">
                                        <span className="px-3 py-1 text-[11px] font-bold text-gold-dark uppercase tracking-wider rounded-full"
                                              style={{ background: 'rgba(201,162,77,0.14)', border: '1px solid rgba(201,162,77,0.28)' }}>
                                            {pred.category}
                                        </span>
                                        <span className="text-[12px] text-ink/55 font-semibold">{pred.date}</span>
                                    </div>
                                    <p className="font-medium text-ink text-[15px]">{pred.prediction}</p>
                                </div>
                                <StatusBadge status={pred.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Remedies Given ─────────────────────────────────────── */}
            <div className="mt-8">
                <SectionHeader
                    icon={Shield}
                    title="Remedies Given"
                    description="Prescribed remedies and their progress"
                    action={
                        <button className="px-4 py-2.5 rounded-lg text-[13px] font-semibold text-ink transition-all flex items-center gap-2 hover:bg-parchment/50"
                                style={{ border: '1px solid rgba(220,201,166,0.40)' }}>
                            <Plus className="w-4 h-4" /> Add Remedy
                        </button>
                    }
                />
                <div className="space-y-3">
                    {[
                        { id: 1, date: "2026-01-05", remedy: "Blue Sapphire (Neelam)", type: "Gemstone", status: "active", notes: "Wear on Saturday morning after puja" },
                        { id: 2, date: "2025-11-20", remedy: "Shani Mantra - 23,000 Japa", type: "Mantra", status: "completed", notes: "Complete within 40 days" },
                        { id: 3, date: "2025-09-15", remedy: "Donate black sesame on Saturdays", type: "Donation", status: "ongoing", notes: "Every Saturday for 11 weeks" },
                    ].map(remedy => (
                        <div key={remedy.id} className="prem-card p-5 hover:border-gold-primary/40 transition-all">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-1.5">
                                        <span className="px-3 py-1 text-[11px] font-bold text-gold-dark uppercase tracking-wider rounded-full"
                                              style={{ background: 'rgba(201,162,77,0.14)', border: '1px solid rgba(201,162,77,0.28)' }}>
                                            {remedy.type}
                                        </span>
                                    </div>
                                    <h3 className="font-serif font-bold text-ink text-[16px]">{remedy.remedy}</h3>
                                </div>
                                <StatusBadge status={remedy.status} />
                            </div>
                            <p className="text-[14px] text-ink/85 leading-relaxed">{remedy.notes}</p>
                            <p className="text-[12px] text-ink/55 font-semibold mt-2">Prescribed: {remedy.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Documents ──────────────────────────────────────────── */}
            <div className="mt-8">
                <SectionHeader
                    icon={FileText}
                    title="Documents"
                    description="Charts, reports, and client documents"
                    action={
                        <button className="px-4 py-2.5 rounded-lg text-[13px] font-semibold text-ink transition-all flex items-center gap-2 hover:bg-parchment/50"
                                style={{ border: '1px solid rgba(220,201,166,0.40)' }}>
                            <Plus className="w-4 h-4" /> Upload Document
                        </button>
                    }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {[
                        { id: 1, name: "Birth Chart Analysis.pdf", date: "2026-01-05", size: "245 KB" },
                        { id: 2, name: "Yearly Prediction 2026.pdf", date: "2025-12-20", size: "180 KB" },
                        { id: 3, name: "Marriage Compatibility.pdf", date: "2025-11-15", size: "320 KB" },
                    ].map(doc => (
                        <div key={doc.id} className="prem-card p-4 hover:border-gold-primary/40 transition-all group cursor-pointer">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(181,71,71,0.12) 0%, rgba(155,44,44,0.06) 100%)',
                                         border: '1px solid rgba(181,71,71,0.20)',
                                     }}>
                                    <FileText className="w-4.5 h-4.5 text-status-error/80" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-ink text-[14px] truncate group-hover:text-gold-dark transition-colors">{doc.name}</h4>
                                    <p className="text-[12px] text-ink/55 font-semibold mt-1">{doc.date} &#8226; {doc.size}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="prem-card text-center py-12"
                     style={{ border: '1px dashed rgba(220,201,166,0.45)' }}>
                    <FileText className="w-10 h-10 text-ink/20 mx-auto mb-3" />
                    <p className="text-ink/50 font-serif text-[14px]">Drop files here or click Upload</p>
                </div>
            </div>

            {/* ── Payment History ────────────────────────────────────── */}
            <div className="mt-8 mb-10">
                <SectionHeader
                    icon={CreditCard}
                    title="Payment History"
                    description="Consultation fees and payment records"
                />

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="prem-card p-5">
                        <p className="text-[11px] text-bronze-dark/80 uppercase tracking-[0.10em] font-bold mb-2">Total Paid</p>
                        <p className="text-[22px] font-serif font-bold text-ink">&#8377;8,500</p>
                    </div>
                    <div className="prem-card p-5">
                        <p className="text-[11px] text-bronze-dark/80 uppercase tracking-[0.10em] font-bold mb-2">Pending</p>
                        <p className="text-[22px] font-serif font-bold text-gold-dark">&#8377;0</p>
                    </div>
                    <div className="prem-card p-5">
                        <p className="text-[11px] text-bronze-dark/80 uppercase tracking-[0.10em] font-bold mb-2">Sessions</p>
                        <p className="text-[22px] font-serif font-bold text-ink">5</p>
                    </div>
                </div>

                {/* Payment Rows */}
                <div className="space-y-3">
                    {[
                        { id: 1, date: "2026-01-05", amount: 2500, type: "Consultation Fee", method: "UPI", status: "paid" },
                        { id: 2, date: "2025-11-20", amount: 3500, type: "Full Chart Analysis", method: "Card", status: "paid" },
                        { id: 3, date: "2025-09-15", amount: 2500, type: "Follow-up Session", method: "Cash", status: "paid" },
                    ].map(payment => (
                        <div key={payment.id} className="prem-card p-5 flex items-center justify-between hover:border-gold-primary/40 transition-all">
                            <div>
                                <p className="font-medium text-ink text-[15px]">{payment.type}</p>
                                <p className="text-[12px] text-ink/55 font-semibold mt-1">{payment.date} &#8226; {payment.method}</p>
                            </div>
                            <div className="text-right flex items-center gap-3">
                                <p className="font-serif font-bold text-ink text-[17px]">&#8377;{payment.amount.toLocaleString()}</p>
                                <StatusBadge status={payment.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {confirmDialog}
        </div>
    );
}
