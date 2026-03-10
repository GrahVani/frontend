"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown, Calculator, Cpu, Hash } from "lucide-react";
import { RAW_CALCULATOR_CATEGORIES, RAW_CALCULATORS } from "@/lib/numerology-constants";
import { useChaldeanRaw } from "@/hooks/mutations/useNumerologyMutation";
import ParchmentInput from "@/components/ui/ParchmentInput";
import RawCalculatorResult from "@/components/numerology/RawCalculatorResult";

// ─────────────────────────────────────────────────────────────────────────────
// Individual Raw Calculator Card
// ─────────────────────────────────────────────────────────────────────────────
function RawCalculatorCard({ slug, name }: { slug: string; name: string }) {
    const [expanded, setExpanded] = React.useState(false);
    const [fullName, setFullName] = React.useState("");
    const [birthDate, setBirthDate] = React.useState("");
    const mutation = useChaldeanRaw(slug);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !birthDate) return;
        mutation.mutate({ full_name: fullName.trim(), birth_date: birthDate });
    };

    return (
        <div className={cn(
            "overflow-hidden rounded-xl transition-all duration-200 relative",
            expanded
                ? "bg-white/60 border border-slate-300 shadow-sm"
                : "bg-slate-50/60 border border-slate-200/60 hover:bg-slate-100/60 hover:border-slate-300/60",
        )}>
            {/* Left slate accent bar — indicates raw/math */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-slate-400 to-slate-500/40 rounded-l" />

            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 px-4 pl-5 py-2.5 text-left transition-colors"
                aria-expanded={expanded}
            >
                <Hash className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-semibold text-slate-800 truncate">{name}</h4>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                    <Cpu className="w-2.5 h-2.5" />
                    Raw
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform", expanded && "rotate-180")} />
            </button>

            {expanded && (
                <div className="px-4 pl-5 pb-4 space-y-3 border-t border-slate-200 pt-3">
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <ParchmentInput
                            label="Full Name"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Enter full name"
                            required
                            className="flex-1"
                        />
                        <ParchmentInput
                            label="Birth Date"
                            type="date"
                            value={birthDate}
                            onChange={e => setBirthDate(e.target.value)}
                            required
                            className="flex-1"
                        />
                        <button
                            type="submit"
                            disabled={mutation.isPending || !fullName.trim() || !birthDate}
                            className="self-end px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors text-[13px] font-medium whitespace-nowrap"
                        >
                            {mutation.isPending ? "..." : "Calculate"}
                        </button>
                    </form>

                    {mutation.isError && (
                        <div className="p-2 rounded bg-red-50 border border-red-200 text-[12px] text-red-700" role="alert">
                            {mutation.error.message}
                        </div>
                    )}

                    {mutation.data && <RawCalculatorResult response={mutation.data} />}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Collapsible Department Section
// ─────────────────────────────────────────────────────────────────────────────
function DepartmentSection({ category, searchQuery }: {
    category: typeof RAW_CALCULATOR_CATEGORIES[number];
    searchQuery: string;
}) {
    const [collapsed, setCollapsed] = React.useState(false);
    const Icon = category.icon;

    // Filter calculators within this department
    const calculators = React.useMemo(() => {
        const calcs = RAW_CALCULATORS.filter(c => c.category === category.key);
        if (!searchQuery.trim()) return calcs;
        const q = searchQuery.toLowerCase();
        return calcs.filter(c => c.name.toLowerCase().includes(q) || c.slug.includes(q));
    }, [category.key, searchQuery]);

    // Hide entire department if search yields no results
    if (calculators.length === 0) return null;

    return (
        <section>
            {/* Department header */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center gap-3 mb-3 group text-left"
                aria-expanded={!collapsed}
            >
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-slate-400 to-slate-500/40" />
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <Icon className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <h3 className="text-[14px] font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {category.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                    {calculators.length}
                </span>
                <div className="flex-1" />
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", collapsed && "-rotate-90")} />
            </button>

            {/* Calculators grid */}
            {!collapsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-4 pl-4 border-l-2 border-slate-200/60">
                    {calculators.map(calc => (
                        <RawCalculatorCard key={calc.slug} slug={calc.slug} name={calc.name} />
                    ))}
                </div>
            )}
        </section>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function RawCalculatorsPage() {
    const [search, setSearch] = React.useState("");
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

    const departmentsToShow = React.useMemo(() => {
        if (activeCategory) {
            return RAW_CALCULATOR_CATEGORIES.filter(c => c.key === activeCategory);
        }
        return RAW_CALCULATOR_CATEGORIES;
    }, [activeCategory]);

    return (
        <div className="space-y-6">
            {/* ─── Header ─── */}
            <div className="prem-card relative overflow-hidden">
                {/* Slate gradient top edge (contrasts with gold in AI sections) */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

                <div className="p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                <Calculator className="w-6 h-6 text-slate-600" />
                            </div>
                            <div>
                                <h1 className="text-[20px] font-bold font-serif text-primary">Raw Calculators</h1>
                                <p className="text-[13px] text-amber-800/60 mt-0.5">
                                    Pure mathematical Chaldean computations — instant, deterministic, no AI processing
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                            <Cpu className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-[11px] font-bold text-slate-600">{RAW_CALCULATORS.length} Calculators</span>
                        </div>
                    </div>

                    {/* How it differs from AI */}
                    <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gold-primary/10">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                            <Cpu className="w-3 h-3 text-slate-500" />
                            <span className="text-[11px] font-medium text-slate-600">Deterministic output</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                            <Calculator className="w-3 h-3 text-slate-500" />
                            <span className="text-[11px] font-medium text-slate-600">Name + birth date input</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
                            <Hash className="w-3 h-3 text-slate-500" />
                            <span className="text-[11px] font-medium text-slate-600">Tabular raw data</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Search + Filter ─── */}
            <div className="flex flex-col sm:flex-row gap-4">
                <ParchmentInput
                    icon={<Search className="w-4 h-4" />}
                    placeholder="Search across all 92 calculators..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 max-w-md"
                />
            </div>

            {/* Department filter pills */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                        "px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors",
                        activeCategory === null
                            ? "bg-slate-700 text-white border-slate-700"
                            : "bg-transparent text-slate-600 border-slate-300 hover:bg-slate-50"
                    )}
                >
                    All Departments ({RAW_CALCULATOR_CATEGORIES.length})
                </button>
                {RAW_CALCULATOR_CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key === activeCategory ? null : cat.key)}
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors",
                                activeCategory === cat.key
                                    ? "bg-slate-700 text-white border-slate-700"
                                    : "bg-transparent text-slate-600 border-slate-300 hover:bg-slate-50"
                            )}
                        >
                            <Icon className="w-3 h-3" />
                            {cat.name}
                            <span className="opacity-60">({cat.slugs.length})</span>
                        </button>
                    );
                })}
            </div>

            {/* ─── Department Sections ─── */}
            <div className="space-y-8">
                {departmentsToShow.map(cat => (
                    <DepartmentSection key={cat.key} category={cat} searchQuery={search} />
                ))}
            </div>

            {/* Empty state */}
            {departmentsToShow.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-[14px]">
                    No departments match your filter.
                </div>
            )}
        </div>
    );
}
