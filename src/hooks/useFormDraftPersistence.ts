"use client";

import { useEffect, useRef, useCallback } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

// S-020: Draft persistence via localStorage
// Saves form state on changes, restores on mount, clears on successful submit
const DRAFT_DEBOUNCE_MS = 1000;

export function useFormDraftPersistence<T extends FieldValues>(
    form: UseFormReturn<T>,
    storageKey: string,
    enabled: boolean = true,
) {
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const hasDraft = useRef(false);

    // Restore draft on mount
    useEffect(() => {
        if (!enabled) return;
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Only restore if it has at least fullName to avoid restoring empty/stale drafts
                if (parsed && parsed.fullName) {
                    form.reset(parsed, { keepDefaultValues: true });
                    hasDraft.current = true;
                }
            }
        } catch {
            // Ignore corrupted drafts
        }
        // Only run on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Watch and save on change
    useEffect(() => {
        if (!enabled) return;
        const subscription = form.watch((values) => {
            clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                try {
                    localStorage.setItem(storageKey, JSON.stringify(values));
                } catch {
                    // Storage full or unavailable
                }
            }, DRAFT_DEBOUNCE_MS);
        });
        return () => {
            subscription.unsubscribe();
            clearTimeout(debounceRef.current);
        };
    }, [form, storageKey, enabled]);

    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            hasDraft.current = false;
        } catch {
            // Ignore
        }
    }, [storageKey]);

    const hasSavedDraft = useCallback(() => {
        try {
            return !!localStorage.getItem(storageKey);
        } catch {
            return false;
        }
    }, [storageKey]);

    return { clearDraft, hasSavedDraft, hasDraft: hasDraft.current };
}
