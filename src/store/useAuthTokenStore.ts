import { create } from "zustand";

interface AuthTokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearTokens: () => void;
  isRefreshing: boolean;
  setIsRefreshing: (v: boolean) => void;
}

export const useAuthTokenStore = create<AuthTokenState>((set) => ({
  accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  refreshToken: typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,
  isRefreshing: false,

  setTokens: (accessToken, refreshToken) => {
    // Store both tokens in localStorage for page refresh recovery
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
    set({ accessToken, refreshToken });
  },

  setAccessToken: (accessToken) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
    }
    set({ accessToken });
  },

  clearTokens: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken"); // Clean up legacy storage
      localStorage.removeItem("user");
    }
    set({ accessToken: null, refreshToken: null });
  },

  setIsRefreshing: (v) => set({ isRefreshing: v }),
}));

// Cross-tab synchronization: keep Zustand state in sync when another tab updates/clears tokens
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "accessToken" || event.key === "refreshToken" || event.key === null) {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      useAuthTokenStore.setState({ accessToken, refreshToken });
    }
  });
}
