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
                <label htmlFor={selectId} className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
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
                        border-b border-gold-primary/50
                        text-ink font-serif text-base tracking-wide
                        focus:outline-none focus:border-gold-dark
                        transition-colors duration-300
                        py-2 pl-2 pr-8 cursor-pointer
                    `}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            </div>

            {error && (
                <span id={errorId} role="alert" className="block text-xs text-red-600 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}
