import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useAdminUIStore } from "@/store/useAdminUIStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import { mockDoctors } from "@/data/mockDoctors";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Stethoscope,
  Phone,
  Settings,
  LogOut,
  X,
  ChevronRight,
  ChevronLeft,
  Activity,
  CheckCircle,
  Clock,
  Users,
  UserCheck,
  PhoneCall,
  PhoneOff,
  Shield,
  Bell,
  HelpCircle,
  User,
  Smartphone,
  Plus,
  CircleDot,
  Bot,
  PhoneIncoming,
  PhoneOutgoing,
  ArrowLeftRight,
  List,
  History,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import s10Logo from "@/assets/s10-logo.png";

/* ── Types ──────────────────────────────────────────── */
interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
  key: string;
}

interface SubItem {
  label: string;
  icon: React.ElementType;
  filter?: string;
}

/* ── Menu Data ──────────────────────────────────────── */
const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", key: "dashboard" },
  { label: "Doctors", icon: Stethoscope, path: "/admin/doctors", key: "doctors" },
  { label: "Agents", icon: Bot, path: "/admin/agents", key: "agents" },
  { label: "Call Tracking", icon: Phone, path: "/admin/calls", key: "calls" },
  { label: "Call History", icon: History, path: "/admin/call-history", key: "call-history" },
  { label: "Settings", icon: Settings, path: "/admin/settings", key: "settings" },
];

const subMenus: Record<string, { title: string; items: SubItem[] }> = {
  dashboard: {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: Activity, filter: "overview" },
      { label: "Success Rate", icon: CheckCircle, filter: "success" },
      { label: "Pending", icon: Clock, filter: "pending" },
    ],
  },
  doctors: {
    title: "Doctors",
    items: [
      { label: "All Doctors", icon: Users, filter: "all" },
      { label: "Active", icon: UserCheck, filter: "active" },
      { label: "Inactive", icon: User, filter: "inactive" },
      { label: "By Specialty", icon: Stethoscope, filter: "specialty" },
    ],
  },
  agents: {
    title: "Agents",
    items: [
      { label: "All Agents", icon: List, filter: "all" },
      { label: "Inbound", icon: PhoneIncoming, filter: "inbound" },
      { label: "Outbound", icon: PhoneOutgoing, filter: "outbound" },
      { label: "In & Outbound", icon: ArrowLeftRight, filter: "inout" },
    ],
  },
  calls: {
    title: "Call Tracking",
    items: [
      { label: "All Calls", icon: Phone, filter: "all" },
      { label: "Successful", icon: PhoneCall, filter: "success" },
      { label: "Failed", icon: PhoneOff, filter: "failed" },
      { label: "Pending", icon: Clock, filter: "pending" },
    ],
  },
  settings: {
    title: "Settings",
    items: [
      { label: "Profile", icon: User, filter: "profile" },
      { label: "Security", icon: Shield, filter: "security" },
      { label: "Notifications", icon: Bell, filter: "notifications" },
      { label: "Support", icon: HelpCircle, filter: "support" },
    ],
  },
  "call-history": {
    title: "Call History",
    items: [
      { label: "All Calls", icon: List, filter: "all" },
    ],
  },
};

/* ── Phone sub-items for Call Tracking ──────────────── */
const phoneSubItems: SubItem[] = [
  { label: "My Phone Number", icon: Smartphone, filter: "my-phone" },
  { label: "Add New Number", icon: Plus, filter: "add-phone" },
  { label: "Active Numbers", icon: CircleDot, filter: "active-phones" },
];

/* ── Nav Icon Button ───────────────────────────────── */
function NavIcon({
  item,
  active,
  onClick,
}: {
  item: MenuItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 w-full rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
        active
          ? "bg-white/15 text-white shadow-sm"
          : "text-white/55 hover:text-white hover:bg-white/8"
      )}
    >
      <Icon className="h-[20px] w-[20px] shrink-0" />
      <span className="truncate">{item.label}</span>
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white rounded-r-full" />
      )}
    </button>
  );
}

/* ── Sub-panel Items ───────────────────────────────── */
function SubNavItem({
  item,
  active,
  onClick,
}: {
  item: SubItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150",
        active
          ? "bg-white/12 text-white"
          : "text-white/50 hover:bg-white/6 hover:text-white/80"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-white/35")} />
      <span className="truncate">{item.label}</span>
      {active && <ChevronRight className="h-3 w-3 ml-auto text-white/40" />}
    </button>
  );
}

