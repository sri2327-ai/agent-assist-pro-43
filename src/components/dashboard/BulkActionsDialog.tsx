import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, CheckCircle, Phone, PhoneCall, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface BulkActionsDialogProps {
  open: boolean;
  onClose: () => void;
  mode: "schedule" | "trigger";
  totalCalls: number;
}

type BulkStage = "form" | "processing" | "completed";

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = ["00", "15", "30", "45"];

export function BulkActionsDialog({ open, onClose, mode, totalCalls }: BulkActionsDialogProps) {
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState("AM");
  const [stage, setStage] = useState<BulkStage>("form");
  const [progress, setProgress] = useState(0);
  const [processed, setProcessed] = useState(0);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStage("form");
        setDate(undefined);
        setProgress(0);
        setProcessed(0);
      }, 200);
    }
  }, [open]);

  useEffect(() => {
    if (stage !== "processing") return;
    const interval = setInterval(() => {
      setProcessed((prev) => {
        const next = prev + Math.ceil(totalCalls / 20);
        const clamped = Math.min(next, totalCalls);
        setProgress(Math.round((clamped / totalCalls) * 100));
        if (clamped >= totalCalls) {
          clearInterval(interval);
          setTimeout(() => setStage("completed"), 500);
        }
        return clamped;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [stage, totalCalls]);

  const handleExecute = () => {
    setStage("processing");
    setProgress(0);
    setProcessed(0);
  };

  const isSchedule = mode === "schedule";
  const title = isSchedule ? "Schedule All Calls" : "Trigger All Calls";
  const GradientIcon = isSchedule ? Clock : PhoneCall;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden animate-scale-in">
        <div className="px-6 py-5 border-b" style={{ background: isSchedule ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" : "linear-gradient(135deg, hsl(var(--success)), hsl(var(--primary)))" }}>
          <DialogHeader>
            <DialogTitle className="text-lg flex items-center gap-2 text-white">
              <GradientIcon className="h-5 w-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 py-5">
          {stage === "form" && (
            <div className="space-y-5 animate-fade-in">
              {/* Summary */}
              <div className="rounded-xl p-4 bg-muted/50 text-center">
                <p className="text-3xl font-bold text-foreground">{totalCalls}</p>
                <p className="text-sm text-muted-foreground">calls will be {isSchedule ? "scheduled" : "triggered"}</p>
              </div>

              {/* Date/Time for schedule mode */}
              {isSchedule && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal rounded-lg", !date && "text-muted-foreground")}
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Select Time</label>
                    <div className="flex gap-2">
                      <Select value={hour} onValueChange={setHour}>
                        <SelectTrigger className="flex-1 rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl max-h-48">
                          {hours.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <span className="flex items-center text-lg font-bold text-muted-foreground">:</span>
                      <Select value={minute} onValueChange={setMinute}>
                        <SelectTrigger className="flex-1 rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {minutes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Select value={ampm} onValueChange={setAmpm}>
                        <SelectTrigger className="w-20 rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {!isSchedule && (
                <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
                  ⚠️ This will immediately trigger all {totalCalls} calls. Are you sure?
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onClose} className="flex-1 rounded-lg">Cancel</Button>
                <Button
                  onClick={handleExecute}
                  disabled={isSchedule && !date}
                  className="flex-1 rounded-lg gap-2 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: isSchedule ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" : "linear-gradient(135deg, hsl(var(--success)), hsl(var(--primary)))" }}
                >
                  <GradientIcon className="h-4 w-4" />
                  {isSchedule ? "Schedule All" : "Trigger All"}
                </Button>
              </div>
            </div>
          )}

          {stage === "processing" && (
            <div className="flex flex-col items-center gap-5 py-8 animate-fade-in">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
                <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              </div>
              <div className="text-center space-y-1 w-full">
                <p className="font-semibold text-lg">{isSchedule ? "Scheduling" : "Triggering"} calls...</p>
                <p className="text-sm text-muted-foreground">{processed} of {totalCalls} processed</p>
                <div className="pt-3 px-4">
                  <Progress value={progress} className="h-2 rounded-full" />
                </div>
              </div>
            </div>
          )}

          {stage === "completed" && (
            <div className="flex flex-col items-center gap-5 py-8 animate-scale-in">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-lg">
                  {isSchedule ? "All Calls Scheduled!" : "All Calls Triggered!"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {totalCalls} calls {isSchedule ? `scheduled for ${date ? format(date, "MMM dd") : ""} at ${hour}:${minute} ${ampm}` : "have been triggered successfully"}
                </p>
              </div>
              <Button onClick={onClose} variant="outline" className="rounded-lg gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
                <CheckCircle className="h-4 w-4" /> Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
