"use client";

import { useState } from "react";
import { Settings, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

type Ayanamsa = "lahiri" | "raman" | "kp";
type ChartStyle = "north_indian" | "south_indian" | "east_indian";

export default function SettingsPage() {
    const toast = useToast();
    const [ayanamsa, setAyanamsa] = useState<Ayanamsa>("lahiri");
    const [chartStyle, setChartStyle] = useState<ChartStyle>("north_indian");
    const [defaultOrb, setDefaultOrb] = useState("8");
    const [showRetro, setShowRetro] = useState(true);
    const [showDegrees, setShowDegrees] = useState(true);

    const handleSave = () => {
        // TODO: Persist to user settings API
        toast.success("Chart preferences saved successfully.");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-ink font-bold mb-1">Chart Preferences</h1>
                <p className="text-muted-refined font-serif italic">Configure default ayanamsa, chart style, and display options</p>
            </div>

            {/* Ayanamsa */}
            <div className="bg-softwhite border border-antique rounded-xl p-5">
                <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
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
                            className={`p-4 rounded-xl border text-left transition-all ${
                                ayanamsa === option.value
                                    ? "border-gold-primary bg-gold-primary/10 ring-1 ring-gold-primary"
                                    : "border-antique hover:border-gold-primary/30"
                            }`}
                        >
                            <span className="text-sm font-serif font-semibold text-ink block">{option.label}</span>
                            <span className="text-xs text-muted-refined">{option.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Style */}
            <div className="bg-softwhite border border-antique rounded-xl p-5">
                <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
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
                            className={`p-4 rounded-xl border text-left transition-all ${
                                chartStyle === option.value
                                    ? "border-gold-primary bg-gold-primary/10 ring-1 ring-gold-primary"
                                    : "border-antique hover:border-gold-primary/30"
                            }`}
                        >
                            <span className="text-sm font-serif font-semibold text-ink block">{option.label}</span>
                            <span className="text-xs text-muted-refined">{option.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Display Options */}
            <div className="bg-softwhite border border-antique rounded-xl p-5">
                <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                    Display Options
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-serif text-ink block">Default Orb (degrees)</span>
                            <span className="text-xs text-muted-refined">Aspect orb for planetary aspects</span>
                        </div>
                        <select
                            value={defaultOrb}
                            onChange={(e) => setDefaultOrb(e.target.value)}
                            className="px-3 py-1.5 bg-parchment/50 border border-antique rounded-lg text-sm font-serif text-ink focus:outline-none focus:border-gold-primary"
                        >
                            {[5, 6, 7, 8, 9, 10].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-serif text-ink block">Show Retrograde Markers</span>
                            <span className="text-xs text-muted-refined">Display (R) next to retrograde planets</span>
                        </div>
                        <button
                            onClick={() => setShowRetro(!showRetro)}
                            className={`w-11 h-6 rounded-full transition-colors ${showRetro ? "bg-gold-primary" : "bg-antique"}`}
                            role="switch"
                            aria-checked={showRetro}
                        >
                            <div className={`w-5 h-5 rounded-full bg-softwhite shadow transition-transform ${showRetro ? "translate-x-5" : "translate-x-0.5"}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-sm font-serif text-ink block">Show Degrees in Chart</span>
                            <span className="text-xs text-muted-refined">Display exact degree positions of planets</span>
                        </div>
                        <button
                            onClick={() => setShowDegrees(!showDegrees)}
                            className={`w-11 h-6 rounded-full transition-colors ${showDegrees ? "bg-gold-primary" : "bg-antique"}`}
                            role="switch"
                            aria-checked={showDegrees}
                        >
                            <div className={`w-5 h-5 rounded-full bg-softwhite shadow transition-transform ${showDegrees ? "translate-x-5" : "translate-x-0.5"}`} />
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