/* ── Section Label ─────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-widest text-white/35">
      {children}
    </p>
  );
}

/* ── Main Sidebar ──────────────────────────────────── */
export function AdminSidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    sidebarMobileOpen,
    setSidebarMobileOpen,
    setActivePage,
    activeFilter,
    setActiveFilter,
  } = useAdminUIStore();
  const { logout } = useAdminAuthStore();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();

  const currentKey =
    menuItems.find((m) => location.pathname.startsWith(m.path))?.key || "dashboard";

  const handleNavClick = (item: MenuItem) => {
    setActivePage(item.key);
    navigate(item.path);
    const defaultFilter = subMenus[item.key]?.items[0]?.filter || "";
    setActiveFilter(defaultFilter);
    if (isMobile) setSidebarMobileOpen(true); // keep open to show sub-panel
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    setSidebarMobileOpen(false);
  };

  const collapsed = !isMobile && sidebarCollapsed;
  // Show secondary sub-panel for Doctors, Call Tracking, and Call History
  const pagesWithSubPanel = ["doctors", "calls", "call-history"];
  const sub = pagesWithSubPanel.includes(currentKey) ? subMenus[currentKey] : null;
  const showPhoneSub = currentKey === "calls";
  const showDoctorList = currentKey === "call-history";
  const [doctorSearch, setDoctorSearch] = useState("");
  const filteredDoctors = useMemo(
    () =>
      mockDoctors.filter((d) =>
        d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
      ),
    [doctorSearch]
  );

  /* ── Sidebar Inner ─────────────────────────────── */
  const sidebarInner = (
    <div
      className="flex h-full w-full select-none"
      style={{
        background: "linear-gradient(180deg, #0d1b2a 0%, #143151 50%, #2a6070 100%)",
      }}
    >
      {/* ════ Left: Primary Nav ════ */}
      <div
        className={cn(
          "flex flex-col shrink-0 border-r border-white/[0.06]",
          collapsed ? "w-full" : "w-[180px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 shrink-0 border-b border-white/[0.06]">
          <img src={s10Logo} alt="S10.AI" className="h-6 w-auto" />
          {!collapsed && (
            <span className="text-sm font-semibold text-white tracking-tight">
              Admin
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          <SectionLabel>Menu</SectionLabel>
          {menuItems.map((item) => (
            <NavIcon
              key={item.key}
              item={item}
              active={currentKey === item.key}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-3 border-t border-white/[0.06] pt-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-3 text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all duration-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ════ Right: Sub-panel ════ */}
      {!collapsed && sub && (
        <div className="w-[180px] flex flex-col border-r border-white/[0.04] animate-fade-in overflow-hidden">
          {/* Sub header */}
          <div className="flex items-center h-14 px-4 shrink-0 border-b border-white/[0.06]">
            <h3 className="text-[13px] font-semibold text-white/70 uppercase tracking-wider">
              {sub.title}
            </h3>
          </div>

          {/* Sub nav */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
            <SectionLabel>Filters</SectionLabel>
            {sub.items.map((item) => (
              <SubNavItem
                key={item.filter}
                item={item}
                active={activeFilter === item.filter}
                onClick={() => setActiveFilter(item.filter || "")}
              />
            ))}

            {/* Phone number sub-section for Call Tracking */}
            {showPhoneSub && (
              <>
                <SectionLabel>Phone Numbers</SectionLabel>
                {phoneSubItems.map((item) => (
                  <SubNavItem
                    key={item.filter}
                    item={item}
                    active={activeFilter === item.filter}
                    onClick={() => setActiveFilter(item.filter || "")}
                  />
                ))}
              </>
            )}

            {/* Doctor search + list for Call History */}
            {showDoctorList && (
              <>
                <SectionLabel>Doctors</SectionLabel>
                <div className="px-1.5 pb-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
                    <Input
                      value={doctorSearch}
                      onChange={(e) => setDoctorSearch(e.target.value)}
                      placeholder="Search doctor…"
                      className="h-8 pl-8 text-xs rounded-lg bg-white/[0.08] border-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/20"
                    />
                  </div>
                </div>
                <div className="space-y-0.5">
                  {filteredDoctors.length === 0 ? (
                    <p className="px-3 py-2 text-[11px] text-white/40">No doctors found.</p>
                  ) : (
                    filteredDoctors.map((d) => {
                      const filter = `doctor:${d.name}`;
                      const active = activeFilter === filter;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setActiveFilter(filter)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-medium text-left transition-all",
                            active
                              ? "bg-white/12 text-white"
                              : "text-white/55 hover:bg-white/[0.06] hover:text-white/85"
                          )}
                        >
                          <div className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                            active ? "bg-white/20 text-white" : "bg-white/[0.08] text-white/60"
                          )}>
                            {d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("").slice(0, 2)}
                          </div>
                          <span className="truncate">{d.name.replace("Dr. ", "")}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  /* ── Mobile Drawer ─────────────────────────────── */
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {sidebarMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity"
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[300px] shadow-2xl transform transition-transform duration-300 ease-out",
            sidebarMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative h-full">
            {sidebarInner}
            <button
              onClick={() => setSidebarMobileOpen(false)}
              className="absolute top-3.5 right-3 z-10 p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </>
    );
  }

  /* ── Desktop ───────────────────────────────────── */
  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 transition-all duration-300 overflow-hidden",
        collapsed ? "w-[60px]" : sub ? "w-[360px]" : "w-[180px]"
      )}
    >
      {sidebarInner}

      {/* Collapse toggle - positioned outside sidebar to prevent clipping */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-5 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md hover:bg-accent hover:text-foreground transition-all hover:scale-110"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}
