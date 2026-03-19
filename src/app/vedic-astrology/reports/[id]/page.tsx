"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Loader2, Clock, Layers, DollarSign, XCircle } from 'lucide-react';
import { useReportStatus } from '@/hooks/queries/useGrantha';
import PdfViewer from '@/components/grantha/PdfViewer';
import { REPORT_STEP_NAMES } from '@/types/grantha';

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const reportId = params.id as string;

    const { data: report, isLoading } = useReportStatus(reportId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="font-serif text-[20px] text-status-error mb-4">Report not found</p>
                    <button onClick={() => router.push('/vedic-astrology/reports')} className="text-gold-dark hover:underline font-serif">
                        Back to Report Lab
                    </button>
                </div>
            </div>
        );
    }

    const isComplete = report.status === 'COMPLETE';
    // downloadUrl is a signed URL returned by Grantha in the report status response
    const downloadUrl = isComplete ? report.downloadUrl : null;

    return (
        <div className="animate-in fade-in duration-500 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/vedic-astrology/reports')}
                        className="p-2 rounded-lg hover:bg-ink/5 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-ink/50" />
                    </button>
                    <div>
                        <h1 className="text-[24px] font-serif text-ink font-black tracking-tight">
                            Report
                        </h1>
                        <p className="text-[13px] text-ink/50 font-semibold">
                            {new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {report.language && ` · ${report.language.toUpperCase()}`}
                        </p>
                    </div>
                </div>

                {downloadUrl && (
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 bg-gold-primary text-white rounded-lg text-[13px] font-semibold hover:bg-gold-dark transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </a>
                )}
            </div>

            <div className="flex gap-6">
                {/* PDF Viewer — main area */}
                <div className="flex-1 prem-card rounded-2xl overflow-hidden">
                    {isComplete && downloadUrl ? (
                        <PdfViewer url={downloadUrl} className="rounded-2xl" />
                    ) : ['FAILED', 'CANCELLED', 'EXPIRED'].includes(report.status) ? (
                        <div className="flex flex-col items-center justify-center py-24 text-ink/40">
                            <XCircle className="w-10 h-10 mb-4 text-status-error" />
                            <p className="font-serif text-[18px] font-bold text-ink mb-2">{report.status}</p>
                            {report.error && (
                                <p className="text-[13px] text-ink/50 text-center max-w-sm">
                                    {typeof report.error === 'string' ? report.error : 'Report generation failed'}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-ink/30">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" />
                            <p className="font-serif text-[16px]">
                                {REPORT_STEP_NAMES[report.currentStep] || report.status}
                            </p>
                            <p className="text-[13px] mt-2">{Math.round(report.progress)}% complete</p>
                        </div>
                    )}
                </div>

                {/* Sidebar — metadata */}
                <div className="w-64 shrink-0 space-y-4">
                    <div className="prem-card rounded-xl p-4 space-y-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3">Details</h4>

                        <div className="flex items-center gap-2 text-[13px]">
                            <Layers className="w-4 h-4 text-ink/30" />
                            <span className="text-ink/70">Pages: <strong className="text-ink">{report.pageCount ?? '—'}</strong></span>
                        </div>

                        <div className="flex items-center gap-2 text-[13px]">
                            <DollarSign className="w-4 h-4 text-ink/30" />
                            <span className="text-ink/70">Cost: <strong className="text-ink">{report.totalCost != null && report.totalCost > 0 ? `₹${report.totalCost.toFixed(2)}` : '—'}</strong></span>
                        </div>

                        <div className="flex items-center gap-2 text-[13px]">
                            <Clock className="w-4 h-4 text-ink/30" />
                            <span className="text-ink/70">Time: <strong className="text-ink">
                                {report.completedAt && report.startedAt
                                    ? `${Math.round((new Date(report.completedAt).getTime() - new Date(report.startedAt).getTime()) / 1000)}s`
                                    : '—'
                                }
                            </strong></span>
                        </div>
                    </div>

                    <div className="prem-card rounded-xl p-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3">Status</h4>
                        <p className="text-[14px] font-semibold text-gold-dark">{report.status}</p>
                        {report.language && (
                            <p className="text-[12px] text-ink/50 mt-1">Language: {report.language.toUpperCase()}</p>
                        )}
                        {report.mode && (
                            <p className="text-[12px] text-ink/50">Mode: {report.mode}</p>
                        )}
                    </div>

                    {/* Sections breakdown */}
                    {report.sections && report.sections.length > 0 && (
                        <div className="prem-card rounded-xl p-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-ink/35 mb-3">Sections</h4>
                            <div className="space-y-2">
                                {report.sections.map((s) => (
                                    <div key={s.sectionId} className="flex items-center justify-between text-[12px]">
                                        <span className="text-ink/70 truncate mr-2">{s.sectionId}</span>
                                        <span className={`font-semibold ${s.status === 'complete' ? 'text-green-600' : 'text-ink/40'}`}>
                                            {s.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
