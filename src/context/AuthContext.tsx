"use client";

import React, { createContext, useContext, useMemo, useCallback, useEffect } from "react";
import { useUserProfile } from "@/hooks/queries/useUserProfile";
import { useAuthMutations } from "@/hooks/mutations/useAuthMutations";

interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
    avatarUrl?: string;
    createdAt?: string;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: rawUser = null, isLoading: loading, refetch: refreshProfile } = useUserProfile();
    const user = rawUser as UserProfile | null;
    const { loginMutation, logoutMutation } = useAuthMutations();

    const login = useCallback(async (credentials: LoginCredentials) => {
        await loginMutation.mutateAsync(credentials);
    }, [loginMutation]);

    const logout = useCallback(async () => {
        await logoutMutation.mutateAsync();
    }, [logoutMutation]);

    const handleRefreshProfile = useCallback(async () => {
        await refreshProfile();
    }, [refreshProfile]);

    // Force refresh user profile on mount to get latest role (only if token exists)
    useEffect(() => {
        const hasToken = typeof window !== "undefined" && 
            (!!localStorage.getItem("accessToken") || !!localStorage.getItem("refreshToken"));
        if (hasToken) {
            refreshProfile();
        }
    }, [refreshProfile]);

    // ST-001: Memoize context value to prevent unnecessary consumer re-renders
    const value = useMemo<AuthContextType>(() => ({
        user,
        loading,
        login,
        logout,
        refreshProfile: handleRefreshProfile,
        isAuthenticated: !!user,
    }), [user, loading, login, logout, handleRefreshProfile]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
