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
        <div className="w-full border-b border-divider bg-softwhite/50 backdrop-blur-md sticky top-12 z-30">
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
                                    py-4 px-2 font-serif text-lg tracking-wide border-b-2 transition-all duration-300
                                    ${isActive
                                        ? 'border-gold-primary text-ink font-bold'
                                        : 'border-transparent text-muted hover:text-gold-dark hover:border-antique'
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
