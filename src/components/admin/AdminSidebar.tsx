import { useLocation, useNavigate } from "react-router-dom";
import { useAdminUIStore } from "@/store/useAdminUIStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import {
  LayoutDashboard,
  Stethoscope,
  Phone,
  Settings,
  LogOut,
  X,
  ChevronRight,
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
  Filter,
  Search,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import s10Logo from "@/assets/s10-logo.png";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", key: "dashboard" },
  { label: "Doctors", icon: Stethoscope, path: "/admin/doctors", key: "doctors" },
  { label: "Calls", icon: Phone, path: "/admin/calls", key: "calls" },
  { label: "Settings", icon: Settings, path: "/admin/settings", key: "settings" },
];

const subMenus: Record<string, { title: string; items: SubItem[] }> = {
  dashboard: {
    title: "Dashboard",
    items: [
      { label: "Overview", icon: Activity, filter: "overview" },
      { label: "Success Rate", icon: CheckCircle, filter: "success" },
      { label: "Pending", icon: Clock, filter: "pending" },
      { label: "All Stats", icon: LayoutDashboard, filter: "all" },
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
  calls: {
    title: "Calls",
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
};

// Icon Rail Item
function RailItem({ item, active, onClick }: { item: MenuItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 group",
            active
              ? "bg-white/15 text-white shadow-lg shadow-black/10"
              : "text-white/50 hover:text-white hover:bg-white/8"
          )}
        >
          <Icon className="h-5 w-5" />
          <span className="text-[9px] mt-0.5 font-medium leading-none">{item.label}</span>
          {active && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-l-full" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" className="text-xs">
        {item.label}
      </TooltipContent>
    </Tooltip>
  );
}

// Sub-panel content
function SubPanel({ pageKey, activeFilter, onFilterChange }: { pageKey: string; activeFilter: string; onFilterChange: (f: string) => void }) {
  const sub = subMenus[pageKey];
  const [search, setSearch] = useState("");

  if (!sub) return null;

  const filtered = sub.items.filter((i) =>
    i.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Sub-panel header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-white/50" />
          {sub.title}
        </h3>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter..."
            className="h-8 pl-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/25 focus:ring-0"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-white/10" />

      {/* Sub items */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 custom-scrollbar">
        {filtered.map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.filter;
          return (
            <button
              key={item.filter}
              onClick={() => onFilterChange(item.filter || "")}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white border border-white/20 shadow-sm"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-white/40")} />
              <span className="truncate">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 ml-auto text-white/50" />}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-[10px] text-white/30 text-center py-4">No matches</p>
        )}
      </nav>
    </div>
  );
}

export function AdminSidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
    sidebarMobileOpen,
    setSidebarMobileOpen,
    activePage,
    setActivePage,
  } = useAdminUIStore();
  const { logout } = useAdminAuthStore();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState("overview");

  // Determine active page from route
  const currentKey = menuItems.find((m) => location.pathname.startsWith(m.path))?.key || "dashboard";

  const handleNavClick = (item: MenuItem) => {
    setActivePage(item.key);
    navigate(item.path);
    // Set default filter
    const defaultFilter = subMenus[item.key]?.items[0]?.filter || "";
    setActiveFilter(defaultFilter);
    if (isMobile && sidebarCollapsed) {
      // On mobile, clicking a nav item should expand the sub-panel
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    setSidebarMobileOpen(false);
  };

  const collapsed = !isMobile && sidebarCollapsed;

  const sidebarContent = (
    <div
      className="flex h-full"
      style={{ background: "linear-gradient(180deg, #0f2027 0%, #143151 40%, #387E89 100%)" }}
    >
      {/* === Icon Rail (always visible) === */}
      <div className={cn(
        "flex flex-col items-center shrink-0 border-r border-white/10",
        "w-16 py-3"
      )}>
        {/* Logo */}
        <div className="mb-4 flex items-center justify-center">
          <img src={s10Logo} alt="S10.AI" className="h-7 w-auto" />
        </div>

        {/* Nav Icons */}
        <nav className="flex-1 flex flex-col items-center gap-1">
          {menuItems.map((item) => (
            <RailItem
              key={item.key}
              item={item}
              active={currentKey === item.key}
              onClick={() => handleNavClick(item)}
            />
          ))}
        </nav>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-[9px] mt-0.5 font-medium">Logout</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">Logout</TooltipContent>
        </Tooltip>
      </div>

      {/* === Sub-panel (expandable) === */}
      {!collapsed && (
        <div className="w-48 flex flex-col border-r border-white/5 animate-fade-in">
          <SubPanel
            pageKey={currentKey}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      )}
    </div>
  );

  // Mobile
  if (isMobile) {
    return (
      <>
        {sidebarMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setSidebarMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out",
            sidebarMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="relative h-full">
            {sidebarContent}
            {/* Close button */}
            <button
              onClick={() => setSidebarMobileOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      </>
    );
  }

  // Desktop
  return (
    <aside className={cn(
      "sticky top-0 h-screen shrink-0 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {sidebarContent}
      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:bg-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5 rotate-180" />}
      </button>
    </aside>
  );
}
