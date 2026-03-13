"use client";

import { useSamvatsara } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { History, Info } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface SamvatsaraWidgetProps {
    year: number;
    className?: string;
}

export default function SamvatsaraWidget({ year, className }: SamvatsaraWidgetProps) {
    const { data, isLoading } = useSamvatsara(year);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const samvatsaraData = data?.data || data;
    
    if (!samvatsaraData?.samvatsara) return null;

    // Extract samvatsara info - could be string or object
    const currentSamvatsara = samvatsaraData.samvatsara;
    const samvatsaraName = typeof currentSamvatsara === 'object' 
        ? currentSamvatsara.name 
        : String(currentSamvatsara);
    
    const cycleNumber = typeof currentSamvatsara === 'object' 
        ? currentSamvatsara.cycle_number || currentSamvatsara.number 
        : 0;
    
    const positionInCycle = typeof currentSamvatsara === 'object' 
        ? currentSamvatsara.position_in_cycle || currentSamvatsara.number 
        : 0;
    
    // Calculate progress
    const cycleProgress = positionInCycle ? Math.round((positionInCycle / 60) * 100) : 0;
    
    // Next samvatsara
    const nextSamvatsara = samvatsaraData.next_samvatsara;
    const nextName = typeof nextSamvatsara === 'object' 
        ? nextSamvatsara?.name 
        : String(nextSamvatsara || '');
    
    // Previous samvatsara
    const prevSamvatsara = samvatsaraData.previous_samvatsara;
    const prevName = typeof prevSamvatsara === 'object' 
        ? prevSamvatsara?.name 
        : String(prevSamvatsara || '');
    
    // Calendar years
    const vikramSamvat = samvatsaraData.year_vikram_samvat;
    const shakaSamvat = samvatsaraData.year_shaka_samvat;

    return (
        <div className={cn("prem-card p-3 relative overflow-hidden", className)}>
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold-primary/10 to-transparent rounded-bl-full" />
            
            <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gold-primary/10 flex items-center justify-center">
                        <History className="w-3.5 h-3.5 text-gold-dark" />
                    </div>
                    <div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[13px]")}>Samvatsara</h3>
                        <p className="text-[10px] text-primary">60-Year Jovian Cycle</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Current Year Name */}
                    <div className="text-center py-2.5 bg-gradient-to-r from-gold-primary/5 via-gold-primary/10 to-gold-primary/5 rounded-xl border border-gold-primary/20">
                        <p className="text-[10px] text-primary uppercase tracking-widest mb-0.5">Current Year</p>
                        <h4 className="font-serif text-[18px] font-bold text-gold-dark">{samvatsaraName}</h4>
                        <p className="text-[11px] text-primary mt-0.5">
                            Year {cycleNumber || positionInCycle} of 60
                            {vikramSamvat && <span className="ml-2">| VS {vikramSamvat}</span>}
                        </p>
                        {shakaSamvat && (
                            <p className="text-[10px] text-primary mt-0.5">Shaka Samvat {shakaSamvat}</p>
                        )}
                    </div>

                    {/* Progress Bar */}
                    {positionInCycle > 0 && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-primary">
                                <span>Cycle Progress</span>
                                <span>{cycleProgress}%</span>
                            </div>
                            <div className="h-1.5 bg-surface-border rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-gold-dark to-gold-primary rounded-full transition-all duration-500"
                                    style={{ width: `${cycleProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Next/Prev Year Preview */}
                    <div className="grid grid-cols-2 gap-2">
                        {prevName && (
                            <div className="flex items-center gap-1.5 p-1.5 bg-surface-base/50 rounded-lg border border-surface-border/50">
                                <Info className="w-3 h-3 text-gold-primary/60 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[9px] text-primary">Previous ({year - 1})</p>
                                    <p className="text-[11px] font-medium text-primary truncate">{prevName}</p>
                                </div>
                            </div>
                        )}
                        {nextName && (
                            <div className="flex items-center gap-1.5 p-1.5 bg-surface-base/50 rounded-lg border border-surface-border/50">
                                <Info className="w-3 h-3 text-gold-primary/60 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-[9px] text-primary">Next ({year + 1})</p>
                                    <p className="text-[11px] font-medium text-primary truncate">{nextName}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
