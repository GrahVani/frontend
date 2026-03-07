import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthTokenStore } from "@/store/useAuthTokenStore";
import { queryKeys } from "@/lib/query-keys";

export function useAuthMutations() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (credentials: { email: string; password: string }) => authApi.login(credentials),
        onSuccess: (data) => {
            if (data.tokens?.accessToken) {
                // Store tokens in in-memory Zustand store (XSS mitigation)
                useAuthTokenStore.getState().setTokens(
                    data.tokens.accessToken,
                    data.tokens.refreshToken || "",
                );
                queryClient.setQueryData(queryKeys.userProfile, data.user);
                router.push("/dashboard");
            }
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => authApi.logout(),
        onSettled: () => {
            useAuthTokenStore.getState().clearTokens();
            queryClient.setQueryData(queryKeys.userProfile, null);
            queryClient.clear();
            router.push("/login");
        },
    });

    return { loginMutation, logoutMutation };
}
