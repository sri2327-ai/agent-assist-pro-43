import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 border-l-0 overflow-hidden">
        <div
          className="px-6 py-5 border-b"
          style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
        >
          <SheetHeader>
            <SheetTitle className="text-lg flex items-center gap-3 text-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <User className="h-5 w-5 text-white" />
              </div>
              Customer Details
            </SheetTitle>
          </SheetHeader>
        </div>
        <div className="px-6 py-6 space-y-5 overflow-y-auto h-[calc(100%-72px)]">
          <div className="space-y-1">
            {details.map((d) => (
              <div key={d.label} className="flex items-center gap-3 py-3 border-b border-border/30 last:border-0 group hover:bg-muted/30 -mx-2 px-3 rounded-xl transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ background: "linear-gradient(135deg, rgba(20,49,81,0.1), rgba(56,126,137,0.1))" }}>
                  <d.icon className="h-4 w-4" style={{ color: "#387E89" }} />
                </div>
                <span className="text-sm text-muted-foreground w-20 shrink-0">{d.label}</span>
                <span className="text-sm font-medium">{d.value}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(20,49,81,0.06), rgba(56,126,137,0.08))" }}>
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusChip status={record.status} />
          </div>

          <div className="rounded-xl p-5 bg-muted/30">
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#387E89" }}>Summary</p>
            <p className="text-sm leading-relaxed">{record.summary}</p>
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
