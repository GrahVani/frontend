import React from 'react';

interface ParchmentInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    label?: string;
    error?: string;
}

export default function ParchmentInput({ className = '', icon, label, id, error, ...props }: ParchmentInputProps) {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
        <div className={`relative group ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                aria-label={!label ? props.placeholder : undefined}
                aria-required={props.required || undefined}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                {...props}
                className={`
                    w-full h-full bg-transparent
                    text-ink font-serif text-base tracking-wide
                    placeholder:text-gold-dark/80
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-1
                    transition-colors duration-300
                    py-2 rounded-xl border border-gold-primary/30 focus:border-gold-dark
                    ${icon ? 'ps-10' : 'ps-3'} pe-3
                    ${error ? 'border-red-400' : ''}
                `}
            />

            {icon && (
                <div className="absolute start-3 top-1/2 -translate-y-1/2 text-gold-dark group-focus-within:text-gold-dark transition-colors duration-300">
                    {icon}
                </div>
            )}

            {error && (
                <span id={errorId} role="alert" className="block text-xs text-red-600 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}
