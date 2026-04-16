"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { YogaModal } from '@/components/astrology/yoga-modal/index';
import { ActiveDoshasLayout } from '@/components/astrology/dosha-modal/index';
import { YogaItem, DoshaItem } from '@/types/yoga-ui.types';
import {
    Sparkles,
    AlertTriangle,
    Star,
    Shield,
    Zap,
    ArrowLeft,
    Sun,
    Moon,
    Flame
} from 'lucide-react';
import ActiveYogasLayout from '@/components/astrology/yoga-dosha/ActiveYogasLayout';
import Link from 'next/link';
import { useDasha } from '@/hooks/queries/useCalculations';
import { parseChartData } from '@/lib/chart-helpers';
import { findActiveDashaPath, RawDashaPeriod } from '@/lib/dasha-utils';
import { useMemo } from 'react';

// ============================================================================
// Yoga & Dosha Type Definitions (Lahiri-Exclusive Features)
// ============================================================================


const YOGA_TYPES: YogaItem[] = [
    // Benefic Yogas
    { id: 'gaja_kesari', name: 'Gaja kesari', sanskrit: 'गजकेसरी', description: 'Jupiter in Kendra from Moon — brings wisdom, fortune & fame', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'guru_mangal', name: 'Guru mangal', sanskrit: 'गुरु मंगल', description: 'Jupiter-Mars conjunction — courage with wisdom', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'budha_aditya', name: 'Budha aditya', sanskrit: 'बुधादित्य', description: 'Sun-Mercury conjunction — intelligence & communication', category: 'benefic', icon: <Sun className="w-4 h-4" /> },
    { id: 'chandra_mangal', name: 'Chandra mangal', sanskrit: 'चन्द्र मंगल', description: 'Moon-Mars conjunction — emotional strength & wealth', category: 'benefic', icon: <Moon className="w-4 h-4" /> },
    { id: 'raj_yoga', name: 'Raja yoga', sanskrit: 'राजयोग', description: 'Kendra-Trikona lord conjunction — power & authority', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'pancha_mahapurusha', name: 'Pancha mahapurusha', sanskrit: 'पंच महापुरुष', description: 'Planets in own/exalted sign in Kendra — exceptional personality', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'dhan', name: 'Dhana yoga', sanskrit: 'धनयोग', description: 'Wealth combinations from 2nd, 5th, 9th, 11th lords', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'shubh', name: 'Shubha yoga', sanskrit: 'शुभयोग', description: 'Benefic planetary combinations for auspicious results', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'kalpadruma', name: 'Kalpadruma', sanskrit: 'कल्पद्रुम', description: 'Wish-fulfilling tree yoga — rare prosperity combination', category: 'benefic', icon: <Star className="w-4 h-4" /> },
    { id: 'spiritual', name: 'Spiritual yoga', sanskrit: 'आध्यात्मिक योग', description: 'Combinations indicating spiritual inclination & moksha', category: 'benefic', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'viparitha_raja', name: 'Viparitha raja', sanskrit: 'विपरीत राजयोग', description: 'Dusthana lords in dusthana — adversity creating fortune', category: 'benefic', icon: <Star className="w-4 h-4" /> },

    // Challenging Yogas
    { id: 'daridra', name: 'Daridra yoga', sanskrit: 'दरिद्रयोग', description: 'Poverty combinations — 11th lord in 6th/8th/12th', category: 'challenging', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'malefic', name: 'Malefic yogas', sanskrit: 'पापयोग', description: 'Harmful planetary combinations requiring remedies', category: 'challenging', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'special', name: 'Special yogas', sanskrit: 'विशेषयोग', description: 'Rare and unique planetary combinations', category: 'benefic', icon: <Sparkles className="w-4 h-4" /> },

    // Jaimini Yogas
    { id: 'chara_karakas_raja', name: 'Chara Karakas Raja', sanskrit: 'चर कारक राजयोग', description: 'Raja yoga from Chara Karakas — power through karaka alignments', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'arudha_lagna_raja', name: 'Arudha Lagna Raja', sanskrit: 'आरूढ़ लग्न राजयोग', description: 'Raja yoga from Arudha Lagna — worldly recognition & status', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'swamsa_raja', name: 'Swamsa Raja', sanskrit: 'स्वांश राजयोग', description: 'Raja yoga from Swamsa — soul-level power & authority', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'hora_lagna_dhana', name: 'Hora Lagna Dhana', sanskrit: 'होरा लग्न धन', description: 'Wealth yoga from Hora Lagna — financial prosperity indicators', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'jaimini_wealth', name: 'Jaimini Wealth', sanskrit: 'जैमिनी धन', description: 'Navamsha-based wealth indication from Jaimini system', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'karakamsa_arishta', name: 'Karakamsa Arishta', sanskrit: 'कारकांश अरिष्ट', description: 'Health afflictions from Karakamsa — disease & suffering indicators', category: 'jaimini', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'jaimini_maraka', name: 'Jaimini Maraka', sanskrit: 'जैमिनी मारक', description: 'Maraka (death-inflicting) yoga from Jaimini system', category: 'jaimini', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'arista_sutra', name: 'Arista Sutra', sanskrit: 'अरिष्ट सूत्र', description: 'Special Arista Sutra health & longevity combinations', category: 'jaimini', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'jaimini_gajakesari', name: 'Jaimini Gajakesari', sanskrit: 'जैमिनी गजकेसरी', description: 'Advanced Gajakesari yoga through Jaimini karakas', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'amala', name: 'Amala Yoga', sanskrit: 'अमला योग', description: 'Yoga of purity — benefic in 10th from Lagna/Moon', category: 'jaimini', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'parvata', name: 'Parvata Yoga', sanskrit: 'पर्वत योग', description: 'Mountain yoga — fame, fortune & leadership qualities', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'kahala', name: 'Kahala Yoga', sanskrit: 'कहल योग', description: 'Yoga of strength — bold, courageous & commanding', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'vasumati', name: 'Vasumati Yoga', sanskrit: 'वसुमती योग', description: 'Yoga of wealth — benefics in upachaya houses from Moon', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'kartari', name: 'Kartari Yoga', sanskrit: 'कर्तरी योग', description: 'Shubha Kartari — benefic hemming of key houses', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'jaimini_combination', name: 'Jaimini Combination', sanskrit: 'जैमिनी संयोजन', description: 'Combined Jaimini yoga patterns for comprehensive analysis', category: 'jaimini', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'jaimini_argala', name: 'Jaimini Argala', sanskrit: 'जैमिनी अर्गला', description: 'Argala (planetary intervention) analysis from Jaimini', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'jaimini_argala_position', name: 'Argala Position', sanskrit: 'अर्गला स्थिति', description: 'Positional argala — house-wise intervention effects', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'virodha_argala', name: 'Virodha Argala', sanskrit: 'विरोध अर्गला', description: 'Counter-intervention — planets obstructing argala effects', category: 'jaimini', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'relationship_upapada', name: 'Upapada Yogas', sanskrit: 'उपपद योग', description: 'Relationship yoga from Upapada Lagna — marriage & partnerships', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'jaimini_navamsa', name: 'Jaimini Navamsa', sanskrit: 'जैमिनी नवांश', description: 'Navamsha relationship indicators from Jaimini system', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'karakamsa_spiritual', name: 'Karakamsa Spiritual', sanskrit: 'कारकांश आध्यात्मिक', description: 'Spiritual indications from Karakamsa position', category: 'jaimini', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'jaimini_spiritual', name: 'Jaimini Spiritual', sanskrit: 'जैमिनी आध्यात्मिक', description: 'Spiritual combination yogas from Jaimini system', category: 'jaimini', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'bk_yogas', name: 'Bhratrukaraka Yogas', sanskrit: 'भ्रातृकारक योग', description: 'Yogas from Bhratrukaraka — sibling & courage indications', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'jaimini_mk', name: 'Matrukaraka Yogas', sanskrit: 'मातृकारक योग', description: 'Yogas from Matrukaraka — mother, property & happiness', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'putrakaraka', name: 'Putrakaraka Yogas', sanskrit: 'पुत्रकारक योग', description: 'Yogas from Putrakaraka — children, creativity & intelligence', category: 'jaimini', icon: <Star className="w-4 h-4" /> },
    { id: 'gk_yogas', name: 'Gnatikaraka Yogas', sanskrit: 'ग्नातिकारक योग', description: 'Yogas from Gnatikaraka — obstacles, disease & enemies', category: 'jaimini', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'jaimini_other', name: 'Jaimini Other', sanskrit: 'जैमिनी अन्य', description: 'Miscellaneous Jaimini yoga combinations', category: 'jaimini', icon: <Star className="w-4 h-4" /> },

    // Tajika Yogas
    { id: 'duphali_kutta', name: 'Duphali Kutta', sanskrit: 'दुफली कुट्ट', description: 'Tajika yoga indicating sudden events & transformations', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'iqabala', name: 'Iqabala Yoga', sanskrit: 'इक़बाल योग', description: 'Yoga of fortune — planetary dignity in solar return', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'induvara', name: 'Induvara Yoga', sanskrit: 'इन्दुवार योग', description: 'Moon-based Tajika yoga — emotional & mental strength', category: 'tajika', icon: <Moon className="w-4 h-4" /> },
    { id: 'ithasala', name: 'Ithasala Yoga', sanskrit: 'इत्थशाल योग', description: 'Applying aspect yoga — events materializing in the year', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'esharpha', name: 'Esharpha Yoga', sanskrit: 'ईशराफ योग', description: 'Separating aspect — opportunities slipping away', category: 'tajika', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'nakata', name: 'Nakata Yoga', sanskrit: 'नकत योग', description: 'Transfer of light — indirect planetary connections', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'yamaya', name: 'Yamaya Yoga', sanskrit: 'यमया योग', description: 'Yoga of restraint — blocked desires & delayed results', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'manau', name: 'Manau Yoga', sanskrit: 'मनाउ योग', description: 'Yoga of prevention — obstacles in the annual chart', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'kamboola', name: 'Kamboola Yoga', sanskrit: 'कंबूल योग', description: 'Reception yoga — mutual planetary support in Varshaphal', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'gairi_kamboola', name: 'Gairi Kamboola', sanskrit: 'गैरी कंबूल', description: 'Non-mutual reception — one-sided planetary support', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'khallasara', name: 'Khallasara Yoga', sanskrit: 'खल्लासर योग', description: 'Void of course — lack of aspects blocking fruition', category: 'tajika', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'radda', name: 'Radda Yoga', sanskrit: 'रद्द योग', description: 'Refusal yoga — cancellation of promised results', category: 'tajika', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'dutthotta_daivira', name: 'Dutthotta Daivira', sanskrit: 'दुत्थोत्थ दैविर', description: 'Rise after fall — recovery & reformation yoga', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'tambira', name: 'Tambira Yoga', sanskrit: 'तम्बीर योग', description: 'Tajika yoga of gradual improvement & subtle gains', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
    { id: 'kuttha', name: 'Kuttha Yoga', sanskrit: 'कुत्थ योग', description: 'Tajika yoga of confrontation & power struggles', category: 'tajika', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'durupha', name: 'Durupha Yoga', sanskrit: 'दुरुफ योग', description: 'Tajika yoga of slow & persistent planetary influence', category: 'tajika', icon: <Flame className="w-4 h-4" /> },
];

const DOSHA_TYPES: DoshaItem[] = [
    // Karmic / Ancestral
    { id: 'kala_sarpa', name: 'Kala sarpa dosha', sanskrit: 'कालसर्प दोष', description: 'All planets hemmed between Rahu-Ketu axis — karmic restrictions', severity: 'high', category: 'karmic', icon: <Flame className="w-4 h-4" /> },
    { id: 'shrapit', name: 'Shrapit dosha', sanskrit: 'श्रापित दोष', description: 'Saturn-Rahu conjunction — past-life curse patterns', severity: 'high', category: 'karmic', icon: <Shield className="w-4 h-4" /> },
    { id: 'pitra', name: 'Pitra dosha', sanskrit: 'पितृ दोष', description: 'Sun-Rahu/Saturn affliction — ancestral karmic debt', severity: 'medium', category: 'karmic', icon: <Sun className="w-4 h-4" /> },
    { id: 'guru_chandal', name: 'Guru chandal dosha', sanskrit: 'गुरु चण्डाल दोष', description: 'Jupiter-Rahu conjunction — misguided wisdom', severity: 'medium', category: 'karmic', icon: <AlertTriangle className="w-4 h-4" /> },

    // Planetary Afflictions
    { id: 'angarak', name: 'Angarak dosha', sanskrit: 'अंगारक दोष', description: 'Mars-Rahu conjunction — anger, accidents & disputes', severity: 'high', category: 'planetary', icon: <Zap className="w-4 h-4" /> },

    // Periodic / Transits
    { id: 'sade_sati', name: 'Sade sati', sanskrit: 'साढ़े साती', description: "Saturn's 7.5 year transit over natal Moon — karmic tests", severity: 'medium', category: 'transit', icon: <Moon className="w-4 h-4" /> },
    { id: 'dhaiya', name: 'Sani dhaiya', sanskrit: 'ढैया', description: "Saturn's 2.5 year transit over 4th/8th house — mental pressure", severity: 'medium', category: 'transit', icon: <Moon className="w-4 h-4" /> },
];

type MainTab = 'yogas' | 'doshas';
type YogaCategory = 'all' | 'benefic' | 'challenging' | 'jaimini' | 'tajika';

// Main Page Component
// ============================================================================
export default function YogaDoshaPage() {
    const { clientDetails, processedCharts, isRefreshingCharts, isGeneratingCharts, isLoadingCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [mainTab, setMainTab] = useState<MainTab>('yogas');
    const [yogaCategory, setYogaCategory] = useState<YogaCategory>('all');

    const activeAyanamsa = ayanamsa.toLowerCase();
    const clientId = clientDetails?.id || '';

    // 1. Fetch D1 Chart Data
    const d1Data = useMemo(() => {
        const key = `D1_${activeAyanamsa}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [processedCharts, activeAyanamsa]);

    // 2. Extract Active Yogas from processedCharts
    const activeYogas = useMemo(() => {
        // Priority map for "Senior Astrologer" view
        const YOGA_PRIORITY: Record<string, number> = {
            'gaja_kesari': 100,
            'hamsa': 95,
            'malavya': 95,
            'bhadra': 95,
            'ruchi': 95,
            'sasa': 95,
            'pancha_mahapurusha': 90,
            'lakshmi': 85,
            'saraswati': 85,
            'raj_yoga': 80,
            'neecha_bhanga': 75,
            'adhi_yoga': 70,
            'dhan_yoga': 65,
            'viparitha_raja': 60,
            'chandra_mangal': 55,
            'budha_aditya': 50
        };

        const list = Object.values(processedCharts)
            .filter((c: { chartType?: string }) => c.chartType?.startsWith('yoga_'))
            .map((c: { chartType?: string; id?: string; metadata?: { benefit?: string; description?: string } }) => {
                const subType = (c.chartType || '').replace('yoga_', '');
                const label = subType.split('_').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

                // Try to get a benefit/description from the chart metadata if available
                const benefit = c.metadata?.benefit || (subType.includes('kesari') ? 'Wisdom & Fame' : 'Celestial Influence');
                const description = c.metadata?.description || `A powerful alignment centered around ${label}.`;

                return {
                    id: c.id || subType,
                    name: label,
                    benefit,
                    description,
                    type: subType,
                    priority: YOGA_PRIORITY[subType] || 0
                };
            });

        // Sort by priority (highest first)
        return list.sort((a, b) => b.priority - a.priority);
    }, [processedCharts]);

    // 3. Fetch Dasha Data
    const { data: dashaResponse, isLoading: dashaLoading } = useDasha(
        clientId,
        'mahadasha',
        activeAyanamsa
    );

    // 4. Calculate Current Dasha Progress
    const dashaProgress = useMemo(() => {
        if (!dashaResponse) return { planet: 'Loading...', subPlanet: '...', percentage: 0 };
        const activePath = findActiveDashaPath(dashaResponse as unknown as RawDashaPeriod);
        const nodes = activePath.nodes;
        const currentPlanet = nodes.length > 0 ? nodes[0].planet : 'Unknown';
        const currentSubPlanet = nodes.length > 1 ? nodes[1].planet : '...';

        return {
            planet: currentPlanet,
            subPlanet: currentSubPlanet,
            percentage: activePath.progress
        };
    }, [dashaResponse]);

    // Filter yogas by category
    const filteredYogas = yogaCategory === 'all'
        ? YOGA_TYPES
        : YOGA_TYPES.filter(y => y.category === yogaCategory);

    // System check — Yoga/Dosha is Lahiri-exclusive
    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Sparkles className="w-12 h-12 text-ink mb-4" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "mb-2")}>Yoga & dosha — Lahiri only</h2>
                <p className={cn(TYPOGRAPHY.value, "max-w-md")}>
                    Yoga and Dosha analysis is currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                    Please switch to Lahiri from the header dropdown to access these features.
                </p>
            </div>
        );
    }

    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pt-4">
            {/* Header: Title + Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px] font-bold")}>Yoga & dosha analysis</h1>
                </div>

                {/* Main Tabs: Yogas / Doshas */}
                <div className="flex gap-1.5 p-1 prem-card rounded-full shadow-sm w-full md:w-auto">
                    <button
                        onClick={() => setMainTab('yogas')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap",
                            TYPOGRAPHY.value,
                            "!text-[12px] !font-bold !mt-0",
                            mainTab === 'yogas'
                                ? cn(COLORS.wbActiveTab, "shadow-md")
                                : "text-ink/55 hover:text-ink hover:bg-white/50"
                        )}
                    >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Yogas ({activeYogas.length})</span>
                    </button>
                    <button
                        onClick={() => setMainTab('doshas')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-full transition-all whitespace-nowrap",
                            TYPOGRAPHY.value,
                            "!text-[12px] !font-bold !mt-0",
                            mainTab === 'doshas'
                                ? cn(COLORS.wbActiveTab, "shadow-md")
                                : "text-ink/55 hover:text-ink hover:bg-white/50"
                        )}
                    >
                        <Shield className="w-3.5 h-3.5 shrink-0" />
                        <span>Doshas ({DOSHA_TYPES.length})</span>
                    </button>
                </div>
            </div>

            {/* ═══════════════ YOGAS TAB ═══════════════ */}
            {mainTab === 'yogas' && (
                <div className="-mx-4 -mb-4">
                    {isLoadingCharts || isGeneratingCharts ? (
                        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white/50 rounded-2xl m-4 border border-gold-primary/20 border-dashed animate-pulse">
                            <Sparkles className="w-6 h-6 text-gold-primary mb-3 animate-spin" />
                            <p className={cn(TYPOGRAPHY.subValue, "italic")}>Synthesizing client dashboard...</p>
                        </div>
                    ) : (
                        <ActiveYogasLayout
                            clientId={clientId}
                            planets={d1Data.planets}
                            ascendantSign={d1Data.ascendant}
                            activeYogas={activeYogas}
                            allYogas={YOGA_TYPES}
                            currentDasha={dashaProgress}
                            ayanamsa={activeAyanamsa}
                            className="bg-transparent"
                        />
                    )}
                </div>
            )}

            {/* ═══════════════ DOSHAS TAB ═══════════════ */}
            {mainTab === 'doshas' && (
                <div className="-mx-4 -mb-4">
                    <ActiveDoshasLayout
                        clientId={clientId}
                        planets={d1Data.planets}
                        ascendantSign={d1Data.ascendant}
                        allDoshas={DOSHA_TYPES}
                        ayanamsa={activeAyanamsa}
                        className="bg-transparent"
                    />
                </div>
            )}
        </div>
    );
}
