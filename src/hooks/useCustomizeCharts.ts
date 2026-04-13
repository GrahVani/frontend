"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES - Free Form Widget System (No Grid!)
// ═══════════════════════════════════════════════════════════════════════════════

export type WidgetSize = 'small' | 'medium' | 'large' | 'wide' | 'full' | 'custom';

export interface WidgetDimensions {
    width: number;   // pixels
    height: number;  // pixels
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
}

export const DEFAULT_DIMENSIONS: WidgetDimensions = {
    width: 320,
    height: 280,
    minWidth: 200,
    minHeight: 150,
    maxWidth: 800,
    maxHeight: 600,
};

export interface WidgetTheme {
    backgroundColor: string;
    backgroundGradient?: string;
    titleColor: string;
    textColor: string;
    accentColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    headerBackground: string;
    headerTextColor: string;
    shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
    // Header customization
    headerHeight?: number;
    headerFontSize?: number;
    contentTextScale?: number;
    titleAlign?: 'left' | 'center' | 'right';
    titleMaxWidth?: number;
    // Auto-scale content based on widget dimensions
    autoScale?: boolean;
    // ═══════════════════════════════════════════════════════════════════════════════
    // ASTROLOGER CUSTOMIZATION OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    // Planet Display
    planetDisplayMode?: 'name' | 'symbol' | 'both';  // Show planet names, symbols, or both
    planetFontSize?: number;                          // Planet name font size in chart
    planetFontWeight?: 'normal' | 'bold' | '600';    // Planet text weight
    // Degree Display
    showDegrees?: boolean;                           // Show planet degrees
    degreeFormat?: 'full' | 'short';                 // Full (12°34'56") or short (12:34)
    degreeFontSize?: number;                         // Degree text size
    // House & Grid
    showHouseNumbers?: boolean;                      // Show house numbers (1-12)
    showGridLines?: boolean;                         // Show chart grid lines
    gridLineColor?: string;                          // Grid line color
    gridLineWidth?: number;                          // Grid line thickness
    // Retrograde & Special
    showRetrogradeIndicator?: boolean;               // Show (R) for retrograde
    retrogradeStyle?: 'R' | 'R%' | 'circle-R';       // Different retro styles
    // Aspect Visualization
    showAspects?: boolean;                           // Show planetary aspects (if available)
    aspectColor?: string;                            // Aspect line color
    // Typography
    fontFamily?: 'default' | 'serif' | 'traditional'; // Chart font style
    // Spacing & Density
    planetSpacing?: 'compact' | 'normal' | 'spacious'; // Space between planets in houses
    labelDensity?: 'minimal' | 'normal' | 'detailed';  // How much info to show
    // ═══════════════════════════════════════════════════════════════════════════════
    // TABLE CUSTOMIZATION OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    tableStyle?: 'compact' | 'comfortable' | 'spacious';
    rowHeight?: number;
    cellPadding?: number;
    alternateRowColors?: boolean;
    tableFontSize?: number;
    // ═══════════════════════════════════════════════════════════════════════════════
    // CARD & LAYOUT OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    cardStyle?: 'flat' | 'elevated' | 'outlined';
    contentLayout?: 'list' | 'grid' | 'timeline';
    // ═══════════════════════════════════════════════════════════════════════════════
    // ANALYSIS WIDGET OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    showSummaryStats?: boolean;
    highlightSeverity?: boolean;
    expandableSections?: boolean;
    // ═══════════════════════════════════════════════════════════════════════════════
    // COMPACT WIDGET OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    showIcon?: boolean;
    compactFontSize?: number;
    // ═══════════════════════════════════════════════════════════════════════════════
    // BACKGROUND STYLE OPTIONS
    // ═══════════════════════════════════════════════════════════════════════════════
    backgroundStyle?: 'solid' | 'gradient' | 'pattern';
}

