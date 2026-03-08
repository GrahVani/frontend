"use client";

import { useState, useEffect } from "react";
import { Save, Settings2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

type Ayanamsa = "lahiri" | "raman" | "kp";
type ChartStyle = "north_indian" | "south_indian" | "east_indian";

const SETTINGS_KEY = "grahvani:chart-preferences";

interface ChartPreferences {
    ayanamsa: Ayanamsa;
    chartStyle: ChartStyle;
    defaultOrb: string;
    showRetro: boolean;
    showDegrees: boolean;
}

const DEFAULTS: ChartPreferences = {
    ayanamsa: "lahiri",
    chartStyle: "north_indian",
    defaultOrb: "8",
    showRetro: true,
    showDegrees: true,
};

function loadPreferences(): ChartPreferences {
    if (typeof window === "undefined") return DEFAULTS;
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return DEFAULTS;
        return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
        return DEFAULTS;
    }
}

export default function SettingsPage() {
    const toast = useToast();
    const [loaded, setLoaded] = useState(false);
    const [ayanamsa, setAyanamsa] = useState<Ayanamsa>(DEFAULTS.ayanamsa);
    const [chartStyle, setChartStyle] = useState<ChartStyle>(DEFAULTS.chartStyle);
    const [defaultOrb, setDefaultOrb] = useState(DEFAULTS.defaultOrb);
    const [showRetro, setShowRetro] = useState(DEFAULTS.showRetro);
    const [showDegrees, setShowDegrees] = useState(DEFAULTS.showDegrees);

    useEffect(() => {
        const prefs = loadPreferences();
        setAyanamsa(prefs.ayanamsa);
        setChartStyle(prefs.chartStyle);
        setDefaultOrb(prefs.defaultOrb);
        setShowRetro(prefs.showRetro);
        setShowDegrees(prefs.showDegrees);
        setLoaded(true);
    }, []);

    const handleSave = () => {
        const prefs: ChartPreferences = { ayanamsa, chartStyle, defaultOrb, showRetro, showDegrees };
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(prefs));
            toast.success("Chart preferences saved successfully.");
        } catch {
            toast.error("Failed to save preferences.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="prem-card glass-shimmer relative overflow-hidden p-5">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                         style={{
                             background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                             border: '1px solid rgba(201,162,77,0.25)',
                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(139,90,43,0.08)',
                         }}>
                        <Settings2 className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-serif font-bold text-ink leading-tight">Chart Preferences</h1>
                        <p className="text-[13px] text-ink/50 font-medium mt-0.5">Configure default ayanamsa, chart style, and display options</p>
                    </div>
                </div>
            </div>

            {/* Ayanamsa */}
            <div className="prem-card p-5">
                <h3 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                    Ayanamsa System
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {([
                        { value: "lahiri", label: "Lahiri (Chitrapaksha)", desc: "Most common in India" },
                        { value: "raman", label: "Raman", desc: "B.V. Raman's system" },
                        { value: "kp", label: "KP (Krishnamurti)", desc: "Krishnamurti Paddhati" },
                    ] as const).map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setAyanamsa(option.value)}
                            className="p-4 rounded-xl text-left transition-all"
                            style={{
                                background: ayanamsa === option.value
                                    ? 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.06) 100%)'
                                    : 'rgba(255,253,249,0.60)',
                                border: ayanamsa === option.value
                                    ? '1.5px solid rgba(201,162,77,0.50)'
                                    : '1px solid rgba(220,201,166,0.30)',
                                boxShadow: ayanamsa === option.value
                                    ? 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(201,162,77,0.10)'
                                    : 'none',
                            }}
                        >
                            <span className="text-[14px] font-serif font-semibold text-ink block">{option.label}</span>
                            <span className="text-[12px] text-ink/45 font-medium">{option.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Style */}
            <div className="prem-card p-5">
                <h3 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                    Default Chart Style
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {([
                        { value: "north_indian", label: "North Indian", desc: "Diamond-shaped houses" },
                        { value: "south_indian", label: "South Indian", desc: "Fixed sign positions" },
                        { value: "east_indian", label: "East Indian", desc: "Maithili style" },
                    ] as const).map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setChartStyle(option.value)}
                            className="p-4 rounded-xl text-left transition-all"
                            style={{
                                background: chartStyle === option.value
                                    ? 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(201,162,77,0.06) 100%)'
                                    : 'rgba(255,253,249,0.60)',
                                border: chartStyle === option.value
                                    ? '1.5px solid rgba(201,162,77,0.50)'
                                    : '1px solid rgba(220,201,166,0.30)',
                                boxShadow: chartStyle === option.value
                                    ? 'inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(201,162,77,0.10)'
                                    : 'none',
                            }}
                        >
                            <span className="text-[14px] font-serif font-semibold text-ink block">{option.label}</span>
                            <span className="text-[12px] text-ink/45 font-medium">{option.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Display Options */}
            <div className="prem-card p-5">
                <h3 className="text-[11px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                    Display Options
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-[14px] font-serif text-ink block font-medium">Default Orb (degrees)</span>
                            <span className="text-[12px] text-ink/45 font-medium">Aspect orb for planetary aspects</span>
                        </div>
                        <select
                            value={defaultOrb}
                            onChange={(e) => setDefaultOrb(e.target.value)}
                            className="px-3 py-1.5 rounded-lg text-[13px] font-serif text-ink focus:outline-none transition-all"
                            aria-label="Default orb degrees"
                            style={{
                                background: 'rgba(250,245,234,0.50)',
                                border: '1px solid rgba(220,201,166,0.35)',
                                boxShadow: 'inset 0 1px 3px rgba(62,46,22,0.06)',
                            }}
                        >
                            {[5, 6, 7, 8, 9, 10].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mx-0" style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,77,0.12) 20%, rgba(220,201,166,0.20) 50%, rgba(201,162,77,0.12) 80%, transparent 100%)' }} />

                    <div className="flex items-center justify-between">
                        <div>
                            <span id="retro-label" className="text-[14px] font-serif text-ink block font-medium">Show Retrograde Markers</span>
                            <span id="retro-desc" className="text-[12px] text-ink/45 font-medium">Display (R) next to retrograde planets</span>
                        </div>
                        <button
                            onClick={() => setShowRetro(!showRetro)}
                            className="w-11 h-6 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2"
                            role="switch"
                            aria-checked={showRetro}
                            aria-labelledby="retro-label"
                            aria-describedby="retro-desc"
                            style={{
                                background: showRetro
                                    ? 'linear-gradient(135deg, rgba(201,162,77,1) 0%, rgba(180,140,60,1) 100%)'
                                    : 'rgba(220,201,166,0.40)',
                                boxShadow: showRetro ? '0 2px 6px rgba(201,162,77,0.30)' : 'inset 0 1px 3px rgba(0,0,0,0.08)',
                            }}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${showRetro ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>

                    <div className="mx-0" style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,77,0.12) 20%, rgba(220,201,166,0.20) 50%, rgba(201,162,77,0.12) 80%, transparent 100%)' }} />

                    <div className="flex items-center justify-between">
                        <div>
                            <span id="degrees-label" className="text-[14px] font-serif text-ink block font-medium">Show Degrees in Chart</span>
                            <span id="degrees-desc" className="text-[12px] text-ink/45 font-medium">Display exact degree positions of planets</span>
                        </div>
                        <button
                            onClick={() => setShowDegrees(!showDegrees)}
                            className="w-11 h-6 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary focus-visible:ring-offset-2"
                            role="switch"
                            aria-checked={showDegrees}
                            aria-labelledby="degrees-label"
                            aria-describedby="degrees-desc"
                            style={{
                                background: showDegrees
                                    ? 'linear-gradient(135deg, rgba(201,162,77,1) 0%, rgba(180,140,60,1) 100%)'
                                    : 'rgba(220,201,166,0.40)',
                                boxShadow: showDegrees ? '0 2px 6px rgba(201,162,77,0.30)' : 'inset 0 1px 3px rgba(0,0,0,0.08)',
                            }}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${showDegrees ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} icon={Save}>Save Preferences</Button>
            </div>
        </div>
    );
}
