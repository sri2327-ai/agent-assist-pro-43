import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { CallRecord } from "@/data/mockCalls";
import { cn } from "@/lib/utils";

interface TranscriptDialogProps {
  record: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

export function TranscriptDialog({ record, open, onClose }: TranscriptDialogProps) {
  if (!record) return null;

  const lines = record.transcript.split("\n").filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Call Transcript — {record.callId}</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
          {lines.map((line, i) => {
            const isAgent = line.startsWith("Agent:");
            const isSystem = line.startsWith("System:") || line.startsWith("[");
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  isAgent && "bg-primary/10 ml-0 mr-8",
                  !isAgent && !isSystem && "bg-muted ml-8 mr-0",
                  isSystem && "text-center text-xs text-muted-foreground italic"
                )}
              >
                {line}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
