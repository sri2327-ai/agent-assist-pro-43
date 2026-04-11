export interface CallRecord {
  id: string;
  agentName: string;
  callId: string;
  customerName: string;
  status: "Success" | "Pending" | "Failed";
  duration: string;
  date: string;
  summary: string;
  transcript: string;
}

export const mockCalls: CallRecord[] = [
  {
    id: "1",
    agentName: "John Doe",
    callId: "CALL-1001",
    customerName: "Rahul Sharma",
    status: "Success",
    duration: "05:32",
    date: "2026-04-10",
    summary: "Customer inquiry resolved successfully regarding billing issue. Agent provided clear explanation of charges and applied a courtesy discount.",
    transcript: "Agent: Hello Rahul, thank you for calling. How can I help you today?\nCustomer: Hi, I have a question about my latest bill. There's an extra charge I don't recognize.\nAgent: I'd be happy to look into that for you. Can you tell me the amount?\nCustomer: It's $24.99, labeled as 'Premium Service'.\nAgent: I see that charge. It appears it was added on March 15th. Let me check if this was authorized.\nAgent: It looks like this was added in error. I'll remove it and apply a courtesy credit.\nCustomer: Thank you so much!\nAgent: You're welcome. Is there anything else I can help with?\nCustomer: No, that's all. Thanks again!"
  },
  {
    id: "2",
    agentName: "Priya Singh",
    callId: "CALL-1002",
    customerName: "Ankit Verma",
    status: "Pending",
    duration: "02:15",
    date: "2026-04-10",
    summary: "Call disconnected before resolution. Customer was inquiring about service upgrade options. Follow-up required.",
    transcript: "Agent: Hello, thank you for calling support.\nCustomer: Hi, I wanted to ask about upgrading my plan.\nAgent: Sure! We have several options available...\n[Call disconnected]\nAgent: Hello? Are you still there?\n[Call ended]"
  },
  {
    id: "3",
    agentName: "Arun Kumar",
    callId: "CALL-1003",
    customerName: "Sneha Iyer",
    status: "Failed",
    duration: "00:45",
    date: "2026-04-09",
    summary: "Call failed due to network issue. Multiple connection attempts were unsuccessful.",
    transcript: "System: Attempting to connect...\nSystem: Connection failed. Retrying...\nSystem: Connection failed. Call terminated."
  },
  {
    id: "4",
    agentName: "Sarah Chen",
    callId: "CALL-1004",
    customerName: "Vikram Patel",
    status: "Success",
    duration: "08:47",
    date: "2026-04-09",
    summary: "Technical support call. Customer's internet connectivity issue was diagnosed and resolved by resetting the router configuration.",
    transcript: "Agent: Hello Vikram, I understand you're having internet issues?\nCustomer: Yes, my connection keeps dropping every few minutes.\nAgent: I can see some instability on your line. Let me run a diagnostic...\nAgent: It appears your router needs a configuration update. I'll walk you through it.\nCustomer: Okay, ready.\nAgent: First, please navigate to 192.168.1.1 in your browser...\n[Configuration steps completed]\nAgent: Your connection should be stable now. Please monitor it for the next hour.\nCustomer: It's working great now. Thank you!"
  },
  {
    id: "5",
    agentName: "John Doe",
    callId: "CALL-1005",
    customerName: "Meera Reddy",
    status: "Success",
    duration: "03:21",
    date: "2026-04-08",
    summary: "Account verification and password reset completed successfully.",
    transcript: "Agent: Hello Meera, how can I assist you?\nCustomer: I'm locked out of my account.\nAgent: I can help with that. Let me verify your identity first.\nAgent: Can you confirm the email address on the account?\nCustomer: meera.reddy@email.com\nAgent: Perfect. I've sent a password reset link to your email.\nCustomer: Got it, thank you!"
  },
  {
    id: "6",
    agentName: "Priya Singh",
    callId: "CALL-1006",
    customerName: "Deepak Joshi",
    status: "Pending",
    duration: "04:10",
    date: "2026-04-08",
    summary: "Customer requested refund for subscription. Escalated to billing department for approval.",
    transcript: "Agent: Hello Deepak, what can I help you with?\nCustomer: I'd like to cancel my subscription and get a refund.\nAgent: I understand. May I ask why you'd like to cancel?\nCustomer: I'm not using the service anymore.\nAgent: I'll process the cancellation. For the refund, I need to escalate to our billing team.\nCustomer: How long will that take?\nAgent: Typically 3-5 business days. You'll receive an email confirmation.\nCustomer: Alright, thank you."
  },
];
