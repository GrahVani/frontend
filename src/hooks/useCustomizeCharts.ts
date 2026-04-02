"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'full';

export interface CustomizeChartItem {
    id: string;
    name: string;
    description: string;
    category:
        | 'divisional'
        | 'rare_shodash'
        | 'lagna'
        | 'dasha'
        | 'ashtakavarga'
        | 'special'
        | 'widget_pushkara'
        | 'widget_chakra'
        | 'widget_karaka'
        | 'widget_shadbala'
        | 'widget_yoga'
        | 'widget_dosha'
        | 'widget_transit'
        | 'widget_remedy'
        | 'widget_shodasha'
        | 'kp_module';
    size?: WidgetSize;
    lahiriOnly?: boolean;
}

export interface ChartInstance {
    instanceId: string;
    id: string;
    size: WidgetSize;
    collapsed: boolean;
}

export interface SelectedItemDetail extends CustomizeChartItem {
    instanceId: string;
    size: WidgetSize;
    collapsed: boolean;
}

interface CustomizeChartsState {
    selectedItems: ChartInstance[];
    isLoading: boolean;
}

const STORAGE_KEY_V2 = 'grahvani_customize_layout_v2';
const STORAGE_KEY_V1 = 'grahvani_customize_charts';

// Layout presets per ayanamsa system
export const LAYOUT_PRESETS: Record<string, Record<string, string[]>> = {
    lahiri: {
        'Classical Vedic': ['D1', 'D9', 'D60', 'vimshottari'],
        'Marriage': ['D1', 'D9', 'D7', 'upapada_lagna'],
        'Career': ['D1', 'D10', 'D60', 'vimshottari'],
        'Strength & Karma': ['D1', 'D27', 'D30', 'D60', 'widget_shadbala'],
    },
    raman: {
        'Classical Vedic': ['D1', 'D9', 'D60', 'vimshottari'],
    },
    kp: {
        'Classical KP': ['kp_planets_cusps', 'kp_bhava_details', 'kp_ruling_planets', 'kp_house_significations'],
    },
    yukteswar: {
        'Classical Vedic': ['D1', 'D9', 'D60', 'vimshottari'],
    },
    bhasin: {
        'Classical Vedic': ['D1', 'D9', 'D60', 'vimshottari'],
    },
};

