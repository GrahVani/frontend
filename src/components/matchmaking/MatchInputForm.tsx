"use client";

import { useState } from "react";
import { User, Calendar, Clock, MapPin } from "lucide-react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import Button from "@/components/ui/Button";
import type { BirthDetails } from "@/types/matchmaking.types";

interface MatchInputFormProps {
    onSubmit: (bride: BirthDetails, groom: BirthDetails) => void;
    loading?: boolean;
}

function BirthDetailsForm({ label, gender, details, onChange }: {
    label: string;
    gender: "male" | "female";
    details: Omit<BirthDetails, "gender">;
    onChange: (d: Omit<BirthDetails, "gender">) => void;
}) {
    return (
        <div className="bg-softwhite border border-antique rounded-xl p-5">
            <h3 className="text-xs font-bold text-header-border tracking-widest font-serif uppercase mb-4">
                {label} Details
            </h3>
            <div className="space-y-4">
                <ParchmentInput
                    label="Full Name"
                    type="text"
                    placeholder={gender === "female" ? "Bride's name" : "Groom's name"}
                    icon={<User className="w-4 h-4" />}
                    value={details.name}
                    onChange={(e) => onChange({ ...details, name: e.target.value })}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <ParchmentInput
                        label="Date of Birth"
                        type="date"
                        value={details.dateOfBirth}
                        onChange={(e) => onChange({ ...details, dateOfBirth: e.target.value })}
                        required
                    />
                    <ParchmentInput
                        label="Time of Birth"
                        type="time"
                        value={details.timeOfBirth}
                        onChange={(e) => onChange({ ...details, timeOfBirth: e.target.value })}
                        required
                    />
                </div>
                <ParchmentInput
                    label="Place of Birth"
                    type="text"
                    placeholder="City, State"
                    icon={<MapPin className="w-4 h-4" />}
                    value={details.placeOfBirth}
                    onChange={(e) => onChange({ ...details, placeOfBirth: e.target.value })}
                    required
                />
            </div>
        </div>
    );
}

const EMPTY_DETAILS = { name: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "" };

export default function MatchInputForm({ onSubmit, loading }: MatchInputFormProps) {
    const [bride, setBride] = useState(EMPTY_DETAILS);
    const [groom, setGroom] = useState(EMPTY_DETAILS);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(
            { ...bride, gender: "female" },
            { ...groom, gender: "male" },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BirthDetailsForm label="Bride" gender="female" details={bride} onChange={setBride} />
                <BirthDetailsForm label="Groom" gender="male" details={groom} onChange={setGroom} />
            </div>
            <div className="flex justify-center">
                <Button type="submit" loading={loading} size="lg">
                    Analyze Compatibility
                </Button>
            </div>
        </form>
    );
}
