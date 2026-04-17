import { useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { CallHistoryTable } from "@/components/admin/CallHistoryTable";
import { DateRangeFilter, DateRangeValue } from "@/components/admin/DateRangeFilter";
import { mockCallHistory, computeStats } from "@/data/mockCallHistory";
import { useAdminUIStore } from "@/store/useAdminUIStore";
import { mockDoctors } from "@/data/mockDoctors";
import {
  RefreshCw, Phone, Clock, Activity, Radio, PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";

function defaultRange(): DateRangeValue {
  const now = new Date();
  const from = new Date(now); from.setHours(0, 0, 0, 0);
  return { from, to: now };
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
  delay: string;
  live?: boolean;
  pulse?: boolean;
}

function StatCard({ label, value, icon: Icon, gradient, delay, live, pulse }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-5 shadow-sm hover:shadow-md transition-all animate-slide-up" style={{ animationDelay: delay }}>
      {live && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">Live</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className={cn("text-3xl font-bold text-card-foreground mt-1 tracking-tight", pulse && "animate-pulse")}>{value}</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" style={{ background: gradient }}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function AdminCallHistory() {
  const { activeFilter } = useAdminUIStore();
  const [timezone, setTimezone] = useState("America/New_York");
  const [quickRange, setQuickRange] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const effectiveRange = dateRange ?? getRange(quickRange);

  // Filter by date range and selected doctor sub-filter (uses doctor name from mockDoctors as patient match — demo)
  const filtered = useMemo(() => {
    let result = mockCallHistory;
    if (effectiveRange?.from) {
      const fromMs = effectiveRange.from.getTime();
      const toMs = (effectiveRange.to ?? effectiveRange.from).getTime() + (effectiveRange.to ? 0 : 86400000);
      result = result.filter((r) => {
        const t = new Date(r.started_at).getTime();
        return t >= fromMs && t <= toMs;
      });
    }
    if (activeFilter && activeFilter !== "all" && activeFilter.startsWith("doctor:")) {
      const doctorName = activeFilter.replace("doctor:", "");
      result = result.filter((r) => r.pat_name.toLowerCase().includes(doctorName.toLowerCase()));
    }
    return result;
  }, [effectiveRange, activeFilter, refreshKey]);

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const activeDoctor = activeFilter?.startsWith("doctor:") ? activeFilter.replace("doctor:", "") : null;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshKey((k) => k + 1); setRefreshing(false); }, 700);
  };

  const rangeLabel = effectiveRange?.from
    ? effectiveRange.to
      ? `${format(effectiveRange.from, "MMM d")} – ${format(effectiveRange.to, "MMM d, yyyy")}`
      : format(effectiveRange.from, "MMM d, yyyy")
    : "All time";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 pb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <PageHeader
            title="Call History"
            subtitle={activeDoctor ? `Showing calls for ${activeDoctor}` : "Complete log of inbound and outbound calls"}
          />
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick range */}
            <Select value={quickRange} onValueChange={(v) => { setQuickRange(v); setDateRange(undefined); }}>
              <SelectTrigger className="h-10 w-[150px] rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl">
                {QUICK_RANGES.map((r) => <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Date range picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 rounded-lg gap-2 font-normal">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{rangeLabel}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl" align="end">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(r) => { setDateRange(r); setQuickRange("custom"); }}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Timezone */}
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="h-10 w-[200px] rounded-lg"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-xl">
                {TIMEZONES.map((tz) => <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Refresh */}
            <Button
              onClick={handleRefresh}
              className="h-10 rounded-lg gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Stats — animated */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Total Calls" value={stats.total} icon={Phone}
            gradient="linear-gradient(135deg, #143151, #1a3a5c)" delay="0s" />
          <StatCard label="Total Duration" value={stats.totalDurationLabel} icon={Clock}
            gradient="linear-gradient(135deg, #387E89, #4a9aa6)" delay="0.05s" />
          <StatCard label="Average Duration" value={stats.avgDurationLabel} icon={Activity}
            gradient="linear-gradient(135deg, #2a6070, #387E89)" delay="0.1s" />
          <StatCard label="Active Calls" value={0} icon={PhoneCall} live pulse
            gradient="linear-gradient(135deg, #22863a, #2ea043)" delay="0.15s" />
          <StatCard label="Concurrent Calls" value={0} icon={Radio} live pulse
            gradient="linear-gradient(135deg, #d29922, #e3b341)" delay="0.2s" />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <CallHistoryTable key={refreshKey} data={filtered} timezone={timezone} />
      </div>
    </div>
  );
}

// Re-export doctor list for sidebar use
export { mockDoctors };
