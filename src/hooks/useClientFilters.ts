import { useState, useCallback, useMemo } from 'react';

export type ViewMode = 'card' | 'table';
export type SortField = 'fullName' | 'createdAt' | 'birthDate' | 'birthPlace';

export interface FilterChip {
    key: string;
    label: string;
    value: string;
}

export interface ClientFilterState {
    search: string;
    gender: string | null;
    city: string | null;
    sortBy: SortField;
    sortOrder: 'asc' | 'desc';
    viewMode: ViewMode;
    page: number;
    limit: number;
}

const DEFAULT: ClientFilterState = {
    search: '',
    gender: null,
    city: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    viewMode: 'card',
    page: 1,
    limit: 25,
};

export function useClientFilters() {
    const [filters, setFilters] = useState<ClientFilterState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('grahvani:clientView');
            if (saved === 'table' || saved === 'card') {
                return { ...DEFAULT, viewMode: saved, limit: saved === 'table' ? 50 : 25 };
            }
        }
        return DEFAULT;
    });

    const setFilter = useCallback(<K extends keyof ClientFilterState>(key: K, value: ClientFilterState[K]) => {
        setFilters(prev => {
            const next = { ...prev, [key]: value };
            if (key !== 'page' && key !== 'viewMode' && key !== 'limit') {
                next.page = 1;
            }
            if (key === 'viewMode') {
                const mode = value as ViewMode;
                next.limit = mode === 'table' ? 50 : 25;
                next.page = 1;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('grahvani:clientView', mode);
                }
            }
            return next;
        });
    }, []);

    const clearFilter = useCallback((key: string) => {
        if (key === 'sort') {
            setFilters(prev => ({ ...prev, sortBy: 'createdAt' as SortField, sortOrder: 'desc' as const, page: 1 }));
        } else {
            setFilters(prev => ({
                ...prev,
                [key]: DEFAULT[key as keyof ClientFilterState],
                page: 1,
            }));
        }
    }, []);

    const clearAllFilters = useCallback(() => {
        setFilters(prev => ({ ...DEFAULT, viewMode: prev.viewMode, limit: prev.limit }));
    }, []);

    const activeFilterChips = useMemo((): FilterChip[] => {
        const chips: FilterChip[] = [];
        if (filters.gender) {
            chips.push({ key: 'gender', label: 'Gender', value: filters.gender.charAt(0).toUpperCase() + filters.gender.slice(1) });
        }
        if (filters.city) {
            chips.push({ key: 'city', label: 'City', value: filters.city });
        }
        if (filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') {
            const labels: Record<string, string> = { fullName: 'Name', createdAt: 'Date Added', birthDate: 'Birth Date', birthPlace: 'City' };
            chips.push({ key: 'sort', label: 'Sort', value: `${labels[filters.sortBy]} ${filters.sortOrder === 'asc' ? 'A→Z' : 'Z→A'}` });
        }
        return chips;
    }, [filters]);

    const queryParams = useMemo(() => ({
        page: filters.page,
        limit: filters.limit,
        search: filters.search || undefined,
        gender: filters.gender || undefined,
        city: filters.city || undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
    }), [filters]);

    return {
        filters,
        setFilter,
        clearFilter,
        clearAllFilters,
        activeFilterChips,
        activeFilterCount: activeFilterChips.length,
        queryParams,
    };
}
