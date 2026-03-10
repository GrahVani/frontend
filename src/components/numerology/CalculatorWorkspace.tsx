"use client";

import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { NumerologyEndpointMeta } from "@/lib/numerology-constants";
import { useChaldeanService } from "@/hooks/mutations/useNumerologyMutation";
import BaseInputForm from "./forms/BaseInputForm";
import TwoPersonForm from "./forms/TwoPersonForm";
import FamilyMembersForm from "./forms/FamilyMembersForm";
import TeamMembersForm from "./forms/TeamMembersForm";
import CustomFieldsForm from "./forms/CustomFieldsForm";
import ServiceResultLayout from "./results/ServiceResultLayout";

interface CalculatorWorkspaceProps {
    endpoint: NumerologyEndpointMeta;
    category: string;
    onBack: () => void;
}

export default function CalculatorWorkspace({ endpoint, category, onBack }: CalculatorWorkspaceProps) {
    const mutation = useChaldeanService(category, endpoint.slug);
    const Icon = endpoint.icon;

    const handleSubmit = (data: Record<string, unknown>) => {
        mutation.mutate(data);
    };

    const renderForm = () => {
        switch (endpoint.inputType) {
            case 'base':
                return <BaseInputForm onSubmit={handleSubmit} isPending={mutation.isPending} label={endpoint.name} />;
            case 'twoPerson':
                return <TwoPersonForm onSubmit={handleSubmit as any} isPending={mutation.isPending} label={endpoint.name} />;
            case 'family':
                return <FamilyMembersForm onSubmit={handleSubmit as any} isPending={mutation.isPending} label={endpoint.name} />;
            case 'team':
                return <TeamMembersForm onSubmit={handleSubmit as any} isPending={mutation.isPending} label={endpoint.name} />;
            case 'custom':
                if (!endpoint.extraFields?.length) {
                    return <BaseInputForm onSubmit={handleSubmit} isPending={mutation.isPending} label={endpoint.name} />;
                }
                return <CustomFieldsForm fields={endpoint.extraFields} onSubmit={handleSubmit} isPending={mutation.isPending} label={endpoint.name} />;
            default:
                return <BaseInputForm onSubmit={handleSubmit} isPending={mutation.isPending} label={endpoint.name} />;
        }
    };

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header bar: Back + Calculator title */}
            <div className="prem-card relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-active-glow to-transparent" />
                <div className="p-4 md:p-5 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-primary/70 hover:text-primary hover:bg-gold-primary/5 transition-colors border border-gold-primary/15"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </button>
                    <div className="w-px h-8 bg-gold-primary/15" />
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(180,130,50,0.08) 100%)',
                            border: '1px solid rgba(201,162,77,0.25)',
                        }}
                    >
                        <Icon className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-[18px] font-bold font-serif text-primary truncate">{endpoint.name}</h2>
                        <p className="text-[12px] text-amber-800/60 truncate">{endpoint.description}</p>
                    </div>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-amber-100/80 text-amber-700 border border-amber-200/60 shrink-0">
                        <Sparkles className="w-3 h-3" />
                        AI-Powered
                    </span>
                </div>
            </div>

            {/* Form card */}
            <div className="prem-card p-5 md:p-6">
                <h3 className="text-[14px] font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-gradient-to-b from-active-glow to-gold-primary" />
                    Enter Details
                </h3>
                {renderForm()}
            </div>

            {/* Error display */}
            {mutation.isError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-[13px] text-red-700" role="alert">
                    {mutation.error.message}
                </div>
            )}

            {/* Results */}
            {mutation.data && <ServiceResultLayout response={mutation.data} />}

            {/* Empty state — before calculation */}
            {!mutation.data && !mutation.isPending && !mutation.isError && (
                <div className="prem-card p-10 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3"
                        style={{
                            background: 'rgba(201,162,77,0.06)',
                            border: '1px solid rgba(201,162,77,0.12)',
                        }}
                    >
                        <Icon className="w-6 h-6 text-amber-600/40" />
                    </div>
                    <p className="text-[13px] text-primary/40">Fill in the details above and click Calculate to see results</p>
                </div>
            )}
        </div>
    );
}
