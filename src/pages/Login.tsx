import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Headphones, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      navigate("/dashboard");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Gradient Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(135deg, #143151 0%, #1a3a5c 40%, #387E89 100%)" }}
      >
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/5 animate-float" />
          <div className="absolute top-1/3 right-10 h-48 w-48 rounded-full bg-white/5 animate-float-delayed" />
          <div className="absolute bottom-20 left-1/4 h-56 w-56 rounded-full bg-white/5 animate-float-slow" />
          <div className="absolute top-10 right-1/3 h-32 w-32 rounded-full bg-white/[0.03] animate-float-delayed" />
          <div className="absolute bottom-1/3 right-1/4 h-40 w-40 rounded-full bg-white/[0.04] animate-float" />
        </div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-md px-8 text-center animate-fade-in">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl animate-scale-in">
            <Headphones className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            CallDesk
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            Your intelligent call agent dashboard. Monitor, manage, and optimize every conversation.
          </p>
          <div className="flex items-center justify-center gap-6 text-white/50 text-sm">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white/90">99.9%</span>
              <span>Uptime</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white/90">50K+</span>
              <span>Calls/Day</span>
            </div>
            <div className="h-8 w-px bg-white/20" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold text-white/90">24/7</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
            >
              <Headphones className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">CallDesk</h1>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your agent dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-secondary hover:text-secondary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/60 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ background: "linear-gradient(90deg, #143151, #387E89)" }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Use any email & password to sign in (mock auth)
          </p>

          <div className="mt-10 pt-6 border-t border-border/40 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by{" "}
              <span
                className="font-semibold bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(90deg, #143151, #387E89)" }}
              >
                CallDesk AI
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
