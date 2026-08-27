import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  KeyRound,
  Monitor,
  Smartphone,
  LogOut,
  Bell,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SystemAccount() {
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Admin",
    lastName: "Administrator",
    email: "admin@institution.edu",
    phone: "+234 801 234 5678",
    role: "Super Administrator",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleProfileChange = (
    field: keyof typeof profile,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: keyof typeof passwords,
    value: string
  ) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <User className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Account
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage your administrator profile, security and account
              preferences.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================
          PROFILE SUMMARY
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">
        <div className="bg-[#081022] px-6 py-6 text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-bold">
                AA
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-1 text-xs text-slate-300">
                  {profile.email}
                </p>

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Account Active
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Account Role
              </p>

              <p className="mt-1 text-sm font-bold">
                {profile.role}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================================
          PROFILE + SECURITY
      ============================================================ */}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* PROFILE */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200 xl:col-span-2">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#081022]">
              <User className="h-4 w-4 text-[#006dcc]" />
              Administrator Profile
            </CardTitle>

            <p className="text-xs text-slate-500">
              Update the information associated with your administrator
              account.
            </p>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  First Name
                </label>

                <input
                  value={profile.firstName}
                  onChange={(e) =>
                    handleProfileChange("firstName", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Last Name
                </label>

                <input
                  value={profile.lastName}
                  onChange={(e) =>
                    handleProfileChange("lastName", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    handleProfileChange("email", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={profile.phone}
                  onChange={(e) =>
                    handleProfileChange("phone", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Account Role
              </label>

              <input
                value={profile.role}
                disabled
                className="h-10 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500"
              />

              <p className="mt-1.5 text-[10px] text-slate-400">
                Your administrator role can only be changed by another
                authorised administrator.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-4">
              <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SECURITY SUMMARY */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#081022]">
              <Shield className="h-4 w-4 text-emerald-600" />
              Security Status
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-600" />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Two-Factor Authentication
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Additional login protection
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-700">
                Enabled
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Password
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    Last changed 24 days ago
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4 w-full text-xs"
              >
                Change Password
              </Button>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Active Sessions
                  </p>

                  <p className="mt-1 text-[10px] text-slate-500">
                    2 devices currently signed in
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4 w-full text-xs"
              >
                Manage Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================================
          CHANGE PASSWORD
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#081022]">
            <Lock className="h-4 w-4 text-[#006dcc]" />
            Change Password
          </CardTitle>

          <p className="text-xs text-slate-500">
            Keep your administrator account secure with a strong password.
          </p>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <PasswordField
              label="Current Password"
              value={passwords.current}
              onChange={(value) =>
                handlePasswordChange("current", value)
              }
              showPassword={showPassword}
            />

            <PasswordField
              label="New Password"
              value={passwords.newPassword}
              onChange={(value) =>
                handlePasswordChange("newPassword", value)
              }
              showPassword={showPassword}
            />

            <PasswordField
              label="Confirm New Password"
              value={passwords.confirm}
              onChange={(value) =>
                handlePasswordChange("confirm", value)
              }
              showPassword={showPassword}
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#006dcc]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}

              {showPassword ? "Hide passwords" : "Show passwords"}
            </button>

            <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
              <Lock className="h-4 w-4" />
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================
          SECURITY PREFERENCES
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#081022]">
            <Bell className="h-4 w-4 text-[#006dcc]" />
            Security & Notification Preferences
          </CardTitle>

          <p className="text-xs text-slate-500">
            Control the security notifications sent to your administrator
            account.
          </p>
        </CardHeader>

        <CardContent className="divide-y divide-slate-100 p-0">
          <SettingRow
            icon={<Shield className="h-4 w-4" />}
            title="Two-Factor Authentication"
            description="Require an additional verification step when signing in."
            enabled={twoFactorEnabled}
            onChange={setTwoFactorEnabled}
          />

          <SettingRow
            icon={<Mail className="h-4 w-4" />}
            title="Email Notifications"
            description="Receive important administrative notifications by email."
            enabled={emailAlerts}
            onChange={setEmailAlerts}
          />

          <SettingRow
            icon={<AlertTriangle className="h-4 w-4" />}
            title="Login Alerts"
            description="Notify you when your administrator account is accessed."
            enabled={loginAlerts}
            onChange={setLoginAlerts}
          />
        </CardContent>
      </Card>

      {/* ============================================================
          ACTIVE SESSIONS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#081022]">
                <Monitor className="h-4 w-4 text-[#006dcc]" />
                Active Sessions
              </CardTitle>

              <p className="mt-1 text-xs text-slate-500">
                Devices currently signed into your administrator account.
              </p>
            </div>

            <Button
              variant="outline"
              className="hidden gap-2 text-xs sm:flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out Other Sessions
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-5">
          <SessionRow
            icon={<Monitor className="h-5 w-5" />}
            device="MacBook Pro"
            browser="Chrome"
            location="Lagos, Nigeria"
            time="Current session"
            current
          />

          <SessionRow
            icon={<Smartphone className="h-5 w-5" />}
            device="iPhone"
            browser="Safari"
            location="Lagos, Nigeria"
            time="Last active 18 minutes ago"
          />
        </CardContent>
      </Card>

      {/* ============================================================
          RECENT ACCOUNT ACTIVITY
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-[#081022]">
            <Clock3 className="h-4 w-4 text-[#006dcc]" />
            Recent Account Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-4">
            <ActivityItem
              title="Successful login"
              description="Administrator account signed in from Chrome on MacBook Pro."
              time="Today, 08:42 AM"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />

            <ActivityItem
              title="Profile updated"
              description="Administrator profile information was updated."
              time="Yesterday, 04:16 PM"
              icon={<User className="h-4 w-4" />}
            />

            <ActivityItem
              title="Password changed"
              description="Account password was successfully changed."
              time="24 days ago"
              icon={<Lock className="h-4 w-4" />}
            />
          </div>
        </CardContent>
      </Card>

      {/* ============================================================
          DANGER ZONE
      ============================================================ */}

      <Card className="border-red-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-red-700">
                Sign Out From All Devices
              </p>

              <p className="mt-1 text-xs text-slate-500">
                This will end every active session except the one you are
                currently using.
              </p>
            </div>

            <Button
              variant="outline"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign Out All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ================================================================
   PASSWORD FIELD
================================================================ */

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

/* ================================================================
   SETTING ROW
================================================================ */

function SettingRow({
  icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold text-slate-800">
            {title}
          </p>

          <p className="mt-1 max-w-xl text-[11px] leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#006dcc]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ================================================================
   SESSION ROW
================================================================ */

function SessionRow({
  icon,
  device,
  browser,
  location,
  time,
  current,
}: {
  icon: React.ReactNode;
  device: string;
  browser: string;
  location: string;
  time: string;
  current?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-slate-800">
              {device}
            </p>

            {current && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                Current
              </span>
            )}
          </div>

          <p className="mt-1 text-[11px] text-slate-500">
            {browser} • {location}
          </p>

          <p className="mt-1 text-[10px] text-slate-400">
            {time}
          </p>
        </div>
      </div>

      {!current && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs"
        >
          <X className="h-3.5 w-3.5" />
          Revoke
        </Button>
      )}
    </div>
  );
}

/* ================================================================
   ACTIVITY ITEM
================================================================ */

function ActivityItem({
  title,
  description,
  time,
  icon,
}: {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#006dcc]">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex flex-col justify-between gap-1 sm:flex-row">
          <p className="text-xs font-bold text-slate-800">
            {title}
          </p>

          <span className="text-[10px] text-slate-400">
            {time}
          </span>
        </div>

        <p className="mt-1 text-[11px] leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}