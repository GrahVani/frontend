"use client";

import { useRitu } from "@/hooks/queries/useCalendar";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { Leaf, Sun, CloudRain, Wind, Snowflake, Flower2 } from "lucide-react";
import { SkeletonCard } from "@/components/ui/Skeleton";

interface RituWidgetProps {
    year: number;
    className?: string;
}

const rituIcons: Record<string, React.ReactNode> = {
    "Vasanta": <Flower2 className="w-4 h-4 text-pink-500" />,
    "Grishma": <Sun className="w-4 h-4 text-orange-500" />,
    "Varsha": <CloudRain className="w-4 h-4 text-blue-500" />,
    "Sharad": <Wind className="w-4 h-4 text-amber-500" />,
    "Hemanta": <Snowflake className="w-4 h-4 text-cyan-500" />,
    "Shishira": <Leaf className="w-4 h-4 text-green-500" />,
};

const rituColors: Record<string, string> = {
    "Vasanta": "from-pink-500/10 to-rose-500/5",
    "Grishma": "from-orange-500/10 to-amber-500/5",
    "Varsha": "from-blue-500/10 to-cyan-500/5",
    "Sharad": "from-amber-500/10 to-yellow-500/5",
    "Hemanta": "from-cyan-500/10 to-blue-500/5",
    "Shishira": "from-green-500/10 to-emerald-500/5",
};

export default function RituWidget({ year, className }: RituWidgetProps) {
    const { data, isLoading } = useRitu(year);

    if (isLoading) return <SkeletonCard className={className} />;
    
    // Handle nested data structure
    const rituData = data?.data || data;
    
    if (!rituData?.ritus) return null;

    // current_ritu is a string (sanskrit name)
    const currentRituName = String(rituData.current_ritu || '');
    const rituList = Array.isArray(rituData.ritus) ? rituData.ritus : [];
    
    // Find current ritu details
    const currentRitu = rituList.find((r: any) => r.name_sa === currentRituName);

    return (
        <div className={cn("prem-card p-4", className)}>
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/15 to-emerald-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 text-green-600" />
                </div>
                <div>
                    <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Ritu (Seasons)</h3>
                    <p className="text-[11px] text-primary font-medium">6 Hindu Seasons</p>
                </div>
            </div>

            {/* Current Season Highlight */}
            {currentRitu && (
                <div className={cn(
                    "mb-4 p-3 rounded-xl bg-gradient-to-r border",
                    rituColors[currentRituName] || "from-gold-primary/10 to-gold-primary/5",
                    "border-gold-primary/20"
                )}>
                    <div className="flex items-center gap-2">
                        {rituIcons[currentRituName] || <Sun className="w-4 h-4" />}
                        <div>
                            <p className="text-[10px] text-primary uppercase tracking-wider">Current Season</p>
                            <p className="text-[14px] font-serif font-bold text-primary">{currentRitu.name_sa}</p>
                        </div>
                    </div>
                    <p className="text-[11px] text-primary mt-1 ml-6">
                        {currentRitu.name_en} ({currentRitu.approx_gregorian})
                    </p>
                    {currentRitu.description && (
                        <p className="text-[10px] text-primary mt-1 ml-6 italic">{currentRitu.description}</p>
                    )}
                </div>
            )}

            {/* All Seasons Grid */}
            <div className="grid grid-cols-2 gap-2">
                {rituList.map((ritu: any, index: number) => {
                    const rituNameSa = String(ritu.name_sa || '');
                    const isCurrent = rituNameSa === currentRituName;
                    
                    return (
                        <div 
                            key={`ritu-${rituNameSa}-${index}`}
                            className={cn(
                                "p-2.5 rounded-lg border transition-all",
                                isCurrent
                                    ? "bg-gold-primary/10 border-gold-primary/30" 
                                    : "bg-surface-base/30 border-surface-border/50 hover:border-gold-primary/20"
                            )}
                        >
                            <div className="flex items-center gap-1.5 mb-1">
                                {rituIcons[rituNameSa] || <Sun className="w-3 h-3" />}
                                <span className={cn(
                                    "text-[12px] font-medium",
                                    isCurrent ? "text-gold-dark" : "text-primary"
                                )}>
                                    {rituNameSa}
                                </span>
                            </div>
                            <p className="text-[10px] text-primary ml-4.5">
                                {String(ritu.approx_gregorian || '')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
