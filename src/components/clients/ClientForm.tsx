"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    User, MapPin, Calendar, Phone, Mail, Briefcase,
    Loader2, FileText, ChevronLeft, ChevronRight, Globe,
} from 'lucide-react';
import ParchmentInput from '@/components/ui/ParchmentInput';
import ParchmentSelect from '@/components/ui/ParchmentSelect';
import ParchmentDatePicker from '@/components/ui/ParchmentDatePicker';
import ParchmentTimePicker from '@/components/ui/ParchmentTimePicker';
import GoldenButton from '@/components/GoldenButton';
import FormStepIndicator from './FormStepIndicator';
import { useLocationAutocomplete } from '@/hooks/useLocationAutocomplete';
import { useFormDraftPersistence } from '@/hooks/useFormDraftPersistence';
import { useClientMutations } from '@/hooks/mutations/useClientMutations';
import { useToast } from '@/context/ToastContext';
import { clientFormSchema, STEP_FIELDS, STEP_LABELS } from '@/lib/schemas/client-form.schema';
import type { ClientFormData } from '@/lib/schemas/client-form.schema';
import type { Client, CreateClientPayload, LocationSuggestion } from '@/types/client';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { formatDate, formatTime } from '@/lib/date-utils';

// Common IANA timezones for the timezone picker (C-014)
const TIMEZONE_OPTIONS = [
    { value: '', label: 'Select Timezone' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +05:30)' },
    { value: 'Asia/Colombo', label: 'Asia/Colombo (IST +05:30)' },
    { value: 'Asia/Kathmandu', label: 'Asia/Kathmandu (+05:45)' },
    { value: 'Asia/Dhaka', label: 'Asia/Dhaka (+06:00)' },
    { value: 'Asia/Karachi', label: 'Asia/Karachi (+05:00)' },
    { value: 'Asia/Dubai', label: 'Asia/Dubai (+04:00)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (+08:00)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (+09:00)' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (+08:00)' },
    { value: 'Europe/London', label: 'Europe/London (GMT/BST)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (CET)' },
    { value: 'Europe/Moscow', label: 'Europe/Moscow (+03:00)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'America/Chicago', label: 'America/Chicago (CST)' },
    { value: 'America/Denver', label: 'America/Denver (MST)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
    { value: 'Pacific/Auckland', label: 'Pacific/Auckland (+12:00)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (+10:00)' },
    { value: 'Africa/Cairo', label: 'Africa/Cairo (+02:00)' },
    { value: 'Africa/Nairobi', label: 'Africa/Nairobi (+03:00)' },
];

interface ClientFormProps {
    mode?: 'create' | 'edit';
    initialData?: Client;
    onSuccess?: (client: Client) => void;
}

// Section header for each form group
function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-divider">
            <Icon className="w-5 h-5 text-gold-burnished" />
            <h2 className={cn(TYPOGRAPHY.sectionTitle, "!text-lg !font-bold !text-ink-deep !mb-0")}>{title}</h2>
        </div>
    );
}

// Label component used throughout
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className={cn(TYPOGRAPHY.label, "block !text-[11px] !font-bold !text-ink uppercase tracking-widest !mb-1")}>
            {children} {required && <span className="text-red-600">*</span>}
        </label>
    );
}

