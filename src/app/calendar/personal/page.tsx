"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Calendar, Clock } from "lucide-react";
import EventForm from "@/components/calendar/EventForm";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { usePersonalEvents, useCreateEvent, useDeleteEvent } from "@/hooks/queries/useCalendar";
import type { PersonalEvent } from "@/types/calendar.types";

const CATEGORY_BADGE: Record<PersonalEvent["category"], { variant: "default" | "success" | "warning" | "info" | "error"; label: string }> = {
    consultation: { variant: "default", label: "Consultation" },
    follow_up: { variant: "warning", label: "Follow-Up" },
    muhurta: { variant: "success", label: "Muhurta" },
    personal: { variant: "info", label: "Personal" },
    other: { variant: "default", label: "Other" },
};

export default function PersonalEventsPage() {
    const now = new Date();
    const [showForm, setShowForm] = useState(false);

    const { data: events, isLoading } = usePersonalEvents(now.getFullYear(), now.getMonth());
    const createEvent = useCreateEvent();
    const deleteEvent = useDeleteEvent();

    const handleCreate = (event: Omit<PersonalEvent, "id">) => {
        createEvent.mutate(event, {
            onSuccess: () => setShowForm(false),
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-ink font-bold mb-1">Personal Events</h1>
                    <p className="text-muted-refined font-serif italic">Manage your consultations, follow-ups, and personal calendar</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} icon={Plus} variant={showForm ? "ghost" : "primary"}>
                    {showForm ? "Cancel" : "New Event"}
                </Button>
            </div>

            {showForm && (
                <EventForm
                    onSubmit={handleCreate}
                    loading={createEvent.isPending}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : events && events.length > 0 ? (
                <div className="space-y-3">
                    {events.map((event) => {
                        const badge = CATEGORY_BADGE[event.category];
                        return (
                            <div key={event.id} className="bg-softwhite border border-antique rounded-xl p-4 flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-serif font-semibold text-ink truncate">{event.title}</h3>
                                        <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-refined">
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
                                        </span>
                                        {event.time && (
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {event.time}
                                            </span>
                                        )}
                                        {event.clientName && (
                                            <span className="text-gold-dark">{event.clientName}</span>
                                        )}
                                    </div>
                                    {event.description && (
                                        <p className="text-xs text-muted-refined mt-1">{event.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => deleteEvent.mutate(event.id)}
                                    className="p-1.5 rounded-md hover:bg-status-error/10 transition-colors shrink-0"
                                    aria-label={`Delete ${event.title}`}
                                >
                                    <Trash2 className="w-4 h-4 text-muted-refined hover:text-status-error" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={FileText}
                    title="No events scheduled"
                    description="Add consultations, follow-ups, and personal events to keep track of your schedule."
                    action={
                        !showForm ? (
                            <Button onClick={() => setShowForm(true)} icon={Plus}>Add Event</Button>
                        ) : undefined
                    }
                />
            )}
        </div>
    );
}
