import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, PhoneCall, CheckCircle, X } from "lucide-react";
import type { CallRecord } from "@/data/mockCalls";
import { cn } from "@/lib/utils";

interface TriggerCallDialogProps {
  record: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

type CallStage = "idle" | "dialing" | "ringing" | "connected" | "ended";

export function TriggerCallDialog({ record, open, onClose }: TriggerCallDialogProps) {
  const [stage, setStage] = useState<CallStage>("idle");

  useEffect(() => {
    if (!open) {
      setStage("idle");
      return;
    }
  }, [open]);

  const handleCall = () => {
    setStage("dialing");
    setTimeout(() => setStage("ringing"), 1500);
    setTimeout(() => setStage("connected"), 3500);
    setTimeout(() => setStage("ended"), 6000);
  };

  if (!record) return null;

  const stageConfig: Record<CallStage, { icon: React.ElementType; label: string; color: string; pulse: boolean }> = {
    idle: { icon: Phone, label: "Ready to call", color: "text-muted-foreground", pulse: false },
    dialing: { icon: Phone, label: "Dialing...", color: "text-warning", pulse: true },
    ringing: { icon: PhoneCall, label: "Ringing...", color: "text-primary", pulse: true },
    connected: { icon: PhoneCall, label: "Connected!", color: "text-success", pulse: false },
    ended: { icon: CheckCircle, label: "Call Completed", color: "text-success", pulse: false },
  };

  const current = stageConfig[stage];
  const Icon = current.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-xl p-0 overflow-hidden animate-scale-in">
        <div className="bg-primary/5 px-6 py-5 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Trigger Call
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-6 flex flex-col items-center gap-5">
          {/* Animated call icon */}
          <div className="relative">
            <div className={cn(
              "flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500",
              stage === "idle" && "bg-muted",
              stage === "dialing" && "bg-warning/15",
              stage === "ringing" && "bg-primary/15",
              stage === "connected" && "bg-success/15",
              stage === "ended" && "bg-success/15",
            )}>
              <Icon className={cn("h-8 w-8 transition-all duration-300", current.color)} />
            </div>
            {current.pulse && (
              <>
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                <span className="absolute inset-[-8px] rounded-full animate-pulse bg-primary/10" />
              </>
            )}
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold text-lg">{record.customerName}</p>
            <p className="text-sm text-muted-foreground font-mono">{record.customerPhone}</p>
            <p className={cn("text-sm font-medium transition-colors duration-300", current.color)}>
              {current.label}
            </p>
          </div>

          <div className="flex gap-3 w-full pt-2">
            {stage === "idle" && (
              <Button
                onClick={handleCall}
                className="flex-1 rounded-lg bg-success hover:bg-success/90 text-white gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="h-4 w-4" />
                Start Call
              </Button>
            )}
            {(stage === "dialing" || stage === "ringing" || stage === "connected") && (
              <Button
                onClick={() => { setStage("ended"); }}
                variant="destructive"
                className="flex-1 rounded-lg gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <X className="h-4 w-4" />
                End Call
              </Button>
            )}
            {stage === "ended" && (
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 rounded-lg gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <CheckCircle className="h-4 w-4" />
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
