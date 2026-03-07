"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ClientListRow from "@/components/clients/ClientListRow";
import { Client } from "@/types/client";
import { useRouter } from 'next/navigation';
import { useClients } from "@/hooks/queries/useClients";
import { useClientMutations } from "@/hooks/mutations/useClientMutations";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { TYPOGRAPHY } from "@/design-tokens/typography";

const deriveNames = (client: Client): Client => {
    if (client.firstName && client.lastName) return client;
    if (client.fullName) {
        const parts = client.fullName.split(' ');
        return {
            ...client,
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            placeOfBirth: client.birthPlace || client.placeOfBirth,
            dateOfBirth: client.birthDate || client.dateOfBirth,
            timeOfBirth: client.birthTime || client.timeOfBirth,
            phone: client.phonePrimary || client.phone,
        };
    }
    return client;
};

export default function ClientsPage() {
    const router = useRouter();
    const toast = useToast();
    const { confirm, dialog } = useConfirmDialog();
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });

    const { data, isLoading: loading, error: queryError, refetch } = useClients({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
    });

    const { deleteClient } = useClientMutations();

    const clients = useMemo(() => data?.clients?.map(deriveNames) || [], [data?.clients]);
    const total = data?.pagination?.total || 0;
    const totalPages = data?.pagination?.totalPages || 1;
    const error = queryError ? (queryError as Error).message : null;

    const handleSelectClient = useCallback((c: Client) => {
        router.push(`/clients/${c.id}`);
    }, [router]);

    const handleEditClient = useCallback((client: Client) => {
        router.push(`/clients/${client.id}`);
    }, [router]);

    const handleDeleteClient = useCallback(async (client: Client) => {
        const confirmed = await confirm({
            title: "Delete Client",
            description: `Are you certain you wish to delete the record of ${client.firstName || client.fullName || 'this client'}? This action cannot be undone.`,
            confirmLabel: "Delete",
            variant: "danger",
        });

        if (!confirmed) return;

        try {
            await deleteClient.mutateAsync(client.id);
            toast.success("Client record deleted successfully.");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to delete client record. Please try again.';
            toast.error(message);
        }
    }, [confirm, deleteClient, toast]);

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-700 py-4 px-2 lg:px-4">
            {dialog}

            <div className={cn(TYPOGRAPHY.label, "!text-xs !tracking-widest !font-bold !text-bronze-dark !mb-0")}>
                Client Almanac
            </div>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "text-3xl !font-bold !text-ink tracking-tight !mb-2")}>
                        Client Registry
                    </h1>
                    <p className={cn(TYPOGRAPHY.label, "!text-muted italic !text-lg !mb-0")}>
                        Client records and their astrological profiles.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/clients/new">
                        <Button variant="primary">+ Add Client</Button>
                    </Link>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-softwhite backdrop-blur-md p-5 rounded-2xl border border-antique shadow-card relative overflow-hidden group">
                <div className="absolute inset-0 bg-parchment opacity-50 pointer-events-none" />
                <div className="relative z-10">
                    <ParchmentInput
                        placeholder="Search clients by name or city..."
                        aria-label="Search clients"
                        icon={<Search className="w-5 h-5 text-gold-dark" />}
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPagination(prev => ({ ...prev, page: 1 })); }}
                        className="bg-parchment border-antique text-ink placeholder:text-muted focus:border-gold-primary h-14 text-lg rounded-2xl"
                    />
                </div>

                {error && (
                    <div className="mt-4 flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg" role="alert">
                        <div className="flex items-center gap-2 text-amber-700 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                        <button
                            onClick={() => refetch()}
                            aria-label="Retry loading clients"
                            className="flex items-center gap-1 text-amber-700 hover:text-amber-800 text-sm font-medium"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Client List */}
            <div className="space-y-4" aria-busy={loading} aria-live="polite" aria-label="Client list">
                {loading ? (
                    <SkeletonTable rows={6} cols={5} />
                ) : clients.length > 0 ? (
                    <ul className="grid grid-cols-1 gap-4 list-none p-0 m-0" aria-label={`${clients.length} clients`}>
                        {clients.map(client => (
                            <li key={client.id}>
                                <ClientListRow
                                    client={client}
                                    onSelect={handleSelectClient}
                                    onEdit={handleEditClient}
                                    onDelete={handleDeleteClient}
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 rounded-2xl bg-softwhite border border-antique">
                        {searchQuery ? (
                            <p className="font-serif text-2xl italic text-muted">
                                No clients match your search.
                            </p>
                        ) : (
                            <>
                                <p className="font-serif text-2xl italic text-muted mb-4">
                                    No clients yet.
                                </p>
                                <Link href="/clients/new">
                                    <Button variant="primary">+ Create First Client</Button>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="pt-8 border-t border-divider flex items-center justify-between">
                <span className="font-serif text-xs text-bronze font-black uppercase tracking-[0.3em]">
                    {total} client{total !== 1 ? 's' : ''}
                </span>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page <= 1}
                            aria-label="Previous page"
                            className="p-2.5 rounded-lg border border-antique hover:bg-parchment disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-bronze" />
                        </button>
                        <span className="font-serif text-sm text-ink px-3">
                            {pagination.page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page >= totalPages}
                            aria-label="Next page"
                            className="p-2.5 rounded-lg border border-antique hover:bg-parchment disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4 text-bronze" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
