import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TIMEZONES } from "@/data/mockCallHistory";

export interface DateRangeValue {
  from: Date;
  to: Date;
}

interface Props {
  value: DateRangeValue;
  onChange: (range: DateRangeValue) => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
}

const PRESETS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "this_month", label: "This month" },
  { key: "last_month", label: "Last month" },
];

function presetRange(key: string): DateRangeValue {
  const now = new Date();
  const start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  switch (key) {
    case "today": return { from: start, to: end };
    case "yesterday": {
      const f = new Date(start); f.setDate(f.getDate() - 1);
      const t = new Date(f); t.setHours(23, 59, 59, 999);
      return { from: f, to: t };
    }
    case "this_month": {
      const f = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: f, to: end };
    }
    case "last_month": {
      const f = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const t = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { from: f, to: t };
    }
    default: return { from: start, to: end };
  }
}

// Convert Date <-> "YYYY-MM-DDTHH:mm" for datetime-local
const toLocalInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromLocalInput = (s: string) => new Date(s);

export function DateRangeFilter({ value, onChange, timezone, onTimezoneChange }: Props) {
  const [open, setOpen] = useState(false);
  const [fromStr, setFromStr] = useState(toLocalInput(value.from));
  const [toStr, setToStr] = useState(toLocalInput(value.to));

  useEffect(() => {
    setFromStr(toLocalInput(value.from));
    setToStr(toLocalInput(value.to));
  }, [value.from, value.to]);

  const apply = () => {
    onChange({ from: fromLocalInput(fromStr), to: fromLocalInput(toStr) });
    setOpen(false);
  };

  const applyPreset = (key: string) => {
    const r = presetRange(key);
    onChange(r);
    setFromStr(toLocalInput(r.from));
    setToStr(toLocalInput(r.to));
  };

  const label = `${format(value.from, "d MMM yyyy, h:mm a").toLowerCase()} → ${format(value.to, "d MMM yyyy, h:mm a").toLowerCase()}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-xl gap-2 font-medium text-sm border-border/60 bg-card hover:bg-muted/40 px-3"
        >
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="hidden md:inline text-foreground/90">{label}</span>
          <span className="md:hidden text-foreground/90">Date range</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[640px] max-w-[95vw] p-0 rounded-2xl overflow-hidden border-border/40 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px]">
          {/* Custom Range */}
          <div className="p-5 space-y-4 bg-card">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Custom Range
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">From</label>
                <Input
                  type="datetime-local"
                  value={fromStr}
                  onChange={(e) => setFromStr(e.target.value)}
                  className="h-11 rounded-xl bg-muted/30 border-border/40 text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">To</label>
                <Input
                  type="datetime-local"
                  value={toStr}
                  onChange={(e) => setToStr(e.target.value)}
                  className="h-11 rounded-xl bg-muted/30 border-border/40 text-sm font-medium"
                />
              </div>
            </div>

            <Button
              onClick={apply}
              className="w-full h-11 rounded-full text-white font-semibold shadow-md hover:shadow-lg transition-shadow"
              style={{ background: "linear-gradient(135deg, #387E89, #4a9aa6)" }}
            >
              Apply range
            </Button>

            <div className="flex flex-wrap gap-2 pt-1">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPreset(p.key)}
                  className="rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-muted/60 hover:border-secondary/40 transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone */}
          <div className="p-5 bg-muted/30 border-t md:border-t-0 md:border-l border-border/40">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Timezone
            </p>
            <div className="space-y-1 max-h-[280px] overflow-y-auto -mx-2 pr-1">
              {TIMEZONES.map((tz) => (
                <button
                  key={tz.value}
                  onClick={() => onTimezoneChange(tz.value)}
                  className={cn(
                    "w-full text-left px-2 py-2 rounded-lg text-sm font-medium transition-colors",
                    timezone === tz.value
                      ? "bg-secondary/15 text-secondary"
                      : "text-foreground/80 hover:bg-card"
                  )}
                >
                  {tz.label.replace(/\s*\([^)]+\)/, "")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
