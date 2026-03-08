"use client";

import React from 'react';

interface SectionHeaderProps {
    icon: React.ElementType;
    title: string;
    description?: string;
    action?: React.ReactNode;
    compact?: boolean;
}

export default function SectionHeader({ icon: Icon, title, description, action, compact = false }: SectionHeaderProps) {
    return (
        <div className={`flex items-center justify-between ${compact ? 'mb-4' : 'mb-5'}`}>
            <div className="flex-1 min-w-0">
                <div className={`${compact ? 'text-[15px]' : 'text-[18px]'} font-serif text-ink flex items-center gap-2.5 font-bold`}>
                    <div className={`${compact ? 'w-7 h-7' : 'w-9 h-9'} rounded-lg flex items-center justify-center shrink-0`}
                         style={{
                             background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                             border: '1px solid rgba(201,162,77,0.25)',
                         }}>
                        <Icon className={`${compact ? 'w-3.5 h-3.5' : 'w-4.5 h-4.5'} text-gold-dark`} />
                    </div>
                    {title}
                </div>
                {description && (
                    <p className="text-[13px] text-ink/55 mt-1 ml-[46px] font-medium">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
