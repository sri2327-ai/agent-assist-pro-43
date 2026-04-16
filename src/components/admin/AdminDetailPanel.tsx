import { useLocation } from "react-router-dom";
import { mockDoctors } from "@/data/mockDoctors";
import { mockCalls } from "@/data/mockCalls";
import { Activity, Stethoscope, Phone, CheckCircle, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

function MiniStat({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
      <Icon className={cn("h-4 w-4", color)} />
      <div>
        <p className="text-[10px] text-white/40">{label}</p>
        <p className="text-xs font-semibold text-white/90">{value}</p>
      </div>
    </div>
  );
}

function DashboardDetail() {
  const total = mockCalls.length;
  const success = mockCalls.filter((c) => c.status === "Success").length;
  const pending = mockCalls.filter((c) => c.status === "Pending").length;

  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider px-1">Quick Summary</p>
      <MiniStat icon={Phone} label="Total Calls" value={total} color="text-white/70" />
      <MiniStat icon={CheckCircle} label="Successful" value={success} color="text-green-400" />
      <MiniStat icon={Clock} label="Pending" value={pending} color="text-yellow-400" />
      <MiniStat icon={Activity} label="Success Rate" value={`${Math.round((success / total) * 100)}%`} color="text-blue-300" />
    </div>
  );
}

function DoctorsDetail() {
  const active = mockDoctors.filter((d) => d.status === "Active").length;

  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider px-1">Doctor Overview</p>
      <MiniStat icon={Users} label="Total Doctors" value={mockDoctors.length} color="text-white/70" />
      <MiniStat icon={Stethoscope} label="Active" value={active} color="text-green-400" />
      <div className="space-y-1 mt-2">
        <p className="text-[10px] text-white/40 px-1">Recent</p>
        {mockDoctors.slice(0, 4).map((d) => (
          <div key={d.id} className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5">
            <div className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}>
              {d.name.charAt(4)}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/80 truncate">{d.name}</p>
              <p className="text-[9px] text-white/40">{d.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CallsDetail() {
  const recent = mockCalls.slice(0, 5);
  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider px-1">Recent Calls</p>
      {recent.map((c) => (
        <div key={c.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5">
          <div className="min-w-0">
            <p className="text-[11px] text-white/80 truncate">{c.customerName}</p>
            <p className="text-[9px] text-white/40">{c.callId}</p>
          </div>
          <span className={cn(
            "text-[9px] font-medium rounded-full px-2 py-0.5",
            c.status === "Success" && "bg-green-500/20 text-green-300",
            c.status === "Pending" && "bg-yellow-500/20 text-yellow-300",
            c.status === "Failed" && "bg-red-500/20 text-red-300",
          )}>
            {c.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function SettingsDetail() {
  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider px-1">Quick Actions</p>
      {["Profile", "Notifications", "Security", "Support"].map((item) => (
        <div key={item} className="rounded-lg bg-white/5 px-3 py-2 text-[11px] text-white/70 cursor-pointer hover:bg-white/10 transition-colors">
          {item}
        </div>
      ))}
    </div>
  );
}

export function AdminDetailPanel() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="h-full overflow-y-auto px-3 py-3 custom-scrollbar">
      {path.includes("/doctors") ? <DoctorsDetail /> :
       path.includes("/calls") ? <CallsDetail /> :
       path.includes("/settings") ? <SettingsDetail /> :
       <DashboardDetail />}
    </div>
  );
}
