import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ParchmentSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

export default function ParchmentSelect({ className = '', label, options, id, error, ...props }: ParchmentSelectProps) {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;

    return (
        <div className={`relative group ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-[12px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    aria-label={!label ? props['aria-label'] || props.name : undefined}
                    aria-required={props.required || undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    {...props}
                    className={`
                        w-full appearance-none bg-transparent
                        border border-gold-primary/30 rounded-xl
                        text-ink font-serif text-[16px] tracking-wide
                        focus:outline-none focus:border-gold-dark focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-1
                        transition-colors duration-300
                        py-2 ps-3 pe-8 cursor-pointer
                        ${error ? 'border-red-400' : ''}
                    `}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
            </div>

            {error && (
                <span id={errorId} role="alert" className="block text-[12px] text-red-600 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}
