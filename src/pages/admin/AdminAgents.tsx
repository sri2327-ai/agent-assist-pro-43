import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockAgents, type Agent } from "@/data/mockAgents";
import { CreateAgentDialog } from "@/components/admin/CreateAgentDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Search, PhoneIncoming, PhoneOutgoing, ArrowLeftRight, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const typeIcons: Record<string, React.ElementType> = { Inbound: PhoneIncoming, Outbound: PhoneOutgoing, "In & Outbound": ArrowLeftRight };

const statusColors: Record<string, string> = {
  Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Draft: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

function StatCard({ label, value, gradient, delay }: { label: string; value: number; gradient: string; delay: string }) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm animate-slide-up" style={{ animationDelay: delay }}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-card-foreground mt-1">{value}</p>
    </div>
  );
}

export default function AdminAgents() {
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return mockAgents.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.phoneNumber.includes(search);
      const matchType = typeFilter === "all" || a.type === typeFilter;
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  const total = mockAgents.length;
  const active = mockAgents.filter((a) => a.status === "Active").length;
  const inbound = mockAgents.filter((a) => a.type === "Inbound").length;
  const outbound = mockAgents.filter((a) => a.type === "Outbound").length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PageHeader title="Agents" subtitle="Manage your AI call agents" />
          <Button
            onClick={() => setCreateOpen(true)}
            className="rounded-xl gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
          >
            <Plus className="h-4 w-4" />
            Create New Agent
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total Agents" value={total} gradient="" delay="0s" />
          <StatCard label="Active" value={active} gradient="" delay="0.05s" />
          <StatCard label="Inbound" value={inbound} gradient="" delay="0.1s" />
          <StatCard label="Outbound" value={outbound} gradient="" delay="0.15s" />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] rounded-xl"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Inbound">Inbound</SelectItem>
              <SelectItem value="Outbound">Outbound</SelectItem>
              <SelectItem value="In & Outbound">In & Outbound</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border/40 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Agent</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold hidden md:table-cell">Phone</TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">Calls</TableHead>
              <TableHead className="font-semibold hidden lg:table-cell">Success</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((agent) => {
              const TypeIcon = typeIcons[agent.type] || Bot;
              return (
                <TableRow key={agent.id} className="cursor-pointer hover:bg-accent/40" onClick={() => navigate(`/admin/agents/new?type=${agent.type.toLowerCase().replace(/ & /g, "")}&mode=scratch`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white" style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}>
                        <Bot className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">{agent.createdAt}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{agent.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{agent.phoneNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell font-medium">{agent.callsHandled}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={cn("text-sm font-medium", agent.successRate > 90 ? "text-emerald-600" : agent.successRate > 80 ? "text-amber-600" : "text-red-500")}>
                      {agent.successRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs rounded-full", statusColors[agent.status])}>{agent.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="gap-2"><Eye className="h-4 w-4" />View</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Pencil className="h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="h-4 w-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <CreateAgentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
