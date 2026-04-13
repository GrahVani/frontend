"use client";

import { useMemo } from 'react';
import type { WidgetDimensions } from './useCustomizeCharts';

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-SCALE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface AutoScaleConfig {
    /** Base width to calculate scale from (default dimensions) */
    baseWidth: number;
    /** Base height to calculate scale from (default dimensions) */
    baseHeight: number;
    /** Minimum scale factor (prevents text from becoming too small) */
    minScale: number;
    /** Maximum scale factor (prevents text from becoming too large) */
    maxScale: number;
    /** Width influence on scale (0-1). 0.5 = equal weight to width and height */
    widthWeight: number;
    /** Whether to use geometric mean (true) or linear average (false) */
    useGeometricMean: boolean;
    /** Smoothing factor for scale transitions (0-1, higher = more responsive) */
    responsiveness: number;
    /** 
     * Scaling strategy:
     * - 'geometric': Balanced scaling using geometric mean (default)
     * - 'fit': Ensures content fits within BOTH dimensions (minimal scale)
     * - 'cover': Ensures content fills AT LEAST ONE dimension (maximum scale)
     */
    mode?: 'geometric' | 'fit' | 'cover';
}

export const DEFAULT_AUTO_SCALE_CONFIG: AutoScaleConfig = {
    baseWidth: 470,
    baseHeight: 500,
    minScale: 0.75,
    maxScale: 1.4,
    widthWeight: 0.5,
    useGeometricMean: true,
    responsiveness: 1,
    mode: 'geometric',
};

// Pre-configured base dimensions for different widget categories
export const WIDGET_BASE_DIMENSIONS: Record<string, { width: number; height: number }> = {
    // Charts - square aspect ratio
    divisional: { width: 470, height: 500 },
    lagna: { width: 470, height: 500 },
    rare_shodash: { width: 450, height: 480 },
    
    // Tables - wider for data
    ashtakavarga: { width: 580, height: 420 },
    widget_shodasha: { width: 650, height: 380 },
    
    // Analysis widgets
    dasha: { width: 450, height: 380 }, // Lowered height to match 9-row content, triggering larger font scales
    widget_shadbala: { width: 520, height: 480 },
    widget_yoga: { width: 500, height: 480 },
    widget_dosha: { width: 500, height: 480 },
    
    // Others
    widget_transit: { width: 480, height: 320 },
    widget_remedy: { width: 520, height: 450 },
    widget_pushkara: { width: 480, height: 380 },
    widget_karaka: { width: 400, height: 380 },
    widget_chakra: { width: 480, height: 480 },
    kp_module: { width: 480, height: 420 },
};

// Category-specific scale limits (some widgets need different constraints)
export const CATEGORY_SCALE_LIMITS: Record<string, { min: number; max: number }> = {
    // Charts can scale more for readability
    divisional: { min: 0.7, max: 1.5 },
    lagna: { min: 0.7, max: 1.5 },
    rare_shodash: { min: 0.7, max: 1.5 },
    
    // Tables need careful scaling to maintain readability
    ashtakavarga: { min: 0.75, max: 1.35 },
    widget_shodasha: { min: 0.75, max: 1.35 },
    
    // Analysis widgets
    dasha: { min: 0.75, max: 2.0 }, // Increased max scale for 'cover' mode
    widget_shadbala: { min: 0.75, max: 1.4 },
    widget_yoga: { min: 0.75, max: 1.4 },
    widget_dosha: { min: 0.75, max: 1.4 },
    
    // Others
    widget_transit: { min: 0.8, max: 1.3 },
    widget_remedy: { min: 0.75, max: 1.4 },
    widget_pushkara: { min: 0.75, max: 1.4 },
    widget_karaka: { min: 0.75, max: 1.4 },
    widget_chakra: { min: 0.7, max: 1.5 },
    kp_module: { min: 0.75, max: 1.4 },
};

export interface AutoScaleResult {
    /** Calculated scale factor */
    scale: number;
    /** CSS variable string for injection */
    cssVariable: string;
    /** Font size multiplier for inline styles */
    fontSizeMultiplier: number;
    /** Whether scaling is active */
    isScaled: boolean;
    /** Scale percentage for display */
    scalePercentage: number;
    /** CSS zoom value for container */
    zoom: number;
    /** The actual mode used */
    mode: 'geometric' | 'fit' | 'cover';
}

/**
 * Calculate auto-scale factor based on widget dimensions
 * Uses geometric mean or min/max strategies for adaptive layout
 */
