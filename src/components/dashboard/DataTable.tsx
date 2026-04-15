import { useState, useMemo } from "react";
import { Search, X, ChevronUp, ChevronDown, CalendarClock, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusChip } from "./StatusChip";
import { CallActions } from "./CallActions";
import { SummaryDialog } from "./SummaryDialog";
import { TranscriptDialog } from "./TranscriptDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { TriggerCallDialog } from "./TriggerCallDialog";
import { ScheduleCallDialog } from "./ScheduleCallDialog";
import { BulkActionsDialog } from "./BulkActionsDialog";
import type { CallRecord } from "@/data/mockCalls";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: CallRecord[];
  loading?: boolean;
}

type SortKey = "agentName" | "callId" | "customerName" | "status" | "duration" | "date";
type SortDir = "asc" | "desc";

export function DataTable({ data, loading }: DataTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState<"schedule" | "trigger" | null>(null);

  const [summaryRecord, setSummaryRecord] = useState<CallRecord | null>(null);
  const [transcriptRecord, setTranscriptRecord] = useState<CallRecord | null>(null);
  const [customerRecord, setCustomerRecord] = useState<CallRecord | null>(null);
  const [triggerCallRecord, setTriggerCallRecord] = useState<CallRecord | null>(null);
  const [scheduleCallRecord, setScheduleCallRecord] = useState<CallRecord | null>(null);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.agentName.toLowerCase().includes(q) ||
          r.customerName.toLowerCase().includes(q) ||
          r.callId.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }
    result = [...result].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [data, search, statusFilter, sortKey, sortDir]);

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPage(0);
  };

  const hasFilters = search || statusFilter !== "all";

  // Selection logic
  const allPageSelected = paged.length > 0 && paged.every((r) => selectedIds.has(r.id));
  const somePageSelected = paged.some((r) => selectedIds.has(r.id));

  const toggleAll = () => {
    const newSet = new Set(selectedIds);
    if (allPageSelected) {
      paged.forEach((r) => newSet.delete(r.id));
    } else {
      paged.forEach((r) => newSet.add(r.id));
    }
    setSelectedIds(newSet);
  };

  const toggleRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectedRecords = data.filter((r) => selectedIds.has(r.id));

  const columns: { label: string; key: SortKey }[] = [
    { label: "Agent Name", key: "agentName" },
    { label: "Call ID", key: "callId" },
    { label: "Customer", key: "customerName" },
    { label: "Status", key: "status" },
    { label: "Duration", key: "duration" },
    { label: "Date", key: "date" },
  ];

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const pages: (number | "ellipsis")[] = [];
    pages.push(0);
    if (page > 2) pages.push("ellipsis");
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 3) pages.push("ellipsis");
    pages.push(totalPages - 1);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Filters */}
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by agent, customer, or call ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 rounded-lg"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-40 rounded-lg">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-28 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-lg hover:bg-destructive/10 hover:text-destructive">
            <X className="mr-1 h-4 w-4" /> Reset
          </Button>
        )}
      </div>

      {/* Selection action bar */}
      {selectedIds.size > 0 && (
        <div className="shrink-0 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 animate-fade-in">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.size} selected
          </span>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              onClick={() => setBulkMode("schedule")}
              className="rounded-lg gap-1.5 text-xs text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
            >
              <CalendarClock className="h-3.5 w-3.5" />
              Schedule Selected
            </Button>
            <Button
              size="sm"
              onClick={() => setBulkMode("trigger")}
              className="rounded-lg gap-1.5 text-xs text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, hsl(var(--success)), hsl(var(--primary)))" }}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Trigger Selected
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-lg text-xs hover:bg-destructive/10 hover:text-destructive"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Scrollable Table */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            <tr className="border-b">
              <th className="w-10 px-3 py-3">
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={toggleAll}
                  className="rounded"
                  {...(somePageSelected && !allPageSelected ? { "data-state": "indeterminate" as any } : {})}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-muted-foreground hover:text-foreground select-none transition-colors"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b animate-pulse">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-24 rounded-lg bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              paged.map((record, idx) => (
                <tr
                  key={record.id}
                  className={cn(
                    "border-b last:border-0 hover:bg-muted/40 transition-colors animate-fade-in",
                    selectedIds.has(record.id) && "bg-primary/5 hover:bg-primary/10"
                  )}
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <td className="px-3 py-3">
                    <Checkbox
                      checked={selectedIds.has(record.id)}
                      onCheckedChange={() => toggleRow(record.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{record.agentName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{record.callId}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => setCustomerRecord(record)}
                      className="text-primary hover:underline hover:text-primary/80 transition-colors font-medium"
                    >
                      {record.customerName}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusChip status={record.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{record.duration}</td>
                  <td className="whitespace-nowrap px-4 py-3">{record.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <CallActions
                      record={record}
                      onViewSummary={setSummaryRecord}
                      onViewTranscript={setTranscriptRecord}
                      onViewCustomer={setCustomerRecord}
                      onTriggerCall={setTriggerCallRecord}
                      onScheduleCall={setScheduleCallRecord}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground pb-1">
          <span>
            Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              Previous
            </Button>
            {pageNumbers.map((p, i) =>
              p === "ellipsis" ? (
                <span key={`e-${i}`} className="px-2 text-muted-foreground">…</span>
              ) : (
                <Button
                  key={p}
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={cn(
                    "min-w-[2rem] px-2 rounded-lg",
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {p + 1}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <SummaryDialog record={summaryRecord} open={!!summaryRecord} onClose={() => setSummaryRecord(null)} />
      <TranscriptDialog record={transcriptRecord} open={!!transcriptRecord} onClose={() => setTranscriptRecord(null)} />
      <CustomerDetailsDialog record={customerRecord} open={!!customerRecord} onClose={() => setCustomerRecord(null)} />
      <TriggerCallDialog record={triggerCallRecord} open={!!triggerCallRecord} onClose={() => setTriggerCallRecord(null)} />
      <ScheduleCallDialog record={scheduleCallRecord} open={!!scheduleCallRecord} onClose={() => setScheduleCallRecord(null)} />
      <BulkActionsDialog
        open={!!bulkMode}
        onClose={() => { setBulkMode(null); setSelectedIds(new Set()); }}
        mode={bulkMode || "schedule"}
        totalCalls={selectedIds.size}
      />
    </div>
  );
}
