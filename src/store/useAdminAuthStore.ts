import { create } from "zustand";

interface AdminUser {
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email: string, _password: string) => {
    set({
      user: {
        email,
        name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        role: "Admin",
        avatar: undefined,
      },
      isAuthenticated: true,
    });
    return true;
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
