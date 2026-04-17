import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/admin/analytics/KpiCard";
import { ChartCard } from "@/components/admin/analytics/ChartCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Phone, PhoneCall, Clock, Timer, CheckCircle2, ListOrdered, RefreshCw,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  callsOverTime, inboundOutbound, callStatus, avgDurationTrend, failureReasons,
  callsPerAgent, agentSuccessRate, agentHandlingTime, aiVsHuman, callFunnel, sentiment,
  agentNames,
} from "@/data/mockAnalytics";

const tooltipStyle = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "0.75rem",
  fontSize: "12px",
  color: "hsl(var(--popover-foreground))",
};

export default function AdminAnalytics() {
  const [range, setRange] = useState<"today" | "week" | "month">("week");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [callType, setCallType] = useState<string>("all");

  // Live concurrent calls (simulate real-time stream)
  const [liveData, setLiveData] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: i, active: Math.round(8 + Math.random() * 14) }))
  );
  const [activeCalls, setActiveCalls] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveData((prev) => {
        const next = [...prev.slice(1), { t: prev[prev.length - 1].t + 1, active: Math.round(6 + Math.random() * 18) }];
        setActiveCalls(next[next.length - 1].active);
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const callsSeries = useMemo(() => callsOverTime[range], [range]);

  const refresh = () => {
    setLiveData(Array.from({ length: 20 }, (_, i) => ({ t: i, active: Math.round(8 + Math.random() * 14) })));
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Analytics Dashboard" subtitle="Real-time call agent performance & insights" />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="h-9 w-[160px] rounded-xl text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agentNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={callType} onValueChange={setCallType}>
            <SelectTrigger className="h-9 w-[140px] rounded-xl text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="inbound">Inbound</SelectItem>
              <SelectItem value="outbound">Outbound</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refresh} className="h-9 rounded-xl gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3 pb-5 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard label="Total Calls" value="1,284" trend={12} icon={Phone}
          gradient="linear-gradient(135deg, #143151, #387E89)" delay="0s" />
        <KpiCard label="Active Calls" value={activeCalls} icon={PhoneCall} live
          gradient="linear-gradient(135deg, #cb2431, #e3344a)" delay="0.05s" />
        <KpiCard label="Avg Duration" value="1m 29s" trend={-4} icon={Timer}
          gradient="linear-gradient(135deg, #387E89, #5BA0AC)" delay="0.1s" />
        <KpiCard label="Avg Wait Time" value="14s" trend={-8} icon={Clock}
          gradient="linear-gradient(135deg, #d29922, #e3b341)" delay="0.15s" />
        <KpiCard label="Success Rate" value="78%" trend={3} icon={CheckCircle2}
          gradient="linear-gradient(135deg, #22863a, #2ea043)" delay="0.2s" />
        <KpiCard label="In Queue" value="6" icon={ListOrdered}
          gradient="linear-gradient(135deg, #6f42c1, #8957e5)" delay="0.25s" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-3">
        <ChartCard
          title="Calls Over Time"
          subtitle={`Total calls per ${range === "today" ? "hour" : range === "week" ? "day" : "day"}`}
          delay="0.05s"
          className="lg:col-span-2"
          action={
            <Select value={range} onValueChange={(v) => setRange(v as typeof range)}>
              <SelectTrigger className="h-8 w-[110px] rounded-lg text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={callsSeries}>
              <defs>
                <linearGradient id="callsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="calls" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#callsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Concurrent Calls"
          subtitle="Live • updates every 2s"
          delay="0.1s"
          action={
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-destructive" />
              </span>
              Live
            </span>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={liveData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone" dataKey="active" stroke="hsl(var(--secondary))" strokeWidth={2.5}
                dot={false} isAnimationActive animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Inbound/Outbound + Status + Sentiment */}
      <div className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-3">
        <ChartCard title="Inbound vs Outbound" subtitle="Daily call volume" delay="0.05s">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={inboundOutbound}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="inbound" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} />
              <Bar dataKey="outbound" stackId="a" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Call Status Distribution" delay="0.1s">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={callStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                {callStatus.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sentiment Analysis" subtitle="Caller sentiment breakdown" delay="0.15s">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sentiment} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={{ fontSize: 11 }}>
                {sentiment.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Duration trend + failures + AI vs Human */}
      <div className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-3">
        <ChartCard title="Avg Call Duration Trend" subtitle="Last 14 days (seconds)" delay="0.05s">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={avgDurationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="duration" stroke="hsl(var(--primary))" strokeWidth={2.5}
                dot={{ r: 3, fill: "hsl(var(--primary))" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Call Failure Reasons" delay="0.1s">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={failureReasons} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis dataKey="reason" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="hsl(var(--destructive))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="AI vs Human Calls" delay="0.15s">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={aiVsHuman} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85}>
                {aiVsHuman.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Agent performance */}
      <div className="grid grid-cols-1 gap-4 pb-4 lg:grid-cols-3">
        <ChartCard title="Calls per Agent" delay="0.05s">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={callsPerAgent} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={110} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Agent Success Rate" subtitle="Leaderboard (%)" delay="0.1s">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={[...agentSuccessRate].sort((a, b) => b.rate - a.rate)}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="rate" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Avg Handling Time" subtitle="Per agent (seconds)" delay="0.15s">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={agentHandlingTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="seconds" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Call Funnel */}
      <div className="grid grid-cols-1 gap-4 pb-6">
        <ChartCard title="Call Funnel" subtitle="Dialed → Connected → In Progress → Completed" delay="0.05s">
          <div className="flex flex-col gap-2">
            {callFunnel.map((stage, i) => {
              const max = callFunnel[0].value;
              const pct = (stage.value / max) * 100;
              const conversion = i === 0 ? 100 : Math.round((stage.value / callFunnel[i - 1].value) * 100);
              return (
                <div key={stage.stage} className="group">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-card-foreground">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.value.toLocaleString()} <span className="ml-2 text-[10px]">({conversion}%)</span>
                    </span>
                  </div>
                  <div className="h-7 w-full overflow-hidden rounded-lg bg-muted/50">
                    <div
                      className="h-full rounded-lg transition-all duration-700 ease-out"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
