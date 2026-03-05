"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { KpHoraryResponse } from '@/types/kp.types';
import { HelpCircle, Shuffle, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface HoraryPanelProps {
    onSubmit: (horaryNumber: number, question: string) => void;
    result?: KpHoraryResponse['data'] | null;
    isLoading?: boolean;
    error?: string | null;
    className?: string;
}

/**
 * KP Horary (Prashna) Panel
 * Input for horary number (1-249) and question, displays result
 */
export default function HoraryPanel({
    onSubmit,
    result,
    isLoading,
    error,
    className,
}: HoraryPanelProps) {
    const [horaryNumber, setHoraryNumber] = useState<number | ''>('');
    const [question, setQuestion] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const generateRandom = () => {
        const num = Math.floor(Math.random() * 249) + 1;
        setHoraryNumber(num);
        setValidationError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Validation
        if (!horaryNumber || horaryNumber < 1 || horaryNumber > 249) {
            setValidationError('Horary number must be between 1 and 249');
            return;
        }
        if (!question.trim()) {
            setValidationError('Please enter your question');
            return;
        }

        onSubmit(horaryNumber, question.trim());
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="bg-softwhite border border-antique rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                        <HelpCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-lg")}>KP Horary (Prashna)</h3>
                        <p className={cn(TYPOGRAPHY.subValue, "text-xs")}>Enter a number between 1-249 and your question</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Horary Number */}
                    <div>
                        <label className={cn(TYPOGRAPHY.label, "block text-[10px] uppercase tracking-wider mb-2")}>
                            Horary Number (1-249)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                min={1}
                                max={249}
                                value={horaryNumber}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setHoraryNumber(val === '' ? '' : parseInt(val, 10));
                                    setValidationError(null);
                                }}
                                placeholder="Enter 1-249"
                                className="flex-1 px-4 py-3 border border-antique rounded-xl bg-white text-lg font-mono focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20"
                            />
                            <button
                                type="button"
                                onClick={generateRandom}
                                className="px-4 py-3 bg-parchment border border-antique rounded-xl hover:bg-gold-primary/10 transition-colors flex items-center gap-2"
                                title="Generate Random Number"
                            >
                                <Shuffle className="w-5 h-5 text-gold-dark" />
                                <span className={cn(TYPOGRAPHY.value, "text-sm font-semibold")}>Random</span>
                            </button>
                        </div>
                    </div>

                    {/* Question */}
                    <div>
                        <label className={cn(TYPOGRAPHY.label, "block text-[10px] uppercase tracking-wider mb-2")}>
                            Your Question
                        </label>
                        <textarea
                            value={question}
                            onChange={(e) => {
                                setQuestion(e.target.value);
                                setValidationError(null);
                            }}
                            placeholder="E.g., Will I get the job at XYZ company?"
                            rows={3}
                            className="w-full px-4 py-3 border border-antique rounded-xl bg-white resize-none focus:outline-none focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20"
                        />
                    </div>

                    {/* Validation Error */}
                    {(validationError || error) && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {validationError || error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-gold-primary to-gold-dark text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className={TYPOGRAPHY.value}>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span className={TYPOGRAPHY.value}>Get Answer</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Result Display */}
            {result && (
                <div className="bg-white border-2 border-gold-primary/30 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Verdict */}
                    {result.verdict && (
                        <div className={cn(
                            "p-4 rounded-xl mb-6 flex items-start gap-4",
                            result.verdict.favorable
                                ? "bg-green-50 border border-green-200"
                                : "bg-red-50 border border-red-200"
                        )}>
                            <div className={cn(
                                "p-2 rounded-full",
                                result.verdict.favorable ? "bg-green-500" : "bg-red-500"
                            )}>
                                {result.verdict.favorable
                                    ? <CheckCircle2 className="w-6 h-6 text-white" />
                                    : <XCircle className="w-6 h-6 text-white" />
                                }
                            </div>
                            <div>
                                <p className={cn(
                                    TYPOGRAPHY.sectionTitle,
                                    "text-lg",
                                    result.verdict.favorable ? "!text-green-700" : "!text-red-700"
                                )}>
                                    {result.verdict.favorable ? 'FAVORABLE' : 'NOT FAVORABLE'}
                                </p>
                                <p className={cn(TYPOGRAPHY.subValue, "text-sm mt-1")}>{result.verdict.reason}</p>
                            </div>
                        </div>
                    )}

                    {/* Question & Number */}
                    <div className="mb-4">
                        <p className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wider mb-1 opacity-70")}>Your Question</p>
                        <p className={cn(TYPOGRAPHY.value, "text-base")}>{result.question}</p>
                        <span className={cn(TYPOGRAPHY.label, "inline-block mt-2 px-2 py-1 bg-gold-primary/10 !text-gold-dark text-[10px] font-mono rounded")}>
                            Horary #{result.horaryNumber}
                        </span>
                    </div>

                    {/* Ascendant Details */}
                    {result.ascendant && (
                        <div className="p-4 bg-parchment rounded-xl mb-4">
                            <p className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wider mb-2 opacity-70")}>Horary Ascendant</p>
                            <div className="flex items-center gap-4">
                                <span className={cn(TYPOGRAPHY.value, "text-base")}>{result.ascendant.sign}</span>
                                <span className={cn(TYPOGRAPHY.subValue, "text-xs")}>{result.ascendant.degree}°</span>
                                <span className={cn(TYPOGRAPHY.subValue, "text-xs")}>{result.ascendant.nakshatra}</span>
                                <span className={cn(TYPOGRAPHY.label, "px-2 py-0.5 bg-copper-100 !text-copper-700 rounded text-[10px] !font-bold")}>
                                    Sub: {result.ascendant.subLord}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Significators Summary */}
                    {result.significators && result.significators.length > 0 && (
                        <div>
                            <p className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wider mb-2 opacity-70")}>House Significators</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {result.significators.slice(0, 6).map((sig, idx) => (
                                    <div key={idx} className="p-2 bg-softwhite border border-antique rounded-lg">
                                        <span className={cn(TYPOGRAPHY.label, "text-[10px] !font-bold")}>House {sig.house}: </span>
                                        <span className={cn(TYPOGRAPHY.value, "text-xs")}>{sig.significatorPlanets.join(', ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
