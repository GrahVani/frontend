import { 
    LayoutGrid, 
    Target, 
    Sparkles, 
    History, 
    Zap, 
    BarChart2, 
    Globe, 
    IterationCcw 
} from 'lucide-react';

/**
 * Supported Ayanamsa Systems for the Customize Page
 */
export const AYANAMSA_SYSTEMS = ['Lahiri', 'KP', 'Raman', 'Yukteswar', 'Bhasin', 'TrueChitra'] as const;
export type AyanamsaSystem = typeof AYANAMSA_SYSTEMS[number];

/**
 * Simple options array for dropdown components
 * Uses short labels optimized for compact widget headers
 */
export const AYANAMSA_OPTIONS: { value: AyanamsaSystem; label: string; color: string }[] = [
    { value: 'Lahiri', label: 'Lahiri', color: '#C9A24D' },
    { value: 'KP', label: 'KP', color: '#E6C97A' },
    { value: 'Raman', label: 'Raman', color: '#D17C4D' },
    { value: 'Yukteswar', label: 'Yukteswar', color: '#7C4DFF' },
    { value: 'Bhasin', label: 'Bhasin', color: '#4CAF50' },
    { value: 'TrueChitra', label: 'True Chitra', color: '#9C27B0' }
];

export interface WidgetRef {
    id: string;
}

export interface AyanamsaCategory {
    id: string;
    name: string;
    widgets: WidgetRef[];
}

export interface AyanamsaOption {
    value: AyanamsaSystem;
    label: string;
    description: string;
    categories: AyanamsaCategory[];
}

