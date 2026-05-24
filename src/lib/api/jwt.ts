/**
 * JWT helpers — extract the learner identity from the access token.
 *
 * The auth-service issues JWTs whose payload includes either `sub`
 * (RFC 7519 standard claim for subject identifier) or a custom `userId` claim.
 * This helper reads from the token already managed by `useAuthTokenStore`.
 *
 * Returns null when no token is present or when the token cannot be decoded —
 * callers must handle the anonymous case explicitly (e.g., skip server sync).
 */

import { useAuthTokenStore } from "@/store/useAuthTokenStore";

interface JwtPayload {
  sub?: string;
  userId?: string;
  exp?: number;
  iat?: number;
  email?: string;
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

/** Returns the learner's userId derived from the current access token, or null. */
export function getUserIdFromCurrentToken(): string | null {
  const token = useAuthTokenStore.getState().accessToken;
  if (!token) {
    if (typeof window !== "undefined") {
      const ls = localStorage.getItem("accessToken");
      if (ls) {
        const payload = decodeJwtPayload(ls);
        return payload?.userId ?? payload?.sub ?? null;
      }
    }
    return null;
  }
  const payload = decodeJwtPayload(token);
  return payload?.userId ?? payload?.sub ?? null;
}
