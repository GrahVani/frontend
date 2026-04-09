'use client';

import React, { useMemo, memo } from 'react';
import { Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { normalizeDoshaData } from './utils/dosha-normalizer';
import { KnowledgeTooltip } from '@/components/knowledge';
import { DoshaSectionRenderer } from '@/components/astrology/dosha-modal/DoshaSectionRenderer';


interface DoshaModalProps {
    clientId: string;
    doshaType: string;
    ayanamsa?: string;
    className?: string;
}

/**
 * DoshaModal — reads dosha data from processedCharts (database cache).
 */
export const DoshaModal = memo(function DoshaModal({
    clientId,
    doshaType,
    ayanamsa = 'lahiri',
    className,
}: DoshaModalProps) {
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Get dosha data from processedCharts
    const { rawData, loading, error } = useMemo(() => {
        const doshaKey = `dosha_all_${ayanamsa.toLowerCase()}`;
        const chart = processedCharts[doshaKey];
        
        if (!chart) {
            return {
                rawData: null,
                loading: isLoadingCharts,
                error: isLoadingCharts ? null : 'Dosha data not available'
            };
        }

        const data = chart.chartData?.data || chart.chartData;
        return {
            rawData: data,
            loading: false,
            error: null
        };
    }, [processedCharts, ayanamsa, isLoadingCharts]);

    const normalized = useMemo(() => {
        if (!rawData) return null;
        return normalizeDoshaData(rawData);
    }, [rawData]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-surface-warm/30 rounded-2xl border border-gold-primary/15" role="status" aria-label="Loading dosha analysis" aria-busy="true">
                <Loader2 className="w-6 h-6 text-red-500 animate-spin mb-3" aria-hidden="true" />
                <p className="text-[12px] font-serif text-ink/55 italic">Mapping karmic patterns...</p>
            </div>
        );
    }

    if (error || !normalized) {
        return (
            <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center" role="alert">
                    <Info className="w-6 h-6 text-red-500 mx-auto mb-2" aria-hidden="true" />
                    <h3 className="text-red-900 font-bold font-serif text-[14px]"><KnowledgeTooltip term="dosha_system" unstyled>Dosha</KnowledgeTooltip> Analysis Pending</h3>
                    <p className="text-[10px] text-red-600">
                        {error || 'Detailed analysis not currently available for this client'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4 p-4 animate-in fade-in slide-in-from-bottom-2 duration-300', className)}>
            <DoshaSectionRenderer data={normalized} />
        </div>
    );
});

