import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, Bot, User, Send, Sparkles, RefreshCw, Pencil, Check,
  TrendingUp, Headphones, PhoneCall, ArrowRight, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Step = "template" | "chat" | "review";
type TemplateKey = "sales" | "support" | "followup";

interface Template {
  key: TemplateKey;
  label: string;
  desc: string;
  icon: any;
  gradient: string;
  defaults: Record<string, string>;
}

const TEMPLATES: Template[] = [
  {
    key: "sales",
    label: "Sales Agent",
    desc: "Qualify leads, pitch products and book demos",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #143151, #387E89)",
    defaults: { goal: "sales", tone: "persuasive", escalation: "yes" },
  },
  {
    key: "support",
    label: "Customer Support Agent",
    desc: "Answer questions, resolve issues, build trust",
    icon: Headphones,
    gradient: "linear-gradient(135deg, #387E89, #5BA3AE)",
    defaults: { goal: "support", tone: "friendly", escalation: "yes" },
  },
  {
    key: "followup",
    label: "Follow-up Agent",
    desc: "Re-engage leads and confirm appointments",
    icon: PhoneCall,
    gradient: "linear-gradient(135deg, #143151, #A5CCF3)",
    defaults: { goal: "follow-up", tone: "professional", escalation: "no" },
  },
];

interface Question {
  id: string;
  text: string;
  placeholder: string;
  type: "text" | "textarea" | "choice";
  choices?: string[];
}

const QUESTIONS: Question[] = [
  { id: "business", text: "What is your business name?", placeholder: "e.g. Acme Health Clinic", type: "text" },
  { id: "goal", text: "What is the main goal of this agent?", placeholder: "Pick one", type: "choice", choices: ["sales", "support", "follow-up"] },
  { id: "tone", text: "What tone should the agent use?", placeholder: "Pick one", type: "choice", choices: ["friendly", "professional", "persuasive"] },
  { id: "language", text: "Which language should the agent speak?", placeholder: "Pick one", type: "choice", choices: ["English", "Tamil", "Hindi", "Spanish"] },
  { id: "instructions", text: "What key instructions should the agent follow?", placeholder: "e.g. always confirm appointments, collect email...", type: "textarea" },
  { id: "restrictions", text: "Any restricted topics or rules?", placeholder: "e.g. don't discuss pricing, no medical advice...", type: "textarea" },
  { id: "escalation", text: "Should it escalate to a human if needed?", placeholder: "Pick one", type: "choice", choices: ["yes", "no"] },
];

interface ChatMsg {
  role: "agent" | "user";
  content: string;
  qId?: string;
  typing?: boolean;
}

