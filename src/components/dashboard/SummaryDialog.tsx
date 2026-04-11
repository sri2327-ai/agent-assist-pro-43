import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden animate-scale-in">
        <div className="bg-primary/5 px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg">Call Summary</DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="text-sm text-muted-foreground">{field.label}</span>
                <span className="text-sm font-medium">{field.value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Summary</p>
            <p className="text-sm leading-relaxed">{record.summary}</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="hover:bg-primary hover:text-primary-foreground">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
