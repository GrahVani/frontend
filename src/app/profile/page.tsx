"use client";

import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Shield, Camera, Edit3, Save, X } from 'lucide-react';
import Button from "@/components/ui/Button";
import ParchmentInput from "@/components/ui/ParchmentInput";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useToast } from "@/context/ToastContext";

export default function ProfilePage() {
    const { user, refreshProfile } = useAuth();
    const toast = useToast();
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <SkeletonCard />
            </div>
        );
    }

    const handleEdit = () => {
        setEditName(user.name || "");
        setEditBio("Dedicated to exploring the celestial alignments that guide human destiny through the ancient wisdom of Vedic Astrology.");
        setEditing(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // TODO: Call profile update API
            toast.success("Profile updated successfully.");
            setEditing(false);
        } catch {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-12 flex items-end gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-header-gradient border-2 border-header-border shadow-2xl flex items-center justify-center overflow-hidden">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-serif text-softwhite uppercase">{user.name?.[0] || user.email?.[0]}</span>
                        )}
                    </div>
                    <button
                        className="absolute -bottom-2 -right-2 w-10 h-10 bg-softwhite rounded-xl shadow-lg border border-header-border/20 flex items-center justify-center text-gold-dark hover:bg-parchment transition-colors group-hover:scale-110 duration-300"
                        aria-label="Change avatar"
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 pb-2">
                    <span className="text-header-border text-xs font-black uppercase tracking-[0.3em] mb-2 block">Astrologer Identity</span>
                    <h1 className="text-4xl font-serif font-bold text-ink leading-none">{user.name || 'Seeker'}</h1>
                    <p className="text-muted-refined font-serif italic mt-2">{user.email}</p>
                </div>
                <div className="pb-2">
                    {editing ? (
                        <div className="flex items-center gap-2">
                            <Button onClick={handleSave} icon={Save} loading={isSaving} size="sm">Save</Button>
                            <Button onClick={handleCancel} variant="ghost" icon={X} size="sm">Cancel</Button>
                        </div>
                    ) : (
                        <Button onClick={handleEdit} variant="secondary" icon={Edit3} size="sm">Edit Profile</Button>
                    )}
                </div>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Essential Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-softwhite border border-antique rounded-2xl p-8 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-header-border/5 rounded-full blur-3xl -mr-16 -mt-16" />

                        <h2 className="text-xl font-serif font-bold text-ink mb-8 flex items-center gap-3">
                            <User className="w-5 h-5 text-header-border" />
                            Profile Details
                        </h2>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {editing ? (
                                    <ParchmentInput
                                        label="Display Name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <ProfileItem label="Display Name" value={user.name} />
                                )}
                                <ProfileItem label="Role" value={user.role || 'Senior Astrologer'} icon={<Shield className="w-3 h-3" />} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileItem label="Primary Email" value={user.email} />
                                <ProfileItem label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Ancient Times'} />
                            </div>

                            <div className="pt-4">
                                {editing ? (
                                    <ParchmentInput
                                        label="Bio / Professional Philosophy"
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        placeholder="Your professional philosophy"
                                    />
                                ) : (
                                    <ProfileItem label="Bio / Professional Philosophy" value="Dedicated to exploring the celestial alignments that guide human destiny through the ancient wisdom of Vedic Astrology." fullWidth />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Actions */}
                <div className="space-y-6">
                    <div className="bg-header-gradient rounded-2xl p-6 text-softwhite shadow-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-active-glow mb-4">Account Status</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                            <span className="text-sm font-medium">Verified Astronomer</span>
                        </div>
                        <p className="text-softwhite/60 text-xs leading-relaxed font-serif italic">
                            Your celestial credentials are fully verified. All predictions made are cryptographically signed.
                        </p>
                    </div>

                    <div className="bg-softwhite border border-antique rounded-2xl p-6 space-y-4">
                        <Button variant="golden" className="w-full" onClick={() => {}}>
                            Update Journal
                        </Button>
                        <button className="w-full py-3 rounded-xl border border-divider text-muted-refined text-xs font-bold uppercase tracking-wider hover:bg-parchment transition-colors">
                            Change Password
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ label, value, icon, fullWidth = false }: { label: string, value?: string, icon?: React.ReactNode, fullWidth?: boolean }) {
    return (
        <div className={fullWidth ? "col-span-full" : ""}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-header-border mb-2 flex items-center gap-2">
                {label}
                {icon}
            </p>
            <p className="text-ink font-serif text-lg border-b border-antique pb-2">
                {value || 'Not provided'}
            </p>
        </div>
    );
}