// All available charts with metadata
export const CHART_CATALOG: CustomizeChartItem[] = [
    // Standard Divisional Charts
    { id: 'D1', name: 'D1 - Rashi', description: 'The fundamental physical existence', category: 'divisional', size: 'medium' },
    { id: 'D2', name: 'D2 - Hora', description: 'Wealth and prosperity', category: 'divisional', size: 'medium' },
    { id: 'D3', name: 'D3 - Drekkana', description: 'Siblings and courage', category: 'divisional', size: 'medium' },
    { id: 'D4', name: 'D4 - Chaturthamsha', description: 'Fortune and fixed assets', category: 'divisional', size: 'medium' },
    { id: 'D7', name: 'D7 - Saptamsha', description: 'Progeny and creative fruits', category: 'divisional', size: 'medium' },
    { id: 'D9', name: 'D9 - Navamsha', description: 'The internal fruit and marriage', category: 'divisional', size: 'medium' },
    { id: 'D10', name: 'D10 - Dashamsha', description: 'Career and public achievements', category: 'divisional', size: 'medium' },
    { id: 'D12', name: 'D12 - Dwadashamsha', description: 'Parents and ancestry', category: 'divisional', size: 'medium' },
    { id: 'D16', name: 'D16 - Shodashamsha', description: 'Vehicles and comforts', category: 'divisional', size: 'medium' },
    { id: 'D20', name: 'D20 - Vimshamsha', description: 'Spiritual progress and devotion', category: 'divisional', size: 'medium' },
    { id: 'D24', name: 'D24 - Chaturvimshamsha', description: 'Learning and knowledge', category: 'divisional', size: 'medium' },
    { id: 'D27', name: 'D27 - Saptavimshamsha', description: 'General strength and vitality', category: 'divisional', size: 'medium' },
    { id: 'D30', name: 'D30 - Trimshamsha', description: 'Evils and misfortunes', category: 'divisional', size: 'medium' },
    { id: 'D40', name: 'D40 - Khavedamsha', description: 'Auspicious/Inauspicious effects', category: 'divisional', size: 'medium' },
    { id: 'D45', name: 'D45 - Akshavedamsha', description: 'General character and fruits', category: 'divisional', size: 'medium' },
    { id: 'D60', name: 'D60 - Shashtiamsha', description: 'Past karma and detailed results', category: 'divisional', size: 'medium' },

    // Rare Shodash Varga (Lahiri only)
    { id: 'd2_iyer', name: 'D2 Iyer', description: 'Wealth - Iyer variation', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd2_somanatha', name: 'D2 Somanatha', description: 'Wealth - Somanatha method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd2_kashinatha', name: 'D2 Kashinatha', description: 'Wealth - Kashinatha method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd4_vedamsha', name: 'D4 Vedamsha', description: 'Fortune - Vedamsha variation', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd5', name: 'D5 Panchamsha', description: 'Power & Authority', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd6_kaulaka', name: 'D6 Kaulaka', description: 'Health - Kaulaka method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd8_chart', name: 'D8 Ashtamsha', description: 'Unexpected Troubles', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd9_nadhi', name: 'D9 Nadhi', description: 'Spouse - Nadhi variation', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd9_pada_special', name: 'D9 Pada', description: 'Spouse - Special method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd9_somanatha', name: 'D9 Somanatha', description: 'Spouse - Somanatha method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd11', name: 'D11 Ekadasamsha', description: 'Gains and acquisitions', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd24_parasidamsha', name: 'D24 Parasidamsha', description: 'Education - Parasidamsha', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd24_siddhamsha', name: 'D24 Siddhamsha', description: 'Education - Siddhamsha', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd30_venkatesha', name: 'D30 Venkatesha', description: 'Misfortunes - Venkatesha', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd108_nd', name: 'D108 ND', description: 'Past karma - ND method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },
    { id: 'd108_dn', name: 'D108 DN', description: 'Past karma - DN method', category: 'rare_shodash', size: 'medium', lahiriOnly: true },

    // Lagna Charts
    { id: 'moon_chart', name: 'Chandra Lagna', description: 'Moon ascendant chart', category: 'lagna', size: 'medium' },
    { id: 'sun_chart', name: 'Surya Lagna', description: 'Sun ascendant chart', category: 'lagna', size: 'medium' },
    { id: 'arudha_lagna', name: 'Arudha Lagna', description: 'Perception and illusion', category: 'lagna', size: 'medium' },
    { id: 'bhava_lagna', name: 'Bhava Lagna', description: 'Relative strength analysis', category: 'lagna', size: 'medium' },
    { id: 'hora_lagna', name: 'Hora Lagna', description: 'Prosperity analysis', category: 'lagna', size: 'medium' },
    { id: 'karkamsha_d1', name: 'Karkamsha D1', description: 'Life purpose analysis', category: 'lagna', size: 'medium' },
    { id: 'karkamsha_d9', name: 'Karkamsha D9', description: 'Inner nature analysis', category: 'lagna', size: 'medium' },
    { id: 'upapada_lagna', name: 'Upapada Lagna', description: 'Marriage and partnerships', category: 'lagna', size: 'medium' },
    { id: 'swamsha', name: 'Swamsha', description: 'Navamsha lagna chart', category: 'lagna', size: 'medium' },
    { id: 'pada_chart', name: 'Pada Chart', description: 'Arudha pada analysis', category: 'lagna', size: 'medium' },

    // Dasha Systems
    { id: 'vimshottari', name: 'Vimshottari Dasha', description: 'Universal Moon-nakshatra based dasha (120 years)', category: 'dasha', size: 'medium' },
    { id: 'tribhagi', name: 'Tribhagi Dasha', description: 'One-third portions of Vimshottari periods (40 years)', category: 'dasha', size: 'medium' },
    { id: 'ashtottari', name: 'Ashtottari Dasha', description: 'For specific lagna conditions (108 years)', category: 'dasha', size: 'medium' },
    { id: 'shodashottari', name: 'Shodashottari Dasha', description: 'Venus in 9th + Lagna in hora of Venus (116 years)', category: 'dasha', size: 'medium' },
    { id: 'dwadashottari', name: 'Dwadashottari Dasha', description: 'Venus in Lagna + Moon in Venusian nakshatra (112 years)', category: 'dasha', size: 'medium' },
    { id: 'panchottari', name: 'Panchottari Dasha', description: 'Cancer Lagna with Dhanishtha nakshatra (105 years)', category: 'dasha', size: 'medium' },
    { id: 'chaturshitisama', name: 'Chaturshitisama Dasha', description: '10th lord posited in 10th house (84 years)', category: 'dasha', size: 'medium' },
    { id: 'satabdika', name: 'Satabdika Dasha', description: 'Lagna in Vargottama position (100 years)', category: 'dasha', size: 'medium' },
    { id: 'dwisaptati', name: 'Dwisaptati Sama', description: 'Lagna lord in 7th or 7th lord in Lagna (72 years)', category: 'dasha', size: 'medium' },
    { id: 'shastihayani', name: 'Shastihayani Dasha', description: 'Sun posited in the Lagna (60 years)', category: 'dasha', size: 'medium' },
    { id: 'shattrimshatsama', name: 'Shattrimshatsama Dasha', description: 'Born in daytime with Moon in Lagna (36 years)', category: 'dasha', size: 'medium' },
    { id: 'chara', name: 'Chara Dasha (Jaimini)', description: 'Sign-based Jaimini dasha system', category: 'dasha', size: 'medium' },

    // Ashtakavarga Types
    { id: 'ashtakavarga_sarva', name: 'Sarvashtakavarga', description: 'Combined strength points of all planets (SAV)', category: 'ashtakavarga', size: 'medium' },
    { id: 'ashtakavarga_bhinna', name: 'Bhinna Ashtakavarga', description: 'Individual planetary strength points (BAV)', category: 'ashtakavarga', size: 'medium' },
    { id: 'widget_shodasha_varga', name: 'Shodashvarga Summary', description: 'Planetary dignities across 16 divisional charts', category: 'widget_shodasha', size: 'wide' },

    // LAHIRI WIDGETS
    {
        id: 'widget_shadbala',
        name: 'Shadbala Analysis',
        description: 'Six-fold planetary strength with Ishta/Kashta phala',
        category: 'widget_shadbala',
        size: 'wide',
        lahiriOnly: true
    },
    {
        id: 'widget_pushkara',
        name: 'Pushkara Navamsha',
        description: 'Auspicious Navamsha divisions and Pushkara Bhaga',
        category: 'widget_pushkara',
        size: 'wide',
        lahiriOnly: true
    },
    {
        id: 'widget_karaka',
        name: 'Chara Karakas',
        description: 'Variable significators based on planetary degrees',
        category: 'widget_karaka',
        size: 'medium',
        lahiriOnly: true
    },
    {
        id: 'widget_chakra',
        name: 'Sudarshan Chakra',
        description: 'Tri-layer radial chart (Surya, Chandra, Lagna)',
        category: 'widget_chakra',
        size: 'large',
        lahiriOnly: false
    },
    {
        id: 'widget_yoga',
        name: 'Yoga Analysis',
        description: 'Benefic and challenging planetary combinations',
        category: 'widget_yoga',
        size: 'wide',
        lahiriOnly: true
    },
    {
        id: 'widget_dosha',
        name: 'Dosha Analysis',
        description: 'Karmic debts and planetary afflictions',
        category: 'widget_dosha',
        size: 'wide',
        lahiriOnly: true
    },
    {
        id: 'widget_transit',
        name: 'Daily Transit',
        description: 'Live planetary movements and Gochar analysis',
        category: 'widget_transit',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'widget_remedy_gemstone',
        name: 'Gemstone Prescription',
        description: 'Planetary gemstone recommendations',
        category: 'widget_remedy',
        size: 'full',
        lahiriOnly: true
    },
    {
        id: 'widget_remedy_mantra',
        name: 'Mantra Sadhana',
        description: 'Sacred syllables for planetary propitiation',
        category: 'widget_remedy',
        size: 'wide',
        lahiriOnly: true
    },

    // KP SYSTEM MODULES
    {
        id: 'kp_planets_cusps',
        name: 'Planets & Cusps',
        description: 'Detailed planetary positions and sub-lord analysis',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_house_significations',
        name: 'House Significations',
        description: 'Thematic significations of houses in KP system',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_planetary_significators',
        name: 'Planetary Significators',
        description: 'Planetary significator analysis in KP',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_bhava_details',
        name: 'Bhava Details',
        description: 'Detailed bhava (house) analysis in KP',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_interlinks',
        name: 'Interlinks',
        description: 'Planetary interlinks and connections',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_advanced_ssl',
        name: 'Advanced SSL',
        description: 'Advanced sub-sub-lord analysis',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_nakshatra_nadi',
        name: 'Nakshatra Nadi',
        description: 'Nakshatra-based Nadi analysis',
        category: 'kp_module',
        size: 'wide',
        lahiriOnly: false
    },
    {
        id: 'kp_pars_fortuna',
        name: 'Pars Fortuna',
        description: 'Part of Fortune calculation in KP',
        category: 'kp_module',
        size: 'medium',
        lahiriOnly: false
    },
    {
        id: 'kp_ruling_planets',
        name: 'Ruling Planets',
        description: 'Real-time ruling planets for the moment',
        category: 'kp_module',
        size: 'medium',
        lahiriOnly: false
    },
];

