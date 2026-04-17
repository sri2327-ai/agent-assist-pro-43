export interface CallHistoryRecord {
  id: string;
  from: string;
  to: string;
  direction: "Inbound" | "Outbound";
  started_at: string;
  ended_at: string;
  duration: string;
  type: string;
  pat_name: string;
  status: string;
  uniqid: string;
}

const raw = [
  { CallLogDet: { id: "call_mn6dyf3ffb3fdd", from: "+16314886390", to: "+18037212893", direction: "Inbound", started_at: "2026-03-25T18:37:21.771000", ended_at: "2026-03-25T18:39:58.118000", duration: "00:02:36", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03252026" },
  { CallLogDet: { id: "call_mn6f0zep1485a7", from: "+16314886390", to: "+18037212893", direction: "Inbound", started_at: "2026-03-25T19:07:21.025000", ended_at: "2026-03-25T19:08:58.433000", duration: "00:01:37", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03252026" },
  { CallLogDet: { id: "call_mn6fe2q3c5083a", from: "+16314886390", to: "+18037212893", direction: "Inbound", started_at: "2026-03-25T19:17:31.851000", ended_at: "2026-03-25T19:19:38.345000", duration: "00:02:06", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03252026" },
  { CallLogDet: { id: "call_mn74smuxa3ff48", from: "+918072446799", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T07:08:41.529000", ended_at: "2026-03-26T07:12:42.194000", duration: "00:04:00", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn75nb87f7a179", from: "+918072446799", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T07:32:32.791000", ended_at: "2026-03-26T07:35:59.532000", duration: "00:03:26", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7aud5ifc09df", from: "+918072446799", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T09:57:59.959000", ended_at: "2026-03-26T10:00:33.113000", duration: "00:02:33", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7fwvxlc508bc", from: "+918072446799", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T12:19:55.689000", ended_at: "2026-03-26T12:20:57.580000", duration: "00:01:01", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7g2lzt654b9a", from: "+917010944325", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T12:24:22.745000", ended_at: "2026-03-26T12:25:44.733000", duration: "00:01:21", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7g4r9zfa1479", from: "+917010944325", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T12:26:02.903000", ended_at: "2026-03-26T12:26:19.357000", duration: "00:00:16", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7g58y8cc5b6c", from: "+917010944325", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T12:26:25.808000", ended_at: "2026-03-26T12:26:46.963000", duration: "00:00:21", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7r6u8gdc1cfa", from: "+918682000023", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T17:35:35.825000", ended_at: "2026-03-26T17:37:37.332000", duration: "00:02:01", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7s3kba6dde4e", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:01:02.615000", ended_at: "2026-03-26T18:03:05.072000", duration: "00:02:02", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7s4kyzfc3c65", from: "+918682000023", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:01:50.123000", ended_at: "2026-03-26T18:03:12.364000", duration: "00:01:22", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7s7jn2270af9", from: "+918682000023", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:04:08.366000", ended_at: "2026-03-26T18:06:48.713000", duration: "00:02:40", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7sbfysd0b21d", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:07:10.228000", ended_at: "2026-03-26T18:08:43.168000", duration: "00:01:32", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7sdjll23df72", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:08:48.249000", ended_at: "2026-03-26T18:10:53.754000", duration: "00:02:05", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7tiv9p9de25d", from: "+918682000023", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:40:56.269000", ended_at: "2026-03-26T18:43:47.101000", duration: "00:02:50", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7tsc89a741b0", from: "+918682000023", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:48:18.153000", ended_at: "2026-03-26T18:50:17.825000", duration: "00:01:59", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7tttwg6f81d5", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T18:49:27.712000", ended_at: "2026-03-26T18:50:07.224000", duration: "00:00:39", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn7wxnpq05003a", from: "+18477021794", to: "+18037212893", direction: "Inbound", started_at: "2026-03-26T20:16:25.166000", ended_at: "2026-03-26T20:20:08.969000", duration: "00:03:43", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03262026" },
  { CallLogDet: { id: "call_mn8gocv53f1833", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T05:29:03.521000", ended_at: "2026-03-27T05:29:11.636000", duration: "00:00:08", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
  { CallLogDet: { id: "call_mn8qy8p96a5711", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T10:16:40.846000", ended_at: "2026-03-27T10:16:49.417000", duration: "00:00:08", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
  { CallLogDet: { id: "call_mn8slqgwd4b3f9", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T11:02:56.577000", ended_at: "2026-03-27T11:04:14.170000", duration: "00:01:17", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
  { CallLogDet: { id: "call_mn8wcw5c8e14a6", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T12:48:02.496000", ended_at: "2026-03-27T12:50:25.149000", duration: "00:02:22", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
  { CallLogDet: { id: "call_mn8whxzxf66bcd", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T12:51:58.174000", ended_at: "2026-03-27T12:52:35.239000", duration: "00:00:37", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
  { CallLogDet: { id: "call_mn8wjgl8267cce", from: "+917708620960", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T12:53:08.924000", ended_at: "2026-03-27T12:55:11.245000", duration: "00:02:02", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
  { CallLogDet: { id: "call_mn8x6lpw85eaf1", from: "+918682000023", to: "+18037212893", direction: "Inbound", started_at: "2026-03-27T13:11:08.661000", ended_at: "2026-03-27T13:14:32.885000", duration: "00:03:24", type: "summary", pat_name: "Test Patient", status: "closed" }, uniqid: "03272026" },
];

const additions: typeof raw = [];
for (let i = 0; i < 67; i++) {
  const base = raw[i % raw.length];
  const dayOffset = Math.floor(i / 6);
  const start = new Date(base.CallLogDet.started_at);
  start.setDate(start.getDate() + dayOffset);
  const end = new Date(base.CallLogDet.ended_at);
  end.setDate(end.getDate() + dayOffset);
  const uniq = `${String(start.getMonth() + 1).padStart(2, "0")}${String(start.getDate()).padStart(2, "0")}${start.getFullYear()}`;
  additions.push({
    CallLogDet: {
      ...base.CallLogDet,
      id: `${base.CallLogDet.id}_x${i}`,
      started_at: start.toISOString(),
      ended_at: end.toISOString(),
    },
    uniqid: uniq,
  });
}

export const mockCallHistory: CallHistoryRecord[] = [...raw, ...additions]
  .map((r) => ({ ...r.CallLogDet, uniqid: r.uniqid }))
  .sort((a, b) => b.started_at.localeCompare(a.started_at)) as CallHistoryRecord[];

export function computeStats(records: CallHistoryRecord[]) {
  const total = records.length;
  let totalSeconds = 0;
  records.forEach((r) => {
    const [h, m, s] = r.duration.split(":").map(Number);
    totalSeconds += h * 3600 + m * 60 + s;
  });
  const avgSeconds = total > 0 ? Math.round(totalSeconds / total) : 0;
  return {
    total,
    totalSeconds,
    avgSeconds,
    totalDurationLabel: formatHMS(totalSeconds, "long"),
    avgDurationLabel: formatHMS(avgSeconds, "short"),
  };
}

export function formatHMS(seconds: number, mode: "long" | "short" = "long"): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (mode === "long") {
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "UTC", label: "UTC" },
];
