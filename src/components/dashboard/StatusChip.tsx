import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: "Success" | "Pending" | "Failed";
}

const statusStyles: Record<string, string> = {
  Success: "bg-success/15 text-success",
  Pending: "bg-warning/15 text-warning",
  Failed: "bg-destructive/15 text-destructive",
};

export function StatusChip({ status }: StatusChipProps) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", statusStyles[status])}>
      {status}
    </span>
  );
}
