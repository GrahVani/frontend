/**
 * Yoga Data Normalizer
 *
 * Pure function that transforms ANY backend yoga JSON
 * into the consistent NormalizedYogaData shape.
 *
 * Handles 6 known shapes:
 *  1. gaja_kesari  → comprehensive_*_analysis
 *  2. guru_mangal full → *_yoga_comprehensive
 *  3. guru_mangal slim → *_yoga_analysis
 *  4. budha-aditya → *_yoga_analysis + conditions + mathematical
 *  5. chandra-mangal → traditional_permutation_combination_analysis
 *  6. raj-yoga → raj_yogas with multi-yoga array
 *
 * Also handles:
 *  - Double-nested data.data unwrapping
 *  - Varying planet formats (all_planetary_positions, planetary_positions, *_details)
 *  - Varying ascendant formats (object, string, inside birth_details)
 *  - Varying notes keys (calculation_notes, notes)
 *  - house_lords map
 */

import type {
    RawYogaResponse,
    NormalizedYogaData,
    NormalizedHeader,
    NormalizedMeta,
    NormalizedDescription,
    NormalizedEffects,
    NormalizedStrength,
    NormalizedCombination,
    NormalizedConditions,
    NormalizedRemedyCategory,
    NormalizedTiming,
    NormalizedTechnical,
    NormalizedHouse,
    NormalizedDoshaSeverity,
    PlanetPosition,
    AscendantInfo,
    YogaAnalysisCore,
    CancellationFactor,
    RajYogasData,
    RajYogaEntry,
    HouseSign,
} from '@/types/yoga.types';

// ─── Local Interfaces for Polymorphic API Fields ────────────────────
// The Astro Engine returns different JSON shapes per yoga type. These small
// interfaces type the dynamic fields accessed via index signatures on
// YogaAnalysisCore and RawYogaResponse (both have [key: string]: unknown).

/** Fields found on shubh/kala-sarpa/kalpadruma analysis cores */
interface YogaAnalysisExtended {
    overall_assessment?: { total_yogas_found?: number; [key: string]: unknown };
    overall_category?: string;
    overall_strength?: number;
    strength_percentage?: number;
    final_assessment?: {
        yoga_classification?: string;
        strength?: string;
        cancellation_score?: number;
        recommendation?: string;
        [key: string]: unknown;
    };
    yoga_analysis?: KalpadrumaCondition[];
    rule_by_rule_analysis?: Record<string, RuleByRuleEntry>;
}

/** Kalpadruma-style yoga_analysis array element */
interface KalpadrumaCondition {
    planet: string;
    role: string;
    sign: string;
    house: number;
    in_exaltation?: boolean;
    in_kendra?: boolean;
    in_trikona?: boolean;
    condition_met: boolean;
}

/** Kala-sarpa rule_by_rule_analysis entry */
interface RuleByRuleEntry {
    description?: string;
    yoga_present?: boolean;
    [key: string]: unknown;
}

/** Top-level fields on RawYogaResponse accessed via index signature */
interface RawYogaExtended {
    yoga_strength?: string;
    base_strength_score?: number;
    malefic_penalty?: number;
    comprehensive_effects?: {
        specific_effects?: string[];
        overall_prediction?: string;
        [key: string]: unknown;
    };
    timing_analysis?: {
        best_periods?: string;
        activation_transits?: string;
        peak_effects?: string;
        remedial_timing?: string;
        [key: string]: unknown;
    };
    remedial_suggestions?: string[] | Record<string, string[]>;
    spiritual_recommendations?: string[];
    cancellation_factors?: CancellationFactor[];
    overall_severity?: string;
    severity_description?: string;
    financial_outlook?: string;
}

/** Birth location sub-object when birth.location is an object */
interface BirthLocationObject {
    latitude?: number;
    longitude?: number;
    timezone_offset?: number;
}

/** House sign entry with optional lord (chart_foundations shape) */
interface HouseSignWithLord extends HouseSign {
    lord?: string;
}

// ─── Key Detection Helpers ─────────────────────────────────────────

/** Patterns that match known yoga analysis keys */
const YOGA_ANALYSIS_PATTERNS = [
    /^comprehensive_.*_analysis$/,
    /^.*_yoga_comprehensive$/,
    /^.*_yoga_analysis$/,
    /^traditional_.*_analysis$/,
    /^yoga_analysis$/,
    /^special_yogas$/,
    /^spiritual_prosperity_analysis$/,
    /^shubh_.*_analysis$/,
    /^kalpadruma_yoga$/,
    /^kala_sarpa_analysis$/,
    /^.*_yogas$/,
];

/** Pattern for raj_yogas key */
const RAJ_YOGAS_KEY = 'raj_yogas';

const PLANET_DETAIL_PATTERN = /^(.+)_details$/;

const KNOWN_TOP_LEVEL_KEYS = new Set([
    'user_name',
    'ascendant',
    'ascendant_sign',
    'birth_details',
    'all_planetary_positions',
    'planetary_positions',
    'house_signs',
    'house_lords',
    'calculation_notes',
    'calculation_details',
    'chart_details',
    'notes',
    'mathematical_framework',
    'remedial_measures',
    'classical_analysis',
    'classical_notes',
    'technical_analysis',
    'wealth_houses_analysis',
    'lordship_analysis',
    'yoga_summary',
    'active_yogas_summary',
    'summary',
    'chart_info',
    'chart_foundations',
    'technical_details',
    'yoga_validation_report',
    'special_yogas',
    'spiritual_prosperity_analysis',
    'shubh_yoga_analysis',
    'kalpadruma_yoga',
    'kala_sarpa_analysis',
    'calculation_info',
    'technical_notes',
    'interpretation_guide',
    'data', // double-wrapped
]);

/**
 * Bridge logic to parse the deeply nested and varied JSON payloads from 
 * the new 43 Jaimini and Tajika endpoints into a structurally consistent state.
 */
