"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Plus, Save, Loader2, StickyNote, CreditCard } from 'lucide-react';
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
                    <p className="font-serif text-xl text-muted">Loading client...</p>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="font-serif text-xl text-red-600 mb-4">{error || 'Client not found'}</p>
                    <button onClick={() => router.push('/clients')} className="text-gold-dark hover:underline font-serif">
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

            {/* Session Notes */}
            <div className="mt-16">
                <h2 className="text-2xl font-serif text-ink font-bold mb-6">Session Notes</h2>
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-softwhite rounded-xl border border-antique p-6 min-h-[500px]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif font-bold text-ink">Quick Notes</h3>
                            <button
                                onClick={handleSaveNotes}
                                disabled={isSavingNotes}
                                className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {isSavingNotes ? "Saving..." : "Save"}
                            </button>
                        </div>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Write your observations, notes, and reminders for this client..."
                            className="w-full h-[400px] bg-parchment border border-antique rounded-lg p-4 resize-none focus:outline-none focus:border-gold-primary font-serif text-ink leading-relaxed placeholder:text-muted/50"
                            aria-label="Client notes"
                        />
                    </div>
                </div>
            </div>

            {/* Past Sessions (placeholder data — TODO: wire to sessions API) */}
            <div className="mt-16">
                <h2 className="text-2xl font-serif text-ink font-bold mb-6">Past Sessions</h2>
                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                    {[
                        { id: 1, date: "2026-01-05", topic: "Career Guidance", notes: "Discussed job change during Saturn Antardasha", duration: "45 min" },
                        { id: 2, date: "2025-11-20", topic: "Marriage Timing", notes: "Favorable periods in 2026 identified", duration: "30 min" },
                        { id: 3, date: "2025-09-15", topic: "Health Concerns", notes: "Rahu transit impact on 6th house reviewed", duration: "40 min" },
                    ].map(session => (
                        <div key={session.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="font-serif font-bold text-ink">{session.topic}</h3>
                                    <p className="text-xs text-muted flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3" /> {session.date} &#8226; {session.duration}
                                    </p>
                                </div>
                                <button className="text-xs text-gold-dark font-medium hover:underline">View Full</button>
                            </div>
                            <p className="text-sm text-body">{session.notes}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Predictions Made (placeholder data — TODO: wire to predictions API) */}
            <div className="mt-16">
                <h2 className="text-2xl font-serif text-ink font-bold mb-6">Predictions Made</h2>
                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                    <div className="flex items-center justify-end mb-2">
                        <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Prediction
                        </button>
                    </div>
                    {[
                        { id: 1, date: "2026-01-05", prediction: "Job change expected by Feb 2025", status: "pending", category: "Career" },
                        { id: 2, date: "2025-11-20", prediction: "Marriage likely between June-August 2026", status: "pending", category: "Marriage" },
                        { id: 3, date: "2025-09-15", prediction: "Health improvement after Oct 2025", status: "verified", category: "Health" },
                    ].map(pred => (
                        <div key={pred.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-gold-primary/10 text-gold-dark rounded">{pred.category}</span>
                                        <span className="text-xs text-muted">{pred.date}</span>
                                    </div>
                                    <p className="font-medium text-ink">{pred.prediction}</p>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${pred.status === 'verified' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
                                    {pred.status === 'verified' ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Remedies Given (placeholder data — TODO: wire to remedies API) */}
            <div className="mt-16">
                <h2 className="text-2xl font-serif text-ink font-bold mb-6">Remedies Given</h2>
                <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-4">
                    <div className="flex items-center justify-end mb-2">
                        <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Remedy
                        </button>
                    </div>
                    {[
                        { id: 1, date: "2026-01-05", remedy: "Blue Sapphire (Neelam)", type: "Gemstone", status: "active", notes: "Wear on Saturday morning after puja" },
                        { id: 2, date: "2025-11-20", remedy: "Shani Mantra - 23,000 Japa", type: "Mantra", status: "completed", notes: "Complete within 40 days" },
                        { id: 3, date: "2025-09-15", remedy: "Donate black sesame on Saturdays", type: "Donation", status: "ongoing", notes: "Every Saturday for 11 weeks" },
                    ].map(remedy => (
                        <div key={remedy.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 text-xs font-semibold bg-gold-primary/10 text-gold-dark rounded">{remedy.type}</span>
                                    </div>
                                    <h3 className="font-serif font-bold text-ink">{remedy.remedy}</h3>
                                </div>
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 ${remedy.status === 'completed' ? 'bg-green-50 text-green-700' : remedy.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {remedy.status.charAt(0).toUpperCase() + remedy.status.slice(1)}
                                </span>
                            </div>
                            <p className="text-sm text-muted">{remedy.notes}</p>
                            <p className="text-xs text-muted mt-2">Prescribed: {remedy.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Documents (placeholder data — TODO: wire to documents/storage API) */}
            <div className="mt-16">
                <h2 className="text-2xl font-serif text-ink font-bold mb-6">Documents</h2>
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-end mb-4">
                        <button className="px-4 py-2 bg-gold-primary text-white rounded-lg text-sm font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Upload Document
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { id: 1, name: "Birth Chart Analysis.pdf", date: "2026-01-05", size: "245 KB" },
                            { id: 2, name: "Yearly Prediction 2026.pdf", date: "2025-12-20", size: "180 KB" },
                            { id: 3, name: "Marriage Compatibility.pdf", date: "2025-11-15", size: "320 KB" },
                        ].map(doc => (
                            <div key={doc.id} className="bg-softwhite border border-antique rounded-xl p-4 hover:border-gold-primary/50 transition-colors group cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                                        <StickyNote className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-ink text-sm truncate group-hover:text-gold-dark">{doc.name}</h4>
                                        <p className="text-xs text-muted mt-1">{doc.date} &#8226; {doc.size}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 text-center py-12 border border-dashed border-antique rounded-xl bg-parchment/30">
                        <StickyNote className="w-10 h-10 text-muted/30 mx-auto mb-3" />
                        <p className="text-muted font-serif text-sm">Drop files here or click Upload</p>
                    </div>
                </div>
            </div>

            {/* Payment History (placeholder data — TODO: wire to payments API) */}
            <div className="mt-16 mb-16">
                <h2 className="text-2xl font-serif text-ink font-bold mb-6">Payment History</h2>
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-softwhite border border-antique rounded-xl p-4">
                            <p className="text-xs text-muted uppercase tracking-wider mb-1">Total Paid</p>
                            <p className="text-xl font-serif font-bold text-ink">&#8377;8,500</p>
                        </div>
                        <div className="bg-softwhite border border-antique rounded-xl p-4">
                            <p className="text-xs text-muted uppercase tracking-wider mb-1">Pending</p>
                            <p className="text-xl font-serif font-bold text-orange-600">&#8377;0</p>
                        </div>
                        <div className="bg-softwhite border border-antique rounded-xl p-4">
                            <p className="text-xs text-muted uppercase tracking-wider mb-1">Sessions</p>
                            <p className="text-xl font-serif font-bold text-ink">5</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { id: 1, date: "2026-01-05", amount: 2500, type: "Consultation Fee", method: "UPI", status: "paid" },
                            { id: 2, date: "2025-11-20", amount: 3500, type: "Full Chart Analysis", method: "Card", status: "paid" },
                            { id: 3, date: "2025-09-15", amount: 2500, type: "Follow-up Session", method: "Cash", status: "paid" },
                        ].map(payment => (
                            <div key={payment.id} className="bg-softwhite border border-antique rounded-xl p-4 flex items-center justify-between hover:border-gold-primary/50 transition-colors">
                                <div>
                                    <p className="font-medium text-ink">{payment.type}</p>
                                    <p className="text-xs text-muted mt-1">{payment.date} &#8226; {payment.method}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-serif font-bold text-ink">&#8377;{payment.amount.toLocaleString()}</p>
                                    <span className="text-xs text-green-600 font-semibold">Paid</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {confirmDialog}
        </div>
    );
}
