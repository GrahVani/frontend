"use client";

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, MapPin, Calendar, Clock } from 'lucide-react';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import type { Client } from '@/types/client';
import { useVedicClient } from '@/context/VedicClientContext';

interface ClientTableViewProps {
    clients: Client[];
    onEdit?: (client: Client) => void;
    onDelete?: (client: Client) => void;
}

export default function ClientTableView({ clients, onEdit, onDelete }: ClientTableViewProps) {
    const router = useRouter();
    const { setClientDetails } = useVedicClient();

    const handleRowClick = useCallback((client: Client) => {
        setClientDetails({
            id: client.id,
            name: client.fullName || `${client.firstName || ''} ${client.lastName || ''}`.trim(),
            gender: client.gender || "male",
            dateOfBirth: client.dateOfBirth || client.birthDate || '',
            timeOfBirth: client.timeOfBirth || client.birthTime || "12:00",
            placeOfBirth: { city: client.placeOfBirth || client.birthPlace || '' },
            rashi: client.rashi,
        });
        router.push(`/clients/${client.id}`);
    }, [router, setClientDetails]);

    const columns: DataGridColumn<Client>[] = [
        {
            key: 'fullName',
            header: 'Client',
            sortable: true,
            width: 'min-w-[240px]',
            render: (row) => {
                const name = row.fullName || `${row.firstName || ''} ${row.lastName || ''}`.trim() || 'Unknown';
                const initial = name[0]?.toUpperCase() || '?';
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-serif font-bold text-gold-dark"
                             style={{
                                 background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                                 border: '1px solid rgba(201,162,77,0.25)',
                                 boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
                             }}>
                            {initial}
                        </div>
                        <span className="font-semibold text-ink text-[14px] truncate">{name}</span>
                    </div>
                );
            },
        },
        {
            key: 'birthPlace',
            header: 'Birth Place',
            sortable: true,
            width: 'w-36',
            render: (row) => {
                const place = row.placeOfBirth || row.birthPlace;
                if (!place) return <span className="text-ink/20">\u2014</span>;
                return (
                    <span className="flex items-center gap-1.5 text-[13px] text-ink/70 font-medium">
                        <MapPin className="w-3 h-3 text-ink/30 shrink-0" />
                        {place}
                    </span>
                );
            },
        },
        {
            key: 'birthDate',
            header: 'Birth Date',
            sortable: true,
            width: 'w-36',
            render: (row) => {
                const date = row.dateOfBirth || row.birthDate;
                if (!date) return <span className="text-ink/20">\u2014</span>;
                try {
                    return (
                        <span className="flex items-center gap-1.5 text-[13px] text-ink/70 font-medium">
                            <Calendar className="w-3 h-3 text-ink/30 shrink-0" />
                            {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    );
                } catch { return <span className="text-ink/20">\u2014</span>; }
            },
        },
        {
            key: 'birthTime',
            header: 'Time',
            width: 'w-24',
            render: (row) => {
                const time = row.timeOfBirth || row.birthTime;
                if (!time) return <span className="text-ink/20">\u2014</span>;
                return (
                    <span className="flex items-center gap-1.5 text-[13px] text-ink/60 font-mono">
                        <Clock className="w-3 h-3 text-ink/25 shrink-0" />
                        {time}
                    </span>
                );
            },
        },
        {
            key: 'rashi',
            header: 'Rashi',
            sortable: true,
            width: 'w-28',
            render: (row) => {
                if (!row.rashi) return <span className="text-ink/20">\u2014</span>;
                return (
                    <span className="inline-flex text-[11px] font-bold text-gold-dark/80 px-2 py-0.5 rounded-md uppercase tracking-wide"
                          style={{
                              background: 'linear-gradient(135deg, rgba(201,162,77,0.10) 0%, rgba(201,162,77,0.05) 100%)',
                              border: '1px solid rgba(201,162,77,0.18)',
                          }}>
                        {row.rashi}
                    </span>
                );
            },
        },
        {
            key: 'phonePrimary',
            header: 'Phone',
            width: 'w-32',
            render: (row) => {
                const phone = row.phone || row.phonePrimary;
                if (!phone) return <span className="text-ink/20">\u2014</span>;
                return (
                    <span className="text-[13px] text-ink/60 font-medium">{phone}</span>
                );
            },
        },
        {
            key: 'actions',
            header: '',
            width: 'w-20',
            align: 'right',
            render: (row) => (
                <div className="flex items-center gap-0.5 justify-end">
                    <button
                        className="p-1.5 rounded-lg hover:bg-surface-warm/60 transition-all"
                        style={{ border: '1px solid transparent' }}
                        title="Edit"
                        aria-label={`Edit ${row.fullName || row.firstName}`}
                        onClick={(e) => { e.stopPropagation(); onEdit?.(row); }}
                    >
                        <Edit2 className="w-3.5 h-3.5 text-ink/30 hover:text-gold-dark transition-colors" />
                    </button>
                    <button
                        className="p-1.5 rounded-lg hover:bg-red-50/50 transition-all"
                        style={{ border: '1px solid transparent' }}
                        title="Delete"
                        aria-label={`Delete ${row.fullName || row.firstName}`}
                        onClick={(e) => { e.stopPropagation(); onDelete?.(row); }}
                    >
                        <Trash2 className="w-3.5 h-3.5 text-ink/30 hover:text-status-error transition-colors" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="prem-card glass-shimmer relative overflow-hidden">
            <DataGrid
                columns={columns}
                data={clients}
                rowKey={(row) => row.id}
                onRowClick={handleRowClick}
                stickyHeader
                striped
                compact
                maxHeight="calc(100vh - 280px)"
                ariaLabel="Client list"
                cellPadding="px-4 py-3"
                emptyState={
                    <div className="py-14 text-center">
                        <p className="text-ink/35 font-serif text-[15px]">No clients found</p>
                    </div>
                }
            />
        </div>
    );
}