function generateInstanceId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useCustomizeCharts() {
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();
    const isLahiri = activeSystem === 'lahiri';

    const [state, setState] = useState<CustomizeChartsState>({
        selectedItems: [],
        isLoading: true,
    });

    // Load from localStorage on mount (with v1 migration)
    useEffect(() => {
        const migrateV1 = (): ChartInstance[] | null => {
            const oldStored = localStorage.getItem(STORAGE_KEY_V1);
            if (!oldStored) return null;
            try {
                const oldParsed = JSON.parse(oldStored) as Record<string, string[]>;
                const chartIds = oldParsed[activeSystem] ?? [];
                if (chartIds.length === 0) return null;
                return chartIds.map(id => {
                    const catalog = CHART_CATALOG.find(c => c.id === id);
                    return {
                        instanceId: generateInstanceId(),
                        id,
                        size: catalog?.size || 'medium',
                        collapsed: false,
                    };
                });
            } catch {
                return null;
            }
        };

        const stored = localStorage.getItem(STORAGE_KEY_V2);
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as Record<string, ChartInstance[]>;
                if (parsed && typeof parsed === 'object') {
                    const itemsForSystem = parsed[activeSystem] ?? [];
                    if (itemsForSystem.length === 0) {
                        const migrated = migrateV1();
                        setState({ selectedItems: migrated || [], isLoading: false });
                        return;
                    }
                    setState({ selectedItems: itemsForSystem, isLoading: false });
                    return;
                }
            } catch {
                // fall through
            }
        }
        const migrated = migrateV1();
        setState({ selectedItems: migrated || [], isLoading: false });
    }, [activeSystem]);

    // Save to localStorage when selection changes
    const saveToStorage = useCallback((items: ChartInstance[]) => {
        const stored = localStorage.getItem(STORAGE_KEY_V2);
        let allSystems: Record<string, ChartInstance[]> = {};
        if (stored) {
            try {
                allSystems = JSON.parse(stored);
            } catch {
                // Invalid, start fresh
            }
        }
        allSystems[activeSystem] = items;
        localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(allSystems));
    }, [activeSystem]);

    const addChart = useCallback((chartId: string) => {
        setState(prev => {
            const catalog = CHART_CATALOG.find(c => c.id === chartId);
            const newItem: ChartInstance = {
                instanceId: generateInstanceId(),
                id: chartId,
                size: catalog?.size || 'medium',
                collapsed: false,
            };
            const newItems = [...prev.selectedItems, newItem];
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const removeChart = useCallback((instanceId: string) => {
        setState(prev => {
            const newItems = prev.selectedItems.filter(i => i.instanceId !== instanceId);
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const duplicateChart = useCallback((instanceId: string) => {
        setState(prev => {
            const idx = prev.selectedItems.findIndex(i => i.instanceId === instanceId);
            if (idx === -1) return prev;
            const source = prev.selectedItems[idx];
            const newItem: ChartInstance = {
                instanceId: generateInstanceId(),
                id: source.id,
                size: source.size,
                collapsed: false,
            };
            const newItems = [...prev.selectedItems];
            newItems.splice(idx + 1, 0, newItem);
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const setItemSize = useCallback((instanceId: string, size: WidgetSize) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, size } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const toggleCollapse = useCallback((instanceId: string) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, collapsed: !i.collapsed } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const reorderItems = useCallback((newOrder: ChartInstance[]) => {
        setState(prev => {
            saveToStorage(newOrder);
            return { ...prev, selectedItems: newOrder };
        });
    }, [saveToStorage]);

    const resetToDefaults = useCallback(() => {
        setState(prev => ({ ...prev, selectedItems: [] }));
        saveToStorage([]);
    }, [saveToStorage]);

    const clearAll = useCallback(() => {
        setState(prev => ({ ...prev, selectedItems: [] }));
        saveToStorage([]);
    }, [saveToStorage]);

    const loadPreset = useCallback((presetName: string) => {
        const presetIds = LAYOUT_PRESETS[activeSystem]?.[presetName] || [];
        if (presetIds.length === 0) return;
        const newItems: ChartInstance[] = presetIds.map(id => {
            const catalog = CHART_CATALOG.find(c => c.id === id);
            return {
                instanceId: generateInstanceId(),
                id,
                size: catalog?.size || 'medium',
                collapsed: false,
            };
        });
        setState(prev => {
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [activeSystem, saveToStorage]);

    // Get available charts based on system
    const availableCharts = useMemo(() => {
        if (isLahiri) {
            return CHART_CATALOG;
        }
        return CHART_CATALOG.filter(chart =>
            chart.category !== 'rare_shodash' &&
            !chart.lahiriOnly
        );
    }, [isLahiri]);

    // Get charts not yet selected
    const unselectedCharts = useMemo(() => {
        const selectedIds = new Set(state.selectedItems.map(i => i.id));
        return availableCharts.filter(chart => !selectedIds.has(chart.id));
    }, [availableCharts, state.selectedItems]);

    // Get selected chart details merged with runtime state
    const selectedChartDetails = useMemo((): SelectedItemDetail[] => {
        return state.selectedItems
            .map(instance => {
                const catalog = CHART_CATALOG.find(c => c.id === instance.id);
                if (!catalog) return null;
                return {
                    ...catalog,
                    instanceId: instance.instanceId,
                    size: instance.size,
                    collapsed: instance.collapsed,
                };
            })
            .filter(Boolean) as SelectedItemDetail[];
    }, [state.selectedItems]);

    // Generate a missing chart
    const generateMissingChart = useCallback(async (clientId: string, chartId: string) => {
        try {
            await clientApi.generateChart(clientId, chartId, activeSystem);
            return true;
        } catch (error) {
            console.error(`Failed to generate chart ${chartId}:`, error);
            return false;
        }
    }, [activeSystem]);

    const presetNames = useMemo(() => {
        return Object.keys(LAYOUT_PRESETS[activeSystem] || {});
    }, [activeSystem]);

    return {
        selectedItems: state.selectedItems,
        selectedChartDetails,
        isLoading: state.isLoading,
        availableCharts,
        unselectedCharts,
        addChart,
        removeChart,
        duplicateChart,
        setItemSize,
        toggleCollapse,
        reorderItems,
        resetToDefaults,
        clearAll,
        generateMissingChart,
        loadPreset,
        presetNames,
        isLahiri,
    };
}
