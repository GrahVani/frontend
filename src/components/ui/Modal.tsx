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
        dialogRef.current?.focus();

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('keydown', handleTab);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] bg-ink/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 md:p-8">
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    className={cn(
                        "relative w-full rounded-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col",
                        sizeClasses[size],
                        className
                    )}
                    style={{
                        background: 'linear-gradient(165deg, rgba(255,253,249,0.92) 0%, rgba(250,245,234,0.88) 50%, rgba(255,253,249,0.90) 100%)',
                        border: '1px solid rgba(220,201,166,0.35)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 25px 60px rgba(62,46,22,0.20), 0 8px 24px rgba(62,46,22,0.10)',
                        backdropFilter: 'blur(20px)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <span id={titleId} className="sr-only">{title}</span>

                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 rounded-xl text-ink/40 hover:text-gold-dark transition-all z-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/40"
                        style={{
                            background: 'rgba(250,245,234,0.60)',
                            border: '1px solid rgba(220,201,166,0.30)',
                        }}
                        aria-label="Close"
                    >
                        <X className="w-4.5 h-4.5" />
                    </button>

                    <div className="overflow-y-auto flex-1">
                        {children}
                    </div>
                </div>

                <div className="absolute inset-0 -z-10" onClick={onClose} aria-hidden="true" />
            </div>
        </div>
    );
};
