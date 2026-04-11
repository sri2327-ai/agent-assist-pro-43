export interface CallRecord {
  id: string;
  agentName: string;
  callId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: "Success" | "Pending" | "Failed";
  duration: string;
  date: string;
  summary: string;
  transcript: string;
}

const agentNames = [
  "John Doe", "Priya Singh", "Arun Kumar", "Sarah Chen", "Vikram Patel",
  "Meera Reddy", "Deepak Joshi", "Ananya Gupta", "Raj Malhotra", "Lisa Wang",
];

const customerNames = [
  "Rahul Sharma", "Ankit Verma", "Sneha Iyer", "Vikram Patel", "Meera Reddy",
  "Deepak Joshi", "Kavita Nair", "Rohit Mehta", "Neha Kapoor", "Suresh Pillai",
  "Amit Tiwari", "Pooja Desai", "Manish Agarwal", "Swati Kulkarni", "Ravi Shankar",
  "Divya Menon", "Karan Bhatia", "Anjali Rao", "Siddharth Das", "Nisha Choudhary",
  "Aarav Mishra", "Ritika Sen", "Tarun Saxena", "Prachi Jain", "Varun Khanna",
  "Shweta Pandey", "Gaurav Soni", "Tanvi Bhatt", "Nikhil Goyal", "Rekha Prasad",
];

const summaries = [
  "Customer inquiry resolved successfully regarding billing issue. Agent provided clear explanation of charges and applied a courtesy discount.",
  "Call disconnected before resolution. Customer was inquiring about service upgrade options. Follow-up required.",
  "Call failed due to network issue. Multiple connection attempts were unsuccessful.",
  "Technical support call. Customer's internet connectivity issue was diagnosed and resolved by resetting the router configuration.",
  "Account verification and password reset completed successfully.",
  "Customer requested refund for subscription. Escalated to billing department for approval.",
  "Product demo scheduled for next week. Customer showed strong interest in premium plan.",
  "Complaint regarding late delivery. Compensation offered and accepted by customer.",
  "New account setup completed. Customer walked through onboarding process.",
  "Service outage reported. Ticket created and customer notified of estimated resolution time.",
];

const transcripts = [
  "Agent: Hello, thank you for calling. How can I help you today?\nCustomer: Hi, I have a question about my latest bill.\nAgent: I'd be happy to look into that for you.\nCustomer: There's an extra charge I don't recognize.\nAgent: Let me check that. I see the charge — it was added in error. I'll remove it now.\nCustomer: Thank you so much!\nAgent: You're welcome. Is there anything else?\nCustomer: No, that's all.",
  "Agent: Hello, what can I help you with today?\nCustomer: I'd like to upgrade my plan.\nAgent: Sure! We have several options available.\n[Call disconnected]\nAgent: Hello? Are you still there?\n[Call ended]",
  "System: Attempting to connect...\nSystem: Connection failed. Retrying...\nSystem: Connection failed. Call terminated.",
  "Agent: Hello, I understand you're having connectivity issues?\nCustomer: Yes, my connection keeps dropping.\nAgent: Let me run a diagnostic...\nAgent: Your router needs a configuration update. I'll walk you through it.\nCustomer: Okay, ready.\nAgent: Please navigate to the settings page...\nCustomer: Done. It's working now. Thank you!",
  "Agent: Hello, how can I assist you?\nCustomer: I'm locked out of my account.\nAgent: Let me verify your identity first.\nAgent: Can you confirm your email?\nCustomer: sure, it's my.email@example.com\nAgent: I've sent a password reset link.\nCustomer: Got it, thank you!",
];

const statuses: Array<"Success" | "Pending" | "Failed"> = ["Success", "Pending", "Failed"];
const statusWeights = [0.6, 0.25, 0.15];

function weightedStatus(): "Success" | "Pending" | "Failed" {
  const r = Math.random();
  if (r < statusWeights[0]) return "Success";
  if (r < statusWeights[0] + statusWeights[1]) return "Pending";
  return "Failed";
}

function randomDuration(): string {
  const mins = Math.floor(Math.random() * 15);
  const secs = Math.floor(Math.random() * 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function randomDate(): string {
  const start = new Date("2026-03-01");
  const end = new Date("2026-04-11");
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split("T")[0];
}

function randomPhone(): string {
  return `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`;
}

function randomEmail(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`;
}

export const mockCalls: CallRecord[] = Array.from({ length: 75 }, (_, i) => {
  const customer = customerNames[i % customerNames.length];
  const status = weightedStatus();
  return {
    id: String(i + 1),
    agentName: agentNames[Math.floor(Math.random() * agentNames.length)],
    callId: `CALL-${1001 + i}`,
    customerName: customer,
    customerPhone: randomPhone(),
    customerEmail: randomEmail(customer),
    status,
    duration: status === "Failed" ? `00:${String(Math.floor(Math.random() * 59) + 1).padStart(2, "0")}` : randomDuration(),
    date: randomDate(),
    summary: summaries[i % summaries.length],
    transcript: transcripts[i % transcripts.length],
  };
}).sort((a, b) => b.date.localeCompare(a.date));