function analyzeJaiminiTajikaPayload(data: Record<string, unknown>, backupHeaderTitle?: string) {
    let isPresent = false;
    const yogas: Array<{ name: string; result?: string; description?: string; code?: string }> = [];
    let totalCount = 0;
    
    // Check known deeply nested arrays and objects specific to Jaimini/Tajika
    for (const [k, v] of Object.entries(data)) {
        if (Array.isArray(v) && v.length > 0) {
            if (['yogas_triggered', 'yogas_identified', 'detected_arishta_yogas', 'active_tajika_yogas', 'detected_yogas', 'yamaya_yogas_detected', 'manau_yogas_detected', 'yogas', 'jy_085_evaluation'].includes(k)) {
                isPresent = true;
                totalCount += v.length;
                v.forEach(item => {
                    if (typeof item === 'object' && item !== null) {
                        // Bulletproof name extraction
                        let nameVal = item.name || item.yoga || item.axis || 'Yoga detected';
                        if (typeof nameVal === 'object') {
                            nameVal = nameVal.name || nameVal.id || JSON.stringify(nameVal);
                        }
                        
                        let resultVal = item.result || item.description || item.status || item.details;
                        if (typeof resultVal === 'object') {
                            resultVal = JSON.stringify(resultVal);
                        }
                        
                        yogas.push({
                            name: String(nameVal),
                            result: resultVal ? String(resultVal) : undefined,
                            code: item.code ? String(item.code) : undefined
                        });
                    }
                });
            }
        }
        
        if (k === 'yogas' || k === 'special_combinations' || k === 'karmic_marriage_yogas' || k === 'jaimini_bk_yogas') {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
               const keys = Object.keys(v);
               if (keys.length > 0 && (keys[0].startsWith('JY') || keys[0].includes('yoga') || keys[0].includes('induvara') || typeof (v as any)[keys[0]] === 'string' || ((v as any)[keys[0]] && typeof (v as any)[keys[0]] === 'object' && 'yoga' in ((v as any)[keys[0]] as any)))) {
                   isPresent = true;
                   totalCount += keys.length;
                   Object.entries(v).forEach(([code, details]) => {
                       let nameVal = String(code).replace(/_/g, ' ');
                       let resultVal = JSON.stringify(details);
                       
                       if (details && typeof details === 'object' && !Array.isArray(details)) {
                            nameVal = (details as any).yoga || (details as any).name || nameVal;
                            resultVal = (details as any).details || (details as any).description || resultVal;
                       } else if (typeof details === 'string') {
                            resultVal = details;
                       }
                       
                       yogas.push({
                           name: nameVal,
                           result: resultVal,
                           code: String(code)
                       });
                   });
               } else if ('details' in v && Array.isArray((v as any).details)) {
                   // Tajika 'yogas' object with 'details' array and 'total_ithasala'
                   const details = (v as any).details;
                   totalCount += details.length;
                   if (details.length > 0) isPresent = true;
                   details.forEach((item: any) => {
                       yogas.push({
                           name: String(item.status || item.aspect || 'Tajika Aspect'),
                           description: `Faster: ${item.faster_planet || 'N/A'}, Slower: ${item.slower_planet || 'N/A'}, Aspect: ${item.aspect || 'N/A'}`
                       });
                   });
               }
           }
        }
        
        // Custom boolean flags
        if (k === 'kahala_yoga_present' && v === true) isPresent = true;

        // Extract meaningful data from deeply nested Jaimini objects that aren't standard yoga arrays
        // e.g. condition_evaluations: { JY-052: {...}, JY-053: {...} }
        if (!Array.isArray(v) && v && typeof v === 'object' && 
            ['condition_evaluations', 'jaimini_rule_evaluations', 'jaimini_yogas_triggered', 'yoga_checks',
             'amala_yoga_evaluations', 'parvata_yoga_jy064_analysis', 'vasumati_yoga_jy066',
             'jy_065_analysis', 'primary_argala_analysis', 'navamsa_analysis_rules',
             'kamboola_analysis_by_house', 'yoga_analysis', 'evaluation_matrix',
             'iqabala_yoga', 'conditions', 'components', 'tajika_analysis'].includes(k)) {
            const entries = Object.entries(v as Record<string, unknown>);
            if (entries.length > 0) {
                entries.forEach(([subKey, subVal]) => {
                    if (subVal && typeof subVal === 'object' && !Array.isArray(subVal)) {
                        const sv = subVal as Record<string, unknown>;
                        // Check for presence flags inside
                        if (sv.is_present === true || sv.yoga_present === true || sv.result === 'ACTIVE' || sv.result === 'Present') {
                            isPresent = true;
                        }
                        const yogaName = sv.yoga || sv.name || sv.rule_summary || sv.description || subKey;
                        const yogaResult = sv.result || sv.status || sv.details || sv.condition || '';
                        yogas.push({
                            name: String(yogaName).replace(/_/g, ' '),
                            result: typeof yogaResult === 'object' ? JSON.stringify(yogaResult) : String(yogaResult),
                            code: subKey
                        });
                        totalCount++;
                    } else if (typeof subVal === 'string' || typeof subVal === 'boolean' || typeof subVal === 'number') {
                        yogas.push({
                            name: String(subKey).replace(/_/g, ' '),
                            result: String(subVal),
                            code: subKey
                        });
                        totalCount++;
                    }
                });
            }
        }

        // Handle array-type analysis keys like kamboola_analysis_by_house, navamsa_analysis_rules
        if (Array.isArray(v) && v.length > 0 && 
            ['kamboola_analysis_by_house', 'navamsa_analysis_rules', 'spiritual_yogas_triggered',
             'arishta_yogas_identified'].includes(k)) {
            isPresent = true;
            totalCount += v.length;
            v.forEach((item: any) => {
                if (typeof item === 'object' && item !== null) {
                    yogas.push({
                        name: String(item.rule_id || item.yoga || item.name || item.house || k.replace(/_/g, ' ')),
                        result: String(item.result || item.condition || item.details || item.status || ''),
                        code: item.rule_id || item.code
                    });
                } else if (typeof item === 'string') {
                    yogas.push({ name: item, result: 'Detected' });
                }
            });
        }
    }
    
    // Direct recursive boolean indicators — only used to confirm presence, NOT to create fake data
    const checkBooleanPresent = (obj: any, depth = 0): boolean => {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj) || depth > 3) return false;
        for (const [key, val] of Object.entries(obj)) {
            if (typeof val === 'boolean' && val === true) {
                if (key.includes('present') || key === 'is_present' || key === 'yoga_detected' || key === 'amala_yoga_present' || key === 'tambira_yoga_present') {
                    return true;
                }
            }
            if (typeof val === 'object' && val !== null) {
                if (checkBooleanPresent(val, depth + 1)) return true;
            }
        }
        return false;
    };
    
    const booleanDetected = checkBooleanPresent(data);
    if (!isPresent && booleanDetected) {
        isPresent = true;
    }

    // If no structured yogas found, DO NOT create fake combinations out of debug variables.
    // Instead, return an empty array, which disables the combinations block.
    if (yogas.length === 0) {
        return { isPresent, yogas: [], totalCount: 0 };
    }

    if (yogas.length > 0 || isPresent) {
        return { isPresent, yogas, totalCount };
    }
    return null;
}

