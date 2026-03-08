"use client";

import { useState } from "react";
import { FileText, Plus, Trash2, Calendar, Clock } from "lucide-react";
import EventForm from "@/components/calendar/EventForm";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { usePersonalEvents, useCreateEvent, useDeleteEvent } from "@/hooks/queries/useCalendar";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useToast } from "@/context/ToastContext";
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
    const { confirm, dialog: confirmDialog } = useConfirmDialog();
    const toast = useToast();

    const handleCreate = (event: Omit<PersonalEvent, "id">) => {
        createEvent.mutate(event, {
            onSuccess: () => {
                setShowForm(false);
                toast.success("Event created successfully.");
            },
            onError: () => {
                toast.error("Failed to create event. Please try again.");
            },
        });
    };

    const handleDelete = async (event: PersonalEvent) => {
        const confirmed = await confirm({
            title: "Delete Event",
            description: `Are you sure you want to delete "${event.title}"? This action cannot be undone.`,
            confirmLabel: "Delete",
            cancelLabel: "Keep",
            variant: "danger",
        });
        if (!confirmed) return;
        deleteEvent.mutate(event.id, {
            onSuccess: () => toast.success("Event deleted."),
            onError: () => toast.error("Failed to delete event. Please try again."),
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-[30px] font-serif text-ink font-bold mb-1">Personal Events</h1>
                    <p className="text-ink/45 font-serif italic">Manage your consultations, follow-ups, and personal calendar</p>
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
                            <div key={event.id} className="prem-card rounded-xl p-4 flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-[14px] font-serif font-semibold text-ink truncate" title={event.title}>{event.title}</h3>
                                        <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-[12px] text-ink/45">
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
                                        <p className="text-[12px] text-ink/45 mt-1">{event.description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(event)}
                                    className="p-2.5 rounded-md hover:bg-status-error/10 transition-colors shrink-0"
                                    aria-label={`Delete ${event.title}`}
                                >
                                    <Trash2 className="w-4 h-4 text-ink/45 hover:text-status-error" />
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

            {confirmDialog}
        </div>
    );
}
