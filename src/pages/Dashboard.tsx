import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { mockCalls } from "@/data/mockCalls";
import { Phone, CheckCircle, Clock, XCircle } from "lucide-react";

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
  const total = mockCalls.length;
  const success = mockCalls.filter((c) => c.status === "Success").length;
  const pending = mockCalls.filter((c) => c.status === "Pending").length;
  const failed = mockCalls.filter((c) => c.status === "Failed").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Call Agent Support" subtitle="Monitor and manage all agent calls" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Calls" value={total} icon={Phone} color="bg-primary/10 text-primary" />
        <StatCard label="Successful" value={success} icon={CheckCircle} color="bg-success/10 text-success" />
        <StatCard label="Pending" value={pending} icon={Clock} color="bg-warning/10 text-warning" />
        <StatCard label="Failed" value={failed} icon={XCircle} color="bg-destructive/10 text-destructive" />
      </div>

      <DataTable data={mockCalls} />
    </div>
  );
}
