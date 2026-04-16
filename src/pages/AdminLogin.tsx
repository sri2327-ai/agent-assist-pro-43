import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, ArrowRight, Activity, Users, Stethoscope } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuthStore();
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
      navigate("/admin/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0f2027 0%, #143151 30%, #387E89 70%, #2c5364 100%)" }}
      >
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] h-80 w-80 rounded-full opacity-20 animate-float"
            style={{ background: "radial-gradient(circle, rgba(56,126,137,0.6) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[15%] right-[5%] h-96 w-96 rounded-full opacity-15 animate-float-delayed"
            style={{ background: "radial-gradient(circle, rgba(20,49,81,0.8) 0%, transparent 70%)" }} />
          <div className="absolute top-[50%] left-[60%] h-64 w-64 rounded-full opacity-10 animate-float-slow"
            style={{ background: "radial-gradient(circle, rgba(56,126,137,0.5) 0%, transparent 70%)" }} />
          {/* Floating particles */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-white/20 animate-float"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + i * 14}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
              }}
            />
          ))}
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-10 text-center animate-fade-in">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/20 shadow-2xl animate-scale-in"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))", backdropFilter: "blur(20px)" }}>
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10">
            Manage your healthcare operations with intelligent tools and real-time insights.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Users, label: "Doctors", value: "120+" },
              { icon: Activity, label: "Calls/Day", value: "2.5K" },
              { icon: Stethoscope, label: "Departments", value: "15" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 p-4 animate-slide-up"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  backdropFilter: "blur(10px)",
                  animationDelay: `${0.2 + i * 0.15}s`,
                }}
              >
                <stat.icon className="h-6 w-6 text-white/70 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 xl:w-[45%] items-center justify-center bg-background px-6 py-12">
        <div className="w-full max-w-sm animate-slide-up">
          {/* Mobile branding */}
          <div className="mb-8 text-center lg:hidden">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
            >
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground">Admin Sign In</h1>
            <p className="text-muted-foreground">Access the administration dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email" className="text-sm font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/60 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-secondary hover:text-secondary/80 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/60 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group text-white"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In to Admin
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
                S10.AI Healthcare
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
