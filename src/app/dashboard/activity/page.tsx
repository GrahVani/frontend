"use client";

import { Users, BarChart3, FileText, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

interface ActivityItem {
    id: string;
    type: "client_created" | "chart_generated" | "report_sent";
    title: string;
    description: string;
    timestamp: string;
}

const ICON_MAP = {
    client_created: Users,
    chart_generated: BarChart3,
    report_sent: FileText,
};

const BADGE_MAP: Record<ActivityItem["type"], { label: string; variant: "default" | "success" | "info" }> = {
    client_created: { label: "Client", variant: "default" },
    chart_generated: { label: "Chart", variant: "success" },
    report_sent: { label: "Report", variant: "info" },
};

function ActivityTimelineItem({ item }: { item: ActivityItem }) {
    const Icon = ICON_MAP[item.type];
    const badge = BADGE_MAP[item.type];

    return (
        <div className="flex gap-4 group">
            <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-parchment border border-antique flex items-center justify-center shrink-0 group-hover:border-gold-primary/50 transition-colors">
                    <Icon className="w-5 h-5 text-gold-dark" />
                </div>
                <div className="w-px flex-1 bg-antique mt-2" />
            </div>
            <div className="pb-8">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-serif font-semibold text-ink">{item.title}</h3>
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                </div>
                <p className="text-sm text-muted-refined">{item.description}</p>
                <time className="text-xs text-muted-refined/70 mt-1 block">{item.timestamp}</time>
            </div>
        </div>
    );
}

export default function ActivityPage() {
    // Placeholder: will be replaced with useDashboardActivity() hook
    const activities: ActivityItem[] = [];

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-ink font-bold mb-1">Recent Activity</h1>
                <p className="text-muted-refined font-serif italic">Timeline of your astrological work</p>
            </div>

            <div className="bg-softwhite border border-antique rounded-xl p-6">
                {activities.length > 0 ? (
                    <div>
                        {activities.map((item) => (
                            <ActivityTimelineItem key={item.id} item={item} />
                        ))}
                        <div className="flex justify-center pt-4">
                            <button className="text-xs font-medium text-gold-primary hover:text-gold-dark transition-colors inline-flex items-center gap-1">
                                Load more <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={Star}
                        title="No activity yet"
                        description="Your activity timeline will populate as you create clients, generate charts, and send reports."
                        action={
                            <Link
                                href="/clients/new"
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors"
                            >
                                Create your first client <ArrowRight className="w-4 h-4" />
                            </Link>
                        }
                    />
                )}
            </div>
        </div>
    );
}
