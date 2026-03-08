"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, LayoutGrid, LayoutList, UserPlus, X, Users } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { ClientFilterState, ViewMode, SortField, FilterChip } from '@/hooks/useClientFilters';

interface ClientToolbarProps {
    filters: ClientFilterState;
    setFilter: <K extends keyof ClientFilterState>(key: K, value: ClientFilterState[K]) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
    activeFilterChips: FilterChip[];
    activeFilterCount: number;
    total: number;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
    { value: 'createdAt', label: 'Date Added' },
    { value: 'fullName', label: 'Name' },
    { value: 'birthDate', label: 'Birth Date' },
    { value: 'birthPlace', label: 'City' },
];

export default function ClientToolbar({
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    activeFilterChips,
    activeFilterCount,
    total,
}: ClientToolbarProps) {
    const [filtersOpen, setFiltersOpen] = useState(false);

    return (
        <div className="space-y-0">
            {/* Main Toolbar */}
            <div className="prem-card glass-shimmer relative overflow-hidden p-4 flex items-center gap-4 flex-wrap">
                {/* Title + Count */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{
                             background: 'linear-gradient(135deg, rgba(201,162,77,0.22) 0%, rgba(139,90,43,0.14) 100%)',
                             border: '1px solid rgba(201,162,77,0.30)',
                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 8px rgba(139,90,43,0.08)',
                         }}>
                        <Users className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-serif font-bold text-ink leading-tight tracking-tight">Client Registry</h1>
                        <p className="text-[11px] font-semibold text-ink/40 mt-0.5 tracking-wide uppercase">Manage your clients</p>
                    </div>
                    <span className="text-[13px] font-mono font-bold text-gold-dark px-2.5 py-1 rounded-lg ml-1"
                          style={{
                              background: 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.06) 100%)',
                              border: '1px solid rgba(201,162,77,0.22)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                          }}>
                        {total}
                    </span>
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[220px] relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark/50" />
                    <input
                        type="text"
                        placeholder="Search by name, city, or phone..."
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 rounded-xl text-[14px] text-ink font-medium focus:outline-none focus:ring-2 focus:ring-gold-primary/25 transition-all placeholder:text-ink/30"
                        style={{
                            background: 'rgba(250,245,234,0.50)',
                            border: '1px solid rgba(220,201,166,0.35)',
                            boxShadow: 'inset 0 1px 3px rgba(139,90,43,0.04)',
                        }}
                        aria-label="Search clients"
                    />
                    {filters.search && (
                        <button onClick={() => setFilter('search', '')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-parchment/60 transition-colors">
                            <X className="w-3.5 h-3.5 text-ink/40" />
                        </button>
                    )}
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className={`px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all flex items-center gap-2 shrink-0 ${filtersOpen ? 'text-gold-dark' : 'text-ink/60 hover:text-ink/80'}`}
                    style={{
                        background: filtersOpen ? 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.06) 100%)' : 'rgba(250,245,234,0.40)',
                        border: `1px solid ${filtersOpen ? 'rgba(201,162,77,0.30)' : 'rgba(220,201,166,0.35)'}`,
                        boxShadow: filtersOpen ? '0 0 0 1px rgba(201,162,77,0.08)' : 'none',
                    }}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                              style={{
                                  background: 'linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-dark) 100%)',
                                  color: 'white',
                                  boxShadow: '0 1px 3px rgba(139,90,43,0.25)',
                              }}>
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* View Toggle */}
                <div className="flex items-center rounded-xl overflow-hidden shrink-0"
                     style={{
                         border: '1px solid rgba(220,201,166,0.35)',
                         boxShadow: 'inset 0 1px 2px rgba(139,90,43,0.03)',
                     }}>
                    <button
                        onClick={() => setFilter('viewMode', 'card' as ViewMode)}
                        className={`p-2.5 transition-all ${filters.viewMode === 'card' ? 'text-gold-dark' : 'text-ink/35 hover:text-ink/60'}`}
                        style={{
                            background: filters.viewMode === 'card'
                                ? 'linear-gradient(135deg, rgba(201,162,77,0.14) 0%, rgba(201,162,77,0.06) 100%)'
                                : 'transparent',
                        }}
                        aria-label="Card view"
                        title="Card view"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <div style={{ width: 1, height: 22, background: 'rgba(220,201,166,0.30)' }} />
                    <button
                        onClick={() => setFilter('viewMode', 'table' as ViewMode)}
                        className={`p-2.5 transition-all ${filters.viewMode === 'table' ? 'text-gold-dark' : 'text-ink/35 hover:text-ink/60'}`}
                        style={{
                            background: filters.viewMode === 'table'
                                ? 'linear-gradient(135deg, rgba(201,162,77,0.14) 0%, rgba(201,162,77,0.06) 100%)'
                                : 'transparent',
                        }}
                        aria-label="Table view"
                        title="Table view"
                    >
                        <LayoutList className="w-4 h-4" />
                    </button>
                </div>

                {/* Add Client */}
                <Link href="/clients/new" className="shrink-0">
                    <Button variant="golden" size="sm" icon={UserPlus}>
                        Add Client
                    </Button>
                </Link>
            </div>

            {/* Filter Row (expandable) */}
            {filtersOpen && (
                <div className="prem-card p-4 mt-0 rounded-t-none flex items-center gap-4 flex-wrap"
                     style={{ borderTop: '1px solid rgba(220,201,166,0.18)' }}>
                    {/* Gender */}
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-bronze-dark/70 uppercase tracking-wider">Gender</label>
                        <select
                            value={filters.gender || ''}
                            onChange={(e) => setFilter('gender', e.target.value || null)}
                            className="text-[13px] text-ink font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-primary/25"
                            style={{
                                background: 'rgba(250,245,234,0.50)',
                                border: '1px solid rgba(220,201,166,0.35)',
                                boxShadow: 'inset 0 1px 2px rgba(139,90,43,0.03)',
                            }}
                        >
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* City */}
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-bronze-dark/70 uppercase tracking-wider">City</label>
                        <input
                            type="text"
                            placeholder="Any"
                            value={filters.city || ''}
                            onChange={(e) => setFilter('city', e.target.value || null)}
                            className="text-[13px] text-ink font-medium rounded-lg px-3 py-2 w-28 focus:outline-none focus:ring-2 focus:ring-gold-primary/25 placeholder:text-ink/25"
                            style={{
                                background: 'rgba(250,245,234,0.50)',
                                border: '1px solid rgba(220,201,166,0.35)',
                                boxShadow: 'inset 0 1px 2px rgba(139,90,43,0.03)',
                            }}
                        />
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-bronze-dark/70 uppercase tracking-wider">Sort</label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilter('sortBy', e.target.value as SortField)}
                            className="text-[13px] text-ink font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold-primary/25"
                            style={{
                                background: 'rgba(250,245,234,0.50)',
                                border: '1px solid rgba(220,201,166,0.35)',
                                boxShadow: 'inset 0 1px 2px rgba(139,90,43,0.03)',
                            }}
                        >
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <button
                            onClick={() => setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="px-2.5 py-2 rounded-lg text-[12px] font-bold text-ink/55 hover:text-gold-dark transition-all"
                            style={{
                                background: 'rgba(250,245,234,0.40)',
                                border: '1px solid rgba(220,201,166,0.35)',
                            }}
                            title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        >
                            {filters.sortOrder === 'asc' ? 'A\u2192Z' : 'Z\u2192A'}
                        </button>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {activeFilterCount > 0 && (
                        <button onClick={clearAllFilters}
                                className="text-[12px] font-semibold text-gold-dark hover:underline underline-offset-2">
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Active Filter Chips */}
            {activeFilterChips.length > 0 && !filtersOpen && (
                <div className="flex items-center gap-2 mt-2.5 flex-wrap px-1">
                    {activeFilterChips.map(chip => (
                        <span key={chip.key}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold text-gold-dark"
                              style={{
                                  background: 'linear-gradient(135deg, rgba(201,162,77,0.10) 0%, rgba(201,162,77,0.05) 100%)',
                                  border: '1px solid rgba(201,162,77,0.22)',
                                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                              }}>
                            {chip.label}: {chip.value}
                            <button onClick={() => clearFilter(chip.key)} className="p-0.5 rounded-full hover:bg-gold-primary/15 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    <button onClick={clearAllFilters}
                            className="text-[11px] font-semibold text-ink/35 hover:text-gold-dark transition-colors ml-1">
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
}
