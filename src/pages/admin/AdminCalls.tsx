import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { BulkActionsDialog } from "@/components/dashboard/BulkActionsDialog";
import { BuyNumberPanel } from "@/components/admin/BuyNumberPanel";
import { mockCalls } from "@/data/mockCalls";
import { Phone, CheckCircle, Clock, XCircle, CalendarClock, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminUIStore } from "@/store/useAdminUIStore";

function StatCard({ label, value, icon: Icon, gradient, delay }: {
  label: string; value: number; icon: React.ElementType; gradient: string; delay: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm animate-slide-up" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: gradient }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminCalls() {
  const [bulkMode, setBulkMode] = useState<"schedule" | "trigger" | null>(null);
  const { activeFilter } = useAdminUIStore();

  const total = mockCalls.length;
  const success = mockCalls.filter((c) => c.status === "Success").length;
  const pending = mockCalls.filter((c) => c.status === "Pending").length;
  const failed = mockCalls.filter((c) => c.status === "Failed").length;

  // Show Buy Number panel when "add-phone" filter is selected
  if (activeFilter === "add-phone") {
    return <BuyNumberPanel />;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader title="Call Management" subtitle="Monitor and manage all call operations" />
          <div className="flex gap-2">
            <Button
              onClick={() => setBulkMode("schedule")}
              className="rounded-xl gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
            >
              <CalendarClock className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule All</span>
              <span className="sm:hidden">Schedule</span>
            </Button>
            <Button
              onClick={() => setBulkMode("trigger")}
              className="rounded-xl gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #387E89, #143151)" }}
            >
              <PhoneCall className="h-4 w-4" />
              <span className="hidden sm:inline">Trigger All</span>
              <span className="sm:hidden">Trigger</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total Calls" value={total} icon={Phone} gradient="linear-gradient(135deg, #143151, #1a3a5c)" delay="0s" />
          <StatCard label="Successful" value={success} icon={CheckCircle} gradient="linear-gradient(135deg, #22863a, #2ea043)" delay="0.1s" />
          <StatCard label="Pending" value={pending} icon={Clock} gradient="linear-gradient(135deg, #d29922, #e3b341)" delay="0.2s" />
          <StatCard label="Failed" value={failed} icon={XCircle} gradient="linear-gradient(135deg, #cb2431, #d73a49)" delay="0.3s" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <DataTable data={mockCalls} />
      </div>

      <BulkActionsDialog
        open={!!bulkMode}
        onClose={() => setBulkMode(null)}
        mode={bulkMode || "schedule"}
        totalCalls={total}
      />
    </div>
  );
}
