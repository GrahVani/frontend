"use client";

import React from "react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import FormFieldGroup from "./FormFieldGroup";
import { Plus, Trash2 } from "lucide-react";

interface TeamMember {
    name: string;
    birth_date: string;
    current_role: string;
}

interface TeamMembersFormProps {
    onSubmit: (data: {
        team_name: string;
        team_members: TeamMember[];
        project_type?: string;
    }) => void;
    isPending: boolean;
    label?: string;
}

export default function TeamMembersForm({ onSubmit, isPending, label }: TeamMembersFormProps) {
    const [teamName, setTeamName] = React.useState("");
    const [projectType, setProjectType] = React.useState("");
    const [members, setMembers] = React.useState<TeamMember[]>([
        { name: "", birth_date: "", current_role: "" },
        { name: "", birth_date: "", current_role: "" },
    ]);

    const addMember = () => {
        setMembers([...members, { name: "", birth_date: "", current_role: "" }]);
    };

    const removeMember = (index: number) => {
        if (members.length <= 2) return;
        setMembers(members.filter((_, i) => i !== index));
    };

    const updateMember = (index: number, field: keyof TeamMember, value: string) => {
        const updated = [...members];
        updated[index] = { ...updated[index], [field]: value };
        setMembers(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName.trim()) return;
        const validMembers = members.filter(m => m.name.trim() && m.birth_date);
        if (validMembers.length < 2) return;
        onSubmit({
            team_name: teamName.trim(),
            team_members: validMembers,
            ...(projectType.trim() ? { project_type: projectType.trim() } : {}),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ParchmentInput label="Team Name" value={teamName} onChange={e => setTeamName(e.target.value)} required placeholder="Enter team name" />
                <ParchmentInput label="Project Type" value={projectType} onChange={e => setProjectType(e.target.value)} placeholder="Optional — e.g. Product Launch" />
            </div>

            <FormFieldGroup label="Team Members (min 2)">
                {members.map((member, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                        <ParchmentInput label="Name" value={member.name} onChange={e => updateMember(index, 'name', e.target.value)} placeholder="Member name" required />
                        <ParchmentInput label="Birth Date" type="date" value={member.birth_date} onChange={e => updateMember(index, 'birth_date', e.target.value)} required />
                        <ParchmentInput label="Role" value={member.current_role} onChange={e => updateMember(index, 'current_role', e.target.value)} placeholder="e.g. Developer" />
                        <button type="button" onClick={() => removeMember(index)} disabled={members.length <= 2} className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors" aria-label="Remove member">
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
                {isPending ? "Calculating..." : label || "Analyze Team"}
            </button>
        </form>
    );
}
