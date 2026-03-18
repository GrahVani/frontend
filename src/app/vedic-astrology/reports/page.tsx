"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Cpu, Sparkles, Loader2 } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useClient } from '@/hooks/queries/useClients';
import { useBlueprints, useReports } from '@/hooks/queries/useGrantha';
import BlueprintCard from '@/components/grantha/BlueprintCard';
import ReportHistoryTable from '@/components/grantha/ReportHistoryTable';
import ClientSelectorModal from '@/components/grantha/ClientSelectorModal';
import ReportGenerationModal from '@/components/grantha/ReportGenerationModal';
import type { Blueprint } from '@/types/grantha';
import type { Client } from '@/types/client';

function buildBlueprintNameMap(blueprints: Blueprint[]): Record<string, string> {
    const map: Record<string, string> = {};
    for (const bp of blueprints) map[bp.id] = bp.name;
    return map;
}

export default function VedicReportsPage() {
    const { clientDetails } = useVedicClient();
    const { data: blueprints, isLoading: loadingBlueprints } = useBlueprints();
    const { data: reportsData, isLoading: loadingReports } = useReports({ pageSize: 20 });

    // Fetch full client record from API (includes coordinates, all birth data)
    const { data: fullClient } = useClient(clientDetails?.id);

    // Modal state
    const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [showClientSelector, setShowClientSelector] = useState(false);
    const [showGenerationModal, setShowGenerationModal] = useState(false);

    const blueprintNames = useMemo(
        () => buildBlueprintNameMap(blueprints || []),
        [blueprints],
    );

    // Handle "Generate" click on a blueprint card
    const handleGenerateClick = (blueprint: Blueprint) => {
        setSelectedBlueprint(blueprint);

        // Use full client from API (has coordinates), fall back to context mapping
        if (fullClient) {
            setSelectedClient(fullClient);
            setShowGenerationModal(true);
        } else if (clientDetails) {
            // Fallback: map VedicClientDetails (may lack coordinates)
            const mapped: Client = {
                id: clientDetails.id || '',
                fullName: clientDetails.name,
                gender: clientDetails.gender,
                birthDate: clientDetails.dateOfBirth,
                birthTime: clientDetails.timeOfBirth,
                birthPlace: clientDetails.placeOfBirth?.city,
                birthLatitude: clientDetails.placeOfBirth?.latitude,
                birthLongitude: clientDetails.placeOfBirth?.longitude,
            };
            setSelectedClient(mapped);
            setShowGenerationModal(true);
        } else {
            setShowClientSelector(true);
        }
    };

    // Client selected from search modal
    const handleClientSelected = (client: Client) => {
        setSelectedClient(client);
        setShowClientSelector(false);
        setShowGenerationModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[30px] font-serif text-ink font-black tracking-tight mb-1 flex items-center gap-3">
                        <Cpu className="w-8 h-8 text-gold-dark" />
                        Report Lab
                    </h1>
                    <p className="text-gold-dark font-serif text-[14px]">
                        AI-powered astrological report generation via Grantha Engine.
                    </p>
                </div>
            </div>

            {/* Blueprint Grid */}
            {loadingBlueprints ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-gold-primary animate-spin mr-3" />
                    <span className="font-serif text-ink/50 text-[15px]">Loading blueprints...</span>
                </div>
            ) : blueprints && blueprints.length > 0 ? (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-gold-dark" />
                        <h3 className="font-serif font-bold text-ink text-[18px]">
                            Available Blueprints
                        </h3>
                        <span className="text-[11px] text-ink/30 font-bold uppercase tracking-widest ml-2">
                            {blueprints.length} {blueprints.length === 1 ? 'type' : 'types'}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blueprints.map((blueprint) => (
                            <BlueprintCard
                                key={blueprint.id}
                                blueprint={blueprint}
                                onGenerate={handleGenerateClick}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="prem-card rounded-2xl p-10 text-center">
                    <p className="text-[14px] text-ink/40 font-serif">No blueprints available. Check Grantha connection.</p>
                </div>
            )}

            {/* Recent Reports */}
            <div>
                <h3 className="font-serif font-bold text-ink text-[18px] mb-4">Recent Reports</h3>
                <ReportHistoryTable
                    reports={reportsData?.data || []}
                    isLoading={loadingReports}
                    blueprintNames={blueprintNames}
                />
            </div>

            {/* Client Selector Modal */}
            <ClientSelectorModal
                open={showClientSelector}
                onClose={() => setShowClientSelector(false)}
                onSelect={handleClientSelected}
            />

            {/* Report Generation Modal */}
            <ReportGenerationModal
                open={showGenerationModal}
                onClose={() => setShowGenerationModal(false)}
                blueprint={selectedBlueprint}
                client={selectedClient}
            />
        </div>
    );
}
