"use client";

import { Search, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface DoshaInfo {
    name: string;
    description: string;
    severity: "critical" | "moderate";
    effects: string[];
    remedies: string[];
}

const DOSHAS: DoshaInfo[] = [
    {
        name: "Manglik Dosha (Kuja Dosha)",
        description: "Occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house of the birth chart.",
        severity: "critical",
        effects: [
            "Delays in marriage",
            "Disharmony between partners",
            "Health issues for the spouse",
        ],
        remedies: [
            "Manglik marrying another Manglik cancels the dosha",
            "Kumbh Vivah (symbolic marriage before actual marriage)",
            "Chanting Mangal Mantras on Tuesdays",
            "Offering red coral to Lord Hanuman",
        ],
    },
    {
        name: "Naadi Dosha",
        description: "Occurs when both bride and groom share the same Naadi (Aadi, Madhya, or Antya).",
        severity: "critical",
        effects: [
            "Health issues in offspring",
            "Lack of mutual understanding",
            "Financial difficulties",
        ],
        remedies: [
            "Naadi Nivaran Puja",
            "Donating grains and gold",
            "Mahamrityunjaya Jaap",
            "Consulting an experienced astrologer for exception rules",
        ],
    },
    {
        name: "Bhakoot Dosha",
        description: "Occurs when moon signs of bride and groom are in 6-8 or 2-12 positions from each other.",
        severity: "moderate",
        effects: [
            "Financial instability in marriage",
            "Separation or divorce tendencies",
            "Emotional distance between partners",
        ],
        remedies: [
            "Bhakoot Dosha Nivaran Puja",
            "Strengthening benefic planets in the chart",
            "Gemstone therapy as prescribed",
            "Exception rules may cancel this dosha",
        ],
    },
];

export default function DoshaAnalysisPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center gap-2 mb-1">
                    <Search className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-2xl font-bold text-softwhite">Dosha Analysis</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-sm max-w-2xl">
                    Understanding compatibility doshas and their remedies in Vedic matchmaking.
                </p>
            </div>

            {/* Dosha Reference Cards */}
            <div className="space-y-4">
                {DOSHAS.map((dosha) => (
                    <div key={dosha.name} className="bg-softwhite border border-antique rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className={`w-5 h-5 ${dosha.severity === "critical" ? "text-status-error" : "text-status-warning"}`} />
                            <h3 className="text-lg font-serif font-bold text-ink">{dosha.name}</h3>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                dosha.severity === "critical"
                                    ? "bg-status-error/10 text-status-error"
                                    : "bg-status-warning/10 text-status-warning"
                            }`}>
                                {dosha.severity === "critical" ? "Critical" : "Moderate"}
                            </span>
                        </div>

                        <p className="text-sm text-muted-refined mb-4">{dosha.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-2">
                                    Effects
                                </h4>
                                <ul className="space-y-1.5">
                                    {dosha.effects.map((effect, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <XCircle className="w-3.5 h-3.5 text-status-error mt-0.5 shrink-0" />
                                            <span className="text-xs text-muted-refined">{effect}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-2">
                                    Remedies
                                </h4>
                                <ul className="space-y-1.5">
                                    {dosha.remedies.map((remedy, i) => (
                                        <li key={i} className="flex items-start gap-1.5">
                                            <CheckCircle className="w-3.5 h-3.5 text-status-success mt-0.5 shrink-0" />
                                            <span className="text-xs text-muted-refined">{remedy}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <EmptyState
                icon={Search}
                title="Analyze a specific match for dosha details"
                description="Run a new match analysis to see personalized dosha findings for a bride and groom pair."
                action={
                    <Link
                        href="/matchmaking"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors"
                    >
                        New Match Analysis <ArrowRight className="w-4 h-4" />
                    </Link>
                }
            />
        </div>
    );
}