/**
 * Find the yoga analysis object inside the raw response.
 * Searches known regex patterns, then falls back to raj_yogas,
 * then falls back to any unknown object containing yoga_present.
 */
function extractYogaAnalysis(data: Record<string, unknown>): YogaAnalysisCore | null {
    // 1. Match known regex patterns
    for (const key of Object.keys(data)) {
        if (YOGA_ANALYSIS_PATTERNS.some(pattern => pattern.test(key))) {
            const value = data[key];
            if (value && typeof value === 'object') {
                return value as YogaAnalysisCore;
            }
        }
    }

    // 2. Fallback — scan for any object that looks like a yoga analysis
    for (const key of Object.keys(data)) {
        if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
        if (PLANET_DETAIL_PATTERN.test(key)) continue;
        if (key === RAJ_YOGAS_KEY) continue;
        const value = data[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const obj = value as Record<string, unknown>;
            if (
                'yoga_present' in obj ||
                'overall_yoga_present' in obj ||
                'yoga_formation_analysis' in obj ||
                'total_yogas_found' in obj ||
                'total_count' in obj ||
                'detected_yogas' in obj ||
                'yogas_found' in obj ||
                'yoga_summary' in obj
            ) {
                return obj as YogaAnalysisCore;
            }
        }
    }

    // 3. Fallback for Jaimini / Tajika responses
    const jtState = analyzeJaiminiTajikaPayload(data);
    if (jtState) {
        return {
            yoga_present: jtState.isPresent,
            total_yogas_found: jtState.totalCount,
            detailed_analysis: "Detailed indicators found for special yogas. Review combinations below.",
            yoga_combinations: jtState.yogas.map(y => ({
                type: y.name,
                present: true,
                effects: [
                    y.result ? `Result: ${y.result}` : null,
                    y.description ? `Description: ${y.description}` : null
                ].filter(Boolean)
            }))
        } as unknown as YogaAnalysisCore;
    }

    return null;
}

/**
 * Find the yoga analysis KEY name from the raw response.
 */
function findYogaAnalysisKey(data: Record<string, unknown>): string | null {
    for (const key of Object.keys(data)) {
        if (YOGA_ANALYSIS_PATTERNS.some(pattern => pattern.test(key))) {
            return key;
        }
    }
    // Fallback check
    for (const key of Object.keys(data)) {
        if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
        if (PLANET_DETAIL_PATTERN.test(key)) continue;
        if (key === RAJ_YOGAS_KEY) return key;
        const value = data[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            const obj = value as Record<string, unknown>;
            if (
                'yoga_present' in obj ||
                'overall_yoga_present' in obj ||
                'yoga_formation_analysis' in obj ||
                'total_yogas_found' in obj ||
                'total_count' in obj ||
                'detected_yogas' in obj ||
                'yogas_found' in obj ||
                'yoga_summary' in obj
            ) {
                return key;
            }
        }
    }
    return null;
}

/**
 * Extract yoga type name from the dynamic analysis key.
 * e.g. "comprehensive_gaja_kesari_analysis" → "Gaja Kesari"
 *      "guru_mangal_yoga_comprehensive"     → "Guru Mangal"
 *      "raj_yogas"                          → "Raj"
 *      "traditional_permutation_combination_analysis" → "Chandra Mangal" (fallback)
 */
