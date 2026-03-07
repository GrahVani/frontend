import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { useAuthTokenStore } from "@/store/useAuthTokenStore";
import { queryKeys } from "@/lib/query-keys";

export function useUserProfile() {
    return useQuery({
        queryKey: queryKeys.userProfile,
        queryFn: async () => {
            // Check in-memory store first, then localStorage fallback
            const store = useAuthTokenStore.getState();
            const hasToken =
                !!store.accessToken ||
                (typeof window !== "undefined" &&
                    (!!localStorage.getItem("accessToken") ||
                        !!localStorage.getItem("refreshToken")));

            if (!hasToken) return null;
            return await userApi.getMe();
        },
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}
