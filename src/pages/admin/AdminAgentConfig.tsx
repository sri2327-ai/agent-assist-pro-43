import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Play, Globe, MessageSquare, Phone, Shield, Settings2, Volume2, ChevronRight, Copy, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminAgentConfig() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const agentType = params.get("type") || "inbound";

  const [name, setName] = useState("My Inbound Assistant");
  const [greeting, setGreeting] = useState('Hey, you\'ve called [company]. How may I assist you today?');
  const [prompt, setPrompt] = useState(
    "Inquire specifically about the service they need and gather relevant details related to the issue.\n\nExplore if the service is required for them personally or someone else.\n\nAfter capturing the information proceed with Book appointment. Use get_availability and create_booking tools.\n\nProvide Information or Assistance Based on Caller's Needs:\n\nFor general inquiries about Company's Services/Products, offer a concise overview and explain how they can meet the caller's needs.\n\nFor specific service-related questions, provide detailed information about availability, the booking process, or direct them to appropriate online resources if applicable.\n\nHandle Specific Requests or Transfer the Call:\n\nProceed to Call Transfer if during the working hours\n\nIf not working hours, propose to leave their details to be contacted later or schedule an appointment.\n\nConfirm Call Back Details:\n\nIf a call back is necessary or preferred by the caller."
  );
  const [voice, setVoice] = useState("alloy");
  const [language, setLanguage] = useState("en");
  const [agentSpeaksFirst, setAgentSpeaksFirst] = useState(true);
  const [callRecording, setCallRecording] = useState(true);
  const [maxDuration, setMaxDuration] = useState("30");

  const typeLabel = agentType === "inbound" ? "Inbound" : agentType === "outbound" ? "Outbound" : "In & Outbound";

  const handleSave = () => toast.success("Agent saved successfully!");
  const handleTest = () => toast.info("Starting test call...");

  /* ── Right Settings Panel ── */
  const settingsPanel = [
    { label: "General", icon: Settings2 },
    { label: "Voice", icon: Volume2 },
    { label: "Call Configuration", icon: Phone },
    { label: "End-Call Reasons", icon: Phone },
    { label: "Knowledge & Memory", icon: MessageSquare },
    { label: "Security & Compliance", icon: Shield },
    { label: "Additional Settings", icon: Settings2 },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="shrink-0 flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-3 gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => navigate("/admin/agents")} className="p-1.5 rounded-lg hover:bg-accent transition-colors shrink-0">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-foreground truncate">{name}</h1>
              <span className="text-xs text-muted-foreground">V2</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-[10px] rounded-full px-2 py-0">{typeLabel}</Badge>
              <span>• No Phone Number</span>
              <span className="hidden sm:inline">• ID: 024e…60c2</span>
              <Copy className="h-3 w-3 cursor-pointer hover:text-foreground transition-colors hidden sm:block" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 hidden sm:flex" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
          <Button size="sm" className="rounded-xl gap-1.5 text-white" style={{ background: "linear-gradient(135deg, #22863a, #2ea043)" }} onClick={handleTest}>
            <Play className="h-3.5 w-3.5" />
            Test
          </Button>
          <Button size="sm" className="rounded-xl gap-1.5 text-white" style={{ background: "linear-gradient(135deg, #6f42c1, #8957e5)" }}>
            Publish
          </Button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Config Form */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {/* Greeting Message */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Label className="text-sm font-semibold">Greeting Message</Label>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch checked={agentSpeaksFirst} onCheckedChange={setAgentSpeaksFirst} />
              <span>Agent speaks first</span>
              <span className="text-xs">•</span>
              <span className="text-xs truncate">"{greeting}"</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs rounded-lg gap-1">
                <Settings2 className="h-3 w-3" />
                Configure
              </Button>
            </div>
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Prompt</Label>
              <a href="#" className="text-xs text-primary hover:underline flex items-center gap-1">
                Prompting Guidelines
                <Globe className="h-3 w-3" />
              </a>
            </div>

            {/* Prompt toolbar */}
            <div className="flex items-center gap-2 border border-border/40 rounded-xl px-3 py-2 bg-muted/30">
              <button className="text-xs px-2.5 py-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground flex items-center gap-1">
                <span className="text-primary font-mono">{"{"}</span> Pre-call variables
              </button>
              <button className="text-xs px-2.5 py-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground flex items-center gap-1">
                <ChevronRight className="h-3 w-3 rotate-180" /> Action results
              </button>
              <button className="text-xs px-2.5 py-1 rounded-lg hover:bg-accent transition-colors text-muted-foreground flex items-center gap-1">
                # Actions
              </button>
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[300px] rounded-xl text-sm leading-relaxed resize-y font-normal"
              placeholder="Enter your agent's instructions..."
            />
          </div>

          {/* Accordion Settings */}
          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="voice" className="border border-border/40 rounded-xl px-4 overflow-hidden">
              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  Voice Settings
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Voice</Label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alloy">Alloy</SelectItem>
                        <SelectItem value="echo">Echo</SelectItem>
                        <SelectItem value="fable">Fable</SelectItem>
                        <SelectItem value="onyx">Onyx</SelectItem>
                        <SelectItem value="nova">Nova</SelectItem>
                        <SelectItem value="shimmer">Shimmer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="call-config" className="border border-border/40 rounded-xl px-4 overflow-hidden">
              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Call Configuration
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Max Duration (min)</Label>
                    <Input value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)} type="number" className="rounded-xl" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40">
                    <Label className="text-xs">Call Recording</Label>
                    <Switch checked={callRecording} onCheckedChange={setCallRecording} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="knowledge" className="border border-border/40 rounded-xl px-4 overflow-hidden">
              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Knowledge & Memory
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-sm text-muted-foreground">Upload documents or connect knowledge bases for your agent to reference during calls.</p>
                <Button variant="outline" size="sm" className="mt-3 rounded-xl">Upload Document</Button>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border border-border/40 rounded-xl px-4 overflow-hidden">
              <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security & Compliance
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <p className="text-sm text-muted-foreground">Configure HIPAA compliance, data retention, and call recording consent settings.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Right: Global Settings Panel (desktop only) */}
        <div className="hidden lg:flex w-[260px] shrink-0 flex-col border-l border-border/40 bg-card/30">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <h3 className="text-sm font-semibold">Global Settings</h3>
            <button className="text-muted-foreground hover:text-foreground transition-colors">×</button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {settingsPanel.map((s) => (
              <button
                key={s.label}
                className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-accent/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <span>{s.label}</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
