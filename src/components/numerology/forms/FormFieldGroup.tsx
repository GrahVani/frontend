"use client";

import { cn } from "@/lib/utils";

interface FormFieldGroupProps {
    label?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export default function FormFieldGroup({ label, description, children, className }: FormFieldGroupProps) {
    return (
        <fieldset className={cn("border border-gold-primary/20 rounded-xl p-4 space-y-3", className)}>
            {label && (
                <legend className="text-[12px] font-bold font-serif text-gold-dark uppercase tracking-widest px-2">
                    {label}
                </legend>
            )}
            {description && (
                <p className="text-[12px] text-amber-800/60 -mt-1">{description}</p>
            )}
            {children}
        </fieldset>
    );
}