export const AYANAMSA_HIERARCHY: AyanamsaOption[] = [
    {
        value: 'Lahiri',
        label: 'Lahiri (Chitra Paksha)',
        description: 'Traditional parashari system with the most comprehensive charts and calculations.',
        categories: [
            {
                id: 'cat-divisional',
                name: 'Divisional Charts',
                widgets: [
                    { id: 'D1' }, { id: 'D2' }, { id: 'D3' }, { id: 'D4' }, { id: 'D7' }, { id: 'D9' }, { id: 'D10' }, 
                    { id: 'D12' }, { id: 'D16' }, { id: 'D20' }, { id: 'D24' }, { id: 'D27' }, { id: 'D30' }, 
                    { id: 'D40' }, { id: 'D45' }, { id: 'D60' }, { id: 'd2_iyer' }, { id: 'd2_somanatha' }, 
                    { id: 'd2_kashinatha' }, { id: 'd4_vedamsha' }, { id: 'd5' }, { id: 'd6_kaulaka' }, 
                    { id: 'd8_chart' }, { id: 'd9_nadhi' }, { id: 'd9_pada_special' }, { id: 'd9_somanatha' }, 
                    { id: 'd11' }, { id: 'd24_parasidamsha' }, { id: 'd24_siddhamsha' }, { id: 'd30_venkatesha' }, 
                    { id: 'd108_nd' }, { id: 'd108_dn' }
                ]
            },
            {
                id: 'cat-lagna',
                name: 'Lagna Charts',
                widgets: [
                    { id: 'moon_chart' }, { id: 'sun_chart' }, { id: 'arudha_lagna' }, { id: 'bhava_lagna' }, 
                    { id: 'hora_lagna' }, { id: 'karkamsha_d1' }, { id: 'karkamsha_d9' }, { id: 'upapada_lagna' }, 
                    { id: 'swamsha' }, { id: 'pada_chart' }, { id: 'sripathi_bhava' }, { id: 'kp_bhava_lagna' }, 
                    { id: 'equal_bhava' }, { id: 'gati_kalagna' }, { id: 'mandi_chart' }, { id: 'gulika_chart' }
                ]
            },
            {
                id: 'cat-dashas',
                name: 'Dasha Systems',
                widgets: [
                    { id: 'vimshottari' }, { id: 'tribhagi' }, { id: 'ashtottari' }, { id: 'shodashottari' }, 
                    { id: 'dwadashottari' }, { id: 'panchottari' }, { id: 'chaturshitisama' }, { id: 'satabdika' }, 
                    { id: 'dwisaptati' }, { id: 'shastihayani' }, { id: 'shattrimshatsama' }, { id: 'chara' }
                ]
            },
            {
                id: 'cat-ashtakavarga',
                name: 'Ashtakavarga',
                widgets: [
                    { id: 'ashtakavarga_sarva' }, { id: 'ashtakavarga_bhinna' }, { id: 'widget_shodasha_varga' }
                ]
            },
            {
                id: 'cat-analysis',
                name: 'Vedic Analysis',
                widgets: [
                    { id: 'widget_shadbala' }, { id: 'widget_pushkara' }, { id: 'widget_karaka' }, 
                    { id: 'widget_yoga' }, { id: 'widget_dosha' }
                ]
            },
            {
                id: 'cat-chakra',
                name: 'Sudarshan Chakra',
                widgets: [
                    { id: 'widget_chakra' }
                ]
            },
            {
                id: 'cat-transit',
                name: 'Transit & Upaya',
                widgets: [
                    { id: 'widget_transit' }, { id: 'widget_remedy_gemstone' }, { id: 'widget_remedy_mantra' }
                ]
            }
        ]
    },
    {
        value: 'KP',
        label: 'KP (Krishnamurti Paddhati)',
        description: 'Stellar astrology focused on precise predictions using cusps and sub-lords.',
        categories: [
            {
                id: 'cat-divisional',
                name: 'Divisional Charts',
                widgets: [
                    { id: 'D1' }
                ]
            },
            {
                id: 'cat-kp',
                name: 'Kp System',
                widgets: [
                    { id: 'kp_planets' }, { id: 'kp_cusps' }, { id: 'kp_house_significations' }, 
                    { id: 'kp_planetary_significators' }, { id: 'kp_bhava_details' }, { id: 'kp_interlinks' }, 
                    { id: 'kp_advanced_ssl' }, { id: 'kp_nakshatra_nadi' }, { id: 'kp_fortuna' }, { id: 'kp_ruling_planets' }
                ]
            },
            {
                id: 'cat-dashas',
                name: 'Dasha Systems',
                widgets: [
                    { id: 'vimshottari' }
                ]
            }
        ]
    },
    {
        value: 'Raman',
        label: 'Raman (B.V. Raman)',
        description: 'Standardized calculations popularized by Dr. B.V. Raman.',
        categories: [
            {
                id: 'cat-divisional',
                name: 'Divisional Charts',
                widgets: [
                    { id: 'D1' }, { id: 'D2' }, { id: 'D3' }, { id: 'D4' }, { id: 'D7' }, { id: 'D9' }, { id: 'D10' }, 
                    { id: 'D12' }, { id: 'D16' }, { id: 'D20' }, { id: 'D24' }, { id: 'D27' }, { id: 'D30' }, 
                    { id: 'D40' }, { id: 'D45' }, { id: 'D60' }
                ]
            },
            {
                id: 'cat-lagna',
                name: 'Lagna Charts',
                widgets: [
                    { id: 'moon_chart' }, { id: 'sun_chart' }, { id: 'arudha_lagna' }, { id: 'bhava_lagna' }, 
                    { id: 'hora_lagna' }, { id: 'karkamsha_d1' }, { id: 'karkamsha_d9' }, { id: 'sripathi_bhava' }, 
                    { id: 'kp_bhava_lagna' }, { id: 'equal_bhava' }
                ]
            },
            {
                id: 'cat-dashas',
                name: 'Dasha Systems',
                widgets: [
                    { id: 'vimshottari' }
                ]
            },
            {
                id: 'cat-ashtakavarga',
                name: 'Ashtakavarga',
                widgets: [
                    { id: 'ashtakavarga_sarva' }, { id: 'ashtakavarga_bhinna' }, { id: 'widget_shodasha_varga' }
                ]
            },
            {
                id: 'cat-chakra',
                name: 'Sudarshan Chakra',
                widgets: [
                    { id: 'widget_chakra' }
                ]
            }
        ]
    },
    {
        value: 'Yukteswar',
        label: 'Yukteswar (Sri Yukteswar)',
        description: 'Calculations based on Swami Sri Yukteswar Giri\'s cosmic principles.',
        categories: [
            {
                id: 'cat-divisional',
                name: 'Divisional Charts',
                widgets: [
                    { id: 'D1' }, { id: 'D2' }, { id: 'D3' }, { id: 'D4' }, { id: 'D7' }, { id: 'D9' }, { id: 'D10' }, 
                    { id: 'D12' }, { id: 'D16' }, { id: 'D20' }, { id: 'D24' }, { id: 'D27' }, { id: 'D30' }, 
                    { id: 'D40' }, { id: 'D45' }, { id: 'D60' }
                ]
            },
            {
                id: 'cat-lagna',
                name: 'Lagna Charts',
                widgets: [
                    { id: 'moon_chart' }, { id: 'sun_chart' }, { id: 'arudha_lagna' }, { id: 'bhava_lagna' }, 
                    { id: 'hora_lagna' }, { id: 'karkamsha_d1' }, { id: 'karkamsha_d9' }, { id: 'sripathi_bhava' }, 
                    { id: 'kp_bhava_lagna' }, { id: 'equal_bhava' }
                ]
            },
            {
                id: 'cat-dashas',
                name: 'Dasha Systems',
                widgets: [
                    { id: 'vimshottari' }, { id: 'tribhagi' }, { id: 'ashtottari' }, { id: 'shodashottari' }, 
                    { id: 'dwadashottari' }, { id: 'panchottari' }, { id: 'chaturshitisama' }, { id: 'satabdika' }, 
                    { id: 'dwisaptati' }, { id: 'shastihayani' }, { id: 'shattrimshatsama' }
                ]
            },
            {
                id: 'cat-ashtakavarga',
                name: 'Ashtakavarga',
                widgets: [
                    { id: 'ashtakavarga_sarva' }, { id: 'ashtakavarga_bhinna' }, { id: 'widget_shodasha_varga' }
                ]
            },
            {
                id: 'cat-chakra',
                name: 'Sudarshan Chakra',
                widgets: [
                    { id: 'widget_chakra' }
                ]
            },
            {
                id: 'cat-transit',
                name: 'Transit & Upaya',
                widgets: [
                    { id: 'widget_transit' }
                ]
            }
        ]
    },
    {
        value: 'Bhasin',
        label: 'Bhasin (J.N. Bhasin)',
        description: 'Predictive methodology established by the renowned scholar J.N. Bhasin.',
        categories: [
            {
                id: 'cat-divisional',
                name: 'Divisional Charts',
                widgets: [
                    { id: 'D1' }, { id: 'D2' }, { id: 'D3' }, { id: 'D4' }, { id: 'D7' }, { id: 'D9' }, { id: 'D10' }, 
                    { id: 'D12' }, { id: 'D16' }, { id: 'D20' }, { id: 'D24' }, { id: 'D27' }, { id: 'D30' }, 
                    { id: 'D40' }, { id: 'D45' }, { id: 'D60' }
                ]
            },
            {
                id: 'cat-lagna',
                name: 'Lagna Charts',
                widgets: [
                    { id: 'moon_chart' }, { id: 'sun_chart' }, { id: 'arudha_lagna' }, { id: 'bhava_lagna' }, 
                    { id: 'hora_lagna' }, { id: 'karkamsha_d1' }, { id: 'karkamsha_d9' }, { id: 'sripathi_bhava' }, 
                    { id: 'kp_bhava_lagna' }, { id: 'equal_bhava' }
                ]
            },
            {
                id: 'cat-dashas',
                name: 'Dasha Systems',
                widgets: [
                    { id: 'vimshottari' }, { id: 'tribhagi' }, { id: 'ashtottari' }, { id: 'shodashottari' }, 
                    { id: 'dwadashottari' }, { id: 'panchottari' }, { id: 'chaturshitisama' }, { id: 'satabdika' }, 
                    { id: 'dwisaptati' }, { id: 'shastihayani' }, { id: 'shattrimshatsama' }
                ]
            },
            {
                id: 'cat-ashtakavarga',
                name: 'Ashtakavarga',
                widgets: [
                    { id: 'ashtakavarga_sarva' }, { id: 'ashtakavarga_bhinna' }
                ]
            },
            {
                id: 'cat-chakra',
                name: 'Sudarshan Chakra',
                widgets: [
                    { id: 'widget_chakra' }
                ]
            }
        ]
    },
    {
        value: 'TrueChitra',
        label: 'True Chitra',
        description: 'True Chitra ayanamsa — specialized dasha-only system with 12 dasha variants.',
        categories: [
            {
                id: 'cat-true-chitra',
                name: 'True Chitra Dasha Systems',
                widgets: [
                    { id: 'prana' }, { id: 'ashtottari' }, { id: 'tribhagi' }, { id: 'tribhagi_40' },
                    { id: 'shodashottari' }, { id: 'dwadashottari' }, { id: 'dwisaptati' },
                    { id: 'shastihayani' }, { id: 'shattrimshatsama' }, { id: 'panchottari' },
                    { id: 'satabdika' }, { id: 'chaturshitisama' }
                ]
            }
        ]
    }
];

