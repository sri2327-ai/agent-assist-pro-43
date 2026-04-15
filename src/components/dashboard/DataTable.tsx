import { useState, useMemo } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusChip } from "./StatusChip";
import { CallActions } from "./CallActions";
import { SummaryDialog } from "./SummaryDialog";
import { TranscriptDialog } from "./TranscriptDialog";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { TriggerCallDialog } from "./TriggerCallDialog";
import { ScheduleCallDialog } from "./ScheduleCallDialog";
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

  const columns: { label: string; key: SortKey }[] = [
    { label: "Agent Name", key: "agentName" },
    { label: "Call ID", key: "callId" },
    { label: "Customer", key: "customerName" },
    { label: "Status", key: "status" },
    { label: "Duration", key: "duration" },
    { label: "Date", key: "date" },
  ];

  // Generate smart page numbers with ellipsis
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
      {/* Sticky Filters */}
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

      {/* Scrollable Table */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            <tr className="border-b">
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
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-24 rounded-lg bg-muted" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              paged.map((record, idx) => (
                <tr
                  key={record.id}
                  className="border-b last:border-0 hover:bg-muted/40 transition-colors animate-fade-in"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
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
    </div>
  );
}
