export interface Agent {
  id: string;
  name: string;
  type: "Inbound" | "Outbound" | "In & Outbound";
  status: "Active" | "Inactive" | "Draft";
  phoneNumber: string;
  greeting: string;
  callsHandled: number;
  successRate: number;
  createdAt: string;
  lastActive: string;
}

const agentNames = [
  "Inbound Assistant", "Outbound Sales Bot", "Support Agent", "Booking Assistant",
  "Follow-up Agent", "Survey Bot", "Appointment Scheduler", "Lead Qualifier",
  "Payment Reminder", "Welcome Agent", "Escalation Handler", "Feedback Collector",
];

const types: Agent["type"][] = ["Inbound", "Outbound", "In & Outbound"];
const statuses: Agent["status"][] = ["Active", "Inactive", "Draft"];

export const mockAgents: Agent[] = Array.from({ length: 12 }, (_, i) => ({
  id: `agent-${i + 1}`,
  name: agentNames[i],
  type: types[i % 3],
  status: statuses[i < 8 ? 0 : i < 10 ? 1 : 2],
  phoneNumber: `+1 (${Math.floor(200 + Math.random() * 800)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
  greeting: `Hey, you've called [company]. How may I assist you today?`,
  callsHandled: Math.floor(50 + Math.random() * 500),
  successRate: Math.round((70 + Math.random() * 28) * 10) / 10,
  createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 28)).toISOString().split("T")[0],
  lastActive: new Date(2025, Math.floor(Math.random() * 4), Math.floor(1 + Math.random() * 28)).toISOString().split("T")[0],
}));
