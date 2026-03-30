"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import Button from "@/components/ui/Button";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const AYANAMSAS = [
    { id: 'Lahiri', label: 'Lahiri (Chitra Paksha)', desc: 'Most widely used in Vedic Astrology' },
    { id: 'KP', label: 'KP (Krishnamurti)', desc: 'Preferred for Stellar/Nakshatra precision' },
    { id: 'Raman', label: 'Raman', desc: 'BV Raman traditional ayanamsa' },
    { id: 'Yukteswar', label: 'Sri Yukteswar', desc: 'Galactic Center based precision' },
    { id: 'Bhasin', label: 'Bhasin', desc: 'J.N. Bhasin ayanamsa system' },
];

interface GlobalSettingsModalProps {
    onClose: () => void;
    router: AppRouterInstance;
}

export default function GlobalSettingsModal({ onClose, router }: GlobalSettingsModalProps) {
    const { ayanamsa, chartStyle, recentClientIds, updateSettings } = useAstrologerStore();

    const settings = React.useMemo(() => ({
        ayanamsa,
        chartStyle,
        recentClientIds
    }), [ayanamsa, chartStyle, recentClientIds]);

    const [tempSettings, setTempSettings] = React.useState(settings);
    const [isSaving, setIsSaving] = React.useState(false);

    const settingsTitleId = React.useId();
    const trapRef = useFocusTrap(onClose);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            const systemChanged = tempSettings.ayanamsa !== settings.ayanamsa;
            updateSettings(tempSettings);
            setIsSaving(false);
            onClose();

            if (systemChanged) {
                router.push('/vedic-astrology/overview');
            }
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" role="dialog" aria-modal="true" aria-labelledby={settingsTitleId}>
            <div ref={trapRef} tabIndex={-1} className="w-full max-w-2xl bg-surface-modal rounded-[2rem] shadow-2xl overflow-hidden border border-header-border/30 animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh] outline-none">

                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-copper-dark to-mahogany flex items-center justify-between shrink-0">
                    <div>
                        <h2 id={settingsTitleId} className={cn(TYPOGRAPHY.sectionTitle, "text-2xl !text-white !font-bold !tracking-wide")}>Global Settings</h2>
                        <p className={cn(TYPOGRAPHY.label, "!text-active-glow/80 !mb-0 mt-1")}>Default preferences for charts and calculations</p>
                    </div>
                    <button onClick={onClose} aria-label="Close settings" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                        <ChevronDown className="w-6 h-6 rotate-90" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                    <fieldset className="border-0 p-0 m-0">
                        <legend className={cn(TYPOGRAPHY.label, "!text-header-border !font-black !tracking-[0.3em] !mb-6 flex items-center gap-3 w-full")}>
                            <span className="w-8 h-[1px] bg-header-border" />
                            Ayanamsa System
                            <span className="flex-1 h-[1px] bg-header-border/20" />
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="radiogroup" aria-label="Ayanamsa system selection">
                            {AYANAMSAS.map((a) => (
                                <button
                                    key={a.id}
                                    role="radio"
                                    aria-checked={tempSettings.ayanamsa === a.id}
                                    onClick={() => setTempSettings(prev => ({ ...prev, ayanamsa: a.id as typeof prev.ayanamsa }))}
                                    className={`relative p-5 rounded-2xl border text-left transition-all hover:scale-[1.02] group ${tempSettings.ayanamsa === a.id
                                        ? 'bg-copper-dark border-copper-dark shadow-lg'
                                        : 'bg-white border-header-border/20 hover:border-header-border hover:bg-bg-hover'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            TYPOGRAPHY.value,
                                            tempSettings.ayanamsa === a.id ? "!text-white" : "!text-ink"
                                        )}>{a.label}</span>
                                        {tempSettings.ayanamsa === a.id && (
                                            <div className="w-4 h-4 rounded-full bg-active-glow flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-copper-dark" />
                                            </div>
                                        )}
                                    </div>
                                    <p className={cn(
                                        TYPOGRAPHY.subValue,
                                        tempSettings.ayanamsa === a.id ? "!text-white/60" : "!text-bronze/60",
                                        "!mt-0"
                                    )}>{a.desc}</p>
                                </button>
                            ))}
                        </div>
                    </fieldset>
                </div>

                {/* Footer */}
                <div className="p-8 bg-softwhite border-t border-header-border/10 flex items-center justify-between shrink-0">
                    <span className={cn(TYPOGRAPHY.subValue, "!text-bronze !font-medium")}>Changes reflect immediately across all open modules.</span>
                    <div className="flex gap-4">
                        <button onClick={onClose} aria-label="Cancel settings changes" className={cn(TYPOGRAPHY.label, "px-6 py-3 rounded-xl !text-bronze !mb-0 hover:bg-bronze/5 transition-colors")}>
                            Cancel
                        </button>
                        <Button variant="primary" onClick={handleSave} disabled={isSaving} loading={isSaving}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
