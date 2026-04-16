import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, HelpCircle, Mail, Phone, Shield } from "lucide-react";
import { toast } from "sonner";

function SettingsCard({ children, title, description, delay }: {
  children: React.ReactNode; title: string; description: string; delay: string;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-6 shadow-sm animate-slide-up" style={{ animationDelay: delay }}>
      <h3 className="text-base font-semibold text-card-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-5">{description}</p>
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const { user } = useAdminAuthStore();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 pb-4">
        <PageHeader title="Settings" subtitle="Manage your account and preferences" />
      </div>

      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="rounded-xl">
            <TabsTrigger value="profile" className="rounded-lg gap-2">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-lg gap-2">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="support" className="rounded-lg gap-2">
              <HelpCircle className="h-4 w-4" /> Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <SettingsCard title="Personal Information" description="Update your profile details" delay="0s">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={user?.name} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue="+91 9876543210" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input defaultValue={user?.role} disabled className="rounded-xl" />
                </div>
              </div>
              <Button
                className="mt-4 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
                onClick={() => toast.success("Profile updated")}
              >
                Save Changes
              </Button>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SettingsCard title="Change Password" description="Update your account password" delay="0s">
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" className="rounded-xl" />
                </div>
                <Button
                  className="rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
                  onClick={() => toast.success("Password updated")}
                >
                  Update Password
                </Button>
              </div>
            </SettingsCard>

            <SettingsCard title="Two-Factor Authentication" description="Add an extra layer of security" delay="0.1s">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Enable 2FA</span>
                </div>
                <Switch />
              </div>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <SettingsCard title="Notification Preferences" description="Control how you receive notifications" delay="0s">
              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email Notifications", desc: "Receive updates via email", checked: emailNotif, onChange: setEmailNotif },
                  { icon: Bell, label: "Push Notifications", desc: "Browser push notifications", checked: pushNotif, onChange: setPushNotif },
                  { icon: Phone, label: "SMS Notifications", desc: "Text message alerts", checked: smsNotif, onChange: setSmsNotif },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch checked={item.checked} onCheckedChange={item.onChange} />
                  </div>
                ))}
              </div>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <SettingsCard title="Contact Support" description="Get help from our team" delay="0s">
              <div className="space-y-4 max-w-sm">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input placeholder="Brief description of your issue" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <Button
                  className="rounded-xl text-white"
                  style={{ background: "linear-gradient(135deg, #143151, #387E89)" }}
                  onClick={() => toast.success("Support ticket submitted")}
                >
                  Submit Ticket
                </Button>
              </div>
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
