"use client";

import { useState } from "react";
import { User, MapPin } from "lucide-react";
import ParchmentInput from "@/components/ui/ParchmentInput";
import Button from "@/components/ui/Button";
import type { BirthDetails } from "@/types/matchmaking.types";

interface MatchInputFormProps {
    onSubmit: (person1: BirthDetails, person2: BirthDetails) => void;
    loading?: boolean;
}

interface FormErrors {
    name?: string;
    dateOfBirth?: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
}

function validateDetails(details: Omit<BirthDetails, "gender">): FormErrors {
    const errors: FormErrors = {};
    if (!details.name.trim()) errors.name = "Name is required";
    if (!details.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!details.timeOfBirth) errors.timeOfBirth = "Time of birth is required";
    if (!details.placeOfBirth.trim()) errors.placeOfBirth = "Place of birth is required";
    return errors;
}

function BirthDetailsForm({ label, details, errors, onChange }: {
    label: string;
    details: Omit<BirthDetails, "gender">;
    errors: FormErrors;
    onChange: (d: Omit<BirthDetails, "gender">) => void;
}) {
    return (
        <div className="prem-card p-5">
            <h3 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                {label}
            </h3>
            <div className="space-y-4">
                <div>
                    <ParchmentInput
                        label="Full Name"
                        type="text"
                        placeholder="Enter full name"
                        icon={<User className="w-4 h-4" />}
                        value={details.name}
                        onChange={(e) => onChange({ ...details, name: e.target.value })}
                        required
                    />
                    {errors.name && <p className="text-[12px] text-status-error mt-1">{errors.name}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <ParchmentInput
                            label="Date of Birth"
                            type="date"
                            value={details.dateOfBirth}
                            onChange={(e) => onChange({ ...details, dateOfBirth: e.target.value })}
                            required
                        />
                        {errors.dateOfBirth && <p className="text-[12px] text-status-error mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    <div>
                        <ParchmentInput
                            label="Time of Birth"
                            type="time"
                            value={details.timeOfBirth}
                            onChange={(e) => onChange({ ...details, timeOfBirth: e.target.value })}
                            required
                        />
                        {errors.timeOfBirth && <p className="text-[12px] text-status-error mt-1">{errors.timeOfBirth}</p>}
                    </div>
                </div>
                <div>
                    <ParchmentInput
                        label="Place of Birth"
                        type="text"
                        placeholder="City, State"
                        icon={<MapPin className="w-4 h-4" />}
                        value={details.placeOfBirth}
                        onChange={(e) => onChange({ ...details, placeOfBirth: e.target.value })}
                        required
                    />
                    {errors.placeOfBirth && <p className="text-[12px] text-status-error mt-1">{errors.placeOfBirth}</p>}
                </div>
            </div>
        </div>
    );
}

const EMPTY_DETAILS = { name: "", dateOfBirth: "", timeOfBirth: "", placeOfBirth: "" };

export default function MatchInputForm({ onSubmit, loading }: MatchInputFormProps) {
    const [person1, setPerson1] = useState(EMPTY_DETAILS);
    const [person2, setPerson2] = useState(EMPTY_DETAILS);
    const [person1Errors, setPerson1Errors] = useState<FormErrors>({});
    const [person2Errors, setPerson2Errors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const errs1 = validateDetails(person1);
        const errs2 = validateDetails(person2);
        setPerson1Errors(errs1);
        setPerson2Errors(errs2);

        if (Object.keys(errs1).length > 0 || Object.keys(errs2).length > 0) return;

        onSubmit(
            { ...person1, gender: "female" },
            { ...person2, gender: "male" },
        );
    };

    const handlePerson1Change = (d: typeof person1) => {
        setPerson1(d);
        if (submitted) setPerson1Errors(validateDetails(d));
    };

    const handlePerson2Change = (d: typeof person2) => {
        setPerson2(d);
        if (submitted) setPerson2Errors(validateDetails(d));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BirthDetailsForm label="Person 1" details={person1} errors={person1Errors} onChange={handlePerson1Change} />
                <BirthDetailsForm label="Person 2" details={person2} errors={person2Errors} onChange={handlePerson2Change} />
            </div>
            <div className="flex justify-center">
                <Button type="submit" loading={loading} size="lg">
                    Analyze Compatibility
                </Button>
            </div>
        </form>
    );
}
