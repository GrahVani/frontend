"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import {
    type WidgetDimensions,
    type WidgetTheme,
    type WidgetSize,
    type CustomizeChartItem,
    type ChartInstance,
    type SelectedItemDetail,
    DEFAULT_WIDGET_THEME,
    DEFAULT_DIMENSIONS,
    CHART_CATALOG,
    PRESET_THEMES,
    WIDGET_DIMENSION_PRESETS,
} from './useCustomizeCharts';

// Re-export types for convenience
export type { WidgetDimensions, WidgetTheme, WidgetSize, CustomizeChartItem, ChartInstance, SelectedItemDetail };
export { DEFAULT_WIDGET_THEME, DEFAULT_DIMENSIONS, CHART_CATALOG, PRESET_THEMES, WIDGET_DIMENSION_PRESETS };

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES - Multi-Page Customize System
// ═══════════════════════════════════════════════════════════════════════════════

export interface CustomizePage {
    id: string;
    name: string;
    description?: string;
    createdAt: number;
    updatedAt: number;
    items: ChartInstance[];
    // Page-level settings
    settings: {
        backgroundColor?: string;
        gridEnabled?: boolean;
        snapToGrid?: boolean;
        gridSize?: number;
    };
}

export interface MultiPageState {
    pages: CustomizePage[];
    activePageId: string | null;
    isLoading: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE & CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY_V5 = 'grahvani_customize_pages_v5'; // Multi-page version
const DEFAULT_PAGE_NAME = 'Workbench';
const MAX_PAGES = 10; // Maximum number of pages allowed

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createDefaultPage(name: string = DEFAULT_PAGE_NAME, items: ChartInstance[] = []): CustomizePage {
    return {
        id: generateId(),
        name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        items,
        settings: {
            backgroundColor: '#FAF9F6',
            gridEnabled: false,
            snapToGrid: false,
            gridSize: 20,
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOOK - Multi-Page Customize Charts
// ═══════════════════════════════════════════════════════════════════════════════

export function useCustomizePages() {
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();
    const isLahiri = activeSystem === 'lahiri';

    const [state, setState] = useState<MultiPageState>({
        pages: [],
        activePageId: null,
        isLoading: true,
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // LOAD FROM LOCALSTORAGE (with migration from v4)
    // ═══════════════════════════════════════════════════════════════════════════
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY_V5);
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as MultiPageState;
                if (parsed.pages && Array.isArray(parsed.pages)) {
                    setState({
                        ...parsed,
                        isLoading: false,
                    });
                    return;
                }
            } catch { /* ignore */ }
        }

        // Migration from v4: Check if there's v4 data
        const v4Data = localStorage.getItem('grahvani_customize_layout_v4');
        if (v4Data) {
            try {
                const v4Items = JSON.parse(v4Data) as ChartInstance[];
                if (Array.isArray(v4Items) && v4Items.length > 0) {
                    // Create a default page with v4 items
                    const migratedPage = createDefaultPage('Workbench', v4Items);
                    setState({
                        pages: [migratedPage],
                        activePageId: migratedPage.id,
                        isLoading: false,
                    });
                    // Save in new format
                    localStorage.setItem(STORAGE_KEY_V5, JSON.stringify({
                        pages: [migratedPage],
                        activePageId: migratedPage.id,
                    }));
                    return;
                }
            } catch { /* ignore */ }
        }

        // No data: create default empty page
        const defaultPage = createDefaultPage();
        setState({
            pages: [defaultPage],
            activePageId: defaultPage.id,
            isLoading: false,
        });
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (!state.isLoading) {
            localStorage.setItem(STORAGE_KEY_V5, JSON.stringify({
                pages: state.pages,
                activePageId: state.activePageId,
            }));
        }
    }, [state.pages, state.activePageId, state.isLoading]);

    // ═══════════════════════════════════════════════════════════════════════════
    // PAGE ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    const createPage = useCallback((name?: string, description?: string) => {
        setState(prev => {
            if (prev.pages.length >= MAX_PAGES) {
                console.warn(`Maximum ${MAX_PAGES} pages allowed`);
                return prev;
            }

            const newPage = createDefaultPage(
                name || 'Workbench',
                []
            );
            if (description) {
                newPage.description = description;
            }

            return {
                ...prev,
                pages: [...prev.pages, newPage],
                activePageId: newPage.id,
            };
        });
    }, []);

    const deletePage = useCallback((pageId: string) => {
        setState(prev => {
            if (prev.pages.length <= 1) {
                // Don't delete the last page
                return prev;
            }

            // Find the index of the page being deleted
            const deletedIndex = prev.pages.findIndex(p => p.id === pageId);
            const newPages = prev.pages.filter(p => p.id !== pageId);
            
            // Determine the new active page
            let newActiveId = prev.activePageId;
            if (prev.activePageId === pageId) {
                // If deleting the active page, go to previous page (or first if deleted was first)
                const prevIndex = Math.max(0, deletedIndex - 1);
                newActiveId = newPages[prevIndex]?.id || newPages[0]?.id || null;
            }

            return {
                ...prev,
                pages: newPages,
                activePageId: newActiveId,
            };
        });
    }, []);

    const duplicatePage = useCallback((pageId: string) => {
        setState(prev => {
            if (prev.pages.length >= MAX_PAGES) {
                console.warn(`Maximum ${MAX_PAGES} pages allowed`);
                return prev;
            }

            const sourcePage = prev.pages.find(p => p.id === pageId);
            if (!sourcePage) return prev;

            const newPage: CustomizePage = {
                ...sourcePage,
                id: generateId(),
                name: `${sourcePage.name} (Copy)`,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                // Deep clone items
                items: sourcePage.items.map(item => ({
                    ...item,
                    instanceId: generateId(),
                })),
            };

            const pageIndex = prev.pages.findIndex(p => p.id === pageId);
            const newPages = [...prev.pages];
            newPages.splice(pageIndex + 1, 0, newPage);

            return {
                ...prev,
                pages: newPages,
                activePageId: newPage.id,
            };
        });
    }, []);

    const renamePage = useCallback((pageId: string, newName: string) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p => 
                p.id === pageId 
                    ? { ...p, name: newName, updatedAt: Date.now() }
                    : p
            ),
        }));
    }, []);

    const setActivePage = useCallback((pageId: string) => {
        setState(prev => ({
            ...prev,
            activePageId: pageId,
        }));
    }, []);

    const reorderPages = useCallback((newOrder: CustomizePage[]) => {
        setState(prev => ({
            ...prev,
            pages: newOrder,
        }));
    }, []);

    const updatePageSettings = useCallback((pageId: string, settings: Partial<CustomizePage['settings']>) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p =>
                p.id === pageId
                    ? { 
                        ...p, 
                        settings: { ...p.settings, ...settings },
                        updatedAt: Date.now(),
                    }
                    : p
            ),
        }));
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════
    // ITEM ACTIONS (delegated to active page)
    // ═══════════════════════════════════════════════════════════════════════════

    const getActivePage = useCallback((): CustomizePage | null => {
        return state.pages.find(p => p.id === state.activePageId) || state.pages[0] || null;
    }, [state.pages, state.activePageId]);

    const updateActivePageItems = useCallback((updater: (items: ChartInstance[]) => ChartInstance[]) => {
        setState(prev => ({
            ...prev,
            pages: prev.pages.map(p =>
                p.id === prev.activePageId
                    ? { ...p, items: updater(p.items), updatedAt: Date.now() }
                    : p
            ),
        }));
    }, []);

    const addChart = useCallback((
        chartId: string,
        system?: string,
        customization?: {
            dimensions?: Partial<WidgetDimensions>;
            theme?: Partial<WidgetTheme>;
            customTitle?: string;
            showHeader?: boolean;
            showBorder?: boolean;
        }
    ) => {
        const catalog = CHART_CATALOG.find(c => c.id === chartId);
        const baseDimensions = catalog?.defaultDimensions || DEFAULT_DIMENSIONS;

        const newItem: ChartInstance = {
            instanceId: generateId(),
            id: chartId,
            size: catalog?.size || 'medium',
            collapsed: false,
            ayanamsa: catalog?.requiredSystem || system || activeSystem,
            dimensions: { ...baseDimensions, ...customization?.dimensions },
            theme: { ...DEFAULT_WIDGET_THEME, ...catalog?.defaultTheme, ...customization?.theme },
            customTitle: customization?.customTitle,
            showHeader: customization?.showHeader !== false,
            showBorder: customization?.showBorder !== false,
        };

        updateActivePageItems(items => [...items, newItem]);
    }, [activeSystem, updateActivePageItems]);

    const removeChart = useCallback((instanceId: string) => {
        updateActivePageItems(items => items.filter(i => i.instanceId !== instanceId));
    }, [updateActivePageItems]);

    const duplicateChart = useCallback((instanceId: string) => {
        updateActivePageItems(items => {
            const idx = items.findIndex(i => i.instanceId === instanceId);
            if (idx === -1) return items;
            
            const source = items[idx];
            const newItem: ChartInstance = {
                ...source,
                instanceId: generateId(),
                collapsed: false,
                customTitle: source.customTitle ? `${source.customTitle} (Copy)` : undefined,
            };
            
            const newItems = [...items];
            newItems.splice(idx + 1, 0, newItem);
            return newItems;
        });
    }, [updateActivePageItems]);

    const updateChartAyanamsa = useCallback((instanceId: string, ayanamsa: string) => {
        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId ? { ...i, ayanamsa } : i
            )
        );
    }, [updateActivePageItems]);

    const updateDimensions = useCallback((instanceId: string, dimensions: Partial<WidgetDimensions>) => {
        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId
                    ? { ...i, dimensions: { ...i.dimensions, ...dimensions } }
                    : i
            )
        );
    }, [updateActivePageItems]);

    const resizeByDelta = useCallback((instanceId: string, deltaWidth: number, deltaHeight: number) => {
        updateActivePageItems(items =>
            items.map(i => {
                if (i.instanceId !== instanceId) return i;
                return {
                    ...i,
                    dimensions: {
                        ...i.dimensions,
                        width: Math.min(
                            i.dimensions.maxWidth,
                            Math.max(i.dimensions.minWidth, i.dimensions.width + deltaWidth)
                        ),
                        height: Math.min(
                            i.dimensions.maxHeight,
                            Math.max(i.dimensions.minHeight, i.dimensions.height + deltaHeight)
                        ),
                    }
                };
            })
        );
    }, [updateActivePageItems]);

    const updateTheme = useCallback((instanceId: string, theme: Partial<WidgetTheme>) => {
        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId ? { ...i, theme: { ...i.theme, ...theme } } : i
            )
        );
    }, [updateActivePageItems]);

    const applyThemePreset = useCallback((instanceId: string, presetName: string) => {
        const preset = PRESET_THEMES[presetName];
        if (!preset) return;

        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId ? { ...i, theme: { ...preset } } : i
            )
        );
    }, [updateActivePageItems]);

    const updateCustomTitle = useCallback((instanceId: string, customTitle: string | undefined) => {
        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId ? { ...i, customTitle } : i
            )
        );
    }, [updateActivePageItems]);

    const toggleHeader = useCallback((instanceId: string) => {
        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId ? { ...i, showHeader: !i.showHeader } : i
            )
        );
    }, [updateActivePageItems]);

    const toggleBorder = useCallback((instanceId: string) => {
        updateActivePageItems(items =>
            items.map(i =>
                i.instanceId === instanceId ? { ...i, showBorder: !i.showBorder } : i
            )
        );
    }, [updateActivePageItems]);

    const reorderItems = useCallback((newOrder: ChartInstance[]) => {
        updateActivePageItems(() => newOrder);
    }, [updateActivePageItems]);

    const resetCurrentPage = useCallback(() => {
        updateActivePageItems(() => []);
    }, [updateActivePageItems]);

    const resetWidgetToDefaults = useCallback((instanceId: string) => {
        updateActivePageItems(items =>
            items.map(i => {
                if (i.instanceId !== instanceId) return i;
                const catalog = CHART_CATALOG.find(c => c.id === i.id);
                const baseDimensions = catalog?.defaultDimensions || DEFAULT_DIMENSIONS;
                return {
                    ...i,
                    dimensions: { ...baseDimensions },
                    theme: { ...DEFAULT_WIDGET_THEME, ...(catalog?.defaultTheme || {}) },
                    customTitle: undefined,
                    showHeader: true,
                    showBorder: true,
                };
            })
        );
    }, [updateActivePageItems]);

    const resetAllWidgetsToDefaults = useCallback(() => {
        updateActivePageItems(items =>
            items.map(i => {
                const catalog = CHART_CATALOG.find(c => c.id === i.id);
                const baseDimensions = catalog?.defaultDimensions || DEFAULT_DIMENSIONS;
                return {
                    ...i,
                    dimensions: { ...baseDimensions },
                    theme: { ...DEFAULT_WIDGET_THEME, ...(catalog?.defaultTheme || {}) },
                    customTitle: undefined,
                    showHeader: true,
                    showBorder: true,
                };
            })
        );
    }, [updateActivePageItems]);

    // ═══════════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════════

    const activePage = getActivePage();

    const selectedItems = useMemo(() => {
        return activePage?.items || [];
    }, [activePage]);

    const selectedChartDetails = useMemo((): SelectedItemDetail[] => {
        return selectedItems
            .map(instance => {
                const catalog = CHART_CATALOG.find(c => c.id === instance.id);
                if (!catalog) return null;
                return {
                    ...catalog,
                    instanceId: instance.instanceId,
                    size: instance.size,
                    collapsed: instance.collapsed,
                    ayanamsa: instance.ayanamsa || catalog.requiredSystem || activeSystem,
                    dimensions: instance.dimensions,
                    theme: instance.theme,
                    customTitle: instance.customTitle,
                    showHeader: instance.showHeader,
                    showBorder: instance.showBorder,
                    position: instance.position,
                };
            })
            .filter(Boolean) as SelectedItemDetail[];
    }, [selectedItems, activeSystem]);

    const availableCharts = useMemo(() => {
        if (isLahiri) return CHART_CATALOG;
        return CHART_CATALOG.filter(chart =>
            chart.category !== 'rare_shodash' && !chart.lahiriOnly
        );
    }, [isLahiri]);

    const canCreateMorePages = state.pages.length < MAX_PAGES;
    const canDeletePage = state.pages.length > 1;

    return {
        // Page state
        pages: state.pages,
        activePageId: state.activePageId,
        activePage,
        isLoading: state.isLoading,
        
        // Page actions
        createPage,
        deletePage,
        duplicatePage,
        renamePage,
        setActivePage,
        reorderPages,
        updatePageSettings,
        
        // Item state (for current page)
        selectedItems,
        selectedChartDetails,
        availableCharts,
        
        // Item actions (for current page)
        addChart,
        removeChart,
        duplicateChart,
        updateChartAyanamsa,
        updateDimensions,
        resizeByDelta,
        updateTheme,
        applyThemePreset,
        updateCustomTitle,
        toggleHeader,
        toggleBorder,
        reorderItems,
        resetCurrentPage,
        resetWidgetToDefaults,
        resetAllWidgetsToDefaults,
        
        // Limits
        canCreateMorePages,
        canDeletePage,
        maxPages: MAX_PAGES,
        
        // Constants
        PRESET_THEMES,
        DEFAULT_WIDGET_THEME,
        DEFAULT_DIMENSIONS,
        CHART_CATALOG,
        WIDGET_DIMENSION_PRESETS,
    };
}

export default useCustomizePages;
