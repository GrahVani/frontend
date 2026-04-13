"use client";

import { useCallback, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT-AWARE DIMENSION SYSTEM
// Dynamic width/height based on content type for optimal visualization
// All widgets support FREE RESIZE - no aspect ratio locking
// ═══════════════════════════════════════════════════════════════════════════════

export type ContentCategory = 
  | 'chart'           // Square divisional charts (D1-D60)
  | 'table_wide'      // Wide data tables (Ashtakavarga, Shodasha)
  | 'table_tall'      // Tall scrollable lists (Dasha)
  | 'circular'        // Circular visualizations (Sudarshan Chakra)
  | 'analysis_card'   // Mixed content (Yoga, Dosha, Shadbala)
  | 'data_grid'       // Grid/matrix data (KP tables)
  | 'compact_card';   // Small info cards (Ruling Planets, Fortuna)

export interface ContentProfile {
  category: ContentCategory;
  defaultSize: { width: number; height: number };
  aspectRatio: number;        // width/height (informational only)
  minSize: { width: number; height: number };
  maxSize: { width: number; height: number };
  recommendedRatio: number;   // Suggested ratio (not enforced)
  scalingBehavior: 'uniform' | 'stretch' | 'scroll';
  description: string;        // User-facing description
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT PROFILES - Define default dimensions for each content type
// NOTE: All profiles have free resize - no aspect ratio enforcement
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTENT_PROFILES: Record<ContentCategory, ContentProfile> = {
  // CHARTS: Square-ish default, but user can resize freely
  chart: {
    category: 'chart',
    defaultSize: { width: 470, height: 500 },
    aspectRatio: 0.94,
    minSize: { width: 280, height: 300 },
    maxSize: { width: 900, height: 900 },
    recommendedRatio: 0.94,
    scalingBehavior: 'stretch', // Charts stretch to fill container
    description: 'Square format recommended for accurate planetary representation',
  },
  
  // WIDE TABLES: 16:9 default for data readability
  table_wide: {
    category: 'table_wide',
    defaultSize: { width: 650, height: 380 },
    aspectRatio: 1.71,
    minSize: { width: 500, height: 300 },
    maxSize: { width: 1200, height: 600 },
    recommendedRatio: 1.71,
    scalingBehavior: 'scroll',
    description: 'Wide format for tabular data visibility',
  },
  
  // TALL TABLES: Portrait default for list-heavy content
  table_tall: {
    category: 'table_tall',
    defaultSize: { width: 450, height: 520 },
    aspectRatio: 0.87,
    minSize: { width: 350, height: 400 },
    maxSize: { width: 800, height: 900 },
    recommendedRatio: 0.87,
    scalingBehavior: 'scroll',
    description: 'Tall format for scrollable lists',
  },
  
  // CIRCULAR: Square default for radial symmetry
  circular: {
    category: 'circular',
    defaultSize: { width: 480, height: 480 },
    aspectRatio: 1,
    minSize: { width: 380, height: 380 },
    maxSize: { width: 900, height: 900 },
    recommendedRatio: 1,
    scalingBehavior: 'stretch',
    description: 'Square recommended for circular symmetry',
  },
  
  // ANALYSIS CARDS: Balanced default
  analysis_card: {
    category: 'analysis_card',
    defaultSize: { width: 500, height: 480 },
    aspectRatio: 1.04,
    minSize: { width: 380, height: 350 },
    maxSize: { width: 900, height: 800 },
    recommendedRatio: 1.04,
    scalingBehavior: 'stretch',
    description: 'Balanced format for mixed content',
  },
  
  // DATA GRIDS: Spreadsheet-like wide default
  data_grid: {
    category: 'data_grid',
    defaultSize: { width: 580, height: 420 },
    aspectRatio: 1.38,
    minSize: { width: 400, height: 320 },
    maxSize: { width: 1000, height: 700 },
    recommendedRatio: 1.38,
    scalingBehavior: 'scroll',
    description: 'Grid format for matrix data',
  },
  
  // COMPACT CARDS: Small default
  compact_card: {
    category: 'compact_card',
    defaultSize: { width: 280, height: 220 },
    aspectRatio: 1.27,
    minSize: { width: 200, height: 180 },
    maxSize: { width: 400, height: 350 },
    recommendedRatio: 1.27,
    scalingBehavior: 'stretch',
    description: 'Compact format for quick info',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET TO CONTENT PROFILE MAPPING
// ═══════════════════════════════════════════════════════════════════════════════

export const WIDGET_CONTENT_PROFILES: Record<string, ContentCategory> = {
  // Divisional Charts - Square default
  'D1': 'chart', 'D2': 'chart', 'D3': 'chart', 'D4': 'chart',
  'D7': 'chart', 'D9': 'chart', 'D10': 'chart', 'D12': 'chart',
  'D16': 'chart', 'D20': 'chart', 'D24': 'chart', 'D27': 'chart',
  'D30': 'chart', 'D40': 'chart', 'D45': 'chart', 'D60': 'chart',
  
  // Rare Shodash
  'd2_iyer': 'chart',
  'd2_somanatha': 'chart',
  'd9_somanatha': 'chart',
  
  // Lagna Charts
  'moon_chart': 'chart',
  'sun_chart': 'chart',
  'arudha_lagna': 'chart',
  'bhava_lagna': 'chart',
  'hora_lagna': 'chart',
  'karkamsha_d1': 'chart',
  'karkamsha_d9': 'chart',
  'upapada_lagna': 'chart',
  'swamsha': 'chart',
  'pada_chart': 'chart',
  'sripathi_bhava': 'chart',
  'kp_bhava_lagna': 'chart',
  'equal_bhava': 'chart',
  'gati_kalagna': 'chart',
  'mandi_chart': 'chart',
  'gulika_chart': 'chart',
  
  // Dasha - Tall default
  'vimshottari': 'table_tall',
  'tribhagi': 'table_tall',
  'ashtottari': 'table_tall',
  'shodashottari': 'table_tall',
  'dwadashottari': 'table_tall',
  'panchottari': 'table_tall',
  'chaturshitisama': 'table_tall',
  'satabdika': 'table_tall',
  'dwisaptati': 'table_tall',
  'shastihayani': 'table_tall',
  'shattrimshatsama': 'table_tall',
  'chara': 'table_tall',
  
  // Ashtakavarga - Wide default
  'ashtakavarga_sarva': 'table_wide',
  'ashtakavarga_bhinna': 'table_wide',
  
  // Shodasha - Wide default
  'widget_shodasha_varga': 'table_wide',
  
  // Chakra - Square default
  'widget_chakra': 'circular',
  
  // Analysis widgets
  'widget_shadbala': 'analysis_card',
  'widget_pushkara': 'analysis_card',
  'widget_karaka': 'data_grid',
  'widget_yoga': 'analysis_card',
  'widget_dosha': 'analysis_card',
  'widget_transit': 'table_tall',
  'widget_remedy_gemstone': 'analysis_card',
  'widget_remedy_mantra': 'analysis_card',
  
  // KP Modules
  'kp_planets': 'data_grid',
  'kp_cusps': 'chart',
  'kp_house_significations': 'data_grid',
  'kp_planetary_significators': 'data_grid',
  'kp_bhava_details': 'data_grid',
  'kp_interlinks': 'data_grid',
  'kp_advanced_ssl': 'data_grid',
  'kp_nakshatra_nadi': 'data_grid',
  'kp_fortuna': 'compact_card',
  'kp_ruling_planets': 'compact_card',
  'kp_ashtakavarga': 'table_wide',
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIMENSION CALCULATION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export interface CalculatedDimensions {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  aspectRatio: number;
  contentCategory: ContentCategory;
  scalingBehavior: 'uniform' | 'stretch' | 'scroll';
}

/**
 * Get content profile for a widget ID
 */
export function getContentProfile(widgetId: string): ContentProfile {
  const category = WIDGET_CONTENT_PROFILES[widgetId] || 'analysis_card';
  return CONTENT_PROFILES[category];
}

/**
 * Calculate dimensions for a widget based on its content profile
 */
export function calculateDimensions(
  widgetId: string,
  overrides?: Partial<{ width: number; height: number }>
): CalculatedDimensions {
  const profile = getContentProfile(widgetId);
  
  const width = overrides?.width ?? profile.defaultSize.width;
  const height = overrides?.height ?? profile.defaultSize.height;
  
  return {
    width,
    height,
    minWidth: profile.minSize.width,
    minHeight: profile.minSize.height,
    maxWidth: profile.maxSize.width,
    maxHeight: profile.maxSize.height,
    aspectRatio: profile.aspectRatio,
    contentCategory: profile.category,
    scalingBehavior: profile.scalingBehavior,
  };
}

/**
 * Constrain dimensions to profile limits
 */
export function constrainDimensions(
  width: number,
  height: number,
  profile: ContentProfile
): { width: number; height: number } {
  return {
    width: Math.max(profile.minSize.width, Math.min(profile.maxSize.width, width)),
    height: Math.max(profile.minSize.height, Math.min(profile.maxSize.height, height)),
  };
}

/**
 * Get resize step size based on content category
 */
export function getResizeStep(category: ContentCategory): number {
  // Uniform 10px step for all - free resize
  return 10;
}

/**
 * Get content type display info for UI
 */
export function getContentTypeInfo(category: ContentCategory): {
  label: string;
  icon: string;
  description: string;
  recommendedFor: string[];
  defaultSize: string;
} {
  const info: Record<ContentCategory, {
    label: string;
    icon: string;
    description: string;
    recommendedFor: string[];
    defaultSize: string;
  }> = {
    chart: {
      label: 'Chart View',
      icon: 'LayoutGrid',
      description: 'Recommended square format for planetary charts',
      recommendedFor: ['Divisional Charts', 'Lagna Charts', 'KP Cusps'],
      defaultSize: '470×500px',
    },
    table_wide: {
      label: 'Wide Table',
      icon: 'Table2',
      description: 'Recommended wide format for data tables',
      recommendedFor: ['Ashtakavarga', 'Shodasha Varga', 'KP Ashtakavarga'],
      defaultSize: '650×380px',
    },
    table_tall: {
      label: 'List View',
      icon: 'List',
      description: 'Recommended tall format for scrollable lists',
      recommendedFor: ['Dasha Systems', 'Daily Transits'],
      defaultSize: '450×520px',
    },
    circular: {
      label: 'Circular',
      icon: 'Circle',
      description: 'Recommended square format for radial symmetry',
      recommendedFor: ['Sudarshan Chakra'],
      defaultSize: '480×480px',
    },
    analysis_card: {
      label: 'Analysis Card',
      icon: 'FileText',
      description: 'Balanced format for mixed content',
      recommendedFor: ['Yoga Analysis', 'Dosha Analysis', 'Shadbala', 'Pushkara'],
      defaultSize: '500×480px',
    },
    data_grid: {
      label: 'Data Grid',
      icon: 'Grid3x3',
      description: 'Grid format for matrix data',
      recommendedFor: ['KP Planets', 'House Significations', 'Significators'],
      defaultSize: '580×420px',
    },
    compact_card: {
      label: 'Compact Card',
      icon: 'CreditCard',
      description: 'Compact format for quick info',
      recommendedFor: ['Ruling Planets', 'Pars Fortuna'],
      defaultSize: '280×220px',
    },
  };
  
  return info[category];
}

/**
 * Get recommended size presets for a content category
 */
export function getRecommendedPresets(category: ContentCategory): Array<{
  name: string;
  width: number;
  height: number;
  icon: string;
  desc: string;
}> {
  const presets = {
    chart: [
      { name: 'Compact', width: 320, height: 340, icon: 'S', desc: 'Space saving' },
      { name: 'Standard', width: 470, height: 500, icon: 'M', desc: 'Default view' },
      { name: 'Large', width: 620, height: 660, icon: 'L', desc: 'Detailed view' },
    ],
    circular: [
      { name: 'Compact', width: 380, height: 380, icon: 'S', desc: 'Space saving' },
      { name: 'Standard', width: 480, height: 480, icon: 'M', desc: 'Default view' },
      { name: 'Large', width: 600, height: 600, icon: 'L', desc: 'Detailed view' },
    ],
    table_wide: [
      { name: 'Compact', width: 500, height: 320, icon: 'S', desc: 'Space saving' },
      { name: 'Wide', width: 650, height: 380, icon: 'W', desc: 'Table view' },
      { name: 'Large', width: 800, height: 450, icon: 'L', desc: 'Full data' },
    ],
    table_tall: [
      { name: 'Compact', width: 350, height: 420, icon: 'S', desc: 'Space saving' },
      { name: 'Tall', width: 450, height: 520, icon: 'T', desc: 'List view' },
      { name: 'Large', width: 550, height: 650, icon: 'L', desc: 'Full view' },
    ],
    analysis_card: [
      { name: 'Compact', width: 380, height: 360, icon: 'S', desc: 'Space saving' },
      { name: 'Standard', width: 500, height: 480, icon: 'M', desc: 'Default view' },
      { name: 'Large', width: 650, height: 620, icon: 'L', desc: 'Detailed view' },
    ],
    data_grid: [
      { name: 'Compact', width: 400, height: 340, icon: 'S', desc: 'Space saving' },
      { name: 'Standard', width: 580, height: 420, icon: 'M', desc: 'Default view' },
      { name: 'Wide', width: 720, height: 480, icon: 'W', desc: 'Full grid' },
    ],
    compact_card: [
      { name: 'Small', width: 200, height: 180, icon: 'XS', desc: 'Minimal' },
      { name: 'Standard', width: 280, height: 220, icon: 'M', desc: 'Default view' },
      { name: 'Large', width: 350, height: 280, icon: 'L', desc: 'Expanded' },
    ],
  };
  
  return presets[category] || presets.analysis_card;
}

// ═══════════════════════════════════════════════════════════════════════════════
// REACT HOOK
// ═══════════════════════════════════════════════════════════════════════════════

export interface UseContentAwareDimensionsReturn {
  profile: ContentProfile;
  dimensions: CalculatedDimensions;
  constrain: (width: number, height: number) => { width: number; height: number };
  resizeStep: number;
  contentInfo: ReturnType<typeof getContentTypeInfo>;
  recommendedPresets: ReturnType<typeof getRecommendedPresets>;
}

export function useContentAwareDimensions(
  widgetId: string,
  currentDimensions?: { width: number; height: number }
): UseContentAwareDimensionsReturn {
  const profile = useMemo(() => getContentProfile(widgetId), [widgetId]);
  
  const dimensions = useMemo(() => 
    calculateDimensions(widgetId, currentDimensions),
    [widgetId, currentDimensions]
  );
  
  const constrain = useCallback((
    width: number,
    height: number
  ) => constrainDimensions(width, height, profile), [profile]);
  
  const resizeStep = useMemo(() => getResizeStep(profile.category), [profile]);
  
  const contentInfo = useMemo(() => getContentTypeInfo(profile.category), [profile]);
  
  const recommendedPresets = useMemo(() => 
    getRecommendedPresets(profile.category), [profile]
  );
  
  return {
    profile,
    dimensions,
    constrain,
    resizeStep,
    contentInfo,
    recommendedPresets,
  };
}

export default useContentAwareDimensions;
