"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
    name: string;
    href: string;
    isActive: boolean;
}

interface TabNavigationProps {
    basePath: string;
}

export default function TabNavigation({ basePath }: TabNavigationProps) {
    const pathname = usePathname();

    // Define tabs
    const tabs = [
        { name: 'Charts', path: '/charts' },
        { name: 'Dashas', path: '/dashas' },
        { name: 'Planets', path: '/planets' },
        { name: 'Reports', path: '/reports' },
    ];

    return (
        <div className="w-full sticky top-14 z-30 backdrop-blur-md"
             style={{
                 background: 'rgba(255,253,249,0.60)',
                 borderBottom: '1px solid rgba(220,201,166,0.25)',
             }}>
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center gap-8 -mb-[1px]" role="tablist" aria-label="Client detail sections">
                    {tabs.map((tab) => {
                        const fullPath = `${basePath}${tab.path}`;
                        // Check if current path starts with this tab's path (active state)
                        // Special handling for default 'charts' if pathname is just basepath (though redirect usually handles this)
                        const isActive = pathname.startsWith(fullPath);

                        return (
                            <Link
                                key={tab.name}
                                href={fullPath}
                                role="tab"
                                aria-selected={isActive}
                                aria-current={isActive ? "page" : undefined}
                                className={`
                                    py-4 px-2 font-serif text-[18px] tracking-wide border-b-2 transition-all duration-300
                                    ${isActive
                                        ? 'border-gold-primary text-ink font-bold'
                                        : 'border-transparent text-ink/45 hover:text-gold-dark hover:border-gold-primary/20'
                                    }
                                `}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
