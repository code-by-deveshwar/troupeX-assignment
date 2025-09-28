import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { api, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../lib/api";

interface User {
  id: string;
  identifier: string;
  name: string;
  headline: string;
  skills: string[];
  location: string;
  avatarURL: string;
}

interface AuthState {
  user: User | null;
  identifier: string;
  setIdentifier: (s: string) => void;
  login: () => Promise<void>;
  verify: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  identifier: "",

  setIdentifier: (s) => set({ identifier: s }),

  login: async () => {
    const identifier = get().identifier;
    if (!identifier) throw new Error("Identifier required");
    await api.post("/api/auth/login", { identifier });
  },

  verify: async (otp: string) => {
    const identifier = get().identifier;
    const { data } = await api.post("/api/auth/verify", { identifier, otp });

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, data.accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);

    set({ user: data.user });
  },

  logout: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (refreshToken) {
        await api.post("/api/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.log("Logout error", err);
    }

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);

    set({ user: null, identifier: "" });
  },
}));
