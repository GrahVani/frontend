// API Error Code Mapping (BF-008/API-019)
// Maps backend error codes and status codes to user-friendly messages.

import { ApiError } from './core';

export interface MappedError {
    title: string;
    message: string;
    action?: string;
    status?: number;
    code?: string;
}

const ERROR_CODE_MAP: Record<string, MappedError> = {
    // Auth errors
    'INVALID_CREDENTIALS': {
        title: 'Login Failed',
        message: 'The email or password you entered is incorrect.',
        action: 'Please check your credentials and try again.',
    },
    'USER_NOT_FOUND': {
        title: 'Account Not Found',
        message: 'No account exists with this email address.',
        action: 'Please check the email or create a new account.',
    },
    'TOKEN_EXPIRED': {
        title: 'Session Expired',
        message: 'Your session has expired for security reasons.',
        action: 'Please log in again to continue.',
    },
    'REFRESH_FAILED': {
        title: 'Session Error',
        message: 'Unable to refresh your session.',
        action: 'Please log in again.',
    },
    'EMAIL_EXISTS': {
        title: 'Email Already Registered',
        message: 'An account with this email address already exists.',
        action: 'Try logging in instead, or use a different email.',
    },
    // Client errors
    'CLIENT_NOT_FOUND': {
        title: 'Client Not Found',
        message: 'The requested client record could not be found.',
        action: 'It may have been deleted or you may not have access.',
    },
    'VALIDATION_ERROR': {
        title: 'Invalid Data',
        message: 'Some of the information provided is invalid.',
    },
    // Chart errors
    'CHART_GENERATION_FAILED': {
        title: 'Chart Calculation Error',
        message: 'Unable to generate the requested chart.',
        action: 'Please verify the client birth data is complete and try again.',
    },
    'MISSING_BIRTH_DATA': {
        title: 'Incomplete Birth Data',
        message: 'Birth date, time, and place are required for chart calculations.',
        action: 'Please update the client profile with complete birth information.',
    },
    // Rate limiting
    'RATE_LIMITED': {
        title: 'Too Many Requests',
        message: 'You\'ve made too many requests. Please wait a moment.',
        action: 'Try again in a few seconds.',
    },
    // Server errors
    'INTERNAL_ERROR': {
        title: 'Server Error',
        message: 'An unexpected error occurred on the server.',
        action: 'Please try again. If the problem persists, contact support.',
    },
};

const STATUS_CODE_MAP: Record<number, MappedError> = {
    400: { title: 'Bad Request', message: 'The request was invalid.' },
    401: { title: 'Unauthorized', message: 'Please log in to continue.' },
    403: { title: 'Forbidden', message: 'You don\'t have permission to perform this action.' },
    404: { title: 'Not Found', message: 'The requested resource was not found.' },
    409: { title: 'Conflict', message: 'This action conflicts with existing data.' },
    422: { title: 'Invalid Data', message: 'The provided data could not be processed.' },
    429: { title: 'Too Many Requests', message: 'Please slow down and try again.' },
    500: { title: 'Server Error', message: 'Something went wrong on our end.' },
    502: { title: 'Service Unavailable', message: 'The server is temporarily unavailable.' },
    503: { title: 'Service Unavailable', message: 'The service is under maintenance.' },
};

/**
 * Maps an API error to a user-friendly message.
 * Fast path: ApiError carries status + code directly — no string parsing needed.
 * Fallback: parses generic Error messages for legacy callers.
 */
export function mapApiError(error: unknown): MappedError {
    // Fast path — structured ApiError from apiFetch (Sprint 24)
    if (error instanceof ApiError) {
        // 1. Try exact error code match
        if (error.code && ERROR_CODE_MAP[error.code]) {
            return { ...ERROR_CODE_MAP[error.code], status: error.status, code: error.code };
        }

        // 2. Try HTTP status match
        if (STATUS_CODE_MAP[error.status]) {
            return {
                ...STATUS_CODE_MAP[error.status],
                status: error.status,
                code: error.code,
                action: error.message,
            };
        }

        // 3. ApiError with unrecognized status/code
        return { title: 'Error', message: error.message, status: error.status, code: error.code };
    }

    // Fallback — generic Error (legacy path, network errors, etc.)
    if (error instanceof Error) {
        const message = error.message;

        // Try to extract error code from message
        for (const [code, mapped] of Object.entries(ERROR_CODE_MAP)) {
            if (message.toLowerCase().includes(code.toLowerCase())) {
                return mapped;
            }
        }

        // Try to extract HTTP status from message pattern "API Error: NNN"
        const statusMatch = message.match(/API Error:\s*(\d{3})/);
        if (statusMatch) {
            const status = parseInt(statusMatch[1], 10);
            if (STATUS_CODE_MAP[status]) {
                return { ...STATUS_CODE_MAP[status], status, action: message };
            }
        }

        // Common message patterns
        if (message.includes('Failed to fetch') || message.includes('Network request failed')) {
            return {
                title: 'Connection Error',
                message: 'Unable to connect to the server.',
                action: 'Please check your internet connection and try again.',
            };
        }

        if (message.includes('Session expired')) {
            return ERROR_CODE_MAP.TOKEN_EXPIRED;
        }

        return { title: 'Error', message };
    }

    return { title: 'Unknown Error', message: 'An unexpected error occurred.' };
}
