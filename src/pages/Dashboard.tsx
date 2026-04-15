import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { BulkActionsDialog } from "@/components/dashboard/BulkActionsDialog";
import { mockCalls } from "@/data/mockCalls";
import { Phone, CheckCircle, Clock, XCircle, CalendarClock, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-card-foreground">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [bulkMode, setBulkMode] = useState<"schedule" | "trigger" | null>(null);

  const total = mockCalls.length;
  const success = mockCalls.filter((c) => c.status === "Success").length;
  const pending = mockCalls.filter((c) => c.status === "Pending").length;
  const failed = mockCalls.filter((c) => c.status === "Failed").length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader title="Call Agent Support" subtitle="Monitor and manage all agent calls" />
          <div className="flex gap-2">
            <Button
              onClick={() => setBulkMode("schedule")}
              className="rounded-lg gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              <CalendarClock className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule All</span>
              <span className="sm:hidden">Schedule</span>
            </Button>
            <Button
              onClick={() => setBulkMode("trigger")}
              className="rounded-lg gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(var(--success)), hsl(var(--primary)))" }}
            >
              <PhoneCall className="h-4 w-4" />
              <span className="hidden sm:inline">Trigger All</span>
              <span className="sm:hidden">Trigger</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total Calls" value={total} icon={Phone} color="bg-primary/10 text-primary" />
          <StatCard label="Successful" value={success} icon={CheckCircle} color="bg-success/10 text-success" />
          <StatCard label="Pending" value={pending} icon={Clock} color="bg-warning/10 text-warning" />
          <StatCard label="Failed" value={failed} icon={XCircle} color="bg-destructive/10 text-destructive" />
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
