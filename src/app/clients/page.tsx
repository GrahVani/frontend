"use client";

import React, { useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, AlertCircle, RefreshCw, ChevronLeft, ChevronRight, UserPlus, Users } from 'lucide-react';
import Button from "@/components/ui/Button";
import ClientToolbar from "@/components/clients/ClientToolbar";
import ClientListRow from "@/components/clients/ClientListRow";
import ClientTableView from "@/components/clients/ClientTableView";
import { Client } from "@/types/client";
import { useRouter } from 'next/navigation';
import { useClients } from "@/hooks/queries/useClients";
import { useClientMutations } from "@/hooks/mutations/useClientMutations";
import { useClientFilters } from "@/hooks/useClientFilters";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { useToast } from "@/context/ToastContext";
import { SkeletonTable } from "@/components/ui/Skeleton";

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
    const {
        filters,
        setFilter,
        clearFilter,
        clearAllFilters,
        activeFilterChips,
        activeFilterCount,
        queryParams,
    } = useClientFilters();

    const { data, isLoading: loading, error: queryError, refetch } = useClients(queryParams);
    const { deleteClient } = useClientMutations();

    const clients = useMemo(() => data?.clients?.map(deriveNames) || [], [data?.clients]);
    const total = data?.pagination?.total || 0;
    const totalPages = data?.pagination?.totalPages || 1;
    const error = queryError ? (queryError as Error).message : null;

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
        <div className="w-full space-y-3 animate-in fade-in duration-700 py-4">
            {dialog}

            {/* Toolbar — search, filters, view toggle, add button */}
            <ClientToolbar
                filters={filters}
                setFilter={setFilter}
                clearFilter={clearFilter}
                clearAllFilters={clearAllFilters}
                activeFilterChips={activeFilterChips}
                activeFilterCount={activeFilterCount}
                total={total}
            />

            {/* Error Banner */}
            {error && (
                <div className="prem-card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] font-medium" style={{ color: '#8B6914' }}>
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                    <button
                        onClick={() => refetch()}
                        aria-label="Retry loading clients"
                        className="flex items-center gap-1.5 text-[12px] font-bold hover:underline"
                        style={{ color: '#8B6914' }}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Retry
                    </button>
                </div>
            )}

            {/* Client List */}
            <div aria-busy={loading} aria-live="polite" aria-label="Client list">
                {loading ? (
                    <div className="prem-card p-6">
                        <SkeletonTable rows={8} cols={5} />
                    </div>
                ) : clients.length > 0 ? (
                    filters.viewMode === 'table' ? (
                        <ClientTableView
                            clients={clients}
                            onEdit={handleEditClient}
                            onDelete={handleDeleteClient}
                        />
                    ) : (
                        <div className="prem-card glass-shimmer relative overflow-hidden">
                            {clients.map((client, idx) => (
                                <React.Fragment key={client.id}>
                                    {idx > 0 && (
                                        <div className="mx-5" style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(201,162,77,0.12) 20%, rgba(220,201,166,0.20) 50%, rgba(201,162,77,0.12) 80%, transparent 100%)' }} />
                                    )}
                                    <ClientListRow
                                        client={client}
                                        onEdit={handleEditClient}
                                        onDelete={handleDeleteClient}
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="prem-card glass-shimmer relative overflow-hidden text-center py-20">
                        {filters.search || activeFilterCount > 0 ? (
                            <div>
                                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(201,162,77,0.10) 0%, rgba(139,90,43,0.05) 100%)',
                                         border: '1px solid rgba(201,162,77,0.15)',
                                     }}>
                                    <Search className="w-6 h-6 text-gold-dark/30" />
                                </div>
                                <p className="font-serif text-[18px] text-ink/50 font-semibold">
                                    No clients match your search
                                </p>
                                <p className="text-[13px] text-ink/35 mt-2 max-w-[300px] mx-auto">Try adjusting your filters or search terms.</p>
                                {activeFilterCount > 0 && (
                                    <button onClick={clearAllFilters}
                                            className="mt-4 text-[13px] font-semibold text-gold-dark hover:underline underline-offset-2">
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                                     style={{
                                         background: 'linear-gradient(135deg, rgba(201,162,77,0.12) 0%, rgba(139,90,43,0.06) 100%)',
                                         border: '1px solid rgba(201,162,77,0.18)',
                                     }}>
                                    <Users className="w-6 h-6 text-gold-dark/35" />
                                </div>
                                <p className="font-serif text-[18px] text-ink/50 font-semibold mb-1.5">
                                    No clients yet
                                </p>
                                <p className="text-[13px] text-ink/35 mb-5">Begin by adding your first client record.</p>
                                <Link href="/clients/new">
                                    <Button variant="golden" size="sm" icon={UserPlus}>Create First Client</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
                <div className="prem-card px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] font-mono font-bold text-ink/40 tabular-nums tracking-wide">
                            PAGE {filters.page}/{totalPages}
                        </span>
                        <div className="w-px h-4" style={{ background: 'rgba(220,201,166,0.30)' }} />
                        <span className="text-[12px] text-ink/35 font-medium">
                            {total} client{total !== 1 ? 's' : ''} total
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setFilter('page', filters.page - 1)}
                            disabled={filters.page <= 1}
                            aria-label="Previous page"
                            className="p-2 rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-parchment/60"
                            style={{
                                border: '1px solid rgba(220,201,166,0.30)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                            }}
                        >
                            <ChevronLeft className="w-4 h-4 text-bronze-dark/70" />
                        </button>
                        <button
                            onClick={() => setFilter('page', filters.page + 1)}
                            disabled={filters.page >= totalPages}
                            aria-label="Next page"
                            className="p-2 rounded-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:bg-parchment/60"
                            style={{
                                border: '1px solid rgba(220,201,166,0.30)',
                                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
                            }}
                        >
                            <ChevronRight className="w-4 h-4 text-bronze-dark/70" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
