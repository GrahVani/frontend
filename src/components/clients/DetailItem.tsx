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
            <p className="text-[11px] uppercase tracking-[0.10em] text-ink font-bold mb-1.5">{label}</p>
            {isEditing && onChange ? (
                type === 'select' ? (
                    <select
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full text-[15px] font-serif text-ink font-medium rounded-lg px-3 py-2.5 bg-surface-warm/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 transition-all"
                        style={{ border: '1px solid rgba(220,201,166,0.40)' }}
                        defaultValue={value}
                        aria-label={label}
                    >
                        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                    </select>
                ) : type === 'date' ? (
                    <ParchmentDatePicker
                        date={value}
                        setDate={(val) => onChange(val || '')}
                    />
                ) : type === 'time' ? (
                    <ParchmentTimePicker
                        value={value}
                        onChange={(val) => onChange(val || '')}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full text-[15px] font-serif text-ink font-medium rounded-lg px-3 py-2.5 bg-surface-warm/50 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 transition-all"
                        style={{ border: '1px solid rgba(220,201,166,0.40)' }}
                    />
                )
            ) : (
                <p className="text-[15px] font-serif text-ink font-semibold pb-2"
                   style={{ borderBottom: '1px solid rgba(220,201,166,0.30)' }}>
                    {type === 'select' ? (options.find(o => o.v === value)?.l || value) : value || 'N/A'}
                </p>
            )}
        </div>
    );
}
