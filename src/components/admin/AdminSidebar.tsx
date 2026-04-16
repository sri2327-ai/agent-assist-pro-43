import { useLocation, useNavigate } from "react-router-dom";
import { useAdminUIStore } from "@/store/useAdminUIStore";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import {
  LayoutDashboard,
  Stethoscope,
  Phone,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import s10Logo from "@/assets/s10-logo.png";
import { AdminDetailPanel } from "./AdminDetailPanel";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
  key: string;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard", key: "dashboard" },
  { label: "Doctors", icon: Stethoscope, path: "/admin/doctors", key: "doctors" },
  { label: "Calls", icon: Phone, path: "/admin/calls", key: "calls" },
  { label: "Settings", icon: Settings, path: "/admin/settings", key: "settings" },
];

function SidebarNavItem({ item, collapsed }: { item: MenuItem; collapsed: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSidebarMobileOpen, setActivePage } = useAdminUIStore();
  const active = location.pathname === item.path;
  const Icon = item.icon;

  const handleClick = () => {
    setActivePage(item.key);
    navigate(item.path);
    setSidebarMobileOpen(false);
  };

  const button = (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        "text-white/70 hover:bg-white/10 hover:text-white",
        active && "bg-white/15 text-white font-semibold border border-white/20 shadow-sm",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active && "text-white")} />
      {!collapsed && <span>{item.label}</span>}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export function AdminSidebar() {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setSidebarMobileOpen } = useAdminUIStore();
  const { logout } = useAdminAuthStore();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const collapsed = !isMobile && sidebarCollapsed;

  const sidebarContent = (
    <div className="flex h-full flex-col" style={{ background: "linear-gradient(180deg, #0f2027 0%, #143151 40%, #387E89 100%)" }}>
      {/* Header */}
      <div className={cn("flex items-center gap-3 border-b border-white/10 px-4 py-4", collapsed && "justify-center px-2")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={s10Logo} alt="S10.AI" className="h-8 w-auto" />
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">Admin</span>
          </div>
        )}
        {collapsed && <img src={s10Logo} alt="S10.AI" className="h-6 w-auto" />}
        {isMobile && (
          <button onClick={() => setSidebarMobileOpen(false)} className="ml-auto text-white/50 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-2 py-4">
        {menuItems.map((item) => (
          <SidebarNavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Detail Panel - only on desktop expanded */}
      {!collapsed && !isMobile && (
        <div className="flex-1 min-h-0 border-t border-white/10">
          <AdminDetailPanel />
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/10 px-2 py-3 mt-auto">
        <button
          onClick={() => { logout(); navigate("/admin/login"); }}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-all",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {sidebarMobileOpen && (
          <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm" onClick={() => setSidebarMobileOpen(false)} />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out",
            sidebarMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 transition-all duration-300",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {sidebarContent}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:bg-accent transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
