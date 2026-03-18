"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    X, Sparkles, Loader2, CheckCircle2, XCircle, Download,
    Eye, Globe, FileText, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { granthaApi, clientToGranthaBirthData } from '@/lib/api/grantha';
import { useGranthaMutations } from '@/hooks/mutations/useGranthaMutations';
import { useToast } from '@/context/ToastContext';
import { REPORT_STEP_NAMES } from '@/types/grantha';
import type { Client } from '@/types/client';
import type { Blueprint, StepEvent, SectionCompleteEvent, CompleteEvent, ErrorEvent } from '@/types/grantha';

type ModalStep = 'config' | 'progress' | 'complete' | 'error';

interface ReportGenerationModalProps {
    open: boolean;
    onClose: () => void;
    blueprint: Blueprint | null;
    client: Client | null;
}

export default function ReportGenerationModal({
    open,
    onClose,
    blueprint,
    client,
}: ReportGenerationModalProps) {
    const [step, setStep] = useState<ModalStep>('config');
    const [language, setLanguage] = useState('en');
    const [mode, setMode] = useState<'full' | 'draft'>('full');
    const [reportId, setReportId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentStepNum, setCurrentStepNum] = useState(0);
    const [stepName, setStepName] = useState('Queued');
    const [sectionsComplete, setSectionsComplete] = useState(0);
    const [sectionsTotal, setSectionsTotal] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [totalCost, setTotalCost] = useState(0);
    const [generationTime, setGenerationTime] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const eventSourceRef = useRef<EventSource | null>(null);
    const startTimeRef = useRef<number | null>(null);

    const { generateReport, cancelReport } = useGranthaMutations();
    const toast = useToast();

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setStep('config');
            setLanguage('en');
            setMode('full');
            setReportId(null);
            setProgress(0);
            setCurrentStepNum(0);
            setStepName('Queued');
            setSectionsComplete(0);
            setSectionsTotal(0);
            setDownloadUrl(null);
            setPageCount(null);
            setTotalCost(0);
            setGenerationTime(null);
            setErrorMessage(null);
            setCompletedSteps(new Set());
        }
        return () => {
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
        };
    }, [open]);

    // SSE progress connection — uses named event listeners
    const connectSSE = useCallback((reportId: string) => {
        eventSourceRef.current?.close();

        const es = granthaApi.streamProgress(reportId);
        eventSourceRef.current = es;

        // Prevent double-handling when a named error event triggers onerror too
        let terminated = false;

        // Grantha sends named events: step, section_complete, complete, error, failed, cancelled

        es.addEventListener('step', (event) => {
            try {
                const data: StepEvent = JSON.parse(event.data);
                setProgress(data.progress);
                setCurrentStepNum(data.step);
                setStepName(REPORT_STEP_NAMES[data.step] || data.status || 'Processing');

                // Track completed steps
                if (data.step > 0) {
                    setCompletedSteps(prev => {
                        const next = new Set(prev);
                        for (let i = 0; i < data.step; i++) next.add(i);
                        return next;
                    });
                }
            } catch { /* ignore parse errors */ }
        });

        es.addEventListener('section_complete', (event) => {
            try {
                const data: SectionCompleteEvent = JSON.parse(event.data);
                setSectionsComplete(data.index + 1);
                setSectionsTotal(data.total);
            } catch { /* ignore */ }
        });

        es.addEventListener('complete', (event) => {
            if (terminated) return;
            terminated = true;
            try {
                const data: CompleteEvent = JSON.parse(event.data);
                es.close();
                setStep('complete');
                setProgress(100);
                setDownloadUrl(data.downloadUrl ?? null);
                setPageCount(data.pageCount ?? null);
                setTotalCost(data.totalCost ?? 0);
                if (startTimeRef.current) {
                    setGenerationTime(Math.round((Date.now() - startTimeRef.current) / 1000));
                }
            } catch { /* ignore */ }
        });

        es.addEventListener('error', (event) => {
            if (terminated) return;
            terminated = true;
            try {
                // If this is an SSE MessageEvent with data, parse the error
                const msgEvent = event as MessageEvent;
                if (msgEvent.data) {
                    const data: ErrorEvent = JSON.parse(msgEvent.data);
                    setErrorMessage(data.message || 'Report generation failed');
                } else {
                    setErrorMessage('Connection lost. Check report status in Report Lab.');
                }
            } catch {
                setErrorMessage('Connection lost. Check report status in Report Lab.');
            }
            es.close();
            setStep('error');
        });

        es.addEventListener('failed', () => {
            if (terminated) return;
            terminated = true;
            es.close();
            setErrorMessage('Report generation failed');
            setStep('error');
        });

        es.addEventListener('cancelled', () => {
            if (terminated) return;
            terminated = true;
            es.close();
            toast.info('Report generation was cancelled');
            onClose();
        });

        // Generic onerror — network failures, connection drops
        es.onerror = () => {
            if (terminated) return;
            // Don't set error state — let user check report status manually
            es.close();
        };
    }, [toast, onClose]);

    // Handle "Generate" click
    const handleGenerate = async () => {
        if (!blueprint || !client) return;

        try {
            const birthData = clientToGranthaBirthData(client);
            startTimeRef.current = Date.now();
            setStep('progress');

            const result = await generateReport.mutateAsync({
                blueprintId: blueprint.id,
                birthData,
                language,
                mode,
            });

            setReportId(result.id);
            connectSSE(result.id);
        } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Failed to start report generation');
            setStep('error');
        }
    };

    // Handle cancel
    const handleCancel = async () => {
        if (!reportId) return;
        try {
            await cancelReport.mutateAsync(reportId);
            eventSourceRef.current?.close();
            toast.info('Report generation cancelled');
            onClose();
        } catch {
            toast.error('Failed to cancel report');
        }
    };

    if (!open || !blueprint) return null;

    // Validate birth data availability
    const hasBirthData = client?.birthDate && client?.birthTime && client?.birthLatitude != null && client?.birthLongitude != null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={step === 'config' ? onClose : undefined} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300"
                 style={{ border: '1px solid rgba(220,201,166,0.35)' }}>

                {/* Header */}
                <div className="p-5 border-b border-gold-primary/15 flex items-center justify-between">
                    <h3 className="font-serif font-bold text-ink text-[18px]">
                        {step === 'config' && 'Generate Report'}
                        {step === 'progress' && 'Generating...'}
                        {step === 'complete' && 'Report Ready'}
                        {step === 'error' && 'Generation Failed'}
                    </h3>
                    {step !== 'progress' && (
                        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-ink/5 transition-colors">
                            <X className="w-5 h-5 text-ink/50" />
                        </button>
                    )}
                </div>

                {/* ── Config Step ────────────────────────────────── */}
                {step === 'config' && (
                    <div className="p-5 space-y-5">
                        {/* Selected blueprint */}
                        <div className="prem-card p-4 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gold-primary/10 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-gold-dark" />
                                </div>
                                <div>
                                    <p className="font-bold text-ink text-[15px]">{blueprint.name}</p>
                                    <p className="text-[12px] text-ink/55">
                                        {blueprint.estimatedPages != null ? `~${blueprint.estimatedPages} pages` : 'Pages vary'}
                                        {blueprint.estimatedCost != null && blueprint.estimatedCost > 0 && ` · ~$${blueprint.estimatedCost.toFixed(2)}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Selected client */}
                        {client && (
                            <div className="prem-card p-4 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gold-primary/10 rounded-full flex items-center justify-center">
                                        <span className="font-serif font-bold text-gold-dark text-[16px]">
                                            {client.fullName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-ink text-[15px]">{client.fullName}</p>
                                        <p className="text-[12px] text-ink/55">
                                            {client.birthDate} &bull; {client.birthPlace || 'Unknown place'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Birth data validation warning */}
                        {client && !hasBirthData && (
                            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-800">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Client is missing birth data. Please update their profile before generating.</span>
                            </div>
                        )}

                        {/* Language selector */}
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-2 block">
                                Language
                            </label>
                            <div className="flex gap-2">
                                {[
                                    { code: 'en', label: 'English' },
                                    { code: 'hi', label: 'Hindi' },
                                ].map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setLanguage(lang.code)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all",
                                            language === lang.code
                                                ? "bg-gold-primary text-white"
                                                : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                                        )}
                                    >
                                        <Globe className="w-3.5 h-3.5" />
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Mode toggle */}
                        <div>
                            <label className="text-[11px] font-bold uppercase tracking-widest text-ink/40 mb-2 block">
                                Mode
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setMode('full')}
                                    className={cn(
                                        "flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-center",
                                        mode === 'full'
                                            ? "bg-gold-primary text-white"
                                            : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                                    )}
                                >
                                    Full Report
                                </button>
                                <button
                                    onClick={() => setMode('draft')}
                                    className={cn(
                                        "flex-1 py-2.5 rounded-lg text-[13px] font-semibold transition-all text-center",
                                        mode === 'draft'
                                            ? "bg-gold-primary text-white"
                                            : "bg-ink/5 text-ink/70 hover:bg-ink/10"
                                    )}
                                >
                                    Draft (No AI)
                                </button>
                            </div>
                        </div>

                        {/* Generate button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!hasBirthData || generateReport.isPending}
                            className="w-full py-3.5 bg-gold-primary text-white rounded-lg font-bold text-[13px] uppercase tracking-widest hover:bg-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                            {generateReport.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            Generate Report
                        </button>
                    </div>
                )}

                {/* ── Progress Step ──────────────────────────────── */}
                {step === 'progress' && (
                    <div className="p-6 space-y-6">
                        {/* Circular progress */}
                        <div className="flex justify-center">
                            <div className="relative w-32 h-32">
                                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
                                    <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(201,162,77,0.15)" strokeWidth="8" />
                                    <circle
                                        cx="64" cy="64" r="56" fill="none"
                                        stroke="#C9A24D"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-[28px] font-serif font-black text-ink">{Math.round(progress)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Current step name */}
                        <p className="text-center font-serif text-[16px] text-gold-dark animate-pulse">
                            {stepName}
                        </p>

                        {/* Section progress */}
                        {sectionsTotal > 0 && (
                            <p className="text-center text-[13px] text-ink/50 font-semibold">
                                {sectionsComplete}/{sectionsTotal} sections complete
                            </p>
                        )}

                        {/* Step checklist */}
                        <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                            {Object.entries(REPORT_STEP_NAMES).map(([num, name]) => {
                                const stepNum = Number(num);
                                if (stepNum === 0 || stepNum === 9) return null;
                                const isDone = completedSteps.has(stepNum);
                                const isCurrent = currentStepNum === stepNum;
                                return (
                                    <div key={num} className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all",
                                        isDone && "text-ink/80",
                                        isCurrent && "bg-gold-primary/5 text-gold-dark font-semibold",
                                        !isDone && !isCurrent && "text-ink/30"
                                    )}>
                                        {isDone ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                        ) : isCurrent ? (
                                            <Loader2 className="w-4 h-4 text-gold-primary animate-spin shrink-0" />
                                        ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-ink/15 shrink-0" />
                                        )}
                                        {name}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cancel button */}
                        <button
                            onClick={handleCancel}
                            disabled={cancelReport.isPending}
                            className="w-full py-2.5 border border-ink/15 rounded-lg text-[12px] font-bold uppercase tracking-widest text-ink/50 hover:text-ink hover:border-ink/30 transition-all"
                        >
                            {cancelReport.isPending ? 'Cancelling...' : 'Cancel'}
                        </button>
                    </div>
                )}

                {/* ── Complete Step ──────────────────────────────── */}
                {step === 'complete' && (
                    <div className="p-6 space-y-5">
                        {/* Success icon */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                        </div>

                        <p className="text-center font-serif text-[18px] font-bold text-ink">
                            Report Generated
                        </p>

                        {/* Metadata */}
                        <div className="grid grid-cols-3 gap-3">
                            {pageCount != null && (
                                <div className="prem-card p-3 text-center rounded-xl">
                                    <p className="text-[10px] text-ink/35 uppercase tracking-widest font-bold mb-1">Pages</p>
                                    <p className="text-[18px] font-serif font-bold text-ink">{pageCount}</p>
                                </div>
                            )}
                            {totalCost > 0 && (
                                <div className="prem-card p-3 text-center rounded-xl">
                                    <p className="text-[10px] text-ink/35 uppercase tracking-widest font-bold mb-1">Cost</p>
                                    <p className="text-[18px] font-serif font-bold text-ink">${totalCost.toFixed(2)}</p>
                                </div>
                            )}
                            {generationTime != null && (
                                <div className="prem-card p-3 text-center rounded-xl">
                                    <p className="text-[10px] text-ink/35 uppercase tracking-widest font-bold mb-1">Time</p>
                                    <p className="text-[18px] font-serif font-bold text-ink">{generationTime}s</p>
                                </div>
                            )}
                        </div>

                        {/* PDF preview */}
                        {downloadUrl && (
                            <div className="rounded-xl overflow-hidden border border-gold-primary/15" style={{ height: 200 }}>
                                <iframe
                                    src={downloadUrl}
                                    className="w-full h-full"
                                    title="Report preview"
                                />
                            </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            {downloadUrl && (
                                <a
                                    href={downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 bg-gold-primary text-white rounded-lg font-bold text-[12px] uppercase tracking-widest hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </a>
                            )}
                            {reportId && (
                                <a
                                    href={`/vedic-astrology/reports/${reportId}`}
                                    className="flex-1 py-3 border border-gold-primary/20 rounded-lg text-gold-dark font-bold text-[12px] uppercase tracking-widest hover:bg-gold-primary/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    View Report
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Error Step ─────────────────────────────────── */}
                {step === 'error' && (
                    <div className="p-6 space-y-5">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-500" />
                            </div>
                        </div>

                        <p className="text-center font-serif text-[16px] text-ink">
                            {errorMessage || 'Something went wrong'}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('config')}
                                className="flex-1 py-3 bg-gold-primary text-white rounded-lg font-bold text-[12px] uppercase tracking-widest hover:bg-gold-dark transition-all"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 border border-ink/15 rounded-lg text-ink/60 font-bold text-[12px] uppercase tracking-widest hover:bg-ink/5 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