export function TemplateChatDialog({ open, onOpenChange, agentType }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  agentType: string;
}) {
  const [step, setStep] = useState<Step>("template");
  const [template, setTemplate] = useState<Template | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState("");
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [agentName, setAgentName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const reset = () => {
    setStep("template");
    setTemplate(null);
    setMessages([]);
    setAnswers({});
    setCurrentQ(0);
    setInput("");
    setEditingQId(null);
    setGeneratedPrompt("");
    setAgentName("");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(reset, 250);
  };

  // auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const askQuestion = (idx: number) => {
    const q = QUESTIONS[idx];
    if (!q) return;
    // typing indicator
    setMessages((m) => [...m, { role: "agent", content: "", typing: true, qId: q.id }]);
    setTimeout(() => {
      setMessages((m) => {
        const copy = [...m];
        const last = copy[copy.length - 1];
        if (last?.typing) copy[copy.length - 1] = { role: "agent", content: q.text, qId: q.id };
        return copy;
      });
    }, 700);
  };

  const handleTemplateSelect = (t: Template) => {
    setTemplate(t);
    setStep("chat");
    // intro message
    setTimeout(() => {
      setMessages([
        { role: "agent", content: `Great choice — let's set up your ${t.label}. I'll ask a few quick questions.` },
      ]);
      setTimeout(() => askQuestion(0), 800);
    }, 200);
  };

  const submitAnswer = (val: string) => {
    const q = QUESTIONS[currentQ];
    if (!q || !val.trim()) return;
    setAnswers((a) => ({ ...a, [q.id]: val }));
    setMessages((m) => [...m, { role: "user", content: val, qId: q.id }]);
    setInput("");
    const next = currentQ + 1;
    setCurrentQ(next);
    if (next < QUESTIONS.length) {
      setTimeout(() => askQuestion(next), 400);
    } else {
      // done
      setTimeout(() => {
        setMessages((m) => [...m, { role: "agent", content: "Perfect — generating your agent configuration now ✨" }]);
        setTimeout(() => generateConfig({ ...answers, [q.id]: val }), 900);
      }, 400);
    }
  };

  const generateConfig = (data: Record<string, string>) => {
    const business = data.business || "Your Business";
    const goal = data.goal || "support";
    const tone = data.tone || "professional";
    const lang = data.language || "English";
    const instructions = data.instructions || "Be helpful and concise.";
    const restrictions = data.restrictions || "None.";
    const escalation = data.escalation || "yes";

    const name = `${business} ${template?.label.replace(" Agent", "")} Agent`;
    setAgentName(name);

    const sysPrompt = `# ROLE
You are an AI ${template?.label} for ${business}, speaking in ${lang}.

# OBJECTIVE
Your primary goal is to handle ${goal} interactions over voice calls — qualifying intent, providing accurate information, and driving the call to a successful outcome.

# TONE & STYLE
- Speak in a ${tone} tone
- Keep responses short, natural and conversational
- Use clear language appropriate for spoken delivery

# RULES & INSTRUCTIONS
${instructions.split("\n").map((l) => `- ${l}`).join("\n")}

# RESTRICTIONS
${restrictions.split("\n").map((l) => `- ${l}`).join("\n")}

# FALLBACK BEHAVIOR
${escalation === "yes"
        ? "If the caller requests a human, expresses strong dissatisfaction, or asks something outside your scope, politely offer to transfer them to a human agent."
        : "If you cannot help, politely apologize and suggest the caller try again later or visit the website."}

# CLOSING
Always end the call by confirming next steps and thanking the caller.`;

    setGeneratedPrompt(sysPrompt);
    setStep("review");
  };

  const regeneratePrompt = () => {
    toast.success("Regenerating prompt...");
    setTimeout(() => generateConfig(answers), 400);
  };

  const startEdit = (qId: string) => {
    setEditingQId(qId);
    setEditValue(answers[qId] || "");
  };

  const saveEdit = () => {
    if (!editingQId) return;
    setAnswers((a) => ({ ...a, [editingQId]: editValue }));
    setMessages((m) => m.map((msg) => (msg.qId === editingQId && msg.role === "user" ? { ...msg, content: editValue } : msg)));
    setEditingQId(null);
    toast.success("Answer updated");
  };

  const handleSave = () => {
    const params = new URLSearchParams({
      type: agentType,
      mode: "predefined",
      template: template?.key || "",
      name: agentName,
      prompt: generatedPrompt,
      tone: answers.tone || "",
      language: answers.language || "",
    });
    handleClose();
    navigate(`/admin/agents/new?${params.toString()}`);
    toast.success("Agent draft created from template");
  };

  const currentQuestion = QUESTIONS[currentQ];
  const progress = step === "chat" ? Math.round((currentQ / QUESTIONS.length) * 100) : step === "review" ? 100 : 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-3">
            {step !== "template" && (
              <button
                onClick={() => {
                  if (step === "review") setStep("chat");
                  else setStep("template");
                }}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0" style={{ background: template?.gradient || "linear-gradient(135deg, #143151, #387E89)" }}>
              {step === "review" ? <Sparkles className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground">
                {step === "template" && "Choose a Template"}
                {step === "chat" && `${template?.label} Setup`}
                {step === "review" && "Review & Confirm"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === "template" && "Pick a starting point for your agent"}
                {step === "chat" && `Question ${Math.min(currentQ + 1, QUESTIONS.length)} of ${QUESTIONS.length}`}
                {step === "review" && "Edit anything before saving"}
              </p>
            </div>
          </div>
          {/* Progress */}
          {step !== "template" && (
            <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, background: "linear-gradient(90deg, #143151, #387E89)" }}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {step === "template" && (
            <div className="p-6 space-y-3 overflow-y-auto">
              {TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => handleTemplateSelect(t)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/40 hover:bg-accent/40 hover:shadow-md transition-all duration-200 text-left group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white group-hover:scale-105 transition-transform" style={{ background: t.gradient }}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base text-foreground">{t.label}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{t.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}

          {step === "chat" && (
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-gradient-to-b from-background to-muted/20">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-3 animate-fade-in", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "agent" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white" style={{ background: template?.gradient }}>
                        <Bot className="h-4 w-4" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                        msg.role === "agent"
                          ? "bg-card border border-border/50 text-foreground rounded-tl-sm"
                          : "text-white rounded-tr-sm"
                      )}
                      style={msg.role === "user" ? { background: "linear-gradient(135deg, #143151, #387E89)" } : undefined}
                    >
                      {msg.typing ? (
                        <div className="flex gap-1 py-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              {currentQ < QUESTIONS.length && (
                <div className="border-t border-border/40 p-4 bg-card shrink-0">
                  {currentQuestion?.type === "choice" ? (
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.choices?.map((c) => (
                        <Button
                          key={c}
                          variant="outline"
                          onClick={() => submitAnswer(c)}
                          className="rounded-full capitalize hover:border-primary/40 hover:bg-accent/60 transition-all"
                        >
                          {c}
                        </Button>
                      ))}
                    </div>
                  ) : currentQuestion?.type === "textarea" ? (
                    <div className="flex gap-2 items-end">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        className="rounded-xl resize-none min-h-[60px] flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            submitAnswer(input);
                          }
                        }}
                      />
                      <Button
                        onClick={() => submitAnswer(input)}
                        disabled={!input.trim()}
                        className="rounded-xl text-white h-10"
                        style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={currentQuestion?.placeholder}
                        className="rounded-xl"
                        onKeyDown={(e) => e.key === "Enter" && submitAnswer(input)}
                        autoFocus
                      />
                      <Button
                        onClick={() => submitAnswer(input)}
                        disabled={!input.trim()}
                        className="rounded-xl text-white"
                        style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {step === "review" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Summary card */}
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Agent Configuration
                  </h3>
                  <Badge variant="outline" className="rounded-full text-xs">{template?.label}</Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Agent Name</label>
                    <Input value={agentName} onChange={(e) => setAgentName(e.target.value)} className="rounded-xl mt-1" />
                  </div>
                </div>
              </div>

              {/* Answers list */}
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <h3 className="font-semibold text-base text-foreground mb-3">Your Answers</h3>
                <div className="space-y-3">
                  {QUESTIONS.map((q) => (
                    <div key={q.id} className="flex items-start gap-3 group">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-muted-foreground">{q.text}</p>
                        {editingQId === q.id ? (
                          <div className="mt-1 flex gap-2 items-start">
                            {q.type === "textarea" ? (
                              <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="rounded-lg text-sm flex-1" rows={2} />
                            ) : q.type === "choice" ? (
                              <select value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 h-9 rounded-lg border border-input bg-background px-3 text-sm">
                                {q.choices?.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                            ) : (
                              <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="rounded-lg flex-1 h-9" />
                            )}
                            <Button size="sm" onClick={saveEdit} className="h-9 rounded-lg text-white" style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}>
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-foreground mt-0.5 break-words">{answers[q.id] || <span className="italic text-muted-foreground">Not answered</span>}</p>
                        )}
                      </div>
                      {editingQId !== q.id && (
                        <button
                          onClick={() => startEdit(q.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent transition-all"
                        >
                          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated prompt */}
              <div className="rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-base text-foreground flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" /> Generated AI Prompt
                  </h3>
                  <Button variant="outline" size="sm" onClick={regeneratePrompt} className="rounded-lg gap-1.5 h-8 text-xs">
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </Button>
                </div>
                <Textarea
                  value={generatedPrompt}
                  onChange={(e) => setGeneratedPrompt(e.target.value)}
                  className="rounded-xl font-mono text-xs leading-relaxed min-h-[260px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "review" && (
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between shrink-0 bg-card">
            <Button variant="outline" onClick={handleClose} className="rounded-xl">Cancel</Button>
            <Button
              onClick={handleSave}
              className="rounded-xl text-white gap-2 hover:scale-[1.02] transition-transform"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
            >
              <Save className="h-4 w-4" /> Save & Continue
            </Button>
          </div>
        )}

        {step === "template" && (
          <div className="px-6 pb-6 flex justify-end shrink-0">
            <Button variant="outline" onClick={handleClose} className="rounded-xl">Cancel</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
