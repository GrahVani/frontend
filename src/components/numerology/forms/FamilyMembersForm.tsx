"use client";

import React from "react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import ParchmentSelect from "@/components/ui/ParchmentSelect";
import FormFieldGroup from "./FormFieldGroup";
import ClientAutoFill from "./ClientAutoFill";
import { Plus, Trash2 } from "lucide-react";

const FAMILY_ROLES = [
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "spouse", label: "Spouse" },
    { value: "sibling", label: "Sibling" },
    { value: "grandparent", label: "Grandparent" },
    { value: "other", label: "Other" },
];

interface FamilyMember {
    name: string;
    birth_date: string;
    role: string;
}

interface FamilyMembersFormProps {
    onSubmit: (data: {
        primary_member: { name: string; birth_date: string; role: string };
        family_members: FamilyMember[];
    }) => void;
    isPending: boolean;
    label?: string;
}

export default function FamilyMembersForm({ onSubmit, isPending, label }: FamilyMembersFormProps) {
    const [primaryName, setPrimaryName] = React.useState("");
    const [primaryDate, setPrimaryDate] = React.useState("");
    const [primaryRole, setPrimaryRole] = React.useState("father");
    const [members, setMembers] = React.useState<FamilyMember[]>([
        { name: "", birth_date: "", role: "spouse" },
    ]);

    const addMember = () => {
        setMembers([...members, { name: "", birth_date: "", role: "son" }]);
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
    };

    const updateMember = (index: number, field: keyof FamilyMember, value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryName.trim() || !primaryDate) return;
        const validMembers = members.filter(m => m.name.trim() && m.birth_date);
        if (validMembers.length === 0) return;
        onSubmit({
            primary_member: { name: primaryName.trim(), birth_date: primaryDate, role: primaryRole },
            family_members: validMembers,
        });
    };

    const handleAutoFill = (data: { full_name: string; birth_date: string }) => {
        setPrimaryName(data.full_name);
        setPrimaryDate(data.birth_date);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ClientAutoFill onFill={handleAutoFill} />

            <FormFieldGroup label="Primary Member">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <ParchmentInput label="Name" value={primaryName} onChange={e => setPrimaryName(e.target.value)} required placeholder="Primary member name" />
                    <ParchmentInput label="Birth Date" type="date" value={primaryDate} onChange={e => setPrimaryDate(e.target.value)} required />
                    <ParchmentSelect label="Role" value={primaryRole} onChange={e => setPrimaryRole(e.target.value)} options={FAMILY_ROLES} />
                </div>
            </FormFieldGroup>

            <FormFieldGroup label="Family Members">
                {members.map((member, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto_auto] gap-3 items-end">
                        <ParchmentInput label="Name" value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} placeholder="Member name" required />
                        <ParchmentInput label="Birth Date" type="date" value={member.birth_date} onChange={e => updateMember(index, 'birth_date', e.target.value)} required />
                        <ParchmentSelect label="Role" value={member.role} onChange={e => updateMember(index, 'role', e.target.value)} options={FAMILY_ROLES} />
                        <button type="button" onClick={() => removeMember(index)} className="p-2 text-red-500 hover:text-red-700 transition-colors" aria-label="Remove member">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addMember} className="inline-flex items-center gap-2 text-[12px] font-medium text-gold-dark hover:text-amber-800 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Member
                </button>
            </FormFieldGroup>

            <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-[14px] font-medium"
            >
                {isPending ? "Calculating..." : label || "Analyze Family Harmony"}
            </button>
        </form>
    );
}
