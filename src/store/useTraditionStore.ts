import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TraditionCode } from "@/types/muhurta.types";

interface TraditionState {
  tradition: TraditionCode;
  setTradition: (t: TraditionCode) => void;
}

export const useTraditionStore = create<TraditionState>()(
  persist(
    (set) => ({
      tradition: "NORTH_INDIAN",
      setTradition: (tradition) => set({ tradition }),
    }),
    {
      name: "grahvani_tradition_store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const valid: TraditionCode[] = [
          "NORTH_INDIAN", "SOUTH_INDIAN_TAMIL", "SOUTH_INDIAN_KERALA",
          "SOUTH_INDIAN_TELUGU", "SOUTH_INDIAN_KANNADA", "UNIVERSAL",
        ];
        if (!valid.includes(state.tradition)) {
          state.tradition = "NORTH_INDIAN";
        }
      },
    },
  ),
);
