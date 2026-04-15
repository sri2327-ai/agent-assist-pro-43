import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 border-l-0 overflow-hidden">
        <div
          className="px-6 py-5 border-b"
          style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
        >
          <SheetHeader>
            <SheetTitle className="text-lg text-white">Call Transcript — {record.callId}</SheetTitle>
          </SheetHeader>
        </div>
        <div className="px-6 py-6 flex flex-col h-[calc(100%-72px)]">
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
            {lines.map((line, i) => {
              const isAgent = line.startsWith("Agent:");
              const isSystem = line.startsWith("System:") || line.startsWith("[");
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm transition-all animate-fade-in",
                    isAgent && "mr-12 text-white",
                    !isAgent && !isSystem && "ml-12 bg-muted hover:bg-muted/80",
                    isSystem && "text-center text-xs text-muted-foreground italic mx-8"
                  )}
                  style={isAgent ? {
                    background: "linear-gradient(135deg, #143151, #387E89)",
                  } : undefined}
                >
                  {isAgent && (
                    <span className="block text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-70">Agent</span>
                  )}
                  {!isAgent && !isSystem && (
                    <span className="block text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: "#387E89" }}>Customer</span>
                  )}
                  <span>{line.replace(/^(Agent:|Customer:)\s*/, "")}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end pt-4 border-t shrink-0">
            <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl hover:bg-primary hover:text-primary-foreground">
              <X className="mr-1 h-3.5 w-3.5" /> Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
