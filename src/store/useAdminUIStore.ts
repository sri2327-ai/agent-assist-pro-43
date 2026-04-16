import { create } from "zustand";

interface AdminUIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  detailPanelOpen: boolean;
  activePage: string;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setDetailPanelOpen: (open: boolean) => void;
  setActivePage: (page: string) => void;
}

export const useAdminUIStore = create<AdminUIState>((set) => ({
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  detailPanelOpen: false,
  activePage: "dashboard",
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open }),
  setActivePage: (page) => set({ activePage: page }),
}));
