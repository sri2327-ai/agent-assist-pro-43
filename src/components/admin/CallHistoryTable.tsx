import { useMemo, useState } from "react";
import {
  Search, X, ChevronUp, ChevronDown, FileText, MessageSquare, User,
  Download, FileSpreadsheet, FileType, ArrowDownLeft, ArrowUpRight, Columns3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { CallHistoryRecord } from "@/data/mockCallHistory";
import { cn } from "@/lib/utils";
import {
  HistorySummaryDialog, HistoryTranscriptDialog, HistoryPatientDialog,
} from "./CallHistoryDialogs";

interface Props {
  data: CallHistoryRecord[];
  timezone: string;
}

type SortKey = "started_at" | "from" | "to" | "duration" | "direction" | "pat_name";
type SortDir = "asc" | "desc";

function fmt(iso: string, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: tz }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function CallHistoryTable({ data, timezone }: Props) {
  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("started_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    pat_name: true,
    from: true,
    to: true,
    direction: true,
    started_at: true,
    duration: true,
    status: true,
    actions: true,
  });

  const [summaryRec, setSummaryRec] = useState<CallHistoryRecord | null>(null);
  const [transcriptRec, setTranscriptRec] = useState<CallHistoryRecord | null>(null);
  const [patientRec, setPatientRec] = useState<CallHistoryRecord | null>(null);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.id.toLowerCase().includes(q) || r.from.toLowerCase().includes(q) ||
          r.to.toLowerCase().includes(q) || r.pat_name.toLowerCase().includes(q)
      );
    }
    if (direction !== "all") result = result.filter((r) => r.direction === direction);
    result = [...result].sort((a, b) => {
      const av = a[sortKey] as string;
      const bv = b[sortKey] as string;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [data, search, direction, sortKey, sortDir]);

  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  const handleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  const resetFilters = () => { setSearch(""); setDirection("all"); setPage(0); };
  const hasFilters = search || direction !== "all";

  const exportCSV = () => {
    const headers = ["Call ID", "Patient", "From", "To", "Direction", "Started", "Ended", "Duration", "Status"];
    const rows = filtered.map((r) => [
      r.id, r.pat_name, r.from, r.to, r.direction,
      fmt(r.started_at, timezone), fmt(r.ended_at, timezone), r.duration, r.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `call-history-${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `call-history-${Date.now()}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rowsHtml = filtered.map((r) => `
      <tr>
        <td>${r.id}</td><td>${r.pat_name}</td><td>${r.from}</td><td>${r.to}</td>
        <td>${r.direction}</td><td>${fmt(r.started_at, timezone)}</td>
        <td>${r.duration}</td><td>${r.status}</td>
      </tr>`).join("");
    w.document.write(`
      <html><head><title>Call History</title>
      <style>
        body{font-family:system-ui;padding:24px;color:#143151}
        h1{font-size:20px;margin:0 0 16px}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
        th{background:#143151;color:#fff}
      </style></head>
      <body><h1>Call History Report</h1>
      <p>Generated ${new Date().toLocaleString()} · ${filtered.length} records</p>
      <table><thead><tr>
        <th>Call ID</th><th>Patient</th><th>From</th><th>To</th>
        <th>Direction</th><th>Started</th><th>Duration</th><th>Status</th>
      </tr></thead><tbody>${rowsHtml}</tbody></table>
      <script>window.onload=()=>window.print()</script>
      </body></html>`);
    w.document.close();
  };

  const columns: { label: string; key: SortKey }[] = [
    { label: "Patient", key: "pat_name" },
    { label: "From", key: "from" },
    { label: "To", key: "to" },
    { label: "Direction", key: "direction" },
    { label: "Started", key: "started_at" },
    { label: "Duration", key: "duration" },
  ];

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const pages: (number | "ellipsis")[] = [];
    pages.push(0);
    if (page > 2) pages.push("ellipsis");
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages - 2, page + 1); i++) pages.push(i);
    if (page < totalPages - 3) pages.push("ellipsis");
    pages.push(totalPages - 1);
    return pages;
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Filters */}
      <div className="shrink-0 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by patient, call ID, or phone…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9 rounded-lg"
          />
        </div>
        <Select value={direction} onValueChange={(v) => { setDirection(v); setPage(0); }}>
          <SelectTrigger className="w-full lg:w-40 rounded-lg"><SelectValue placeholder="Direction" /></SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Directions</SelectItem>
            <SelectItem value="Inbound">Inbound</SelectItem>
            <SelectItem value="Outbound">Outbound</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setPage(0); }}>
          <SelectTrigger className="w-full lg:w-28 rounded-lg"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-lg hover:bg-destructive/10 hover:text-destructive">
            <X className="mr-1 h-4 w-4" /> Reset
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="rounded-lg gap-1.5 text-white"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={exportCSV} className="gap-2"><FileSpreadsheet className="h-4 w-4" /> CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF} className="gap-2"><FileType className="h-4 w-4" /> PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={exportJSON} className="gap-2"><FileText className="h-4 w-4" /> JSON</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/95 backdrop-blur-sm">
            <tr className="border-b">
              {columns.map((c) => (
                <th key={c.key} onClick={() => handleSort(c.key)}
                  className="cursor-pointer whitespace-nowrap px-4 py-3 text-left font-semibold text-muted-foreground hover:text-foreground select-none transition-colors">
                  <span className="inline-flex items-center gap-1">{c.label}<SortIcon col={c.key} /></span>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No call history found.</td></tr>
            ) : paged.map((r, idx) => {
              const isInbound = r.direction === "Inbound";
              return (
                <tr key={r.id}
                  className="border-b last:border-0 hover:bg-muted/40 transition-colors animate-fade-in"
                  style={{ animationDelay: `${idx * 25}ms` }}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">{r.pat_name}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.from}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.to}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isInbound ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"
                    )}>
                      {isInbound ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {r.direction}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">{fmt(r.started_at, timezone)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{r.duration}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-2.5 py-0.5 text-xs font-medium capitalize">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      {r.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSummaryRec(r)}
                        className="h-8 rounded-lg gap-1 text-xs hover:bg-primary/10 hover:text-primary">
                        <FileText className="h-3.5 w-3.5" /><span className="hidden md:inline">Summary</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setTranscriptRec(r)}
                        className="h-8 rounded-lg gap-1 text-xs hover:bg-secondary/10 hover:text-secondary">
                        <MessageSquare className="h-3.5 w-3.5" /><span className="hidden md:inline">Transcript</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setPatientRec(r)}
                        className="h-8 rounded-lg gap-1 text-xs hover:bg-accent/30">
                        <User className="h-3.5 w-3.5" /><span className="hidden md:inline">Patient</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground pb-1">
          <span>Showing {page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, filtered.length)} of {filtered.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
              className="rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-40">Previous</Button>
            {getPageNumbers().map((p, i) =>
              p === "ellipsis" ? <span key={`e-${i}`} className="px-2">…</span> : (
                <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => setPage(p)}
                  className={cn("min-w-[2rem] px-2 rounded-lg",
                    p === page ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary")}>
                  {p + 1}
                </Button>
              )
            )}
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
              className="rounded-lg hover:bg-primary hover:text-primary-foreground disabled:opacity-40">Next</Button>
          </div>
        </div>
      )}

      <HistorySummaryDialog record={summaryRec} open={!!summaryRec} onClose={() => setSummaryRec(null)} timezone={timezone} />
      <HistoryTranscriptDialog record={transcriptRec} open={!!transcriptRec} onClose={() => setTranscriptRec(null)} timezone={timezone} />
      <HistoryPatientDialog record={patientRec} open={!!patientRec} onClose={() => setPatientRec(null)} timezone={timezone} />
    </div>
  );
}