function extractYogaTypeName(data: Record<string, unknown>): string {
    const key = findYogaAnalysisKey(data);
    if (!key) return 'Yoga Analysis';

    return key
        .replace(/^comprehensive_/, '')
        .replace(/_analysis$/, '')
        .replace(/_yoga_comprehensive$/, '')
        .replace(/_yoga_analysis$/, '')
        .replace(/^traditional_/, '')
        .replace(/_permutation_combination$/, '')
        .replace(/_yogas$/, '')
        .split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

/**
 * Extract planet positions from individual *_details keys.
 */
function extractPlanetDetails(data: Record<string, unknown>): Record<string, PlanetPosition> | null {
    const planets: Record<string, PlanetPosition> = {};
    let found = false;

    for (const key of Object.keys(data)) {
        const match = key.match(PLANET_DETAIL_PATTERN);
        if (match) {
            const value = data[key];
            if (value && typeof value === 'object' && 'sign' in (value as object)) {
                const planetName = match[1].charAt(0).toUpperCase() + match[1].slice(1);
                planets[planetName] = value as PlanetPosition;
                found = true;
            }
        }
    }

    return found ? planets : null;
}

/**
 * Collect unknown keys into the raw passthrough bucket.
 */
function collectUnknownKeys(data: Record<string, unknown>): Record<string, unknown> {
    const raw: Record<string, unknown> = {};
    const analysisKey = findYogaAnalysisKey(data);

    for (const key of Object.keys(data)) {
        if (KNOWN_TOP_LEVEL_KEYS.has(key)) continue;
        if (key === analysisKey) continue;
        if (key === RAJ_YOGAS_KEY) continue;
        if (YOGA_ANALYSIS_PATTERNS.some(pattern => pattern.test(key))) continue;
        if (PLANET_DETAIL_PATTERN.test(key)) continue;
        raw[key] = data[key];
    }

    return raw;
}

// ─── Section Extractors ────────────────────────────────────────────

function extractHeader(data: Record<string, unknown>, analysis: YogaAnalysisCore | null, backupTitle?: string): NormalizedHeader | null {
    let yogaName = extractYogaTypeName(data);
    // If the internal JSON didn't yield a meaningful name, use the dropdown selection name
    if (yogaName === 'Yoga Analysis' && backupTitle) {
        yogaName = backupTitle;
    }

    // yoga_present can live at top-level, nested under yoga_formation_analysis,
    // or be derived from total_yogas_found / total_count > 0
    const ext = analysis as (YogaAnalysisCore & YogaAnalysisExtended) | null;
    const overallAssessment = ext?.overall_assessment;
    const totalYogasFound = (analysis?.total_yogas_found ?? analysis?.total_count ?? overallAssessment?.total_yogas_found) as number | undefined;
    const isPresent = analysis?.yoga_present
        ?? analysis?.overall_yoga_present
        ?? analysis?.yoga_formation_analysis?.yoga_present
        ?? (totalYogasFound !== undefined ? totalYogasFound > 0 : false);

    // Strength label — multiple sources
    const dataExt = data as Record<string, unknown> & RawYogaExtended;
    const strength = analysis?.yoga_strength
        ?? analysis?.strongest_combination?.overall_strength
        ?? ext?.overall_category
        ?? ext?.final_assessment?.yoga_classification
        ?? (typeof dataExt.yoga_strength === 'string' ? dataExt.yoga_strength : undefined);

    // Strength score — multiple sources
    const strengthScore = analysis?.total_strength_score
        ?? analysis?.strongest_combination?.strength_score
        ?? ext?.overall_strength
        ?? (typeof dataExt.base_strength_score === 'number' ? dataExt.base_strength_score : undefined);

    // Raja yoga stats
    const rajYogas = data[RAJ_YOGAS_KEY] as Record<string, unknown> | undefined;
    const rajTotalCount = rajYogas?.total_count as number | undefined;
    const avgStrength = rajYogas?.average_strength as number | undefined;

    // Subtitle — yoga_summary, reason, explanation, or formation_rule
    const subtitle = (analysis?.yoga_summary as string | undefined)
        ?? analysis?.reason
        ?? analysis?.explanation
        ?? (analysis?.yoga_formation_analysis?.formation_rule as string | undefined);

    return {
        title: yogaName,
        subtitle,
        isPresent: rajYogas ? (rajTotalCount ?? 0) > 0 : isPresent,
        strength,
        strengthScore: strengthScore ?? avgStrength,
        overallRating: analysis?.overall_rating as number | undefined,
        totalCount: rajTotalCount ?? totalYogasFound,
    };
}

function extractMeta(data: Record<string, unknown>): NormalizedMeta | null {
    const raw = data as RawYogaResponse;
    const birth = raw.birth_details;
    const notes = raw.calculation_notes ?? raw.notes ?? raw.calculation_details ?? raw.technical_details ?? raw.calculation_info ?? raw.technical_notes;
    const chartDetails = raw.chart_details;
    const chartInfo = raw.chart_info;
    const chartFoundations = raw.chart_foundations;

    // Ascendant — 8 possible formats
    let ascendantSign: string | undefined;
    let ascendantDegrees: string | undefined;
    if (raw.ascendant) {
        ascendantSign = raw.ascendant.sign;
        ascendantDegrees = raw.ascendant.degrees ?? raw.ascendant.formatted_degree ?? (raw.ascendant.degree_in_sign != null ? String(raw.ascendant.degree_in_sign) : undefined);
    } else if (chartFoundations?.ascendant) {
        ascendantSign = chartFoundations.ascendant.sign;
        ascendantDegrees = chartFoundations.ascendant.degrees;
    } else if (chartDetails?.ascendant) {
        ascendantSign = (chartDetails.ascendant as AscendantInfo).sign;
        ascendantDegrees = (chartDetails.ascendant as AscendantInfo).degrees;
    } else if (chartDetails?.ascendant_sign) {
        ascendantSign = chartDetails.ascendant_sign as string;
        ascendantDegrees = chartDetails.ascendant_degree as string | undefined;
    } else if (chartInfo) {
        ascendantSign = chartInfo.ascendant_sign;
        ascendantDegrees = chartInfo.ascendant_degree;
    } else if (raw.ascendant_sign) {
        ascendantSign = raw.ascendant_sign;
    } else if (birth?.ascendant) {
        ascendantSign = birth.ascendant.sign;
        ascendantDegrees = birth.ascendant.degrees;
    }

    // Lat/lon can be in birth_details directly, or nested in .location / .birth_location
    let lat = birth?.latitude ?? birth?.birth_location?.latitude;
    let lon = birth?.longitude ?? birth?.birth_location?.longitude;

    if (birth?.location) {
        if (typeof birth.location === 'object') {
            const loc = birth.location as BirthLocationObject;
            lat = lat ?? loc.latitude;
            lon = lon ?? loc.longitude;
        } else if (typeof birth.location === 'string') {
            const match = birth.location.match(/Lat:\s*([0-9.]+),\s*Lon:\s*([0-9.]+)/);
            if (match) {
                lat = parseFloat(match[1]);
                lon = parseFloat(match[2]);
            }
        }
    }

    const hasMeta = raw.user_name || birth || notes || chartDetails || chartInfo || chartFoundations || ascendantSign;
    if (!hasMeta) return null;

    // ayanamsa_value can come from notes, chart_details, or chart_info
    const ayVal = notes?.ayanamsa_value ?? chartDetails?.ayanamsa_value ?? chartInfo?.ayanamsa_value;
    const ayanamsaValue = ayVal != null ? String(ayVal).replace(/°$/, '') : undefined;

    return {
        userName: raw.user_name,
        birthDate: birth?.birth_date,
        birthTime: birth?.birth_time,
        ascendantSign,
        ascendantDegrees,
        latitude: lat,
        longitude: typeof lon === 'number' ? lon : undefined,
        ayanamsa: notes?.ayanamsa ?? (chartDetails?.ayanamsa as string | undefined) ?? chartInfo?.ayanamsa,
        ayanamsaValue,
        houseSystem: notes?.house_system ?? chartDetails?.house_system ?? chartInfo?.house_system,
        chartType: notes?.chart_type ?? ((data.metadata as any)?.yoga_category ? String((data.metadata as any).yoga_category).toUpperCase() : undefined),
        analysisType: notes?.analysis_type ?? notes?.analysis_methodology ?? ((data.metadata as any)?.system ? String((data.metadata as any).system).toUpperCase() + ' SYSTEM' : undefined),
    };
}

function extractDescription(analysis: YogaAnalysisCore | null, data?: Record<string, unknown>): NormalizedDescription | null {
    // Top-level fallback for Tajika/Jaimini reasons
    if (data && (data.reason || data.explanation || data.details || data.summary)) {
        return {
            text: (data.reason || data.explanation || data.details || data.summary) as string
        };
    }

    if (!analysis) return null;

    const text = analysis.detailed_analysis;
    const explanation = analysis.explanation;

    // Also check yoga_formation_analysis for description content
    const formationRule = analysis.yoga_formation_analysis?.formation_rule as string | undefined;
    const separationAnalysis = analysis.yoga_formation_analysis?.separation_analysis as string | undefined;

    const primaryText = text ?? explanation ?? separationAnalysis;
    if (!primaryText) return null;

    return {
        text: primaryText,
        explanation: text ? (explanation ?? formationRule) : formationRule,
    };
}

function extractEffects(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedEffects | null {
    // From the old YogaAnalysis shape (gaja_kesari-like)
    const dataExt = data as Record<string, unknown> & RawYogaExtended;
    const compEffects = dataExt.comprehensive_effects;
    if (compEffects) {
        return {
            specific: compEffects.specific_effects ?? [],
            overall: compEffects.overall_prediction,
        };
    }

    // From yoga combinations
    if (analysis?.strongest_combination?.effects) {
        return {
            specific: analysis.strongest_combination.effects,
            overall: analysis.detailed_analysis,
        };
    }

    // From chandra-mangal individual_analysis
    if (analysis?.individual_analysis) {
        const indiv = analysis.individual_analysis as Record<string, unknown>;
        const combined = indiv.combined_individual_influence as Record<string, unknown> | undefined;
        if (combined) {
            return {
                specific: (combined.individual_contributions as string[]) ?? [],
                overall: combined.overall_assessment as string | undefined,
            };
        }
    }

    // From alternative_combinations in yoga_formation_analysis
    const alts = analysis?.yoga_formation_analysis?.alternative_combinations;
    if (Array.isArray(alts) && alts.length > 0) {
        return {
            specific: alts,
            overall: 'Alternative yogas to consider',
        };
    }

    return null;
}

function extractStrength(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedStrength | null {
    const ext = analysis as (YogaAnalysisCore & YogaAnalysisExtended) | null;
    const dataExt = data as Record<string, unknown> & RawYogaExtended;
    const score = analysis?.total_strength_score
        ?? analysis?.strongest_combination?.strength_score
        ?? ext?.overall_strength
        ?? ext?.strength_percentage
        ?? ext?.final_assessment?.cancellation_score;
    const label = analysis?.yoga_strength
        ?? analysis?.strongest_combination?.overall_strength
        ?? ext?.overall_category
        ?? ext?.final_assessment?.strength
        ?? (typeof dataExt.yoga_strength === 'string' ? dataExt.yoga_strength : undefined);
    const base = typeof dataExt.base_strength_score === 'number' ? dataExt.base_strength_score : undefined;
    const penalty = typeof dataExt.malefic_penalty === 'number' ? dataExt.malefic_penalty : undefined;
    const overallRating = analysis?.overall_rating as number | undefined;

    // Raj yoga average strength
    const rajYogas = data[RAJ_YOGAS_KEY] as Record<string, unknown> | undefined;
    const avgStrength = rajYogas?.average_strength as number | undefined;

    if (score === undefined && label === undefined && base === undefined && overallRating === undefined && avgStrength === undefined) return null;

    return {
        base,
        penalty,
        final: overallRating ?? score ?? avgStrength ?? base ?? 0,
        label,
        overallRating,
        functionalStatus: analysis?.functional_status ?? undefined,
        specialFeatures: analysis?.special_features ?? undefined,
    };
}

function extractConditions(analysis: YogaAnalysisCore | null): NormalizedConditions | null {
    let met = (analysis?.conditions_met as string[] | undefined) ?? [];
    let failed = (analysis?.conditions_failed as string[] | undefined) ?? [];

    // Kalpadruma-style yoga_analysis array
    const ext = analysis as (YogaAnalysisCore & YogaAnalysisExtended) | null;
    const kalpaAnalysis = ext?.yoga_analysis;
    if (Array.isArray(kalpaAnalysis)) {
        kalpaAnalysis.forEach((cond: KalpadrumaCondition) => {
            const label = `${cond.role}: ${cond.planet} in ${cond.sign} (H${cond.house})`;
            if (cond.condition_met) {
                if (!met.includes(label)) met.push(label);
            } else {
                if (!failed.includes(label)) failed.push(label);
            }
        });
    }

    // Kala-sarpa-style rule_by_rule_analysis
    const ruleByRule = ext?.rule_by_rule_analysis;
    if (ruleByRule && typeof ruleByRule === 'object') {
        Object.entries(ruleByRule).forEach(([ruleName, ruleData]: [string, RuleByRuleEntry]) => {
            const label = `${ruleName.replace(/_/g, ' ')}: ${ruleData.description ?? ''}`;
            if (ruleData.yoga_present) {
                if (!met.includes(label)) met.push(label);
            } else {
                if (!failed.includes(label)) failed.push(label);
            }
        });
    }

    // Kala-sarpa final_assessment as header-like summary → also inject into conditions
    const finalAssessment = ext?.final_assessment;
    if (finalAssessment?.recommendation) {
        const recLabel = `Recommendation: ${finalAssessment.recommendation}`;
        if (!met.includes(recLabel) && !failed.includes(recLabel)) {
            met.push(recLabel);
        }
    }

    if (met.length === 0 && failed.length === 0) return null;

    return {
        met,
        failed,
    };
}

function extractRajYogas(data: Record<string, unknown>): RajYogasData | null {
    const rajData = data[RAJ_YOGAS_KEY] as Record<string, unknown> | undefined;
    if (!rajData) return null;

    const yogasRaw = rajData.yogas as Array<Record<string, unknown>> | undefined;
    if (!yogasRaw || yogasRaw.length === 0) return null;

    const yogas: RajYogaEntry[] = yogasRaw.map(y => ({
        type: (y.type as string) ?? 'Unknown',
        subtype: y.subtype as string | undefined,
        description: (y.description as string) ?? '',
        formation: y.formation as string | undefined,
        planets: (y.planets as string[]) ?? [],
        houses: (y.houses as number[]) ?? [],
        strength: (y.strength as number) ?? 0,
        priority: (y.priority as string) ?? 'Unknown',
        cancellations: (y.cancellations as string[]) ?? [],
    }));

    return {
        totalCount: (rajData.total_count as number) ?? yogas.length,
        averageStrength: (rajData.average_strength as number) ?? 0,
        priorityDistribution: rajData.priority_distribution as Record<string, number> | undefined,
        typeDistribution: rajData.type_distribution as Record<string, number> | undefined,
        yogas,
    };
}

function extractCombinations(analysis: YogaAnalysisCore | null): NormalizedCombination[] | null {
    if (!analysis?.yoga_combinations?.length) return null;

    return analysis.yoga_combinations.map(combo => ({
        type: combo.type ?? 'unknown',
        present: combo.present ?? false,
        effects: combo.effects ?? [],
        house: combo.house,
        sign: combo.sign,
        houseCategory: combo.house_category,
        houseStrength: combo.house_strength,
        orbDegrees: combo.orb_degrees,
        orbStrength: combo.orb_strength,
        overallStrength: combo.overall_strength,
        strengthScore: combo.strength_score,
        nakshatraNumber: combo.nakshatra_number,
    }));
}

function extractPlanets(data: Record<string, unknown>): Record<string, PlanetPosition> | null {
    const grids = [
        data.all_planetary_positions,
        data.planetary_positions,
        data.planets,
        data.debug_planetary_d9,
        data.all_planetary_data,
        data.planetary_data,
        data['4_raw_planet_data'],
        data.raw_planet_data,
        data.planetary_signs,
        (data.chart_foundations as any)?.planetary_positions
    ];

    // Harvest Jaimini Karakas into planets output so they render in the YogaPlanetsGrid beautifully
    const jaiminiKarakas = [ data.chara_karakas, data.core_karakas, data.karakas, data.karakamsa_houses ];
    for (const jk of jaiminiKarakas) {
        if (jk && typeof jk === 'object' && !Array.isArray(jk)) {
            const mappedGrid: Record<string, PlanetPosition> = {};
            Object.entries(jk).forEach(([karakaName, planetName]) => {
                if (typeof planetName === 'string' && planetName.length > 0 && isNaN(Number(karakaName))) {
                    let cleanName = karakaName.replace(/_/g, ' ');
                    const abbrMatch = karakaName.match(/\((.*?)\)/);
                    if (abbrMatch) cleanName = abbrMatch[1];
                    mappedGrid[cleanName] = { planet: cleanName, sign: planetName, house: 0 };
                }
            });
            if (Object.keys(mappedGrid).length > 0) return mappedGrid;
        }
    }

    for (const grid of grids) {
        if (grid && typeof grid === 'object' && Object.keys(grid).length > 0) {
            if (Array.isArray(grid)) {
                // Handle case where planetary data is an array of objects
                const mappedGrid: Record<string, PlanetPosition> = {};
                grid.forEach(p => {
                    const name = p.planet || p.name || p.id;
                    if (name) mappedGrid[name] = p;
                });
                return mappedGrid;
            }
            
            Object.values(grid as Record<string, any>).forEach(p => {
                if (!p.degrees && p.formatted_degree) p.degrees = p.formatted_degree;
            });
            return grid as Record<string, PlanetPosition>;
        }
    }

    // Individual *_details keys
    return extractPlanetDetails(data);
}

function extractHouses(data: Record<string, unknown>): NormalizedHouse[] | null {
    const raw = data as RawYogaResponse;
    const houseSigns = raw.house_signs ?? raw.chart_foundations?.house_signs;
    if (!houseSigns) return null;

    const entries = Object.entries(houseSigns);
    if (entries.length === 0) return null;

    const lords = raw.house_lords;

    return entries
        .map(([key, value]) => {
            const num = parseInt(key.replace(/\D/g, ''), 10);
            // Lords can use "House 1", "1", or "house_1" format, OR be inline in chart_foundations
            const valueWithLord = value as HouseSignWithLord;
            const lordKey = valueWithLord.lord
                ?? (lords ? (lords[key] ?? lords[`House ${num}`] ?? lords[String(num)] ?? lords[`house_${num}`]) : undefined);
            return {
                houseNumber: isNaN(num) ? 0 : num,
                sign: value.sign,
                startLongitude: value.start_longitude,
                lord: lordKey,
            };
        })
        .sort((a, b) => a.houseNumber - b.houseNumber);
}

function extractTiming(data: Record<string, unknown>): NormalizedTiming | null {
    const dataExt = data as Record<string, unknown> & RawYogaExtended;
    const timing = dataExt.timing_analysis;
    if (!timing) return null;

    return {
        bestPeriods: timing.best_periods,
        activationTransits: timing.activation_transits,
        peakEffects: timing.peak_effects,
        remedialTiming: timing.remedial_timing,
    };
}

function extractRemedies(data: Record<string, unknown>): (string[] | NormalizedRemedyCategory[]) | null {
    const dataExt = data as Record<string, unknown> & RawYogaExtended;

    // Flat array: remedial_suggestions (top-level)
    const suggestions = dataExt.remedial_suggestions;
    if (Array.isArray(suggestions) && suggestions.length > 0) return suggestions;

    // Flat array: spiritual_recommendations (spiritual-prosperity)
    const spiritualRecs = dataExt.spiritual_recommendations;
    if (Array.isArray(spiritualRecs) && spiritualRecs.length > 0) return spiritualRecs;

    // Flat array: classical_analysis.remedial_suggestions (dhan-yoga)
    const raw = data as RawYogaResponse;
    const classicalSuggestions = raw.classical_analysis?.remedial_suggestions;
    if (Array.isArray(classicalSuggestions) && classicalSuggestions.length > 0) return classicalSuggestions;

    // Categorized object: remedial_measures
    if (raw.remedial_measures && typeof raw.remedial_measures === 'object') {
        const categories: NormalizedRemedyCategory[] = Object.entries(raw.remedial_measures)
            .filter(([, items]) => Array.isArray(items) && items.length > 0)
            .map(([key, items]) => ({
                category: key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase()),
                items: items as string[],
            }));
        if (categories.length > 0) return categories;
    }

    return null;
}

function extractCancellation(data: Record<string, unknown>): CancellationFactor[] | null {
    const dataExt = data as Record<string, unknown> & RawYogaExtended;
    const factors = dataExt.cancellation_factors;
    if (Array.isArray(factors) && factors.length > 0) return factors;
    return null;
}

function extractDoshaSeverity(data: Record<string, unknown>, analysis: YogaAnalysisCore | null): NormalizedDoshaSeverity | null {
    const dataExt = data as Record<string, unknown> & RawYogaExtended;

    // Top-level severity
    const severity = dataExt.overall_severity;
    if (severity) {
        return {
            level: severity,
            description: dataExt.severity_description ?? dataExt.financial_outlook,
        };
    }

    // Severity inside yoga analysis (daridra)
    const analysisSeverity = analysis?.overall_severity as string | undefined;
    if (analysisSeverity) {
        return {
            level: analysisSeverity,
            description: analysis?.financial_outlook as string | undefined,
        };
    }

    return null;
}

function extractTechnical(data: Record<string, unknown>, normalizedMeta: NormalizedMeta | null): NormalizedTechnical | null {
    const raw = data as RawYogaResponse;
    const notes = raw.calculation_notes ?? raw.notes ?? raw.calculation_details ?? raw.technical_details ?? raw.calculation_info ?? raw.technical_notes;
    const validation = raw.yoga_validation_report;
    const calcInfo = raw.calculation_info;
    const techNotes = raw.technical_notes;
    const calcParams = (raw.calculation_parameters ?? raw.system_params ?? raw.metadata ?? raw.system_details ?? raw.system_flags) as Record<string, any>;
    
    // Extract Jaimini Core indicators directly as methodology or rules
    const jCore = (raw.jaimini_core ?? raw.core_metrics ?? raw.core_astrology ?? raw.chart_core ?? raw.base_calculations ?? raw.karakamsa_lagna ?? raw.swamsa ?? raw.lagna ?? raw.jaimini_variables) as Record<string, any> | string;
    const extraRules: string[] = [];
    if (jCore) {
        if (typeof jCore === 'string') extraRules.push(`Karakamsa/Lagna: ${jCore}`);
        else if (typeof jCore === 'object') {
            Object.entries(jCore).forEach(([k, v]) => {
                if (typeof v === 'string' || typeof v === 'number') {
                    extraRules.push(`${k.replace(/_/g, ' ')}: ${v}`);
                }
            });
        }
    }

    // Try extracting any top level key containing lagna, ascendant, ayanamsa that wasn't caught
    for(const k of ['karakamsa_lagna', 'arudha_lagna', 'upapada_lagna', 'ascendant_sign', 'lagna_sign']) {
        if (typeof raw[k] === 'string') {
            extraRules.push(`${k.replace(/_/g, ' ')}: ${raw[k]}`);
        }
    }

    const result = {
        ayanamsa: normalizedMeta?.ayanamsa ?? calcParams?.ayanamsa,
        ayanamsaValue: normalizedMeta?.ayanamsaValue ?? calcParams?.ayanamsa_value,
        houseSystem: normalizedMeta?.houseSystem ?? calcParams?.house_system,
        calculationMethod: (notes?.calculation_method ?? calcParams?.calculation_mode ?? calcParams?.node_calculation ?? calcParams?.nodes ?? (notes?.['calculation_type'] as string | undefined)) as string | undefined,
        chartType: normalizedMeta?.chartType ?? calcParams?.chart_type,
        yogaRules: (notes?.yoga_validation ?? notes?.conjunction_rule ?? notes?.kaal_sarpa_rule) as string | undefined,
        coordinateSystem: (notes?.coordinate_system ?? notes?.ephemeris ?? calcInfo?.coordinate_system ?? calcInfo?.ephemeris ?? techNotes?.coordinate_system ?? techNotes?.ephemeris) as string | undefined,
        classicalRules: [
            ...(Object.entries(notes ?? {})
                .filter(([k]) => k.endsWith('_rule') || k.endsWith('_source'))
                .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)),
            ...(calcInfo?.comprehensive_coverage ?? []),
            ...(techNotes?.fixes_applied ?? []),
            ...(raw.interpretation_guide?.rule_explanations
                ? Object.entries(raw.interpretation_guide.rule_explanations).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                : []),
            ...extraRules
        ],
        methodology: validation
            ? Object.entries(validation).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join(', ')
            : (calcInfo?.precision ?? techNotes?.calculation_precision),
    };

    const hasData = Object.entries(result).some(([k, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== null && v !== '';
    });

    return hasData ? result : null;
}

function extractCoreMetrics(data: Record<string, unknown>): Record<string, Record<string, string>> | null {
    const raw = data as RawYogaResponse;
    const metrics: Record<string, Record<string, string>> = {};

    // 1. Chara Karakas
    const jaiminiKarakas = raw.chara_karakas ?? raw.core_karakas ?? raw.karakas;
    if (jaiminiKarakas && typeof jaiminiKarakas === 'object' && !Array.isArray(jaiminiKarakas)) {
        metrics['Chara Karakas'] = {};
        Object.entries(jaiminiKarakas).forEach(([k, v]) => {
            if (typeof v === 'string' || typeof v === 'number') {
                metrics['Chara Karakas'][k.replace(/_/g, ' ')] = String(v);
            }
        });
    }

    // 2. Jaimini Core / Core Metrics map
    const jCore = raw.jaimini_core ?? raw.core_metrics ?? raw.core_astrology ?? raw.chart_core ?? raw.karakamsa_houses;
    if (jCore && typeof jCore === 'object' && !Array.isArray(jCore)) {
        metrics['Core Astrology Metrics'] = {};
        Object.entries(jCore).forEach(([k, v]) => {
            if (typeof v === 'string' || typeof v === 'number') metrics['Core Astrology Metrics'][k.replace(/_/g, ' ')] = String(v);
            else if (typeof v === 'boolean') metrics['Core Astrology Metrics'][k.replace(/_/g, ' ')] = v ? 'Yes' : 'No';
        });
    }

    // 3. Various top-level independent values pulled from root
    const rootMatches: Record<string, string> = {};
    for (const k of ['karakamsa_lagna', 'swamsa', 'arudha_lagna', 'upapada_lagna', 'lagnesh', 'karyesh', 'ascendant_sign', 'lagna_sign', 'moon_sign', 'darakaraka', 'atmakaraka', 'ayanamsa']) {
        if (typeof raw[k] === 'string' || typeof raw[k] === 'number') {
            rootMatches[k.replace(/_/g, ' ')] = String(raw[k]);
        }
    }
    if (Object.keys(rootMatches).length > 0) {
        metrics['Key Chart Indicators'] = rootMatches;
    }

    // 4. Arrays & specific isolated indicators
    if (Array.isArray(raw.planets_in_karakamsa) && raw.planets_in_karakamsa.length > 0) {
        if (!metrics['Jaimini Indicators']) metrics['Jaimini Indicators'] = {};
        metrics['Jaimini Indicators']['Planets in Karakamsa'] = raw.planets_in_karakamsa.join(', ');
    }
    const tajikaYogaRaw = raw.iqabala_yoga ?? raw.tambira_yoga_present;
    if (tajikaYogaRaw) {
        if (!metrics['Tajika Metrics']) metrics['Tajika Metrics'] = {};
        if (typeof tajikaYogaRaw === 'boolean') metrics['Tajika Metrics']['Yoga Present'] = tajikaYogaRaw ? 'Yes' : 'No';
        else if (typeof tajikaYogaRaw === 'object' && !Array.isArray(tajikaYogaRaw)) {
            Object.entries(tajikaYogaRaw).forEach(([k, v]) => {
                if (typeof v === 'string' || typeof v === 'number') metrics['Tajika Metrics'][k.replace(/_/g, ' ')] = String(v);
                else if (typeof v === 'boolean') metrics['Tajika Metrics'][k.replace(/_/g, ' ')] = v ? 'Yes' : 'No';
            });
        }
    }

    if (Object.keys(metrics).length === 0) return null;
    return metrics;
}

// ─── Main Normalizer ───────────────────────────────────────────────

/**
 * Normalizes any raw yoga API response into the consistent
 * NormalizedYogaData shape. Sections with no data are null.
 *
 * @param input - Raw JSON from the backend (may be double-nested)
 * @returns NormalizedYogaData with null sections where data is absent
 */
export function normalizeYogaData(input: unknown, originalYogaType?: string): NormalizedYogaData {
    // Step 1: Unwrap double-nested data.data
    let data: Record<string, unknown> = {};
    if (input && typeof input === 'object') {
        const obj = input as Record<string, unknown>;
        if (obj.data && typeof obj.data === 'object') {
            const inner = obj.data as Record<string, unknown>;
            if (inner.data && typeof inner.data === 'object') {
                data = inner.data as Record<string, unknown>;
            } else {
                data = inner;
            }
        } else {
            data = obj;
        }
    }

    const backupHeaderTitle = originalYogaType 
        ? originalYogaType.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
        : undefined;

    // Step 2: Extract yoga analysis from dynamic key
    const analysis = extractYogaAnalysis(data);
    const meta = extractMeta(data);

    const jaiminiTajika = analyzeJaiminiTajikaPayload(data, backupHeaderTitle);

    // Step 3: Build normalized sections
    const normalized: NormalizedYogaData = {
        header: extractHeader(data, analysis, backupHeaderTitle),
        meta,
        description: extractDescription(analysis, data),
        effects: extractEffects(data, analysis),
        strength: extractStrength(data, analysis),
        combinations: extractCombinations(analysis),
        conditions: extractConditions(analysis),
        rajYogas: extractRajYogas(data),
        planets: extractPlanets(data),
        houses: extractHouses(data),
        timing: extractTiming(data),
        remedies: extractRemedies(data),
        cancellation: extractCancellation(data),
        doshaSeverity: extractDoshaSeverity(data, analysis),
        technical: extractTechnical(data, meta),
        coreMetrics: extractCoreMetrics(data),
        raw: collectUnknownKeys(data),
    };

    if (jaiminiTajika) {
        if (!normalized.header || (normalized.header && !normalized.header.isPresent)) {
            normalized.header = { isPresent: jaiminiTajika.isPresent, title: backupHeaderTitle ?? 'Detected Yoga' };
        }
        
        normalized.combinations = jaiminiTajika.yogas.map(y => ({
            type: y.name,
            present: jaiminiTajika.isPresent,
            effects: y.result ? [y.result] : [],
        }));
    }

    return normalized;
}
