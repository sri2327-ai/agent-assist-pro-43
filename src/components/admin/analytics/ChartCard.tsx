import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  delay?: string;
}

export function ChartCard({ title, subtitle, action, className, children, delay = "0s" }: ChartCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card p-5 shadow-sm animate-slide-up",
        className
      )}
      style={{ animationDelay: delay }}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-card-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
