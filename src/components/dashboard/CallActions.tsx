import { useState } from "react";
import { MoreHorizontal, Phone, Eye, FileText, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CallRecord } from "@/data/mockCalls";
import { useResponsive } from "@/hooks/useResponsive";

interface CallActionsProps {
  record: CallRecord;
  onViewSummary: (record: CallRecord) => void;
  onViewTranscript: (record: CallRecord) => void;
  onViewCustomer: (record: CallRecord) => void;
  onTriggerCall: (record: CallRecord) => void;
}

const actionButtons = [
  { key: "call", icon: Phone, label: "Trigger Call", color: "hover:bg-success/10 hover:text-success" },
  { key: "summary", icon: Eye, label: "View Summary", color: "hover:bg-primary/10 hover:text-primary" },
  { key: "transcript", icon: FileText, label: "Transcript", color: "hover:bg-accent/80 hover:text-accent-foreground" },
  { key: "customer", icon: UserCircle, label: "Customer", color: "hover:bg-secondary/10 hover:text-secondary-foreground" },
] as const;

export function CallActions({ record, onViewSummary, onViewTranscript, onViewCustomer, onTriggerCall }: CallActionsProps) {
  const [open, setOpen] = useState(false);
  const { isDesktop } = useResponsive();

  const handleAction = (key: string) => {
    switch (key) {
      case "call": onTriggerCall(record); break;
      case "summary": onViewSummary(record); break;
      case "transcript": onViewTranscript(record); break;
      case "customer": onViewCustomer(record); break;
    }
    setOpen(false);
  };

  // Desktop: show inline icon buttons
  if (isDesktop) {
    return (
      <TooltipProvider delayDuration={200}>
        <div className="flex items-center justify-end gap-1">
          {actionButtons.map((btn) => (
            <Tooltip key={btn.key}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleAction(btn.key)}
                  className={`rounded-lg p-1.5 text-muted-foreground transition-all duration-200 hover:scale-110 active:scale-95 ${btn.color}`}
                >
                  <btn.icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="rounded-lg text-xs">
                {btn.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    );
  }

  // Mobile/Tablet: 3-dot dropdown
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        {actionButtons.map((btn) => (
          <DropdownMenuItem
            key={btn.key}
            className="cursor-pointer rounded-lg hover:bg-primary/10 focus:bg-primary/10"
            onClick={() => handleAction(btn.key)}
          >
            <btn.icon className="mr-2 h-4 w-4" />
            {btn.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
