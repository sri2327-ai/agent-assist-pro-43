import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, CheckCircle, CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { CallRecord } from "@/data/mockCalls";

interface ScheduleCallDialogProps {
  record: CallRecord | null;
  open: boolean;
  onClose: () => void;
}

type ScheduleStage = "form" | "scheduling" | "confirmed";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];

export function ScheduleCallDialog({ record, open, onClose }: ScheduleCallDialogProps) {
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  const [stage, setStage] = useState<ScheduleStage>("form");

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStage("form");
        setDate(undefined);
        setHour("09");
        setMinute("00");
        setAmpm("AM");
      }, 200);
    }
  }, [open]);

  const handleSchedule = () => {
    if (!date) return;
    setStage("scheduling");
    setTimeout(() => setStage("confirmed"), 1800);
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden animate-scale-in">
        {/* Gradient header */}
        <div className="px-6 py-5 border-b" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}>
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2 text-white">
              <CalendarCheck className="h-5 w-5" />
              Schedule Call
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          {stage === "form" && (
            <div className="space-y-5 animate-fade-in">
              {/* Customer info */}
              <div className="flex items-center gap-3 rounded-xl p-3 bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}>
                  {record.customerName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-sm">{record.customerName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{record.customerPhone}</p>
                </div>
              </div>

              {/* Date picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-lg",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Time</label>
                <div className="flex gap-2">
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger className="flex-1 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl max-h-48">
                      {hours.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="flex items-center text-lg font-bold text-muted-foreground">:</span>
                  <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger className="flex-1 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {minutes.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={ampm} onValueChange={setAmpm}>
                    <SelectTrigger className="w-20 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1 rounded-lg">
                  Cancel
                </Button>
                <Button
                  onClick={handleSchedule}
                  disabled={!date}
                  className="flex-1 rounded-lg gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
                >
                  <Clock className="h-4 w-4" />
                  Schedule
                </Button>
              </div>
            </div>
          )}

          {stage === "scheduling" && (
            <div className="flex flex-col items-center gap-5 py-8 animate-fade-in">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.15))" }}>
                  <Clock className="h-8 w-8 text-primary animate-spin" style={{ animationDuration: "2s" }} />
                </div>
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-lg">Scheduling call...</p>
                <p className="text-sm text-muted-foreground">Setting up for {date && format(date, "MMM dd, yyyy")} at {hour}:{minute} {ampm}</p>
              </div>
            </div>
          )}

          {stage === "confirmed" && (
            <div className="flex flex-col items-center gap-5 py-8 animate-scale-in">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-lg">Call Scheduled!</p>
                <p className="text-sm text-muted-foreground">
                  {record.customerName} • {date && format(date, "MMM dd, yyyy")} at {hour}:{minute} {ampm}
                </p>
              </div>
              <Button
                onClick={onClose}
                variant="outline"
                className="rounded-lg gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <CheckCircle className="h-4 w-4" />
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
