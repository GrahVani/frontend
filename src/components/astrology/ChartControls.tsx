"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Eye, Settings } from 'lucide-react';
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import GoldenButton from "@/components/GoldenButton";
import { useAstrologerStore, type Ayanamsa } from "@/store/useAstrologerStore";
import { ChevronDown, Info } from 'lucide-react';
import { clientApi, CHART_METADATA } from '@/lib/api';
import { KnowledgeTooltip } from '@/components/knowledge';


export default function ChartControls() {
    const router = useRouter();
    const { ayanamsa, chartStyle, recentClientIds, setAyanamsa } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };

    const updateAyanamsa = (newAyanamsa: string) => {
        setAyanamsa(newAyanamsa as Ayanamsa);
        // Redirect to Kundali (Overview) page if system changed
        router.push('/vedic-astrology/overview');
    };

    const [showAdvanced, setShowAdvanced] = React.useState(false);

    // Get dynamic chart options based on selected Ayanamsa system
    const systemCapabilities = clientApi.getSystemCapabilities(settings.ayanamsa);
    const availableDivisionalCharts = systemCapabilities.charts.divisional;

    // Build chart options from available charts
    const chartOptions = availableDivisionalCharts.map(chartType => ({
        value: chartType,
        label: `${CHART_METADATA[chartType]?.name || chartType} (${chartType})`
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gold-primary/15 pb-2">
                <h3 className="font-serif text-gold-dark text-[14px] font-bold uppercase tracking-widest">
                    Chart Configuration
                </h3>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-active-glow/20 rounded-full border border-active-glow/30">
                    <span className="text-[10px] text-gold-dark font-serif font-bold uppercase tracking-tighter">{settings.ayanamsa}</span>
                </div>
            </div>

            {/* Ayanamsa Info / Toggle */}
            <div className="bg-surface-warm-light border border-gold-primary/15 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gold-primary/15 flex items-center justify-center">
                        <Info className="w-4 h-4 text-gold-dark" />
                    </div>
                    <div>
                        <p className="text-[9px] text-ink/45 uppercase tracking-widest font-bold">Current <KnowledgeTooltip term="ayanamsa_system" unstyled>Ayanamsa</KnowledgeTooltip></p>
                        <p className="text-[12px] font-serif text-ink font-bold">{settings.ayanamsa} (Default)</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-[10px] text-gold-dark font-bold uppercase hover:underline"
                >
                    {showAdvanced ? "Hide" : "Change"}
                </button>
            </div>

            {/* Advanced Settings (Hidden by default) */}
            {showAdvanced && (
                <div className="bg-surface-warm border border-gold-primary/20 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
                    <ParchmentSelect
                        label="Override Ayanamsa"
                        defaultValue={settings.ayanamsa.toLowerCase()}
                        onChange={(e) => updateAyanamsa(e.target.value)}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        options={[
                            { value: 'Lahiri', label: 'Lahiri (Chitrapaksha)' },
                            { value: 'Raman', label: 'Raman' },
                            { value: 'KP', label: 'KP' },
                            { value: 'Yukteswar', label: 'Sri Yukteswar' },
                            { value: 'Bhasin', label: 'Bhasin' },
                        ]}
                    />
                    <p className="text-[9px] text-gold-dark/60 mt-2 italic">* This updates your global astrologer preferences.</p>

                    {/* System capability info */}
                    <div className="mt-3 p-2 bg-surface-warm-light rounded-lg text-[9px] text-ink/45">
                        <span className="font-bold uppercase">Available Features:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                            {systemCapabilities.hasDivisional && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Divisional</span>}
                            {systemCapabilities.hasAshtakavarga && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded"><KnowledgeTooltip term="ashtakavarga_system" unstyled>Ashtakavarga</KnowledgeTooltip></span>}
                            {systemCapabilities.hasNumerology && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Numerology</span>}
                            {systemCapabilities.hasHorary && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Horary</span>}
                            {!systemCapabilities.hasDivisional && <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded">D1 Only</span>}
                        </div>
                    </div>
                </div>
            )}

            {/* Divisional Charts Select - Now Dynamic based on Ayanamsa */}
            <div>
                <ParchmentSelect
                    label="Divisional Chart"
                    defaultValue="D1"
                    options={chartOptions}
                />
                {!systemCapabilities.hasDivisional && (
                    <p className="text-[9px] text-orange-600 mt-1 italic">
                        Note: {settings.ayanamsa} system only supports D1 (Rashi) chart.
                    </p>
                )}
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-gold-primary rounded bg-surface-warm group-hover:bg-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold-dark" />
                    </div>
                    <span className="text-[14px] font-serif text-ink">Show Degrees</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-gold-primary rounded bg-surface-warm group-hover:bg-white flex items-center justify-center">
                        {/* Unchecked */}
                    </div>
                    <span className="text-[14px] font-serif text-ink/45">Show Arudhas</span>
                </label>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-gold-primary/15 flex justify-center">
                <GoldenButton
                    topText="Generate"
                    bottomText="Chart"
                    className="w-full max-w-[220px]"
                />
            </div>

        </div>
    );
}


