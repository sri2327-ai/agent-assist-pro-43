import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Save, Play, Globe, MessageSquare, Phone, Shield, Settings2, Volume2,
  ChevronRight, Copy, HelpCircle, Clock, Bot, FileText, Plug, Lock, PhoneIncoming, PhoneOutgoing,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AdminAgentConfig() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const agentType = params.get("type") || "inbound";

  /* ── Core ── */
  const [name, setName] = useState("My Inbound Assistant");
  const [greeting, setGreeting] = useState('Hey, you\'ve called [company]. How may I assist you today?');
  const [prompt, setPrompt] = useState(
    "Inquire specifically about the service they need and gather relevant details related to the issue.\n\nExplore if the service is required for them personally or someone else.\n\nAfter capturing the information proceed with Book appointment. Use get_availability and create_booking tools.\n\nProvide Information or Assistance Based on Caller's Needs:\n\nFor general inquiries about Company's Services/Products, offer a concise overview and explain how they can meet the caller's needs.\n\nFor specific service-related questions, provide detailed information about availability, the booking process, or direct them to appropriate online resources if applicable."
  );
  const [agentSpeaksFirst, setAgentSpeaksFirst] = useState(true);

  /* ── 1. General ── */
  const [workspace, setWorkspace] = useState("Acme Health");
  const [defaultLang, setDefaultLang] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [workingDays, setWorkingDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  /* ── 2. Call Handling ── */
  const [maxDuration, setMaxDuration] = useState("30");
  const [ringDuration, setRingDuration] = useState("25");
  const [retryAttempts, setRetryAttempts] = useState("3");
  const [autoHangup, setAutoHangup] = useState(true);
  const [silenceDetection, setSilenceDetection] = useState(true);
  const [silenceThreshold, setSilenceThreshold] = useState("8");

  /* ── 3. AI Behavior ── */
  const [tone, setTone] = useState("professional");
  const [responseLength, setResponseLength] = useState("medium");
  const [fallback, setFallback] = useState("If unclear, politely ask the caller to rephrase or offer to transfer to a human agent.");
  const [humanHandoff, setHumanHandoff] = useState(true);
  const [escalationConditions, setEscalationConditions] = useState("Escalate when caller requests a human, mentions complaint, or after 3 failed clarifications.");
  const [sessionMemory, setSessionMemory] = useState(true);

  /* ── 4. Script & Compliance ── */
  const [disclaimer, setDisclaimer] = useState("This call may be recorded for quality and training purposes.");
  const [langSwitching, setLangSwitching] = useState(true);
  const [restrictedWords, setRestrictedWords] = useState("politics, religion, competitors");

  /* ── 5. Voice & Audio ── */
  const [voice, setVoice] = useState("alloy");
  const [speechSpeed, setSpeechSpeed] = useState([1]);
  const [interruptHandling, setInterruptHandling] = useState(true);
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  /* ── 6. Integration ── */
  const [webhookUrl, setWebhookUrl] = useState("");
  const [crmSync, setCrmSync] = useState(false);
  const [callLogDest, setCallLogDest] = useState("internal");

  /* ── 7. Security ── */
  const [accessRole, setAccessRole] = useState("admin");
  const [retentionPolicy, setRetentionPolicy] = useState("90d");
  const [recordingStorage, setRecordingStorage] = useState(true);
  const [piiMasking, setPiiMasking] = useState(true);

  /* ── 8. Inbound ── */
  const [routingLogic, setRoutingLogic] = useState("round-robin");
  const [queueLimit, setQueueLimit] = useState("10");
  const [maxWaiting, setMaxWaiting] = useState("60");
  const [voicemail, setVoicemail] = useState(true);

  /* ── 9. Outbound ── */
  const [dialingMode, setDialingMode] = useState("auto");
  const [retryCount, setRetryCount] = useState("3");
  const [retryDelay, setRetryDelay] = useState("300");
  const [dndHandling, setDndHandling] = useState(true);

  const typeLabel = agentType === "inbound" ? "Inbound" : agentType === "outbound" ? "Outbound" : "In & Outbound";
  const showInbound = agentType === "inbound" || agentType === "both";
  const showOutbound = agentType === "outbound" || agentType === "both";

  const handleSave = () => toast.success("Agent saved successfully!");
  const handleTest = () => toast.info("Starting test call...");

  const toggleDay = (d: string) =>
    setWorkingDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  /* Section header helper – colorful gradient icon tile */
  const SectionTrigger = ({
    icon: Icon,
    title,
    desc,
    gradient,
  }: {
    icon: any;
    title: string;
    desc?: string;
    gradient: string;
  }) => (
    <div className="flex items-center gap-3 sm:gap-4 text-left w-full">
      <div
        className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex items-center justify-center shrink-0 text-white shadow-md transition-transform group-hover:scale-105"
        style={{ background: gradient }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-foreground leading-tight">{title}</div>
        {desc && <div className="text-sm text-muted-foreground truncate mt-0.5">{desc}</div>}
      </div>
    </div>
  );

  /* Color palette for sections */
  const G = {
    general: "linear-gradient(135deg, #667eea, #764ba2)",
    call: "linear-gradient(135deg, #f093fb, #f5576c)",
    ai: "linear-gradient(135deg, #4facfe, #00f2fe)",
    script: "linear-gradient(135deg, #43e97b, #38f9d7)",
    voice: "linear-gradient(135deg, #fa709a, #fee140)",
    integration: "linear-gradient(135deg, #30cfd0, #330867)",
    security: "linear-gradient(135deg, #ee0979, #ff6a00)",
    inbound: "linear-gradient(135deg, #22c55e, #16a34a)",
    outbound: "linear-gradient(135deg, #f97316, #ea580c)",
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* ── Top Bar – Vibrant Gradient Hero ── */}
      <div
        className="shrink-0 relative overflow-hidden border-b border-border/40"
        style={{ background: "linear-gradient(120deg, #143151 0%, #1f4a6b 50%, #387E89 100%)" }}
      >
        <div className="absolute inset-0 opacity-25 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(165,204,243,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(56,126,137,0.45), transparent 45%)" }} />
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate("/admin/agents")} className="p-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-all shrink-0">
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white truncate drop-shadow-sm">{name}</h1>
                <span className="text-xs text-white/80 px-1.5 py-0.5 rounded-md bg-white/15">V2</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/85 flex-wrap mt-0.5">
                <Badge className="text-[11px] rounded-full px-2.5 py-0.5 bg-white/20 text-white border-0 backdrop-blur-sm">{typeLabel}</Badge>
                <span>• No Phone Number</span>
                <span className="hidden sm:inline">• ID: 024e…60c2</span>
                <Copy className="h-3.5 w-3.5 cursor-pointer hover:text-white transition-colors hidden sm:block" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="rounded-xl gap-1.5 bg-white/15 hover:bg-white/25 text-white border-0 backdrop-blur-sm hidden sm:flex" onClick={handleSave}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button size="sm" className="rounded-xl gap-1.5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }} onClick={handleTest}>
              <Play className="h-4 w-4" /> Test
            </Button>
            <Button size="sm" className="rounded-xl gap-1.5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)" }}>
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Content (centered, no right panel) ── */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="mx-auto w-full max-w-4xl px-4 md:px-6 py-6 space-y-6">

          {/* Greeting Message */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/60 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-md" style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}>
                <MessageSquare className="h-4 w-4" />
              </div>
              <Label className="text-base font-semibold">Greeting Message</Label>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <Switch checked={agentSpeaksFirst} onCheckedChange={setAgentSpeaksFirst} />
              <span className="font-medium">Agent speaks first</span>
            </div>
            <Textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="rounded-xl text-base resize-y min-h-[70px] leading-relaxed"
            />
          </div>

          {/* Prompt */}
          <div className="space-y-3 p-5 rounded-2xl border border-border/50 bg-gradient-to-br from-card to-card/60 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white shadow-md" style={{ background: "linear-gradient(135deg, #f093fb, #f5576c)" }}>
                  <FileText className="h-4 w-4" />
                </div>
                <Label className="text-base font-semibold">Prompt</Label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
                Prompting Guidelines
                <Globe className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="flex items-center gap-2 border border-border/50 rounded-xl px-3 py-2 bg-muted/40 flex-wrap">
              <button className="text-sm px-3 py-1.5 rounded-lg hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium">
                <span className="text-primary font-mono">{"{"}</span> Pre-call variables
              </button>
              <button className="text-sm px-3 py-1.5 rounded-lg hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium">
                <ChevronRight className="h-3.5 w-3.5 rotate-180" /> Action results
              </button>
              <button className="text-sm px-3 py-1.5 rounded-lg hover:bg-background hover:shadow-sm transition-all text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium">
                # Actions
              </button>
            </div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[280px] rounded-xl text-base leading-relaxed resize-y"
              placeholder="Enter your agent's instructions..."
            />
          </div>

          {/* ── Global Settings Sections ── */}
          <div className="pt-4">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-border" />
              <span className="text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2">⚙ Global Settings</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-border" />
            </div>

            <Accordion type="multiple" defaultValue={["general"]} className="space-y-4">

              {/* 1. General */}
              <AccordionItem value="general" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={Settings2} title="General Configuration" desc="Workspace, language, timezone & business hours" gradient={G.general} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Workspace / Account Name</Label>
                      <Input value={workspace} onChange={(e) => setWorkspace(e.target.value)} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Default Language</Label>
                      <Select value={defaultLang} onValueChange={setDefaultLang}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ta">Tamil</SelectItem>
                          <SelectItem value="hi">Hindi</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label className="text-xs">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                          <SelectItem value="America/Los_Angeles">America/Los_Angeles (PST)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3 p-3 rounded-xl border border-border/40 bg-background/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-xs font-semibold">Business Hours</Label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Start Time</Label>
                        <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">End Time</Label>
                        <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Working Days</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {WEEKDAYS.map((d) => {
                          const active = workingDays.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => toggleDay(d)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                                active
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "bg-background border-border/60 text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 2. Call Handling */}
              <AccordionItem value="call-handling" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={Phone} title="Call Handling Rules" desc="Duration, retries & silence detection" gradient={G.call} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Max Call Duration (min)</Label>
                      <Input type="number" value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Ring Duration (sec)</Label>
                      <Input type="number" value={ringDuration} onChange={(e) => setRingDuration(e.target.value)} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Retry Attempts</Label>
                      <Input type="number" value={retryAttempts} onChange={(e) => setRetryAttempts(e.target.value)} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <div>
                        <Label className="text-xs font-medium">Auto Hang-up</Label>
                        <p className="text-[11px] text-muted-foreground">End call on idle conditions</p>
                      </div>
                      <Switch checked={autoHangup} onCheckedChange={setAutoHangup} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <div>
                        <Label className="text-xs font-medium">Silence Detection</Label>
                        <p className="text-[11px] text-muted-foreground">Threshold {silenceThreshold}s</p>
                      </div>
                      <Switch checked={silenceDetection} onCheckedChange={setSilenceDetection} />
                    </div>
                  </div>
                  {silenceDetection && (
                    <div className="space-y-2">
                      <Label className="text-xs">Silence Threshold (seconds)</Label>
                      <Input type="number" value={silenceThreshold} onChange={(e) => setSilenceThreshold(e.target.value)} className="rounded-xl" />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              {/* 3. AI Behavior */}
              <AccordionItem value="ai-behavior" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={Bot} title="AI Behavior Settings" desc="Tone, length, fallback & escalation" gradient={G.ai} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Response Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="empathetic">Empathetic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Response Length</Label>
                      <Select value={responseLength} onValueChange={setResponseLength}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Fallback Behavior</Label>
                    <Textarea value={fallback} onChange={(e) => setFallback(e.target.value)} className="rounded-xl min-h-[70px] text-sm" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                    <div>
                      <Label className="text-xs font-medium">Human Handoff</Label>
                      <p className="text-[11px] text-muted-foreground">Allow escalation to a human agent</p>
                    </div>
                    <Switch checked={humanHandoff} onCheckedChange={setHumanHandoff} />
                  </div>
                  {humanHandoff && (
                    <div className="space-y-2">
                      <Label className="text-xs">Escalation Conditions</Label>
                      <Textarea value={escalationConditions} onChange={(e) => setEscalationConditions(e.target.value)} className="rounded-xl min-h-[60px] text-sm" />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                    <div>
                      <Label className="text-xs font-medium">Session Memory</Label>
                      <p className="text-[11px] text-muted-foreground">Remember context within a call</p>
                    </div>
                    <Switch checked={sessionMemory} onCheckedChange={setSessionMemory} />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 4. Script & Compliance */}
              <AccordionItem value="script" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={FileText} title="Script & Compliance" desc="Disclaimers, language switching & restricted topics" gradient={G.script} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Default Greeting Message</Label>
                    <Textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} className="rounded-xl min-h-[60px] text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Compliance Disclaimer</Label>
                    <Textarea value={disclaimer} onChange={(e) => setDisclaimer(e.target.value)} className="rounded-xl min-h-[60px] text-sm" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                    <div>
                      <Label className="text-xs font-medium">Language Switching</Label>
                      <p className="text-[11px] text-muted-foreground">Auto-detect & switch languages</p>
                    </div>
                    <Switch checked={langSwitching} onCheckedChange={setLangSwitching} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Restricted Words / Topics</Label>
                    <Input value={restrictedWords} onChange={(e) => setRestrictedWords(e.target.value)} placeholder="comma, separated, tags" className="rounded-xl" />
                    <div className="flex flex-wrap gap-1.5">
                      {restrictedWords.split(",").map((w) => w.trim()).filter(Boolean).map((w) => (
                        <Badge key={w} variant="secondary" className="rounded-full text-[11px]">{w}</Badge>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 5. Voice & Audio */}
              <AccordionItem value="voice" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={Volume2} title="Voice & Audio Settings" desc="Voice, speed & noise suppression" gradient={G.voice} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Default Voice</Label>
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
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Speech Speed</Label>
                      <span className="text-xs text-muted-foreground">{speechSpeed[0].toFixed(2)}x</span>
                    </div>
                    <Slider value={speechSpeed} onValueChange={setSpeechSpeed} min={0.5} max={2} step={0.05} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <Label className="text-xs font-medium">Interrupt Handling</Label>
                      <Switch checked={interruptHandling} onCheckedChange={setInterruptHandling} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <Label className="text-xs font-medium">Noise Suppression</Label>
                      <Switch checked={noiseSuppression} onCheckedChange={setNoiseSuppression} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 6. Integration */}
              <AccordionItem value="integration" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={Plug} title="Integration Settings" desc="Webhooks, CRM & third-party integrations" gradient={G.integration} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Webhook URL</Label>
                    <Input
                      type="url"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-domain.com/webhook"
                      className="rounded-xl"
                    />
                    {webhookUrl && !/^https?:\/\//.test(webhookUrl) && (
                      <p className="text-[11px] text-destructive">URL must start with http:// or https://</p>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <Label className="text-xs font-medium">CRM Sync</Label>
                      <Switch checked={crmSync} onCheckedChange={setCrmSync} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Call Logging Destination</Label>
                      <Select value={callLogDest} onValueChange={setCallLogDest}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal DB</SelectItem>
                          <SelectItem value="s3">Amazon S3</SelectItem>
                          <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                          <SelectItem value="webhook">Custom Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Third-party Integrations</Label>
                    <div className="space-y-2">
                      {["Salesforce", "HubSpot", "Slack", "Zapier"].map((name) => (
                        <div key={name} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                          <span className="text-sm font-medium">{name}</span>
                          <Button variant="outline" size="sm" className="rounded-lg h-7 text-xs">Connect</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 7. Security */}
              <AccordionItem value="security" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <AccordionTrigger className="py-4 hover:no-underline">
                  <SectionTrigger icon={Lock} title="Security & Permissions" desc="Roles, retention & PII masking" gradient={G.security} />
                </AccordionTrigger>
                <AccordionContent className="pb-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Role-based Access</Label>
                      <Select value={accessRole} onValueChange={setAccessRole}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin Only</SelectItem>
                          <SelectItem value="manager">Admin + Manager</SelectItem>
                          <SelectItem value="all">All Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Data Retention Policy</Label>
                      <Select value={retentionPolicy} onValueChange={setRetentionPolicy}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30d">30 Days</SelectItem>
                          <SelectItem value="90d">90 Days</SelectItem>
                          <SelectItem value="1y">1 Year</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <div>
                        <Label className="text-xs font-medium">Call Recording Storage</Label>
                        <p className="text-[11px] text-muted-foreground">Store recordings securely</p>
                      </div>
                      <Switch checked={recordingStorage} onCheckedChange={setRecordingStorage} />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                      <div>
                        <Label className="text-xs font-medium">PII Masking</Label>
                        <p className="text-[11px] text-muted-foreground">Mask sensitive data</p>
                      </div>
                      <Switch checked={piiMasking} onCheckedChange={setPiiMasking} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* 8. Inbound */}
              {showInbound && (
                <AccordionItem value="inbound" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <SectionTrigger icon={PhoneIncoming} title="Inbound Global Settings" desc="Routing, queue & voicemail" gradient={G.inbound} />
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Call Routing Logic</Label>
                        <Select value={routingLogic} onValueChange={setRoutingLogic}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="round-robin">Round Robin</SelectItem>
                            <SelectItem value="priority">Priority-based</SelectItem>
                            <SelectItem value="skill">Skill-based</SelectItem>
                            <SelectItem value="random">Random</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Queue Limit</Label>
                        <Input type="number" value={queueLimit} onChange={(e) => setQueueLimit(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Max Waiting Time (sec)</Label>
                        <Input type="number" value={maxWaiting} onChange={(e) => setMaxWaiting(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                        <Label className="text-xs font-medium">Voicemail</Label>
                        <Switch checked={voicemail} onCheckedChange={setVoicemail} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* 9. Outbound */}
              {showOutbound && (
                <AccordionItem value="outbound" className="group border border-border/50 rounded-2xl px-5 overflow-hidden bg-gradient-to-br from-card to-card/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <SectionTrigger icon={PhoneOutgoing} title="Outbound Global Settings" desc="Dialing mode, retries & DND" gradient={G.outbound} />
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Dialing Mode</Label>
                        <Select value={dialingMode} onValueChange={setDialingMode}>
                          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="predictive">Predictive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/50">
                        <div>
                          <Label className="text-xs font-medium">DND Handling</Label>
                          <p className="text-[11px] text-muted-foreground">Respect Do-Not-Disturb lists</p>
                        </div>
                        <Switch checked={dndHandling} onCheckedChange={setDndHandling} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Retry Count</Label>
                        <Input type="number" value={retryCount} onChange={(e) => setRetryCount(e.target.value)} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Retry Delay (sec)</Label>
                        <Input type="number" value={retryDelay} onChange={(e) => setRetryDelay(e.target.value)} className="rounded-xl" />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

            </Accordion>
          </div>

          {/* Bottom save bar (mobile + desktop) */}
          <div className="flex items-center justify-end gap-2 pt-2 pb-6">
            <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={handleTest}>
              <Play className="h-3.5 w-3.5" /> Preview Agent
            </Button>
            <Button size="sm" className="rounded-xl gap-1.5" onClick={handleSave}>
              <Save className="h-3.5 w-3.5" /> Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