export function calculateAutoScale(
    current: { width: number; height: number },
    category: string = 'divisional',
    userConfig?: Partial<AutoScaleConfig>
): AutoScaleResult {
    // Get base dimensions for category
    const baseDims = WIDGET_BASE_DIMENSIONS[category] || WIDGET_BASE_DIMENSIONS.divisional;
    
    // Get category-specific limits or defaults
    const limits = CATEGORY_SCALE_LIMITS[category] || { min: 0.75, max: 1.4 };
    
    // Merge config
    const config: AutoScaleConfig = {
        ...DEFAULT_AUTO_SCALE_CONFIG,
        baseWidth: baseDims.width,
        baseHeight: baseDims.height,
        minScale: limits.min,
        maxScale: limits.max,
        ...userConfig,
    };

    // Calculate dimension ratios
    const widthRatio = current.width / config.baseWidth;
    const heightRatio = current.height / config.baseHeight;

    // Calculate composite scale based on mode
    let scale: number;
    const mode = config.mode || 'geometric';

    if (mode === 'fit') {
        // Essential for charts: ensure everything is visible
        scale = Math.min(widthRatio, heightRatio);
    } else if (mode === 'cover') {
        // Essential for lists: fill the space and remove white gaps by increasing font size
        scale = Math.max(widthRatio, heightRatio);
    } else {
        // Default Balanced 'geometric' mean
        if (config.useGeometricMean) {
            scale = Math.sqrt(widthRatio * heightRatio);
        } else {
            const heightWeight = 1 - config.widthWeight;
            scale = (widthRatio * config.widthWeight) + (heightRatio * heightWeight);
        }
    }

    // Clamp to limits
    const clampedScale = Math.max(config.minScale, Math.min(config.maxScale, scale));

    return {
        scale: clampedScale,
        cssVariable: `--widget-scale: ${clampedScale};`,
        fontSizeMultiplier: clampedScale,
        isScaled: clampedScale !== 1,
        scalePercentage: Math.round(clampedScale * 100),
        zoom: clampedScale,
        mode,
    };
}

/**
 * Hook for reactive auto-scale calculation
 */
export function useWidgetAutoScale(
    dimensions: WidgetDimensions,
    category: string,
    enabled: boolean = true,
    userConfig?: Partial<AutoScaleConfig>
): AutoScaleResult {
    return useMemo(() => {
        if (!enabled) {
            return {
                scale: 1,
                cssVariable: '--widget-scale: 1;',
                fontSizeMultiplier: 1,
                isScaled: false,
                scalePercentage: 100,
                zoom: 1,
                mode: 'geometric'
            };
        }
        return calculateAutoScale(
            { width: dimensions.width, height: dimensions.height },
            category,
            userConfig
        );
    }, [dimensions.width, dimensions.height, category, enabled, userConfig]);
}

/**
 * Generate CSS custom properties for widget scaling
 * These can be applied to the widget container and used by all children
 */
export function generateScaleCSSVariables(result: AutoScaleResult): React.CSSProperties {
    return {
        '--widget-scale': result.scale,
        '--widget-font-size-base': '14px',
        '--widget-font-size-xs': `calc(10px * ${result.scale})`,
        '--widget-font-size-sm': `calc(12px * ${result.scale})`,
        '--widget-font-size-md': `calc(14px * ${result.scale})`,
        '--widget-font-size-lg': `calc(16px * ${result.scale})`,
        '--widget-font-size-xl': `calc(20px * ${result.scale})`,
        '--widget-line-height': `calc(1.5 * ${Math.min(result.scale, 1.2)})`, // Cap line-height growth
        '--widget-spacing-xs': `calc(4px * ${result.scale})`,
        '--widget-spacing-sm': `calc(8px * ${result.scale})`,
        '--widget-spacing-md': `calc(16px * ${result.scale})`,
        '--widget-spacing-lg': `calc(24px * ${result.scale})`,
    } as React.CSSProperties;
}

/**
 * Get widget font size style based on scale
 * Utility for components that need direct font-size application
 */
export function getScaledFontSize(
    baseSize: number,
    scaleResult: AutoScaleResult,
    unit: 'px' | 'rem' | 'em' = 'px'
): string {
    const scaled = baseSize * scaleResult.fontSizeMultiplier;
    if (unit === 'rem') return `${scaled / 16}rem`;
    if (unit === 'em') return `${scaled}em`;
    return `${scaled}px`;
}

export default useWidgetAutoScale;
