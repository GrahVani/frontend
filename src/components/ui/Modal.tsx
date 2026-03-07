"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
    size?: ModalSize;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, size = 'md' }) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = React.useId();

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        // Focus trap
        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !dialogRef.current) return;
            const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first?.focus();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleTab);
        document.body.style.overflow = 'hidden';

        // Focus the dialog
        dialogRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleTab);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-ink/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 md:p-8">
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    className={cn(
                        "relative w-full bg-white rounded-2xl shadow-2xl border border-antique animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col",
                        sizeClasses[size],
                        className
                    )}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Screen-reader-only title */}
                    <span id={titleId} className="sr-only">{title}</span>

                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 bg-white text-secondary hover:text-primary hover:bg-gold-primary transition-all rounded-full border border-antique shadow-sm z-50 ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="overflow-y-auto flex-1">
                        {children}
                    </div>
                </div>

                {/* Backdrop click to close — keyboard users dismiss via Escape */}
                <div className="absolute inset-0 -z-10" onClick={onClose} aria-hidden="true" />
            </div>
        </div>
    );
};