/**
 * Category Metadata for the Chart Selector Modal
 */
export interface WorkbenchCategory {
    id: string;
    name: string;
    description: string;
    icon: any;
    allowedAyanamsas: AyanamsaSystem[];
}

/**
 * System-specific Workbench Configuration
 */
export interface AyanamsaConfig {
    title: string;
    subtitle: string;
    themeColor: string;
    pillLabel: string;
    allowedCategoryIds: string[];
}

/**
 * Global Metadata for Ayanamsa Systems
 * Defines the core capabilities and UI configuration per astrological system.
 */
export const AYANAMSA_CONFIGS: Record<AyanamsaSystem, AyanamsaConfig> = {
    /**
     * Lahiri (Chitra Paksha) System
     * Supports:
     * - Divisional Charts: FULL suite (D1 through D150)
     * - Features: Natal, Transit, Daily Transit, Yogas, Doshas, Remedies, Numerology, Panchanga
     * - Dashas: Extensive (Vimshottari, Chara, Tribhagi, Ashtottari, Shodashottari, Dwadashottari, etc.)
     * - Ashtakavarga: Sarva, Bhinna, Shodasha
     */
    Lahiri: {
        title: 'Vedic Workbench',
        subtitle: 'Traditional Parashari Analysis',
        themeColor: '#C9A24D',
        pillLabel: 'Lahiri',
        allowedCategoryIds: [
            'all',
            'cat-divisional',
            'cat-lagna',
            'cat-ashtakavarga',
            'cat-dashas',
            'cat-analysis',
            'cat-transit',
            'cat-chakra'
        ]
    },
    /**
     * KP (Krishnamurti Paddhati) System
     * Supports:
     * - Divisional Charts: D1 ONLY
     * - Features: Horary, Ruling Planets, Planet/House Significations, Cuspal Interlinks, Nakshatra Nadi, Fortuna
     * - Dashas: Vimshottari ONLY
     * - Excludes: Ashtakavarga, Transit/Yoga/Dosha modules, Non-D1 Divisional Charts
     */
    KP: {
        title: 'KP Workbench',
        subtitle: 'Krishnamurti Padhdhati Precision',
        themeColor: '#E6C97A',
        pillLabel: 'KP',
        allowedCategoryIds: [
            'all',
            'cat-divisional',
            'cat-kp',
            'cat-dashas'
        ]
    },
    /**
     * Raman (B.V. Raman) System
     * Supports:
     * - Divisional Charts: D1 through D60
     * - Features: Natal, Transit, Ashtakavarga, Arudha Lagna, Sudarshan Chakra
     * - Dashas: Vimshottari ONLY 
     * - Excludes: Yogas, Doshas, Remedies, Numerology, Non-Vimshottari Dashas
     */
    Raman: {
        title: 'Raman Workbench',
        subtitle: 'B.V. Raman Analysis',
        themeColor: '#D17C4D',
        pillLabel: 'Raman',
        allowedCategoryIds: [
            'all',
            'cat-divisional',
            'cat-lagna',
            'cat-ashtakavarga',
            'cat-dashas',
            'cat-chakra'
        ]
    },
    /**
     * Yukteswar System
     * Supports:
     * - Divisional Charts: D1 through D60
     * - Features: Natal, Transit, Dashas, Ashtakavarga, Arudha Lagna, Sudarshan Chakra
     * - Dashas: Extensive (Vimshottari, Tribhagi, Ashtottari, etc.)
     */
    Yukteswar: {
        title: 'Yukteswar Workbench',
        subtitle: 'Cosmic Astrological Precision',
        themeColor: '#7C4DFF',
        pillLabel: 'Yukteswar',
        allowedCategoryIds: [
            'all',
            'cat-divisional',
            'cat-lagna',
            'cat-ashtakavarga',
            'cat-dashas',
            'cat-chakra',
            'cat-transit'
        ]
    },
    /**
     * Bhasin System
     * Supports:
     * - Divisional Charts: D1 through D60
     * - Features: Natal, Dashas, Ashtakavarga, Arudha Lagna, Sudarshan Chakra
     * - Dashas: Extensive (Vimshottari, Tribhagi, Ashtottari, etc.)
     */
    Bhasin: {
        title: 'Bhasin Workbench',
        subtitle: 'Traditional Predictive Insight',
        themeColor: '#4CAF50',
        pillLabel: 'Bhasin',
        allowedCategoryIds: [
            'all',
            'cat-divisional',
            'cat-lagna',
            'cat-ashtakavarga',
            'cat-dashas',
            'cat-chakra'
        ]
    },
    /**
     * True Chitra System
     * Supports:
     * - Dasha Systems ONLY (no natal/divisional charts)
     * - 12 specialized dasha variants under True Chitra ayanamsa
     */
    TrueChitra: {
        title: 'True Chitra Workbench',
        subtitle: 'True Chitra Ayanamsa Dasha Analysis',
        themeColor: '#9C27B0',
        pillLabel: 'True Chitra',
        allowedCategoryIds: [
            'all',
            'cat-true-chitra'
        ]
    }
};

