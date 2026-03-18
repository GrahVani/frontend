// Grantha Report Engine — TypeScript types
// Matched to ACTUAL Grantha API response shapes (verified against source)

// ── Blueprint Types ─────────────────────────────────────────────────

/** GET /blueprints returns { data: Blueprint[] } */
export interface Blueprint {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    estimatedPages: { min: number; max: number } | null;
    estimatedCost: { min: number; max: number; currency: string } | null;
    isSystem: boolean;
    version?: number;
    // Only present on GET /blueprints/:id (detail)
    sections?: SectionDefinition[];
    dataRequirements?: unknown;
    styling?: unknown;
    createdAt?: string;
    updatedAt?: string;
}

export interface SectionDefinition {
    id: string;
    name: string;
    type: SectionType;
    order: number;
    skill?: string;
    model?: string;
    tokenBudget?: number;
    dependsOn?: string[];
    chartConfig?: ChartConfig;
}

export type SectionType =
    | 'ai-content'
    | 'chart-visual'
    | 'cover-page'
    | 'table-of-contents'
    | 'data-table'
    | 'static-content'
    | 'summary';

export interface ChartConfig {
    chartType: string;
    chartStyle?: 'south-indian' | 'north-indian' | 'kp';
    divisionalCharts?: string[];
    columns?: 2 | 3 | 4;
    size?: number;
}

/** GET /blueprints/:id/estimate */
export interface BlueprintEstimate {
    blueprintId: string;
    name: string;
    sections: {
        total: number;
        aiContent: number;
        charts: number;
        static: number;
    };
    estimatedPages: number;
    estimatedCostUsd: number;
    estimatedTimeSeconds: number;
    breakdown: Array<{
        sectionId: string;
        type: string;
        estimatedPages: number;
        estimatedCostUsd: number;
    }>;
}

// ── Report Types ────────────────────────────────────────────────────

export type ReportStatus =
    | 'QUEUED'
    | 'VALIDATING'
    | 'DATA_FETCHING'
    | 'GENERATING'
    | 'RENDERING'
    | 'UPLOADING'
    | 'COMPLETE'
    | 'FAILED'
    | 'CANCELLED'
    | 'EXPIRED';

/** GET /reports/:id — full report details (flat, NOT wrapped) */
export interface ReportJob {
    id: string;
    status: ReportStatus;
    currentStep: number;
    progress: number;
    mode: string;
    language: string;
    blueprintId: string;
    totalCost: number | null;
    totalTokens: number | null;
    pageCount: number | null;
    fileSizeBytes: number | null;
    downloadUrl: string | null;   // Signed URL (auto-refreshed by Grantha)
    error: string | null;
    qualityTier: string;
    sections?: ReportSection[];
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
}

export interface ReportSection {
    sectionId: string;
    type: string;
    status: string;
    model: string | null;
    tokensUsed: number | null;
    cost: number | null;
    pageCount: number | null;
}

/** GET /reports returns { data: ReportListItem[], pagination: {...} } */
export interface ReportListItem {
    id: string;                    // NOT jobId
    status: ReportStatus;
    progress: number;
    mode: string;
    language: string;
    blueprintId: string;           // Flat ID, NOT a {id,name,slug} object
    totalCost: number | null;
    totalTokens: number | null;
    pageCount: number | null;
    fileSizeBytes: number | null;
    error: string | null;
    priority: number;
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
}

export interface GenerateReportInput {
    blueprintId: string;
    birthData: GranthaBirthData;
    language?: string;
    mode?: 'full' | 'draft';
    brandId?: string;
    templateId?: string;
}

/** POST /reports returns 202 — flat object, NOT wrapped */
export interface GenerateReportResponse {
    id: string;                    // NOT jobId
    status: string;
    progress: number;
    createdAt: string;
    estimatedSteps: number;
}

export interface GranthaBirthData {
    name: string;
    dob: string;      // YYYY-MM-DD
    tob: string;      // HH:mm
    lat: number;
    lng: number;
    gender: 'male' | 'female' | 'other';
}

// ── SSE Event Types ─────────────────────────────────────────────────
// Grantha uses NAMED SSE events: event: step, event: section_complete,
// event: complete, event: error, event: failed, event: cancelled.
// EventSource.onmessage only catches unnamed events — use addEventListener.

export interface StepEvent {
    step: number;
    status: string;
    progress: number;
}

export interface SectionCompleteEvent {
    sectionId: string;
    index: number;
    total: number;
}

export interface CompleteEvent {
    downloadUrl: string;
    pageCount: number;
    totalCost: number;
}

export interface ErrorEvent {
    message: string;
    sectionId?: string;
}

// ── Report Step Names (for UI display) ──────────────────────────────

export const REPORT_STEP_NAMES: Record<number, string> = {
    0: 'Queued',
    1: 'Validating Input',
    2: 'Fetching Astrological Data',
    3: 'Building Chart Visuals',
    4: 'Generating AI Analysis',
    5: 'Composing Sections',
    6: 'Rendering PDF',
    7: 'Uploading Document',
    8: 'Finalizing',
    9: 'Complete',
};

// ── Blueprint Categories ────────────────────────────────────────────

export const BLUEPRINT_CATEGORIES: Record<string, string> = {
    daily: 'Daily',
    periodic: 'Periodic',
    detailed: 'Detailed Analysis',
    specialized: 'Specialized',
};
