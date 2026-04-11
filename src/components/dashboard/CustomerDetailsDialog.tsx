import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, User, Phone, Mail, Calendar, Clock, Hash } from "lucide-react";
import { StatusChip } from "./StatusChip";
import type { CallRecord } from "@/data/mockCalls";

interface CustomerDetailsDialogProps {
  record: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

export function CustomerDetailsDialog({ record, open, onClose }: CustomerDetailsDialogProps) {
  if (!record) return null;

  const details = [
    { icon: User, label: "Name", value: record.customerName },
    { icon: Phone, label: "Phone", value: record.customerPhone },
    { icon: Mail, label: "Email", value: record.customerEmail },
    { icon: Hash, label: "Call ID", value: <span className="font-mono text-xs">{record.callId}</span> },
    { icon: Calendar, label: "Date", value: record.date },
    { icon: Clock, label: "Duration", value: <span className="font-mono text-xs">{record.duration}</span> },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden animate-scale-in">
        <div className="bg-primary/5 px-6 py-5 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4.5 w-4.5 text-primary" />
              </div>
              Customer Details
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-3">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0 group hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
                <d.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground w-20 shrink-0">{d.label}</span>
                <span className="text-sm font-medium">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusChip status={record.status} />
          </div>

          <div className="rounded-lg bg-muted/30 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Summary</p>
            <p className="text-sm leading-relaxed">{record.summary}</p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-lg hover:bg-primary hover:text-primary-foreground transition-all">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