/**
 * Master list of all categories available on the Customize Page
 */
export const WORKBENCH_CATEGORIES: WorkbenchCategory[] = [
    {
        id: 'cat-divisional',
        name: 'Divisional Charts',
        description: 'Varga analysis for specific life areas',
        icon: LayoutGrid,
        allowedAyanamsas: ['Lahiri', 'KP', 'Raman', 'Yukteswar', 'Bhasin']
    },
    {
        id: 'cat-lagna',
        name: 'Lagna Charts',
        description: 'Solar, Lunar and Return charts',
        icon: Globe,
        allowedAyanamsas: ['Lahiri', 'Raman', 'Yukteswar', 'Bhasin']
    },
    {
        id: 'cat-kp',
        name: 'Kp System',
        description: 'Stellar positions and sub-lord analysis',
        icon: Target,
        allowedAyanamsas: ['KP']
    },
    {
        id: 'cat-ashtakavarga',
        name: 'Ashtakavarga',
        description: 'Mathematical point-based strength analysis',
        icon: Sparkles,
        allowedAyanamsas: ['Lahiri', 'Raman', 'Yukteswar', 'Bhasin']
    },
    {
        id: 'cat-dashas',
        name: 'Dasha Systems',
        description: 'Navigating time cycles and periods',
        icon: History,
        allowedAyanamsas: ['Lahiri', 'KP', 'Raman', 'Yukteswar', 'Bhasin']
    },
    {
        id: 'cat-analysis',
        name: 'Vedic Analysis',
        description: 'Yoga, Dosha and specialized Vedic metrics',
        icon: Zap,
        allowedAyanamsas: ['Lahiri']
    },
    {
        id: 'cat-transit',
        name: 'Transit & Upaya',
        description: 'Real-time movements and remedies',
        icon: BarChart2,
        allowedAyanamsas: ['Lahiri', 'Yukteswar']
    },
    {
        id: 'cat-chakra',
        name: 'Sudarshan Chakra',
        description: 'Triple-ring planetary alignment',
        icon: IterationCcw,
        allowedAyanamsas: ['Lahiri', 'KP', 'Raman', 'Yukteswar', 'Bhasin']
    },
    {
        id: 'cat-true-chitra',
        name: 'True Chitra Dasha',
        description: 'True Chitra ayanamsa dasha systems',
        icon: History,
        allowedAyanamsas: ['TrueChitra']
    }
];

/**
 * Checks if a specific widget/chart is compatible with a given Ayanamsa system
 * based on the master hierarchy definition.
 */
export const isChartCompatible = (chartId: string, system: string): boolean => {
    const systemLower = system.toLowerCase();
    const config = AYANAMSA_HIERARCHY.find(h => h.value.toLowerCase() === systemLower);
    if (!config) return true; // Default to true if system not found
    
    // Check all categories in that system for the widget ID
    return config.categories.some(cat => 
        cat.widgets.some(w => w.id === chartId)
    );
};

