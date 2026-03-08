"use client";

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormStepIndicatorProps {
    steps: readonly string[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

// C-010: Multi-step wizard progress indicator
export default function FormStepIndicator({ steps, currentStep, onStepClick }: FormStepIndicatorProps) {
    return (
        <nav aria-label="Form progress" className="mb-8">
            <ol className="flex items-center justify-between gap-2">
                {steps.map((label, i) => {
                    const isComplete = i < currentStep;
                    const isCurrent = i === currentStep;
                    const isClickable = onStepClick && i <= currentStep;

                    return (
                        <li key={label} className="flex-1 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => isClickable && onStepClick(i)}
                                disabled={!isClickable}
                                aria-current={isCurrent ? 'step' : undefined}
                                className={cn(
                                    "flex items-center gap-2 w-full group transition-colors",
                                    isClickable ? "cursor-pointer" : "cursor-default",
                                )}
                            >
                                {/* Step circle */}
                                <span className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-serif font-bold shrink-0 transition-all duration-300 border-2",
                                    isComplete && "bg-gold-primary border-gold-primary text-white",
                                    isCurrent && "bg-surface-warm border-gold-primary text-gold-dark",
                                    !isComplete && !isCurrent && "bg-surface-warm border-gold-primary/20 text-ink/45",
                                )}>
                                    {isComplete ? <Check className="w-4 h-4" /> : i + 1}
                                </span>
                                {/* Step label */}
                                <span className={cn(
                                    "text-[12px] font-serif font-medium tracking-wide hidden sm:inline transition-colors",
                                    isCurrent && "text-ink font-bold",
                                    isComplete && "text-gold-dark",
                                    !isComplete && !isCurrent && "text-ink/45",
                                )}>
                                    {label}
                                </span>
                            </button>
                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-0.5 rounded-full transition-colors duration-300",
                                    i < currentStep ? "bg-gold-primary" : "bg-gold-primary/20",
                                )} />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
