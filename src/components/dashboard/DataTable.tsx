import { useState, useMemo } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StatusChip } from "./StatusChip";
import { CallActions } from "./CallActions";
import { SummaryDialog } from "./SummaryDialog";
import { TranscriptDialog } from "./TranscriptDialog";
import type { CallRecord } from "@/data/mockCalls";

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
  const [rowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [summaryRecord, setSummaryRecord] = useState<CallRecord | null>(null);
  const [transcriptRecord, setTranscriptRecord] = useState<CallRecord | null>(null);

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

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by agent, customer, or call ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="mr-1 h-4 w-4" /> Reset
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground hover:text-foreground select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon col={col.key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
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
              paged.map((record) => (
                <tr key={record.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{record.agentName}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{record.callId}</td>
                  <td className="whitespace-nowrap px-4 py-3">{record.customerName}</td>
                  <td className="whitespace-nowrap px-4 py-3"><StatusChip status={record.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{record.duration}</td>
                  <td className="whitespace-nowrap px-4 py-3">{record.date}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <CallActions
                      record={record}
                      onViewSummary={setSummaryRecord}
                      onViewTranscript={setTranscriptRecord}
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
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      <SummaryDialog record={summaryRecord} open={!!summaryRecord} onClose={() => setSummaryRecord(null)} />
      <TranscriptDialog record={transcriptRecord} open={!!transcriptRecord} onClose={() => setTranscriptRecord(null)} />
    </div>
  );
}
