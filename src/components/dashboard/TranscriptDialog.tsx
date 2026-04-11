import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
      <DialogContent className="max-w-lg max-h-[80vh] rounded-xl p-0 overflow-hidden animate-scale-in">
        <div className="bg-primary/5 px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg">Call Transcript — {record.callId}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-6 py-4 space-y-3">
          <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
            {lines.map((line, i) => {
              const isAgent = line.startsWith("Agent:");
              const isSystem = line.startsWith("System:") || line.startsWith("[");
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm transition-colors",
                    isAgent && "bg-primary/10 ml-0 mr-8 hover:bg-primary/15",
                    !isAgent && !isSystem && "bg-muted ml-8 mr-0 hover:bg-muted/80",
                    isSystem && "text-center text-xs text-muted-foreground italic"
                  )}
                >
                  {line}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end pt-2 border-t">
            <Button variant="outline" size="sm" onClick={onClose} className="hover:bg-primary hover:text-primary-foreground">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
