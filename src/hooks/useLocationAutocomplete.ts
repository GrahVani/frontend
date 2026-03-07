"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { geocodeApi } from '@/lib/api';
import type { LocationSuggestion } from '@/types/client';

// C-013: Location autocomplete with keyboard navigation (arrow keys + enter)
export function useLocationAutocomplete() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const search = useCallback(async (q: string) => {
        if (q.length < 2) {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await geocodeApi.getSuggestions(q, 5);
            setSuggestions(response.suggestions || []);
        } catch {
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search on query change
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (query.length >= 2) {
            debounceRef.current = setTimeout(() => search(query), 300);
        } else {
            setSuggestions([]);
        }
        return () => clearTimeout(debounceRef.current);
    }, [query, search]);

    const handleInputChange = useCallback((value: string) => {
        setQuery(value);
        setIsOpen(true);
        setActiveIndex(-1);
    }, []);

    const handleSelect = useCallback((suggestion: LocationSuggestion) => {
        setQuery(suggestion.formatted);
        setSuggestions([]);
        setIsOpen(false);
        setActiveIndex(-1);
        return suggestion;
    }, []);

    // C-013: Keyboard navigation handler for the combobox
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
                break;
            case 'Enter':
                e.preventDefault();
                if (activeIndex >= 0 && activeIndex < suggestions.length) {
                    handleSelect(suggestions[activeIndex]);
                    return suggestions[activeIndex];
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setActiveIndex(-1);
                break;
        }
        return undefined;
    }, [isOpen, suggestions, activeIndex, handleSelect]);

    const handleBlur = useCallback(() => {
        // Delay to allow click on suggestion to fire first
        setTimeout(() => {
            setIsOpen(false);
            setActiveIndex(-1);
        }, 200);
    }, []);

    const handleFocus = useCallback(() => {
        if (suggestions.length > 0) {
            setIsOpen(true);
        }
    }, [suggestions.length]);

    return {
        query,
        setQuery,
        suggestions,
        isOpen,
        isLoading,
        activeIndex,
        handleInputChange,
        handleSelect,
        handleKeyDown,
        handleBlur,
        handleFocus,
    };
}
