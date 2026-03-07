// Barrel re-export — maintains backward compatibility with `import { X } from '@/lib/api'`
// All existing imports continue to work. New code can import from specific modules:
//   import { clientApi } from '@/lib/api/clients'
//   import { apiFetch } from '@/lib/api/core'

// Types
export type {
    ApiResponse,
    PaginatedResponse,
    PaginationMeta,
    LoginCredentials,
    RegisterPayload,
    AuthTokensResponse,
    NormalizedTokens,
    UserPreferences,
    ChartRecord,
    ChartGenerateResponse,
    SudarshanChakraResponse,
    KpInterlinkResponse,
    DashaPeriod,
    DashaResponse,
    AshtakavargaResponse,
    SystemCapabilities,
} from './types';

export { normalizeAuthTokens } from './types';

// Constants
export { CHART_METADATA, DASHA_TYPES } from './constants';

// Core infrastructure
export { apiFetch, AuthRefreshError, ApiError, AUTH_URL, USER_URL, CLIENT_URL } from './core';

// Domain APIs
export { authApi, userApi } from './auth';
export { clientApi } from './clients';
export { kpApi } from './kp';
export { familyApi } from './family';
export { geocodeApi } from './geocode';
export { ramanApi } from './raman';
export { panchangApi } from './panchang';
export { matchmakingApi } from './matchmaking';
export { fetchDailyMuhurta, searchCategoryMuhurta } from './muhurta';

// Error mapping & stale times
export { mapApiError } from './error-codes';
export type { MappedError } from './error-codes';
export { STALE_TIMES } from './stale-times';
