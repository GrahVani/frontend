import { useEffect } from 'react';

/**
 * Shows a browser-native "Leave site?" confirmation when the user
 * tries to close/refresh the tab while there are unsaved changes.
 *
 * Usage:
 *   useUnsavedChangesWarning(form.formState.isDirty);
 *   useUnsavedChangesWarning(hasUnsavedEdits);
 */
export function useUnsavedChangesWarning(isDirty: boolean) {
    useEffect(() => {
        if (!isDirty) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);
}