export const DEFAULT_WIDGET_THEME: WidgetTheme = {
    backgroundColor: '#FDFBF7',
    titleColor: '#3E2A1F',
    textColor: '#3E2A1F',
    accentColor: '#C9A24D',
    borderColor: '#E6D5B8',
    borderWidth: 1,
    borderRadius: 12,
    headerBackground: 'transparent',
    headerTextColor: '#3E2A1F',
    shadowIntensity: 'light',
    // Header defaults
    headerHeight: 36,
    headerFontSize: 12,
    contentTextScale: 1,
    titleAlign: 'left',
    titleMaxWidth: undefined,
    // Auto-scale enabled by default
    autoScale: true,
    // Astrologer defaults
    planetDisplayMode: 'name',
    planetFontSize: 14,
    planetFontWeight: '600',
    // showDegrees: undefined by default - will be determined by chart type (D1 shows degrees, others don't)
    degreeFormat: 'short',
    degreeFontSize: 9,
    showHouseNumbers: true,
    showGridLines: true,
    gridLineColor: '#D4C4A8',
    gridLineWidth: 2,
    showRetrogradeIndicator: true,
    retrogradeStyle: 'R',
    showAspects: false,
    aspectColor: '#9C7A2F',
    fontFamily: 'default',
    planetSpacing: 'normal',
    labelDensity: 'normal',
    // Table defaults
    tableStyle: 'comfortable',
    rowHeight: 32,
    cellPadding: 8,
    alternateRowColors: true,
    tableFontSize: 12,
    // Card defaults
    cardStyle: 'elevated',
    contentLayout: 'list',
    // Analysis widget defaults
    showSummaryStats: true,
    highlightSeverity: true,
    expandableSections: true,
    // Compact widget defaults
    showIcon: true,
    compactFontSize: 11,
    // Background style
    backgroundStyle: 'solid',
};

