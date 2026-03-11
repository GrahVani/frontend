"use client";

import { useLunarMonths } from "@/hooks/queries/useCalendar";
import { Moon } from "lucide-react";

export default function LunarMonthWidget({ year }: { year: number }) {
    const { data: lunarData, isLoading } = useLunarMonths(year);

    if (isLoading || !lunarData || !lunarData.months) {
        return null;
    }

    const currentMonthIndex = new Date().getMonth();
    const currentMonthData = lunarData.months[currentMonthIndex];

    if (!currentMonthData) return null;

    return (
        <div className="prem-card p-5 bg-surface-base/80 backdrop-blur-sm mt-6">
            <h3 className="text-[15px] font-serif font-bold text-ink flex items-center gap-2 mb-4 border-b border-gold-primary/20 pb-2">
                <Moon className="w-4 h-4 text-gold-dark" />
                Vedic Month Alignment
            </h3>
            
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[12px] text-ink/60 font-medium">Current Lunar Month</p>
                        <h4 className="text-[20px] font-serif font-bold text-ink">
                            {currentMonthData.name}
                            {currentMonthData.is_adhik && <span className="text-[12px] text-gold-dark ml-2">(Adhik)</span>}
                        </h4>
                    </div>
                </div>

                <div className="bg-surface-warm/40 rounded-lg p-3 space-y-3 border border-gold-primary/5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[10px] text-ink/40 uppercase font-bold block mb-1">Start Date</span>
                            <span className="text-[13px] font-medium text-ink/80">{new Date(currentMonthData.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-ink/40 uppercase font-bold block mb-1">End Date</span>
                            <span className="text-[13px] font-medium text-ink/80">{new Date(currentMonthData.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-gold-primary/10 grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-[10px] text-ink/40 uppercase font-bold block mb-1">Purnima</span>
                            <span className="text-[13px] font-medium text-ink/80">{new Date(currentMonthData.purnima_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-ink/40 uppercase font-bold block mb-1">Amavasya</span>
                            <span className="text-[13px] font-medium text-ink/80">{new Date(currentMonthData.amavasya_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    </div>

                    {currentMonthData.sankranti && (
                        <div className="pt-2 border-t border-gold-primary/10">
                            <span className="text-[10px] text-ink/40 uppercase font-bold block mb-1">Solar Ingress</span>
                            <span className="text-[13px] font-medium text-gold-dark">{currentMonthData.sankranti.name}</span>
                        </div>
                    )}
                </div>
                
                <p className="text-[10px] text-ink/40 text-center uppercase tracking-wide">
                    System: Amanta (New Moon Ending)
                </p>
            </div>
        </div>
    );
}
