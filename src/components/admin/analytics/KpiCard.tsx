import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: number; // percent, positive or negative
  icon: React.ElementType;
  gradient?: string;
  delay?: string;
  live?: boolean;
}

export function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
  gradient = "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
  delay = "0s",
  live,
}: KpiCardProps) {
  const trendUp = (trend ?? 0) >= 0;
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            {live && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
                </span>
                Live
              </span>
            )}
          </div>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {typeof trend === "number" && (
            <div
              className={cn(
                "mt-1 inline-flex items-center gap-1 text-[11px] font-semibold",
                trendUp ? "text-success" : "text-destructive"
              )}
            >
              {trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(trend)}% vs last period
            </div>
          )}
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ background: gradient }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
        style={{ background: gradient }}
      />
    </div>
  );
}