export const PRESET_THEMES: Record<string, WidgetTheme> = {
    default: DEFAULT_WIDGET_THEME,
    vedic: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#FFF8E7',
        headerBackground: 'linear-gradient(135deg, #D4AD5A 0%, #C9A24D 100%)',
        headerTextColor: '#FFFFFF',
        accentColor: '#9C7A2F',
        borderColor: '#D4AD5A',
    },
    dark: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#1A1A2E',
        titleColor: '#E8E8E8',
        textColor: '#B8B8B8',
        headerBackground: '#16213E',
        headerTextColor: '#E8E8E8',
        accentColor: '#E94560',
        borderColor: '#0F3460',
        shadowIntensity: 'medium',
    },
    spiritual: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#F0F4F0',
        headerBackground: 'linear-gradient(135deg, #5B8A5B 0%, #4A704A 100%)',
        headerTextColor: '#FFFFFF',
        accentColor: '#7BA37B',
        borderColor: '#A8C6A8',
    },
    royal: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#FAF5FF',
        headerBackground: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
        headerTextColor: '#FFFFFF',
        accentColor: '#8B5CF6',
        borderColor: '#DDD6FE',
    },
    ocean: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#F0F9FF',
        headerBackground: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
        headerTextColor: '#FFFFFF',
        accentColor: '#38BDF8',
        borderColor: '#BAE6FD',
    },
    sunset: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#FFF7ED',
        headerBackground: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
        headerTextColor: '#FFFFFF',
        accentColor: '#FB923C',
        borderColor: '#FED7AA',
    },
    minimal: {
        ...DEFAULT_WIDGET_THEME,
        backgroundColor: '#FFFFFF',
        headerBackground: '#F9FAFB',
        headerTextColor: '#111827',
        accentColor: '#6B7280',
        borderColor: '#E5E7EB',
        shadowIntensity: 'none',
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SMART DEFAULT DIMENSIONS - Optimized for best first view
// Charts use square aspect ratio like Kundali page for consistency
// ═══════════════════════════════════════════════════════════════════════════════

export const WIDGET_DIMENSION_PRESETS: Record<string, WidgetDimensions> = {
    // Charts - square aspect ratio for optimal chart viewing (matching Kundali page D1: 435px)
    // Default: 470×500 gives comfortable padding while maintaining square chart area
    divisional: { 
        width: 470, height: 500, 
        minWidth: 280, minHeight: 300, 
        maxWidth: 900, maxHeight: 900 
    },
    lagna: { 
        width: 470, height: 500, 
        minWidth: 280, minHeight: 300, 
        maxWidth: 900, maxHeight: 900 
    },
    rare_shodash: { 
        width: 450, height: 480, 
        minWidth: 280, minHeight: 300, 
        maxWidth: 800, maxHeight: 800 
    },
    
    // Tables - wider for data readability with proper min sizes
    ashtakavarga: { 
        width: 580, height: 420, 
        minWidth: 400, minHeight: 300, 
        maxWidth: 1000, maxHeight: 700 
    },
    widget_shodasha: { 
        width: 650, height: 380, 
        minWidth: 500, minHeight: 300, 
        maxWidth: 1200, maxHeight: 600 
    },
    
    // Analysis widgets - balanced proportions for content
    dasha: { 
        width: 800, height: 516, 
        minWidth: 350, minHeight: 400, 
        maxWidth: 1200, maxHeight: 1000 
    },
    widget_shadbala: { 
        width: 520, height: 480, 
        minWidth: 400, minHeight: 350, 
        maxWidth: 900, maxHeight: 800 
    },
    widget_yoga: { 
        width: 500, height: 480, 
        minWidth: 380, minHeight: 350, 
        maxWidth: 900, maxHeight: 800 
    },
    widget_dosha: { 
        width: 500, height: 480, 
        minWidth: 380, minHeight: 350, 
        maxWidth: 900, maxHeight: 800 
    },
    
    // Others - optimized for their specific content
    widget_transit: { 
        width: 480, height: 320, 
        minWidth: 380, minHeight: 250, 
        maxWidth: 900, maxHeight: 600 
    },
    widget_remedy: { 
        width: 520, height: 450, 
        minWidth: 400, minHeight: 350, 
        maxWidth: 900, maxHeight: 800 
    },
    widget_pushkara: { 
        width: 480, height: 380, 
        minWidth: 380, minHeight: 300, 
        maxWidth: 900, maxHeight: 700 
    },
    widget_karaka: { 
        width: 400, height: 380, 
        minWidth: 320, minHeight: 300, 
        maxWidth: 800, maxHeight: 700 
    },
    widget_chakra: { 
        width: 480, height: 480, 
        minWidth: 380, minHeight: 380, 
        maxWidth: 900, maxHeight: 900 
    },
    kp_module: { 
        width: 480, height: 420, 
        minWidth: 380, minHeight: 320, 
        maxWidth: 900, maxHeight: 800 
    },
};

export interface CustomizeChartItem {
    id: string;
    name: string;
    description: string;
    category: string;
    size?: WidgetSize;
    lahiriOnly?: boolean;
    requiredSystem?: string;
    defaultDimensions?: WidgetDimensions;
    defaultTheme?: Partial<WidgetTheme>;
}

export interface ChartInstance {
    instanceId: string;
    id: string;
    size: WidgetSize;
    collapsed: boolean;
    ayanamsa?: string;
    
    // FREE FORM - Pixel dimensions
    dimensions: WidgetDimensions;
    theme: WidgetTheme;
    customTitle?: string;
    showHeader: boolean;
    showBorder: boolean;
    
    // Position for free-form layout
    position?: { x: number; y: number };
}

export interface SelectedItemDetail extends CustomizeChartItem {
    instanceId: string;
    size: WidgetSize;
    collapsed: boolean;
    ayanamsa?: string;
    dimensions: WidgetDimensions;
    theme: WidgetTheme;
    customTitle?: string;
    showHeader: boolean;
    showBorder: boolean;
    position?: { x: number; y: number };
}

interface CustomizeChartsState {
    selectedItems: ChartInstance[];
    isLoading: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE & CATALOG
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY_V4 = 'grahvani_customize_layout_v4'; // Free form version

export const CHART_CATALOG: CustomizeChartItem[] = [
    // Divisional Charts
    { id: 'D1', name: 'D1 - Rashi', description: 'The fundamental physical existence', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D2', name: 'D2 - Hora', description: 'Wealth and prosperity', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D3', name: 'D3 - Drekkana', description: 'Siblings and courage', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D4', name: 'D4 - Chaturthamsha', description: 'Fortune and fixed assets', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D7', name: 'D7 - Saptamsha', description: 'Progeny and creative fruits', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D9', name: 'D9 - Navamsha', description: 'The internal fruit and marriage', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D10', name: 'D10 - Dashamsha', description: 'Career and public achievements', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D12', name: 'D12 - Dwadashamsha', description: 'Parents and ancestry', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D16', name: 'D16 - Shodashamsha', description: 'Vehicles and comforts', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D20', name: 'D20 - Vimshamsha', description: 'Spiritual progress and devotion', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D24', name: 'D24 - Chaturvimshamsha', description: 'Learning and knowledge', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D27', name: 'D27 - Bhamsha', description: 'General strength and vitality', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D30', name: 'D30 - Trimshamsha', description: 'Evils and misfortunes', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D40', name: 'D40 - Khavedamsha', description: 'Auspicious/Inauspicious effects', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D45', name: 'D45 - Akshavedamsha', description: 'General character and fruits', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },
    { id: 'D60', name: 'D60 - Shashtiamsha', description: 'Past karma and detailed results', category: 'divisional', defaultDimensions: WIDGET_DIMENSION_PRESETS.divisional },

    // Rare Shodash Varga
    { id: 'd2_iyer', name: 'D2 Iyer', description: 'Wealth - Iyer variation', category: 'rare_shodash', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.rare_shodash },
    { id: 'd2_somanatha', name: 'D2 Somanatha', description: 'Wealth - Somanatha method', category: 'rare_shodash', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.rare_shodash },
    { id: 'd9_somanatha', name: 'D9 Somanatha', description: 'Spouse - Somanatha method', category: 'rare_shodash', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.rare_shodash },

    // Lagna Charts
    { id: 'moon_chart', name: 'Chandra Lagna', description: 'Moon ascendant chart', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'sun_chart', name: 'Surya Lagna', description: 'Sun ascendant chart', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'arudha_lagna', name: 'Arudha Lagna', description: 'Perception and illusion', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'bhava_lagna', name: 'Bhava Lagna', description: 'Relative strength analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'hora_lagna', name: 'Hora Lagna', description: 'Prosperity analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'karkamsha_d1', name: 'Karkamsha D1', description: 'Life purpose analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'karkamsha_d9', name: 'Karkamsha D9', description: 'Inner nature analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'upapada_lagna', name: 'Upapada Lagna', description: 'Marriage and partnerships', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'swamsha', name: 'Swamsha', description: 'Navamsha lagna chart', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'pada_chart', name: 'Pada Chart', description: 'Arudha pada analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'sripathi_bhava', name: 'Sripathi bhava', description: 'House analysis (Sripathi)', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'kp_bhava_lagna', name: 'KP bhava', description: 'Stellar system (KP Bhava)', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'equal_bhava', name: 'Equal bhava', description: 'Equal house division', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'gati_kalagna', name: 'Gati kalagna', description: 'GL chart analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'mandi_chart', name: 'Mandi', description: 'Karmic obstacles analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },
    { id: 'gulika_chart', name: 'Gulika', description: 'Instant karma analysis', category: 'lagna', defaultDimensions: WIDGET_DIMENSION_PRESETS.lagna },

    // Dasha Systems
    { id: 'vimshottari', name: 'Vimshottari Dasha', description: 'Universal Moon-nakshatra based dasha (120 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'tribhagi', name: 'Tribhagi Dasha', description: 'One-third portions of Vimshottari periods (40 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'ashtottari', name: 'Ashtottari Dasha', description: 'For specific lagna conditions (108 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'shodashottari', name: 'Shodashottari Dasha', description: 'Venus in 9th + Lagna in hora of Venus (116 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'dwadashottari', name: 'Dwadashottari Dasha', description: 'Venus in Lagna + Moon in Venusian nakshatra (112 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'panchottari', name: 'Panchottari Dasha', description: 'Cancer Lagna with Dhanishtha nakshatra (105 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'chaturshitisama', name: 'Chaturshitisama Dasha', description: '10th lord posited in 10th house (84 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'satabdika', name: 'Satabdika Dasha', description: 'Lagna in Vargottama position (100 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'dwisaptati', name: 'Dwisaptati Sama', description: 'Lagna lord in 7th or 7th lord in Lagna (72 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'shastihayani', name: 'Shastihayani Dasha', description: 'Sun posited in the Lagna (60 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'shattrimshatsama', name: 'Shattrimshatsama Dasha', description: 'Born in daytime with Moon in Lagna (36 years)', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },
    { id: 'chara', name: 'Chara Dasha (Jaimini)', description: 'Sign-based Jaimini dasha system', category: 'dasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.dasha },

    // Ashtakavarga Types
    { id: 'ashtakavarga_sarva', name: 'Sarvashtakavarga', description: 'Combined strength points of all planets (SAV)', category: 'ashtakavarga', defaultDimensions: WIDGET_DIMENSION_PRESETS.ashtakavarga },
    { id: 'ashtakavarga_bhinna', name: 'Bhinna Ashtakavarga', description: 'Individual planetary strength points (BAV)', category: 'ashtakavarga', defaultDimensions: WIDGET_DIMENSION_PRESETS.ashtakavarga },
    { id: 'widget_shodasha_varga', name: 'Shodashvarga Summary', description: 'Planetary dignities across 16 divisional charts', category: 'widget_shodasha', defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_shodasha },

    // LAHIRI WIDGETS
    { id: 'widget_shadbala', name: 'Shadbala Analysis', description: 'Six-fold planetary strength with Ishta/Kashta phala', category: 'widget_shadbala', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_shadbala },
    { id: 'widget_pushkara', name: 'Pushkara Navamsha', description: 'Auspicious Navamsha divisions and Pushkara Bhaga', category: 'widget_pushkara', lahiriOnly: true, defaultDimensions: { ...DEFAULT_DIMENSIONS, width: 450, height: 300 } },
    { id: 'widget_karaka', name: 'Chara Karakas', description: 'Variable significators based on planetary degrees', category: 'widget_karaka', lahiriOnly: true, defaultDimensions: { ...DEFAULT_DIMENSIONS, width: 350, height: 300 } },
    { id: 'widget_chakra', name: 'Sudarshan Chakra', description: 'Tri-layer radial chart (Surya, Chandra, Lagna)', category: 'widget_chakra', defaultDimensions: { ...DEFAULT_DIMENSIONS, width: 400, height: 400 } },
    { id: 'widget_yoga', name: 'Yoga Analysis', description: 'Benefic and challenging planetary combinations', category: 'widget_yoga', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_yoga },
    { id: 'widget_dosha', name: 'Dosha Analysis', description: 'Karmic debts and planetary afflictions', category: 'widget_dosha', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_dosha },
    { id: 'widget_transit', name: 'Daily Transit', description: 'Live planetary movements and Gochar analysis', category: 'widget_transit', defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_transit },
    { id: 'widget_remedy_gemstone', name: 'Gemstone Prescription', description: 'Planetary gemstone recommendations', category: 'widget_remedy', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_remedy },
    { id: 'widget_remedy_mantra', name: 'Mantra Sadhana', description: 'Sacred syllables for planetary propitiation', category: 'widget_remedy', lahiriOnly: true, defaultDimensions: WIDGET_DIMENSION_PRESETS.widget_remedy },

    // KP SYSTEM MODULES
    { id: 'kp_planets', name: 'Planets', description: 'Planetary positions with stellar star and sub lords', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_cusps', name: 'Cuspal Chart', description: 'Visual chart displaying the 12 house cusps', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: { ...DEFAULT_DIMENSIONS, width: 400, height: 400 } },
    { id: 'kp_house_significations', name: 'House Significations', description: 'Thematic significations of houses in KP system', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_planetary_significators', name: 'Planetary Significators', description: 'Mapping of planets to the houses they signify', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_bhava_details', name: 'Bhava Details', description: 'Technical bhava analysis including signs and sub-lords', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_interlinks', name: 'Interlinks', description: 'Planetary interlink analysis and connection chains', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_advanced_ssl', name: 'Advanced SSL', description: 'Advanced SSL connection analysis and strength', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_nakshatra_nadi', name: 'Nakshatra Nadi', description: 'Detailed Nadi coordinates for planets and houses', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.kp_module },
    { id: 'kp_fortuna', name: 'Pars Fortuna', description: 'Part of Fortune calculation for success points', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: { ...DEFAULT_DIMENSIONS, width: 250, height: 200 } },
    { id: 'kp_ruling_planets', name: 'Ruling Planets', description: 'Real-time strong planets for the current moment', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: { ...DEFAULT_DIMENSIONS, width: 250, height: 200 } },
    { id: 'kp_ashtakavarga', name: 'Ashtakavarga (KP)', description: 'Ashtakavarga calculation within the KP system', category: 'kp_module', requiredSystem: 'kp', defaultDimensions: WIDGET_DIMENSION_PRESETS.ashtakavarga },
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function generateInstanceId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export function useCustomizeCharts() {
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();
    const isLahiri = activeSystem === 'lahiri';

    const [state, setState] = useState<CustomizeChartsState>({
        selectedItems: [],
        isLoading: true,
    });

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY_V4);
        if (stored) {
            try {
                const items = JSON.parse(stored) as ChartInstance[];
                if (Array.isArray(items)) {
                    setState({ selectedItems: items, isLoading: false });
                    return;
                }
            } catch { /* ignore */ }
        }
        setState({ selectedItems: [], isLoading: false });
    }, []);

    const saveToStorage = useCallback((items: ChartInstance[]) => {
        localStorage.setItem(STORAGE_KEY_V4, JSON.stringify(items));
    }, []);

    // ═══════════════════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

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
        setState(prev => {
            const catalog = CHART_CATALOG.find(c => c.id === chartId);
            const baseDimensions = catalog?.defaultDimensions || DEFAULT_DIMENSIONS;
            
            const newItem: ChartInstance = {
                instanceId: generateInstanceId(),
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
            const newItems = [...prev.selectedItems, newItem];
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [activeSystem, saveToStorage]);

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
                ...source,
                instanceId: generateInstanceId(),
                collapsed: false,
                customTitle: source.customTitle ? `${source.customTitle} (Copy)` : undefined,
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

    const updateChartAyanamsa = useCallback((instanceId: string, ayanamsa: string) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, ayanamsa } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    // ═══════════════════════════════════════════════════════════════════════════
    // FREE FORM DIMENSION ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    const updateDimensions = useCallback((instanceId: string, dimensions: Partial<WidgetDimensions>) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId 
                    ? { ...i, dimensions: { ...i.dimensions, ...dimensions } } 
                    : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const resizeByDelta = useCallback((instanceId: string, deltaWidth: number, deltaHeight: number) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i => {
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
            });
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    // ═══════════════════════════════════════════════════════════════════════════
    // THEME ACTIONS
    // ═══════════════════════════════════════════════════════════════════════════

    const updateTheme = useCallback((instanceId: string, theme: Partial<WidgetTheme>) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, theme: { ...i.theme, ...theme } } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const applyThemePreset = useCallback((instanceId: string, presetName: string) => {
        const preset = PRESET_THEMES[presetName];
        if (!preset) return;
        
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, theme: { ...preset } } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const updateCustomTitle = useCallback((instanceId: string, customTitle: string | undefined) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, customTitle } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const toggleHeader = useCallback((instanceId: string) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, showHeader: !i.showHeader } : i
            );
            saveToStorage(newItems);
            return { ...prev, selectedItems: newItems };
        });
    }, [saveToStorage]);

    const toggleBorder = useCallback((instanceId: string) => {
        setState(prev => {
            const newItems = prev.selectedItems.map(i =>
                i.instanceId === instanceId ? { ...i, showBorder: !i.showBorder } : i
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

    // ═══════════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ═══════════════════════════════════════════════════════════════════════════

    const availableCharts = useMemo(() => {
        if (isLahiri) return CHART_CATALOG;
        return CHART_CATALOG.filter(chart =>
            chart.category !== 'rare_shodash' && !chart.lahiriOnly
        );
    }, [isLahiri]);

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
    }, [state.selectedItems, activeSystem]);

    return {
        selectedItems: state.selectedItems,
        selectedChartDetails,
        isLoading: state.isLoading,
        availableCharts,
        addChart,
        removeChart,
        duplicateChart,
        setItemSize,
        toggleCollapse,
        reorderItems,
        resetToDefaults,
        isLahiri,
        updateChartAyanamsa,
        
        // Free form actions
        updateDimensions,
        resizeByDelta,
        
        // Theme actions
        updateTheme,
        applyThemePreset,
        updateCustomTitle,
        toggleHeader,
        toggleBorder,
        
        // Constants
        PRESET_THEMES,
        DEFAULT_WIDGET_THEME,
        DEFAULT_DIMENSIONS,
        CHART_CATALOG,
    };
}

export default useCustomizeCharts;
