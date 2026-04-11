import { useLocation, useNavigate } from "react-router-dom";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useResponsive } from "@/hooks/useResponsive";
import {
  LayoutDashboard,
  Phone,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import s10Logo from "@/assets/s10-logo.png";

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Calls", icon: Phone, path: "/calls" },
  { label: "Agents", icon: Users, path: "/agents" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function SidebarItem({ item, collapsed }: { item: MenuItem; collapsed: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSidebarMobileOpen } = useUIStore();
  const active = location.pathname === item.path;
  const Icon = item.icon;

  const button = (
    <button
      onClick={() => {
        navigate(item.path);
        setSidebarMobileOpen(false);
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        "text-white/80 hover:bg-white/10 hover:text-white",
        active && "bg-white/15 text-white font-semibold border border-white/20",
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

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, sidebarMobileOpen, setSidebarMobileOpen } = useUIStore();
  const { logout } = useAuthStore();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  const collapsed = !isMobile && sidebarCollapsed;

  const sidebarContent = (
    <div className="flex h-full flex-col text-sidebar-foreground" style={{ background: 'linear-gradient(180deg, #143151 0%, #1a3a5c 50%, #387E89 100%)' }}>
      {/* Header */}
      <div className={cn("flex items-center gap-3 border-b border-sidebar-border px-4 py-4", collapsed && "justify-center px-2")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src={s10Logo} alt="S10.AI" className="h-8 w-auto" />
          </div>
        )}
        {collapsed && <img src={s10Logo} alt="S10.AI" className="h-6 w-auto" />}
        {isMobile && (
          <button onClick={() => setSidebarMobileOpen(false)} className="ml-auto text-sidebar-muted hover:text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-2 py-3">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
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
          <div className="fixed inset-0 z-40 bg-foreground/30" onClick={() => setSidebarMobileOpen(false)} />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200",
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
        "sticky top-0 h-screen shrink-0 transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {sidebarContent}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:bg-accent"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
