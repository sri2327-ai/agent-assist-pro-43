import { useState } from "react";
import { MoreHorizontal, Phone, Eye, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { CallRecord } from "@/data/mockCalls";

interface CallActionsProps {
  record: CallRecord;
  onViewSummary: (record: CallRecord) => void;
  onViewTranscript: (record: CallRecord) => void;
}

export function CallActions({ record, onViewSummary, onViewTranscript }: CallActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => {
            toast.info(`📞 Calling ${record.customerName}...`);
            setOpen(false);
          }}
        >
          <Phone className="mr-2 h-4 w-4" />
          Trigger Call
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onViewSummary(record);
            setOpen(false);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Summary
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onViewTranscript(record);
            setOpen(false);
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Transcript
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
