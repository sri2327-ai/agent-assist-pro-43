import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusChip } from "./StatusChip";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { CallRecord } from "@/data/mockCalls";

interface SummaryDialogProps {
  record: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

export function SummaryDialog({ record, open, onClose }: SummaryDialogProps) {
  if (!record) return null;

  const fields = [
    { label: "Call ID", value: <span className="font-mono text-xs">{record.callId}</span> },
    { label: "Agent", value: record.agentName },
    { label: "Customer", value: record.customerName },
    { label: "Status", value: <StatusChip status={record.status} /> },
    { label: "Duration", value: <span className="font-mono text-xs">{record.duration}</span> },
    { label: "Date", value: record.date },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 border-l-0 overflow-hidden">
        <div
          className="px-6 py-5 border-b"
          style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
        >
          <SheetHeader>
            <SheetTitle className="text-lg text-white">Call Summary</SheetTitle>
          </SheetHeader>
        </div>
        <div className="px-6 py-6 space-y-5 overflow-y-auto h-[calc(100%-72px)]">
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                <span className="text-sm text-muted-foreground">{field.label}</span>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-5" style={{ background: "linear-gradient(135deg, rgba(20,49,81,0.06), rgba(56,126,137,0.08))" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#387E89" }}>Summary</p>
            <p className="text-sm leading-relaxed text-foreground">{record.summary}</p>
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl hover:bg-primary hover:text-primary-foreground">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
