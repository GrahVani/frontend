"use client";

import React from 'react';
import { Download, Eye, Loader2, XCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReportListItem, ReportStatus } from '@/types/grantha';

interface ReportHistoryTableProps {
    reports: ReportListItem[];
    isLoading: boolean;
    /** Map of blueprintId → name for display. Fetched by parent. */
    blueprintNames?: Record<string, string>;
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
    const config: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
        COMPLETE: {
            bg: 'rgba(45,106,79,0.10)',
            border: 'rgba(45,106,79,0.25)',
            text: 'text-status-success',
            icon: <CheckCircle2 className="w-3 h-3" />,
        },
        FAILED: {
            bg: 'rgba(181,71,71,0.10)',
            border: 'rgba(181,71,71,0.25)',
            text: 'text-status-error',
            icon: <XCircle className="w-3 h-3" />,
        },
        CANCELLED: {
            bg: 'rgba(100,100,100,0.10)',
            border: 'rgba(100,100,100,0.25)',
            text: 'text-ink/50',
            icon: <XCircle className="w-3 h-3" />,
        },
    };

    const inProgress = !['COMPLETE', 'FAILED', 'CANCELLED', 'EXPIRED'].includes(status);
    const c = config[status] || {
        bg: 'rgba(201,162,77,0.14)',
        border: 'rgba(201,162,77,0.28)',
        text: 'text-gold-dark',
        icon: inProgress ? <Loader2 className="w-3 h-3 animate-spin" /> : <Clock className="w-3 h-3" />,
    };

    return (
        <span
            className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full", c.text)}
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
            {c.icon}
            {status}
        </span>
    );
}

export default function ReportHistoryTable({ reports, isLoading, blueprintNames = {} }: ReportHistoryTableProps) {
    if (isLoading) {
        return (
            <div className="prem-card rounded-2xl p-10 text-center">
                <Loader2 className="w-6 h-6 text-gold-primary mx-auto mb-3 animate-spin" />
                <p className="text-[14px] text-ink/40 font-serif">Loading reports...</p>
            </div>
        );
    }

    if (reports.length === 0) {
        return (
            <div className="prem-card rounded-2xl p-10 text-center">
                <p className="text-[14px] text-ink/40 font-serif">No reports generated yet.</p>
            </div>
        );
    }

    return (
        <div className="prem-card rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-[14px]">
                <thead className="bg-surface-warm text-body/70 font-black uppercase text-[10px] tracking-widest border-b border-gold-primary/10">
                    <tr>
                        <th className="px-5 py-3">Report Type</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Pages</th>
                        <th className="px-5 py-3">Cost</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gold-primary/5">
                    {reports.map((report) => (
                        <tr key={report.id} className="hover:bg-ink/[0.02] transition-colors">
                            <td className="px-5 py-4 text-gold-dark text-[13px] font-semibold">
                                {blueprintNames[report.blueprintId] || report.blueprintId.slice(0, 8)}
                            </td>
                            <td className="px-5 py-4 text-ink/55 text-[13px] font-semibold">
                                {new Date(report.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </td>
                            <td className="px-5 py-4 font-mono text-[13px] text-ink/60">
                                {report.pageCount ?? '—'}
                            </td>
                            <td className="px-5 py-4 font-mono text-[13px] text-ink/60">
                                {report.totalCost != null && report.totalCost > 0 ? `₹${report.totalCost.toFixed(2)}` : '—'}
                            </td>
                            <td className="px-5 py-4">
                                <ReportStatusBadge status={report.status} />
                            </td>
                            <td className="px-5 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {report.status === 'COMPLETE' && (
                                        <a
                                            href={`/vedic-astrology/reports/${report.id}`}
                                            className="p-2 rounded-lg hover:bg-gold-primary/10 transition-colors text-gold-dark"
                                            title="View Report"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
