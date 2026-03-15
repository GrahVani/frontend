"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { KnowledgeTooltip } from "@/components/knowledge";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { useEventTypes } from "@/hooks/queries/useMuhurta";
import { Skeleton } from "@/components/ui/Skeleton";
import {
    Sparkles, Home, Car, Plane, Baby, GraduationCap, Stethoscope,
    Shovel, Store, FileText, Gem, Heart, Users,
} from "lucide-react";
import type { EventTypeCode } from "@/types/muhurta.types";

const EVENT_KNOWLEDGE_TERMS: Record<string, string> = {
    VIVAH: "vivah_muhurta",
    SAGAI: "sagai_muhurta",
    GRIHA_PRAVESH: "griha_pravesh",
    BHOOMI_PUJAN: "bhoomi_pujan",
    UPANAYANA: "upanayana",
    NAAMKARAN: "naamkaran",
    ANNAPRASHAN: "annaprashan",
    VIDYAARAMBH: "vidyaarambh",
};

const EVENT_ICONS: Record<string, React.ReactNode> = {
    VIVAH: <Heart className="w-6 h-6" />,
    SAGAI: <Users className="w-6 h-6" />,
    GRIHA_PRAVESH: <Home className="w-6 h-6" />,
    BHOOMI_PUJAN: <Shovel className="w-6 h-6" />,
    VYAPAAR: <Store className="w-6 h-6" />,
    VAHAN: <Car className="w-6 h-6" />,
    UPANAYANA: <Gem className="w-6 h-6" />,
    NAAMKARAN: <Baby className="w-6 h-6" />,
    ANNAPRASHAN: <Baby className="w-6 h-6" />,
    VIDYAARAMBH: <GraduationCap className="w-6 h-6" />,
    SURGERY: <Stethoscope className="w-6 h-6" />,
    YATRA: <Plane className="w-6 h-6" />,
    PROPERTY: <FileText className="w-6 h-6" />,
};

export default function CeremoniesPage() {
    const { data, isLoading } = useEventTypes();

    const events = data?.event_types ?? [
        { code: "GRIHA_PRAVESH" as EventTypeCode, name: "Griha Pravesh", description: "Housewarming ceremony", requires_two_persons: false },
        { code: "BHOOMI_PUJAN" as EventTypeCode, name: "Bhoomi Pujan", description: "Ground breaking ceremony", requires_two_persons: false },
        { code: "VYAPAAR" as EventTypeCode, name: "Vyapaar", description: "Business opening / new venture", requires_two_persons: false },
        { code: "VAHAN" as EventTypeCode, name: "Vahan", description: "Vehicle purchase / first drive", requires_two_persons: false },
        { code: "UPANAYANA" as EventTypeCode, name: "Upanayana", description: "Thread ceremony (Janeu/Poonal)", requires_two_persons: false },
        { code: "NAAMKARAN" as EventTypeCode, name: "Naamkaran", description: "Naming ceremony", requires_two_persons: false },
        { code: "ANNAPRASHAN" as EventTypeCode, name: "Annaprashan", description: "First rice feeding ceremony", requires_two_persons: false },
        { code: "VIDYAARAMBH" as EventTypeCode, name: "Vidyaarambh", description: "Starting education", requires_two_persons: false },
        { code: "SURGERY" as EventTypeCode, name: "Surgery", description: "Surgical / medical procedure", requires_two_persons: false },
        { code: "YATRA" as EventTypeCode, name: "Yatra", description: "Travel / pilgrimage", requires_two_persons: false },
        { code: "PROPERTY" as EventTypeCode, name: "Property", description: "Property purchase / registration", requires_two_persons: false },
    ];

    // Exclude marriage events (they have their own page)
    const ceremonies = events.filter((e) => !e.requires_two_persons);

    return (
        <div className="space-y-6 pb-12">
            <div>
                <h1 className={cn(TYPOGRAPHY.pageTitle, "flex items-center gap-3")}>
                    <Sparkles className="w-6 h-6 text-gold-dark" />
                    Ceremonies & Events
                </h1>
                <p className={cn("text-ink/60 text-sm", "mt-1")}>
                    Find auspicious dates for Hindu ceremonies and life events
                </p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="prem-card p-5 space-y-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-5 w-2/3" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ceremonies.map((event) => (
                        <Link
                            key={event.code}
                            href={`/muhurta/find?event=${event.code}`}
                            className="prem-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-dark shrink-0 group-hover:bg-gold-primary/20 transition-colors">
                                    {EVENT_ICONS[event.code] ?? <Sparkles className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-ink text-[15px] group-hover:text-gold-dark transition-colors">
                                        {EVENT_KNOWLEDGE_TERMS[event.code] ? (
                                            <KnowledgeTooltip term={EVENT_KNOWLEDGE_TERMS[event.code]} unstyled>
                                                {event.name}
                                            </KnowledgeTooltip>
                                        ) : (
                                            event.name
                                        )}
                                    </h3>
                                    <p className="text-ink/60 text-[12.5px] mt-0.5 leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Marriage events callout */}
            <div className="prem-card p-5 bg-parchment/30">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                        <Heart className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-ink text-[14px]">Looking for Wedding or Engagement Dates?</h3>
                        <p className="text-ink/60 text-[12.5px] mt-0.5">
                            Marriage ceremonies include compatibility analysis.{" "}
                            <Link href="/muhurta/marriage" className="text-gold-dark font-medium hover:underline">
                                Go to Marriage Muhurat
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
