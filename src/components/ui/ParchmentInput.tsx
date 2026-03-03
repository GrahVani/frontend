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
                    focus:outline-none
                    transition-colors duration-300
                    py-2 rounded-xl border-b border-gold-primary/50 focus:border-gold-dark
                    ${icon ? 'pl-10' : 'pl-2'}
                `}
            />

            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-dark group-focus-within:text-gold-dark transition-colors duration-300">
                    {icon}
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-primary to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

            {error && (
                <span id={errorId} role="alert" className="block text-xs text-red-600 mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}