export default function ClientForm({ mode = 'create', initialData, onSuccess }: ClientFormProps) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [manualCoordinates, setManualCoordinates] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { createClient, updateClient } = useClientMutations();
    const toast = useToast();

    // Build default values from initialData or empty
    const defaultValues: ClientFormData = {
        fullName: initialData?.firstName && initialData?.lastName
            ? `${initialData.firstName} ${initialData.lastName}`
            : (initialData?.fullName || ''),
        gender: (initialData?.gender as ClientFormData['gender']) || undefined as unknown as ClientFormData['gender'],
        maritalStatus: (initialData?.maritalStatus as ClientFormData['maritalStatus']) || undefined,
        email: initialData?.email || '',
        phonePrimary: initialData?.phonePrimary || initialData?.phone || '',
        phoneSecondary: initialData?.phoneSecondary || '',
        dateOfBirth: formatDate(initialData?.birthDate) || '',
        timeOfBirth: formatTime(initialData?.birthTime) || '',
        birthTimeAccuracy: (initialData?.birthTimeAccuracy as ClientFormData['birthTimeAccuracy']) || 'exact',
        birthPlace: initialData?.birthPlace || initialData?.placeOfBirth || '',
        birthLatitude: initialData?.birthLatitude,
        birthLongitude: initialData?.birthLongitude,
        birthTimezone: initialData?.birthTimezone || '',
        occupation: initialData?.occupation || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        country: initialData?.country || '',
        notes: (initialData?.notes && Array.isArray(initialData.notes) && initialData.notes.length > 0)
            ? initialData.notes[0].noteContent
            : '',
    };

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientFormSchema),
        defaultValues,
        mode: 'onBlur', // Validate on blur for a gentle UX
    });

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, trigger } = form;

    // S-020: Draft persistence (only for create mode)
    const { clearDraft, hasDraft } = useFormDraftPersistence(form, 'grahvani-client-draft', mode === 'create');

    // Location autocomplete (C-013)
    const location = useLocationAutocomplete();

    // Sync location query with form on mount (edit mode)
    useEffect(() => {
        const bp = initialData?.birthPlace || initialData?.placeOfBirth;
        if (bp) location.setQuery(bp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData?.birthPlace, initialData?.placeOfBirth]);

    // When a location is selected from autocomplete, populate coordinate fields
    const onLocationSelect = useCallback((suggestion: LocationSuggestion) => {
        location.handleSelect(suggestion);
        setValue('birthPlace', suggestion.formatted, { shouldValidate: true });
        setValue('birthLatitude', suggestion.latitude);
        setValue('birthLongitude', suggestion.longitude);
        setValue('birthTimezone', suggestion.timezone);
        setValue('city', suggestion.city || '');
        setValue('country', suggestion.country || '');
    }, [location, setValue]);

    // C-013: Handle keyboard in location input — select on Enter
    const onLocationKeyDown = useCallback((e: React.KeyboardEvent) => {
        const selected = location.handleKeyDown(e);
        if (selected) {
            onLocationSelect(selected);
        }
    }, [location, onLocationSelect]);

    // C-015: Scroll to first error
    const scrollToFirstError = useCallback(() => {
        if (!formRef.current) return;
        const firstError = formRef.current.querySelector('[aria-invalid="true"]');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            (firstError as HTMLElement).focus?.();
        }
    }, []);

    // Step navigation with per-step validation
    const goNext = useCallback(async () => {
        const fields = STEP_FIELDS[step];
        const valid = await trigger(fields);
        if (valid) {
            setStep(s => Math.min(s + 1, STEP_LABELS.length - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            scrollToFirstError();
        }
    }, [step, trigger, scrollToFirstError]);

    const goPrev = useCallback(() => {
        setStep(s => Math.max(s - 1, 0));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // C-018: Notes auto-grow
    const notesRef = useRef<HTMLTextAreaElement | null>(null);
    const watchedNotes = watch('notes');
    useEffect(() => {
        if (notesRef.current) {
            notesRef.current.style.height = 'auto';
            notesRef.current.style.height = `${Math.max(100, notesRef.current.scrollHeight)}px`;
        }
    }, [watchedNotes]);

    // Submit handler
    const onSubmit = useCallback(async (data: ClientFormData) => {
        setSubmitError(null);
        try {
            const payload: CreateClientPayload = {
                fullName: data.fullName.trim(),
                email: data.email || undefined,
                phonePrimary: data.phonePrimary || undefined,
                phoneSecondary: data.phoneSecondary || undefined,
                birthDate: data.dateOfBirth || undefined,
                birthTime: data.timeOfBirth || undefined,
                birthPlace: data.birthPlace || undefined,
                birthLatitude: data.birthLatitude,
                birthLongitude: data.birthLongitude,
                birthTimezone: data.birthTimezone || undefined,
                birthTimeAccuracy: data.birthTimeAccuracy,
                gender: data.gender,
                maritalStatus: data.maritalStatus || undefined,
                occupation: data.occupation || undefined,
                city: data.city || undefined,
                state: data.state || undefined,
                country: data.country || undefined,
            };

            if (mode === 'edit' && initialData?.id) {
                const updated = await updateClient.mutateAsync({ id: initialData.id, data: payload });
                clearDraft();
                toast.success(`Client "${data.fullName}" updated successfully.`);
                onSuccess ? onSuccess(updated as Client) : router.push('/clients');
            } else {
                const created = await createClient.mutateAsync(payload);
                clearDraft();
                toast.success(`Client "${data.fullName}" created successfully.`);
                onSuccess ? onSuccess(created as Client) : router.push('/clients');
            }
        } catch (err: unknown) {
            setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        }
    }, [mode, initialData?.id, updateClient, createClient, clearDraft, onSuccess, router]);

    // Watched birth coordinates for conditional display
    const birthLat = watch('birthLatitude');
    const birthLng = watch('birthLongitude');
    const showCoordinates = manualCoordinates || (birthLat !== undefined && birthLng !== undefined);

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="w-full"
            aria-label={mode === 'edit' ? 'Edit client form' : 'Client registration form'}
            noValidate
        >
            {/* Draft restored notice */}
            {hasDraft && mode === 'create' && (
                <div className="mb-4 p-3 bg-gold-primary/10 border border-gold-primary/30 rounded-lg text-sm text-gold-dark font-serif flex items-center justify-between">
                    <span>A previously saved draft has been restored.</span>
                    <button
                        type="button"
                        onClick={() => { clearDraft(); form.reset(defaultValues); }}
                        className="text-xs font-bold text-gold-dark hover:text-red-600 transition-colors underline"
                    >
                        Discard
                    </button>
                </div>
            )}

            {/* Error Display */}
            {submitError && (
                <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {submitError}
                </div>
            )}

            {/* C-010: Multi-step progress */}
            <FormStepIndicator
                steps={STEP_LABELS}
                currentStep={step}
                onStepClick={(s) => { if (s < step) setStep(s); }}
            />

            {/* ─── Step 0: Personal Identity ─── */}
            {step === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <SectionHeader icon={User} title="Personal Identity" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <FieldLabel required>Full Name</FieldLabel>
                            <ParchmentInput
                                placeholder="Full Name"
                                {...register('fullName')}
                                aria-required="true"
                                aria-invalid={!!errors.fullName}
                                error={errors.fullName?.message}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* C-012: Gender has no default — must actively choose */}
                        <div>
                            <FieldLabel required>Gender</FieldLabel>
                            <ParchmentSelect
                                label=""
                                aria-label="Gender"
                                aria-required="true"
                                aria-invalid={!!errors.gender}
                                error={errors.gender?.message}
                                value={watch('gender') || ''}
                                onChange={(e) => setValue('gender', e.target.value as ClientFormData['gender'], { shouldValidate: true })}
                                options={[
                                    { value: '', label: 'Select Gender' },
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                ]}
                            />
                        </div>
                        <div>
                            <FieldLabel>Marital Status</FieldLabel>
                            <ParchmentSelect
                                label=""
                                aria-label="Marital status"
                                value={watch('maritalStatus') || ''}
                                onChange={(e) => setValue('maritalStatus', e.target.value as ClientFormData['maritalStatus'] || undefined)}
                                options={[
                                    { value: '', label: 'Select Status' },
                                    { value: 'single', label: 'Single' },
                                    { value: 'married', label: 'Married' },
                                    { value: 'divorced', label: 'Divorced' },
                                    { value: 'widowed', label: 'Widowed' },
                                ]}
                            />
                        </div>
                    </div>

                    <SectionHeader icon={Phone} title="Contact Information" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ParchmentInput
                            placeholder="Email Address"
                            type="email"
                            icon={<Mail className="w-4 h-4" />}
                            {...register('email')}
                            aria-invalid={!!errors.email}
                            error={errors.email?.message}
                        />
                        <ParchmentInput
                            placeholder="Primary Phone"
                            type="tel"
                            icon={<Phone className="w-4 h-4" />}
                            {...register('phonePrimary')}
                            aria-invalid={!!errors.phonePrimary}
                            error={errors.phonePrimary?.message}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ParchmentInput
                            placeholder="Secondary Phone (Optional)"
                            type="tel"
                            icon={<Phone className="w-4 h-4" />}
                            {...register('phoneSecondary')}
                            aria-invalid={!!errors.phoneSecondary}
                            error={errors.phoneSecondary?.message}
                        />
                    </div>
                </div>
            )}

            {/* ─── Step 1: Birth Details ─── */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <SectionHeader icon={Calendar} title="Birth Details" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <FieldLabel required>Date of Birth</FieldLabel>
                            <ParchmentDatePicker
                                label=""
                                placeholder="Select Birth Date"
                                date={watch('dateOfBirth')}
                                setDate={(dateString) => setValue('dateOfBirth', dateString || '', { shouldValidate: true })}
                                required
                            />
                            {errors.dateOfBirth && (
                                <span role="alert" className="block text-xs text-red-600 mt-1">{errors.dateOfBirth.message}</span>
                            )}
                        </div>
                        <div>
                            <FieldLabel required>Time of Birth</FieldLabel>
                            <ParchmentTimePicker
                                label=""
                                placeholder="Select Birth Time"
                                value={watch('timeOfBirth')}
                                onChange={(timeString) => setValue('timeOfBirth', timeString || '', { shouldValidate: true })}
                                required
                            />
                            {errors.timeOfBirth && (
                                <span role="alert" className="block text-xs text-red-600 mt-1">{errors.timeOfBirth.message}</span>
                            )}
                        </div>
                    </div>

                    {/* C-011: Birth time accuracy selector */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <FieldLabel>Birth Time Accuracy</FieldLabel>
                            <ParchmentSelect
                                label=""
                                aria-label="Birth time accuracy"
                                value={watch('birthTimeAccuracy')}
                                onChange={(e) => setValue('birthTimeAccuracy', e.target.value as ClientFormData['birthTimeAccuracy'])}
                                options={[
                                    { value: 'exact', label: 'Exact (from birth certificate)' },
                                    { value: 'approximate', label: 'Approximate (within 15-30 min)' },
                                    { value: 'rectified', label: 'Rectified (astrologer-adjusted)' },
                                    { value: 'unknown', label: 'Unknown (needs rectification)' },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Birth Place with Autocomplete + Keyboard Nav (C-013) */}
                    <div>
                        <FieldLabel required>Place of Birth</FieldLabel>
                        <div className="relative">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-burnished" />
                                <input
                                    type="text"
                                    placeholder="Search city or town..."
                                    aria-label="Place of birth"
                                    aria-required="true"
                                    aria-autocomplete="list"
                                    aria-expanded={location.isOpen && location.suggestions.length > 0}
                                    aria-activedescendant={location.activeIndex >= 0 ? `loc-option-${location.activeIndex}` : undefined}
                                    aria-invalid={!!errors.birthPlace}
                                    role="combobox"
                                    value={location.query}
                                    onChange={(e) => {
                                        location.handleInputChange(e.target.value);
                                        setValue('birthPlace', e.target.value, { shouldValidate: true });
                                    }}
                                    onFocus={location.handleFocus}
                                    onBlur={() => {
                                        location.handleBlur();
                                        // If typed but no suggestion selected, enable manual coords
                                        if (location.query.trim().length > 0 && birthLat === undefined && !manualCoordinates) {
                                            setManualCoordinates(true);
                                            setValue('birthLatitude', 0);
                                            setValue('birthLongitude', 0);
                                            setValue('birthTimezone', 'Asia/Kolkata');
                                        }
                                    }}
                                    onKeyDown={onLocationKeyDown}
                                    className={cn(
                                        TYPOGRAPHY.value,
                                        "w-full bg-transparent border-b border-gold-primary/50 py-2 pl-10 pr-10",
                                        "!text-ink-deep !font-serif placeholder:text-gold-burnished placeholder:opacity-80",
                                        "focus:outline-none focus:border-gold-dark transition-colors !mt-0",
                                        errors.birthPlace && "border-red-400",
                                    )}
                                />
                                {location.isLoading && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-burnished animate-spin" />
                                )}
                            </div>

                            {/* Suggestions Dropdown */}
                            {location.isOpen && location.suggestions.length > 0 && (
                                <div
                                    role="listbox"
                                    aria-label="Location suggestions"
                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-divider rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                                >
                                    {location.suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            id={`loc-option-${index}`}
                                            type="button"
                                            role="option"
                                            aria-selected={index === location.activeIndex}
                                            onClick={() => onLocationSelect(suggestion)}
                                            className={cn(
                                                "w-full px-4 py-3 text-left border-b border-divider/30 last:border-0 transition-colors",
                                                index === location.activeIndex
                                                    ? "bg-gold-primary/10"
                                                    : "hover:bg-softwhite",
                                            )}
                                        >
                                            <p className="text-ink font-medium text-sm">{suggestion.formatted}</p>
                                            <p className="text-gold-dark text-xs mt-1">
                                                {suggestion.latitude.toFixed(4)} N, {suggestion.longitude.toFixed(4)} E — {suggestion.timezone}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.birthPlace && (
                            <span role="alert" className="block text-xs text-red-600 mt-1">{errors.birthPlace.message}</span>
                        )}
                    </div>

                    {/* Manual Coordinates Toggle */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="manualCoords"
                            checked={manualCoordinates}
                            onChange={(e) => {
                                setManualCoordinates(e.target.checked);
                                if (e.target.checked && birthLat === undefined) {
                                    setValue('birthLatitude', 0);
                                    setValue('birthLongitude', 0);
                                    setValue('birthTimezone', 'Asia/Kolkata');
                                }
                            }}
                            className="w-4 h-4 accent-gold-dark cursor-pointer"
                        />
                        <label htmlFor="manualCoords" className="text-sm text-ink font-serif cursor-pointer">
                            Enter coordinates manually (for precise calculations)
                        </label>
                    </div>

                    {/* Coordinates & Timezone (C-014: timezone picker) */}
                    {showCoordinates && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-softwhite rounded-xl border border-divider shadow-sm">
                            <div className="space-y-2">
                                <FieldLabel required>Latitude</FieldLabel>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={watch('birthLatitude') ?? ''}
                                    onChange={(e) => setValue('birthLatitude', parseFloat(e.target.value) || 0, { shouldValidate: true })}
                                    className={cn(TYPOGRAPHY.value, "w-full bg-transparent border-b border-divider focus:border-gold-dark focus:outline-none py-1 !text-ink !mt-0")}
                                    aria-required="true"
                                    aria-invalid={!!errors.birthLatitude}
                                    aria-label="Birth latitude"
                                />
                                {errors.birthLatitude && (
                                    <span role="alert" className="block text-xs text-red-600">{errors.birthLatitude.message}</span>
                                )}
                            </div>
                            <div className="space-y-2">
                                <FieldLabel required>Longitude</FieldLabel>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={watch('birthLongitude') ?? ''}
                                    onChange={(e) => setValue('birthLongitude', parseFloat(e.target.value) || 0, { shouldValidate: true })}
                                    className={cn(TYPOGRAPHY.value, "w-full bg-transparent border-b border-divider focus:border-gold-dark focus:outline-none py-1 !text-ink !font-serif !mt-0")}
                                    aria-required="true"
                                    aria-invalid={!!errors.birthLongitude}
                                    aria-label="Birth longitude"
                                />
                                {errors.birthLongitude && (
                                    <span role="alert" className="block text-xs text-red-600">{errors.birthLongitude.message}</span>
                                )}
                            </div>
                            {/* C-014: Timezone picker instead of free text */}
                            <div className="space-y-2">
                                <FieldLabel required>Timezone</FieldLabel>
                                <ParchmentSelect
                                    label=""
                                    aria-label="Birth timezone"
                                    value={watch('birthTimezone') || ''}
                                    onChange={(e) => setValue('birthTimezone', e.target.value, { shouldValidate: true })}
                                    options={TIMEZONE_OPTIONS}
                                    aria-required="true"
                                    aria-invalid={!!errors.birthTimezone}
                                    error={errors.birthTimezone?.message}
                                />
                            </div>
                            <div className="md:col-span-3 text-xs text-gold-dark/70 italic">
                                Latitude: -90 to 90 (e.g., 27.1833 for Agra) | Longitude: -180 to 180 (e.g., 78.0167)
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Step 2: Additional Info ─── */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <SectionHeader icon={Briefcase} title="Professional & Address" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <ParchmentInput
                            placeholder="Occupation"
                            icon={<Briefcase className="w-4 h-4" />}
                            {...register('occupation')}
                            error={errors.occupation?.message}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <ParchmentInput
                            placeholder="City"
                            icon={<Globe className="w-4 h-4" />}
                            {...register('city')}
                        />
                        <ParchmentInput
                            placeholder="State/Province"
                            {...register('state')}
                        />
                        <ParchmentInput
                            placeholder="Country"
                            {...register('country')}
                        />
                    </div>

                    <SectionHeader icon={FileText} title="Notes & Observations" />

                    <div>
                        <FieldLabel>Client Notes</FieldLabel>
                        {/* C-018: Auto-grow textarea */}
                        <textarea
                            {...register('notes')}
                            ref={(el) => {
                                register('notes').ref(el);
                                notesRef.current = el;
                            }}
                            placeholder="Add any initial observations, specific questions, or important context about the client here..."
                            aria-label="Client notes"
                            aria-invalid={!!errors.notes}
                            className={cn(
                                TYPOGRAPHY.value,
                                "w-full bg-transparent border border-gold-primary/50 rounded-lg p-3 min-h-[100px]",
                                "!text-ink-deep !font-serif placeholder:text-gold-burnished placeholder:opacity-80",
                                "focus:outline-none focus:border-gold-dark transition-colors resize-none !mt-0",
                                errors.notes && "border-red-400",
                            )}
                        />
                        {errors.notes && (
                            <span role="alert" className="block text-xs text-red-600 mt-1">{errors.notes.message}</span>
                        )}
                        <p className="text-xs text-muted mt-1 text-right">
                            {(watch('notes') || '').length} / 5000
                        </p>
                    </div>
                </div>
            )}

            {/* ─── Navigation & Submit (C-016: sticky submit bar) ─── */}
            <div className="sticky bottom-0 bg-parchment/95 backdrop-blur-sm border-t border-divider pt-4 pb-4 mt-8 -mx-1 px-1 z-10">
                <div className="flex items-center justify-between gap-4">
                    {/* Back button */}
                    {step > 0 ? (
                        <button
                            type="button"
                            onClick={goPrev}
                            className="px-5 py-2.5 rounded-lg border border-antique text-ink font-serif text-sm font-medium hover:bg-softwhite transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {/* Next / Submit */}
                    {step < STEP_LABELS.length - 1 ? (
                        <button
                            type="button"
                            onClick={goNext}
                            className="px-6 py-2.5 bg-gold-primary text-white rounded-lg font-serif font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <GoldenButton
                            topText={isSubmitting ? 'Saving' : (mode === 'edit' ? 'Update' : 'Save')}
                            bottomText={isSubmitting ? '...' : 'Client'}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-[240px]"
                        />
                    )}
                </div>
            </div>
        </form>
    );
}
