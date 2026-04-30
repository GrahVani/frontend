'use client';

import React, { useMemo, memo } from 'react';
import { Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { KnowledgeTooltip } from '@/components/knowledge';
import { normalizeYogaData } from './utils/normalizer';
import { YogaSectionRenderer } from './YogaSectionRenderer';


interface YogaModalProps {
    clientId: string;
    yogaType: string;
    ayanamsa?: string;
    className?: string;
    onClose?: () => void;
}

/**
 * YogaModal — reads yoga data from processedCharts (database cache).
 */
export const YogaModal = memo(function YogaModal({
    clientId,
    yogaType,
    ayanamsa = 'lahiri',
    className,
    onClose,
}: YogaModalProps) {
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Get yoga data from processedCharts
    const { rawData, loading, error } = useMemo(() => {
        // Fix: Use the specific yogaType rather than 'yoga_all' which doesn't exist
        // in processedCharts. The backend stores them as yoga_<type> 
        // which maps to yoga_<type>_<ayanamsa> in processedCharts.
        const yogaKey = `yoga_${yogaType.toLowerCase()}_${ayanamsa.toLowerCase()}`;
        const chart = processedCharts[yogaKey];
        
        if (!chart) {
            return {
                rawData: null,
                loading: isLoadingCharts,
                error: isLoadingCharts ? null : 'Yoga data not available'
            };
        }

        const data = chart.chartData?.data || chart.chartData;
        return {
            rawData: data,
            loading: false,
            error: null
        };
    }, [processedCharts, ayanamsa, isLoadingCharts, yogaType]);

    // Normalize data — memoized to avoid re-processing on every render
    const normalized = useMemo(() => {
        if (!rawData) return null;
        return normalizeYogaData(rawData, yogaType);
    }, [rawData, yogaType]);

    // â”€â”€â”€ Loading State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-amber-50/40 rounded-2xl border border-amber-200/60" role="status" aria-label="Loading yoga analysis" aria-busy="true">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin mb-3" aria-hidden="true" />
                <p className="text-[12px] font-serif text-amber-700/55 italic">Analyzing celestial alignments...</p>
            </div>
        );
    }

    // â”€â”€â”€ Error State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (error || !normalized) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center" role="alert">
                    <Info className="w-6 h-6 text-amber-500 mx-auto mb-2" aria-hidden="true" />
                    <h3 className="text-amber-900 font-bold font-serif text-[14px]"><KnowledgeTooltip term="yoga_system" unstyled>Yoga</KnowledgeTooltip> Detail Pending</h3>
                    <p className="text-[10px] text-amber-600">
                        {error || 'Detailed analysis not currently available for this client'}
                    </p>
                </div>
            </div>
        );
    }

    // â”€â”€â”€ Yoga Not Present â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (normalized.header && !normalized.header.isPresent) {
        return (
            <div className={cn('space-y-4 p-4', className)}>
                {/* Still render section renderer â€” it will show header (with "Inactive" badge),
            meta, description, planets, etc. even for absent yogas */}
                <YogaSectionRenderer data={normalized} />
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300', className)}>
            <YogaSectionRenderer data={normalized} />
        </div>
    );
});

