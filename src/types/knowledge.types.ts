// Knowledge Service — Frontend Types
// Maps to the backend KnowledgeEntry Prisma model (app_knowledge schema)

export interface KnowledgeEntry {
    id: string;
    termKey: string;
    domain: string;         // "vedic" | "kp" | "matchmaking" | "numerology"
    category: string;       // e.g. "panchanga", "kp_core", "ashta_koota", "numerology_core"
    title: string;
    sanskrit: string | null;
    summary: string;
    description: string;
    howToRead: string | null;
    significance: string | null;
    examples: KnowledgeExample[];
    relatedTerms: string[];
    tags: string[];
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface KnowledgeExample {
    title: string;
    content: string;
}

/** GET /api/v1/knowledge/:termKey */
export interface KnowledgeTermResponse {
    data: KnowledgeEntry;
}

/** GET /api/v1/knowledge/batch?keys=a,b,c */
export interface KnowledgeBatchResponse {
    data: Record<string, KnowledgeEntry>;
    meta: {
        requested: number;
        found: number;
        missing: string[];
    };
}

/** GET /api/v1/knowledge/domain/:domain */
export interface KnowledgeDomainResponse {
    data: KnowledgeEntry[];
    meta: { count: number; domain: string };
}

/** GET /api/v1/knowledge/category/:category */
export interface KnowledgeCategoryResponse {
    data: KnowledgeEntry[];
    meta: { count: number; category: string };
}

/** GET /api/v1/knowledge/search?q=&domain=&limit= */
export interface KnowledgeSearchResponse {
    data: KnowledgeEntry[];
    meta: { query: string; count: number };
}

/** GET /api/v1/knowledge/stats */
export interface KnowledgeStatsResponse {
    data: {
        total: number;
        byDomain: Record<string, number>;
        byCategory: Record<string, number>;
    };
}
