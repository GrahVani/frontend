"use client";

import React from 'react';
import { FileText, Download, Star, Moon, Heart, Clock } from 'lucide-react';
import GoldenButton from "@/components/GoldenButton";

export default function ReportsPage() {

    const reports = [
        {
            title: "Detailed Horoscope",
            icon: Star,
            description: "Premium analysis of your natal chart including charts, divisonal charts, and complete planetary details.",
            price: "Paid",
            isFree: false
        },
        {
            title: "Bhrigu Patrika",
            icon: FileText,
            description: "Classic Vedic report focusing on prediction and remedies based on the Bhrigu Samhita system.",
            price: "Included",
            isFree: true
        },
        {
            title: "Dasha & Predictions",
            icon: Clock,
            description: "Detailed timeline of your life events based on Vimshottari Dasha analysis for the next 20 years.",
            price: "Included",
            isFree: true
        },
        {
            title: "Match Making Report",
            icon: Heart,
            description: "Comprehensive Guna Milan and compatibility analysis for marriage purposes.",
            price: "Paid",
            isFree: false
        },
        {
            title: "Varshphal (Yearly)",
            icon: Moon,
            description: "Annual solar return chart prediction for the current year with month-by-month breakdown.",
            price: "Included",
            isFree: true
        }
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Card */}
            <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden border border-gold-primary/20 bg-header-gradient"
            >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <FileText className="w-5 h-5 text-gold-dark" />
                    <h1 className="font-serif text-[24px] font-bold text-softwhite">Available Reports</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-[14px] max-w-2xl relative z-10">
                    Generate and download comprehensive astrological reports. Select from our range of classical and modern analysis modules.
                </p>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, index) => (
                    <div key={index} className="prem-card rounded-xl p-6 hover:shadow-md transition-shadow flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-gold-primary/15/30 flex items-center justify-center text-gold-dark">
                                <report.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase ${report.isFree ? 'bg-emerald-100 text-emerald-800' : 'bg-gold-primary/15 text-body'
                                }`}>
                                {report.price}
                            </span>
                        </div>

                        <h3 className="font-serif text-[18px] font-bold text-ink mb-2">{report.title}</h3>
                        <p className="text-ink/45 text-[14px] font-serif leading-relaxed mb-6 flex-1">
                            {report.description}
                        </p>

                        <div className="mt-auto">
                            <GoldenButton
                                topText="Generate"
                                bottomText="PDF"
                                className="w-full"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
