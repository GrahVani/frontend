"use client";

import React from "react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import ClientAutoFill from "./ClientAutoFill";
import type { FieldConfig } from "@/lib/numerology-constants";

interface CustomFieldsFormProps {
    fields: FieldConfig[];
    onSubmit: (data: Record<string, unknown>) => void;
    isPending: boolean;
    label?: string;
    /** Show client auto-fill if any field is named full_name or birth_date */
    showAutoFill?: boolean;
}

export default function CustomFieldsForm({ fields, onSubmit, isPending, label, showAutoFill = true }: CustomFieldsFormProps) {
    const [values, setValues] = React.useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        fields.forEach(f => { initial[f.name] = ""; });
        return initial;
    });

    const setValue = (name: string, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Build payload, filtering empty optional fields
        const data: Record<string, unknown> = {};
        fields.forEach(f => {
            const v = values[f.name]?.trim();
            if (v) {
                if (f.type === 'number') {
                    data[f.name] = Number(v);
                } else if (v === 'true') {
                    data[f.name] = true;
                } else if (v === 'false') {
                    data[f.name] = false;
                } else {
                    data[f.name] = v;
                }
            }
        });
        onSubmit(data);
    };

    const hasAutoFillFields = showAutoFill && fields.some(f => f.name === 'full_name' || f.name === 'birth_date');

    const handleAutoFill = (data: { full_name: string; birth_date: string }) => {
        if (fields.some(f => f.name === 'full_name')) setValue('full_name', data.full_name);
        if (fields.some(f => f.name === 'birth_date')) setValue('birth_date', data.birth_date);
    };

    const requiredFieldsFilled = fields.filter(f => f.required).every(f => values[f.name]?.trim());

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {hasAutoFillFields && <ClientAutoFill onFill={handleAutoFill} />}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map(field => {
                    if (field.type === 'select' && field.options) {
                        return (
                            <ParchmentSelect
                                key={field.name}
                                label={field.label}
                                value={values[field.name] || ""}
                                onChange={e => setValue(field.name, e.target.value)}
                                options={field.options}
                                required={field.required}
                            />
                        );
                    }
                    return (
                        <ParchmentInput
                            key={field.name}
                            label={field.label}
                            type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
                            value={values[field.name] || ""}
                            onChange={e => setValue(field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                        />
                    );
                })}
            </div>

            <button
                type="submit"
                disabled={isPending || !requiredFieldsFilled}
                className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] font-medium"
            >
                {isPending ? "Calculating..." : label || "Analyze"}
            </button>
        </form>
    );
}
