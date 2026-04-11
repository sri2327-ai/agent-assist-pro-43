import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusChip } from "./StatusChip";
import type { CallRecord } from "@/data/mockCalls";

interface SummaryDialogProps {
  record: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

export function SummaryDialog({ record, open, onClose }: SummaryDialogProps) {
  if (!record) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Call Summary</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Call ID</span>
            <span className="font-medium font-mono">{record.callId}</span>
            <span className="text-muted-foreground">Agent</span>
            <span className="font-medium">{record.agentName}</span>
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium">{record.customerName}</span>
            <span className="text-muted-foreground">Status</span>
            <StatusChip status={record.status} />
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium font-mono">{record.duration}</span>
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{record.date}</span>
          </div>
          <div className="border-t pt-3">
            <p className="text-muted-foreground mb-1 font-medium">Summary</p>
            <p>{record.summary}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
