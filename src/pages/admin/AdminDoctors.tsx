import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { mockDoctors, Doctor } from "@/data/mockDoctors";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Stethoscope, Star, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";

function DoctorStatCard({ label, value, icon: Icon, gradient, delay }: {
  label: string; value: number | string; icon: React.ElementType; gradient: string; delay: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4 shadow-sm animate-slide-up" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: gradient }}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDoctors() {
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filtered = mockDoctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const active = mockDoctors.filter((d) => d.status === "Active").length;
  const onLeave = mockDoctors.filter((d) => d.status === "On Leave").length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 space-y-4 pb-4">
        <PageHeader title="Doctors" subtitle="Manage doctor profiles and availability" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <DoctorStatCard label="Total Doctors" value={mockDoctors.length} icon={Users} gradient="linear-gradient(135deg, #143151, #1a3a5c)" delay="0s" />
          <DoctorStatCard label="Active" value={active} icon={Activity} gradient="linear-gradient(135deg, #22863a, #2ea043)" delay="0.1s" />
          <DoctorStatCard label="On Leave" value={onLeave} icon={Stethoscope} gradient="linear-gradient(135deg, #d29922, #e3b341)" delay="0.2s" />
          <DoctorStatCard label="Avg Rating" value={`${(mockDoctors.reduce((a, d) => a + d.rating, 0) / mockDoctors.length).toFixed(1)} ★`} icon={Star} gradient="linear-gradient(135deg, #387E89, #143151)" delay="0.3s" />
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-xl border border-border/40">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead className="hidden md:table-cell">Patients</TableHead>
              <TableHead className="hidden md:table-cell">Rating</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doctor, i) => (
              <TableRow
                key={doctor.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 0.03}s` }}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                      style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}>
                      {doctor.name.charAt(4)}
                    </div>
                    <span className="font-medium text-sm">{doctor.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{doctor.specialty}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">{doctor.patients}</TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {doctor.rating}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full text-[11px] font-medium",
                      doctor.status === "Active" && "border-green-200 bg-green-50 text-green-700",
                      doctor.status === "On Leave" && "border-yellow-200 bg-yellow-50 text-yellow-700",
                      doctor.status === "Inactive" && "border-red-200 bg-red-50 text-red-700",
                    )}
                  >
                    {doctor.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Doctor Detail Drawer */}
      <Sheet open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
        <SheetContent className="w-full sm:w-[50vw] sm:max-w-[50vw] p-0 rounded-l-2xl overflow-hidden">
          {selectedDoctor && (
            <div className="flex h-full flex-col">
              <SheetHeader className="p-6 text-white" style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur-sm">
                    {selectedDoctor.name.charAt(4)}
                  </div>
                  <div>
                    <SheetTitle className="text-white text-lg">{selectedDoctor.name}</SheetTitle>
                    <p className="text-white/70 text-sm">{selectedDoctor.specialty}</p>
                  </div>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-auto p-6 space-y-4">
                {[
                  { label: "Email", value: selectedDoctor.email },
                  { label: "Phone", value: selectedDoctor.phone },
                  { label: "Status", value: selectedDoctor.status },
                  { label: "Patients", value: selectedDoctor.patients },
                  { label: "Rating", value: `${selectedDoctor.rating} / 5.0` },
                  { label: "Joined", value: selectedDoctor.joinDate },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center py-3 border-b border-border/40">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
