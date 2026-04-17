// Dummy analytics data for the Call Agent Analytics dashboard
export const callsOverTime = {
  today: Array.from({ length: 24 }, (_, h) => ({
    label: `${String(h).padStart(2, "0")}:00`,
    calls: Math.round(20 + Math.sin(h / 3) * 15 + Math.random() * 12),
  })),
  week: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
    label: d,
    calls: Math.round(180 + Math.cos(i) * 60 + Math.random() * 40),
  })),
  month: Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    calls: Math.round(150 + Math.sin(i / 4) * 60 + Math.random() * 40),
  })),
};

export const inboundOutbound = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d,
  inbound: Math.round(80 + Math.random() * 60),
  outbound: Math.round(60 + Math.random() * 70),
}));

export const callStatus = [
  { name: "Success", value: 612, color: "hsl(var(--success))" },
  { name: "Failed", value: 84, color: "hsl(var(--destructive))" },
  { name: "Missed", value: 56, color: "hsl(var(--warning))" },
  { name: "Busy", value: 38, color: "hsl(var(--muted-foreground))" },
];

export const avgDurationTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  duration: Math.round(80 + Math.sin(i / 2) * 25 + Math.random() * 10),
}));

export const failureReasons = [
  { reason: "No Answer", count: 42 },
  { reason: "User Disconnected", count: 27 },
  { reason: "Network Issue", count: 15 },
  { reason: "Busy", count: 11 },
];

export const agentNames = [
  "Inbound Assistant",
  "Outbound Sales",
  "Support Agent",
  "Booking Bot",
  "Follow-up Agent",
  "Lead Qualifier",
];

export const callsPerAgent = agentNames.map((name) => ({
  name,
  calls: Math.round(60 + Math.random() * 180),
}));

export const agentSuccessRate = agentNames.map((name) => ({
  name,
  rate: Math.round(70 + Math.random() * 28),
}));

export const agentHandlingTime = agentNames.map((name) => ({
  name,
  seconds: Math.round(70 + Math.random() * 90),
}));

export const aiVsHuman = [
  { name: "AI Agents", value: 742, color: "hsl(var(--primary))" },
  { name: "Human Agents", value: 218, color: "hsl(var(--secondary))" },
];

export const callFunnel = [
  { stage: "Dialed", value: 1200 },
  { stage: "Connected", value: 980 },
  { stage: "In Progress", value: 820 },
  { stage: "Completed", value: 612 },
];

export const sentiment = [
  { name: "Positive", value: 480, color: "hsl(var(--success))" },
  { name: "Neutral", value: 290, color: "hsl(var(--muted-foreground))" },
  { name: "Negative", value: 120, color: "hsl(var(--destructive))" },
];
