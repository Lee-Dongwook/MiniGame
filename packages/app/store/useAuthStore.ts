import { create } from "zustand";

interface AuthState {
  uid?: string;
  setUid: (u?: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  uid: undefined,
  setUid: (uid) => set({ uid }),
}));
