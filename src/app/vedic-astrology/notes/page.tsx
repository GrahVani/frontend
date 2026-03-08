"use client";

import React from 'react';
import { NotebookPen, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';

export default function NotesHistoryPage() {
    const { clientDetails } = useVedicClient();

    if (!clientDetails) return null;

    // Mock consultation history
    const consultations = [
        {
            id: 1,
            date: "2024-12-15",
            topic: "Career Change Query",
            predictions: "Job change expected in Saturn Antar-dasha (Feb 2025)",
            status: "pending",
            remedies: "Shani Japa, Blue Sapphire after Panchang muhurta"
        },
        {
            id: 2,
            date: "2024-10-08",
            topic: "Marriage Timing",
            predictions: "Favorable period Jun-Aug 2025 during Jupiter transit",
            status: "verified",
            remedies: "Venus Shanti, Donate white items on Friday"
        },
        {
            id: 3,
            date: "2024-08-22",
            topic: "Health Concerns",
            predictions: "Caution advised during Ketu-Mars period",
            status: "pending",
            remedies: "Ketu Beej Mantra, Hanuman Chalisa"
        }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                        <NotebookPen className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                        <h1 className="text-[24px] font-serif font-bold text-ink">Consultation History</h1>
                        <p className="text-[14px] text-ink/45">Past sessions with {clientDetails.name}</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-gold-primary text-ink rounded-lg text-[14px] font-semibold hover:bg-gold-soft transition-colors">
                    + Add Note
                </button>
            </div>

            {/* Consultation List */}
            <div className="space-y-4">
                {consultations.map((session) => (
                    <ConsultationCard key={session.id} session={session} />
                ))}
            </div>

            {/* Summary */}
            <div className="prem-card rounded-xl p-5 flex items-center justify-between">
                <span className="text-[14px] text-ink/45">Total Consultations</span>
                <span className="font-serif font-bold text-ink">{consultations.length}</span>
            </div>
        </div>
    );
}

function ConsultationCard({ session }: { session: { id: number; date: string; topic: string; predictions: string; status: string; remedies: string } }) {
    const statusIcon = session.status === "verified"
        ? <CheckCircle2 className="w-4 h-4 text-green-600" />
        : <Clock className="w-4 h-4 text-gold-dark" />;

    const statusLabel = session.status === "verified" ? "Verified" : "Pending";
    const statusColor = session.status === "verified" ? "text-green-600" : "text-gold-dark";

    return (
        <div className="prem-card rounded-xl p-5 hover:border-gold-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <h3 className="font-serif font-bold text-ink">{session.topic}</h3>
                    <div className="flex items-center gap-2 text-[12px] text-ink/45 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{session.date}</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1 text-[12px] font-semibold ${statusColor}`}>
                    {statusIcon}
                    <span>{statusLabel}</span>
                </div>
            </div>

            <div className="space-y-2 text-[14px]">
                <div>
                    <span className="text-ink/45">Prediction:</span>
                    <span className="text-body ml-2">{session.predictions}</span>
                </div>
                <div>
                    <span className="text-ink/45">Remedies:</span>
                    <span className="text-body ml-2">{session.remedies}</span>
                </div>
            </div>
        </div>
    );
}
