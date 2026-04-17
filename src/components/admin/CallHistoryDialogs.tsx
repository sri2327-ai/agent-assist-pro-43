import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, User, Phone, Calendar, Clock, Hash, ArrowRight, ArrowLeft } from "lucide-react";
import type { CallHistoryRecord } from "@/data/mockCallHistory";
import { cn } from "@/lib/utils";

const HEADER_BG = "linear-gradient(135deg, #143151, #387E89)";

function formatDate(iso: string, tz: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: tz,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

interface BaseProps {
  record: CallHistoryRecord | null;
  open: boolean;
  onClose: () => void;
  timezone: string;
}

export function HistorySummaryDialog({ record, open, onClose, timezone }: BaseProps) {
  if (!record) return null;
  const fields = [
    { label: "Call ID", value: <span className="font-mono text-xs">{record.id}</span> },
    { label: "Patient", value: record.pat_name },
    { label: "From", value: record.from },
    { label: "To", value: record.to },
    { label: "Direction", value: record.direction },
    { label: "Started", value: formatDate(record.started_at, timezone) },
    { label: "Ended", value: formatDate(record.ended_at, timezone) },
    { label: "Duration", value: <span className="font-mono text-xs">{record.duration}</span> },
    { label: "Status", value: <span className="capitalize">{record.status}</span> },
  ];
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 border-l-0 overflow-hidden">
        <div className="px-6 py-5 border-b" style={{ background: HEADER_BG }}>
          <SheetHeader>
            <SheetTitle className="text-lg text-white">Call Summary</SheetTitle>
          </SheetHeader>
        </div>
        <div className="px-6 py-6 space-y-5 overflow-y-auto h-[calc(100%-72px)]">
          <div className="space-y-2">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <span className="text-sm text-muted-foreground">{f.label}</span>
                <span className="text-sm font-medium">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-5" style={{ background: "linear-gradient(135deg, rgba(20,49,81,0.06), rgba(56,126,137,0.08))" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#387E89" }}>AI Summary</p>
            <p className="text-sm leading-relaxed text-foreground">
              Inbound {record.direction.toLowerCase()} call from {record.from} answered by the AI receptionist.
              The patient ({record.pat_name}) was greeted, intent captured, and call closed successfully after {record.duration}.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function HistoryTranscriptDialog({ record, open, onClose, timezone }: BaseProps) {
  if (!record) return null;
  const lines = [
    { who: "Agent", text: `Hi, this is BRAVO AI receptionist. How can I help you today?` },
    { who: "Customer", text: `Hi, I'd like to schedule an appointment.` },
    { who: "Agent", text: `Sure! May I get your full name and date of birth?` },
    { who: "Customer", text: `${record.pat_name}, born 12 May 1992.` },
    { who: "Agent", text: `Got it. What time works for you this week?` },
    { who: "Customer", text: `Friday morning if possible.` },
    { who: "Agent", text: `Friday 10:00 AM is available. Shall I confirm?` },
    { who: "Customer", text: `Yes, please.` },
    { who: "Agent", text: `Confirmed. You'll receive an SMS shortly. Thank you!` },
  ];
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 border-l-0 overflow-hidden">
        <div className="px-6 py-5 border-b" style={{ background: HEADER_BG }}>
          <SheetHeader>
            <SheetTitle className="text-lg text-white">Transcript — {record.id}</SheetTitle>
          </SheetHeader>
          <p className="text-xs text-white/70 mt-1">{formatDate(record.started_at, timezone)}</p>
        </div>
        <div className="px-6 py-6 flex flex-col h-[calc(100%-88px)]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
            {lines.map((l, i) => {
              const isAgent = l.who === "Agent";
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm animate-fade-in",
                    isAgent ? "mr-12 text-white" : "ml-12 bg-muted"
                  )}
                  style={isAgent ? { background: HEADER_BG } : undefined}
                >
                  <span className={cn("block text-[10px] font-semibold uppercase tracking-wider mb-1", isAgent ? "opacity-70" : "")} style={!isAgent ? { color: "#387E89" } : undefined}>
                    {l.who}
                  </span>
                  <span>{l.text}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end pt-4 border-t shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function HistoryPatientDialog({ record, open, onClose, timezone }: BaseProps) {
  if (!record) return null;
  const Icon = record.direction === "Inbound" ? ArrowLeft : ArrowRight;
  const details = [
    { icon: User, label: "Name", value: record.pat_name },
    { icon: Phone, label: "From", value: record.from },
    { icon: Phone, label: "To", value: record.to },
    { icon: Icon, label: "Direction", value: record.direction },
    { icon: Hash, label: "Call ID", value: <span className="font-mono text-xs">{record.id}</span> },
    { icon: Calendar, label: "Started", value: formatDate(record.started_at, timezone) },
    { icon: Clock, label: "Duration", value: <span className="font-mono text-xs">{record.duration}</span> },
  ];
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 border-l-0 overflow-hidden">
        <div className="px-6 py-5 border-b" style={{ background: HEADER_BG }}>
          <SheetHeader>
            <SheetTitle className="text-lg flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <User className="h-5 w-5 text-white" />
              </div>
              Patient Details
            </SheetTitle>
          </SheetHeader>
        </div>
        <div className="px-6 py-6 space-y-3 overflow-y-auto h-[calc(100%-72px)]">
          {details.map((d) => (
            <div key={d.label} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 hover:bg-muted/30 -mx-2 px-3 rounded-xl transition-colors">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg shrink-0" style={{ background: "linear-gradient(135deg, rgba(20,49,81,0.1), rgba(56,126,137,0.1))" }}>
                <d.icon className="h-4 w-4" style={{ color: "#387E89" }} />
              </div>
              <span className="text-sm text-muted-foreground w-24 shrink-0">{d.label}</span>
              <span className="text-sm font-medium">{d.value}</span>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
