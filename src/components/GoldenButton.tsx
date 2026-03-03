'use client';

import React from 'react';

interface PremiumButtonProps {
    topText: string;
    bottomText: string;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function PremiumButton({
    topText,
    bottomText,
    onClick,
    className = '',
    disabled = false,
    type = 'button',
}: PremiumButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-disabled={disabled || undefined}
            aria-label={`${topText} ${bottomText}`}
            className={`relative group bg-transparent border-none p-0 ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            {/* Main button container with clip-path for chamfered corners */}
            <div
                className="relative p-[2px] bg-gradient-to-br from-gold-soft via-gold-primary to-gold-dark [clip-path:polygon(12px_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,12px_100%,0_50%)]"
            >
                {/* Inner button with Header background gradient */}
                <div
                    className="bg-header-gradient text-center min-w-[200px] px-7 py-2.5 [clip-path:polygon(12px_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,12px_100%,0_50%)]"
                >
                    {/* Top text */}
                    <div className="font-serif text-[0.7rem] font-bold tracking-[2px] uppercase text-white leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
                    >
                        {topText}
                    </div>
                    {/* Bottom text */}
                    <div className="font-serif text-[0.6rem] font-medium tracking-[1.5px] uppercase text-parchment-soft leading-tight mt-0.5 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
                    >
                        {bottomText}
                    </div>
                </div>
            </div>

            {/* Gold dots at left and right pointed tips */}
            <div
                className="absolute top-1/2 -left-[3px] -translate-y-1/2 w-[7px] h-[7px] rounded-full shadow-[0_0_4px_rgba(200,160,60,0.8)] [background:radial-gradient(circle,#F0D878_0%,#C9A24C_60%,#8B6B2E_100%)]"
            />
            <div
                className="absolute top-1/2 -right-[3px] -translate-y-1/2 w-[7px] h-[7px] rounded-full shadow-[0_0_4px_rgba(200,160,60,0.8)] [background:radial-gradient(circle,#F0D878_0%,#C9A24C_60%,#8B6B2E_100%)]"
            />
        </button>
    );
}
