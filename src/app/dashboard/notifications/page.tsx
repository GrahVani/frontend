"use client";

import { useState } from "react";
import { Bell, BellOff, Check, CheckCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning";
    read: boolean;
    timestamp: string;
}

function NotificationItem({ notification, onToggleRead }: {
    notification: Notification;
    onToggleRead: (id: string) => void;
}) {
    const badgeVariant = notification.type === "success" ? "success" : notification.type === "warning" ? "warning" : "info";

    return (
        <div
            className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                notification.read
                    ? "bg-softwhite border-antique/50 opacity-70"
                    : "bg-parchment/30 border-gold-primary/20"
            }`}
        >
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${notification.read ? "bg-antique" : "bg-gold-primary"}`} aria-label={notification.read ? "Read" : "Unread"} role="img" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-serif font-semibold text-ink truncate" title={notification.title}>{notification.title}</h3>
                    <Badge variant={badgeVariant} size="sm">{notification.type}</Badge>
                </div>
                <p className="text-sm text-muted-refined">{notification.message}</p>
                <time className="text-xs text-muted-refined/70 mt-1 block">{notification.timestamp}</time>
            </div>
            <button
                onClick={() => onToggleRead(notification.id)}
                className="shrink-0 p-2.5 rounded-md hover:bg-parchment transition-colors"
                aria-label={notification.read ? "Mark as unread" : "Mark as read"}
            >
                {notification.read ? (
                    <CheckCheck className="w-4 h-4 text-muted-refined" />
                ) : (
                    <Check className="w-4 h-4 text-gold-primary" />
                )}
            </button>
        </div>
    );
}

export default function NotificationsPage() {
    // Placeholder: will be replaced with useDashboardNotifications() hook
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const toggleRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
        );
    };

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const filtered = filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications;

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-serif text-ink font-bold mb-1">Notifications</h1>
                    <p className="text-muted-refined font-serif italic">
                        {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                    </p>
                </div>
                {notifications.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex rounded-lg border border-antique overflow-hidden">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                    filter === "all" ? "bg-gold-dark text-softwhite" : "bg-softwhite text-muted-refined hover:bg-parchment"
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter("unread")}
                                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                                    filter === "unread" ? "bg-gold-dark text-softwhite" : "bg-softwhite text-muted-refined hover:bg-parchment"
                                }`}
                            >
                                Unread
                            </button>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-medium text-gold-primary hover:text-gold-dark transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-softwhite border border-antique rounded-xl p-6">
                {filtered.length > 0 ? (
                    <div className="space-y-3">
                        {filtered.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onToggleRead={toggleRead}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={filter === "unread" ? BellOff : Bell}
                        title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
                        description={
                            filter === "unread"
                                ? "You're all caught up! Switch to 'All' to see previous notifications."
                                : "Notifications about client updates, system alerts, and important reminders will appear here."
                        }
                    />
                )}
            </div>
        </div>
    );
}
