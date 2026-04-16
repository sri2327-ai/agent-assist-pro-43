import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PhoneIncoming, PhoneOutgoing, ArrowLeftRight, FileEdit, Settings2, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type AgentType = "inbound" | "outbound" | "inout";
type SetupMode = "scratch" | "predefined";

const agentTypes = [
  { key: "inbound" as AgentType, label: "Inbound Call", desc: "Handle incoming calls from customers", icon: PhoneIncoming },
  { key: "outbound" as AgentType, label: "Outbound Call", desc: "Make outgoing calls to leads & customers", icon: PhoneOutgoing },
  { key: "inout" as AgentType, label: "In & Outbound Call", desc: "Handle both incoming and outgoing calls", icon: ArrowLeftRight },
];

const setupModes = [
  { key: "scratch" as SetupMode, label: "Start from Scratch", desc: "Build your agent configuration step by step", icon: FileEdit },
  { key: "predefined" as SetupMode, label: "Use Predefined Settings", desc: "Start with optimized templates and customize", icon: Settings2 },
];

export function CreateAgentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<AgentType | null>(null);
  const navigate = useNavigate();

  const reset = () => { setStep(1); setSelectedType(null); };

  const handleClose = () => { onOpenChange(false); setTimeout(reset, 200); };

  const handleTypeSelect = (t: AgentType) => { setSelectedType(t); setStep(2); };

  const handleSetupSelect = (mode: SetupMode) => {
    handleClose();
    navigate(`/admin/agents/new?type=${selectedType}&mode=${mode}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <DialogTitle className="text-lg font-semibold">
              {step === 1 ? "Choose the Type of Agent" : "Choose Setup Method"}
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 1 ? "Select the call direction your agent will handle" : "How would you like to configure your agent?"}
          </p>
        </DialogHeader>

        {/* Body */}
        <div className="p-6 space-y-3">
          {step === 1
            ? agentTypes.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTypeSelect(t.key)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                    "border-border/50 hover:border-primary/40 hover:bg-accent/50 hover:shadow-sm"
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{t.label}</p>
                    <p className="text-sm text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))
            : setupModes.map((m) => (
                <button
                  key={m.key}
                  onClick={() => handleSetupSelect(m.key)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left",
                    "border-border/50 hover:border-primary/40 hover:bg-accent/50 hover:shadow-sm"
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, #387E89, #143151)" }}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{m.label}</p>
                    <p className="text-sm text-muted-foreground">{m.desc}</p>
                  </div>
                </button>
              ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end">
          <Button variant="outline" onClick={handleClose} className="rounded-xl">Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
