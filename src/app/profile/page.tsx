"use client";

import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { User, Shield, Camera, Edit3, Save, X } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="mb-8 flex items-end gap-8">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl flex items-center justify-center overflow-hidden"
                         style={{
                             background: 'linear-gradient(145deg, rgba(201,162,77,0.25) 0%, rgba(139,90,43,0.18) 50%, rgba(201,162,77,0.12) 100%)',
                             border: '2px solid rgba(201,162,77,0.40)',
                             boxShadow: 'inset 0 2px 8px rgba(139,90,43,0.10), 0 12px 32px rgba(62,46,22,0.12)',
                         }}>
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-5xl font-serif text-gold-dark/80 uppercase">{user.name?.[0] || user.email?.[0]}</span>
                        )}
                    </div>
                    <button
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-gold-dark hover:text-gold-primary transition-all group-hover:scale-110 duration-300"
                        aria-label="Change avatar"
                        style={{
                            background: 'rgba(255,253,249,0.90)',
                            border: '1px solid rgba(220,201,166,0.40)',
                            boxShadow: '0 4px 12px rgba(62,46,22,0.10)',
                        }}
                    >
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex-1 pb-2">
                    <span className="text-gold-dark text-[11px] font-black uppercase tracking-[0.3em] mb-2 block">Astrologer Profile</span>
                    <h1 className="text-[30px] font-serif font-bold text-ink leading-none">{user.name || 'Astrologer'}</h1>
                    <p className="text-ink/45 font-serif italic mt-2 text-[14px]">{user.email}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column - Essential Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="prem-card glass-shimmer relative overflow-hidden rounded-2xl p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16"
                             style={{ background: 'rgba(201,162,77,0.06)' }} />

                        <h2 className="text-[17px] font-serif font-bold text-ink mb-6 flex items-center gap-3">
                            <User className="w-5 h-5 text-gold-dark" />
                            Profile Details
                        </h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileItem label="Primary Email" value={user.email} />
                                <ProfileItem label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />
                            </div>

                            <div className="pt-4">
                                {editing ? (
                                    <ParchmentInput
                                        label="Professional Bio"
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        placeholder="Your professional philosophy"
                                    />
                                ) : (
                                    <ProfileItem label="Professional Bio" value="Dedicated to exploring the celestial alignments that guide human destiny through the ancient wisdom of Vedic Astrology." fullWidth />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Actions */}
                <div className="space-y-6">
                    <div className="rounded-2xl p-6 text-white"
                         style={{
                             background: 'linear-gradient(145deg, rgba(139,90,43,0.95) 0%, rgba(101,65,30,0.92) 50%, rgba(62,46,22,0.95) 100%)',
                             boxShadow: '0 12px 32px rgba(62,46,22,0.25), inset 0 1px 0 rgba(201,162,77,0.20)',
                         }}>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold-primary/80 mb-4">Account Status</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                            <span className="text-[14px] font-medium text-white/90">Verified Astrologer</span>
                        </div>
                        <p className="text-white/50 text-[12px] leading-relaxed font-serif italic">
                            Your account is verified and in good standing.
                        </p>
                    </div>

                    <div className="prem-card rounded-2xl p-6 space-y-4">
                        <Button variant="golden" className="w-full" onClick={() => {}}>
                            Edit Profile
                        </Button>
                        <Button variant="secondary" className="w-full">
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileItem({ label, value, icon, fullWidth = false }: { label: string, value?: string, icon?: React.ReactNode, fullWidth?: boolean }) {
    return (
        <div className={fullWidth ? "col-span-full" : ""}>
            <p className="text-[11px] font-bold tracking-[0.2em] text-gold-dark mb-2 flex items-center gap-2 uppercase">
                {label}
                {icon}
            </p>
            <p className="text-ink font-serif text-[16px] pb-2"
               style={{ borderBottom: '1px solid rgba(220,201,166,0.25)' }}>
                {value || 'Not provided'}
            </p>
        </div>
    );
}
