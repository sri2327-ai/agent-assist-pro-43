import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminProfileMenu } from "./AdminProfileMenu";
import { useAdminUIStore } from "@/store/useAdminUIStore";
import { useResponsive } from "@/hooks/useResponsive";
import { Menu } from "lucide-react";

export function AdminLayout() {
  const { setSidebarMobileOpen } = useAdminUIStore();
  const { isMobile } = useResponsive();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="shrink-0 flex items-center justify-between border-b border-border/60 bg-card/80 backdrop-blur-sm px-4 md:px-6 h-14">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={() => setSidebarMobileOpen(true)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <Menu className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
          <AdminProfileMenu />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
