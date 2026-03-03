"use client";

import React, { createContext, useContext } from "react";
import { authApi, userApi } from "@/lib/api";
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

    const login = async (credentials: LoginCredentials) => {
        await loginMutation.mutateAsync(credentials);
    };

    const logout = async () => {
        await logoutMutation.mutateAsync();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshProfile: async () => { await refreshProfile(); },
                isAuthenticated: !!user,
            }}
        >
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
