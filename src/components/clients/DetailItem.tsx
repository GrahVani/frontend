"use client";

import React from 'react';
import ParchmentDatePicker from '@/components/ui/ParchmentDatePicker';
import ParchmentTimePicker from '@/components/ui/ParchmentTimePicker';

interface DetailItemProps {
    label: string;
    value: string;
    isEditing?: boolean;
    onChange?: (val: string) => void;
    type?: 'text' | 'select' | 'date' | 'time';
    options?: { v: string; l: string }[];
}

export default function DetailItem({
    label,
    value,
    isEditing = false,
    onChange,
    type = 'text',
    options = [],
}: DetailItemProps) {
    return (
        <div>
            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-1 font-serif">{label}</p>
            {isEditing ? (
                type === 'select' ? (
                    <select
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full text-base font-serif text-primary font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                        defaultValue={value}
                        aria-label={label}
                    >
                        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                ) : type === 'date' ? (
                    <ParchmentDatePicker
                        date={value}
                        setDate={(val) => onChange?.(val || '')}
                    />
                ) : type === 'time' ? (
                    <ParchmentTimePicker
                        value={value}
                        onChange={(val) => onChange?.(val || '')}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full text-base font-serif text-primary font-medium border border-antique rounded-lg px-3 py-2 bg-parchment focus:outline-none focus:border-gold-primary"
                    />
                )
            ) : (
                <p className="text-base font-serif text-primary font-semibold border-b border-antique pb-2">
                    {type === 'select' ? (options.find(o => o.v === value)?.l || value) : value || 'N/A'}
                </p>
            )}
        </div>
    );
}
