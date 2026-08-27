import { useState } from "react";
import {
  Settings,
  Building2,
  GraduationCap,
  CalendarDays,
  Bell,
  ShieldCheck,
  CreditCard,
  Video,
  Save,
  RotateCcw,
  Globe,
  Mail,
  Lock,
  Smartphone,
  Database,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SettingsSection =
  | "institution"
  | "academic"
  | "registration"
  | "notifications"
  | "security"
  | "payments"
  | "integrations";

interface ToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-[#006dcc]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

export default function SystemSettings() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("institution");

  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    institutionName: "Edu Pro University",
    institutionCode: "EPU",
    institutionEmail: "info@edupro.edu",
    institutionPhone: "+234 800 000 0000",
    institutionAddress: "Lagos, Nigeria",
    website: "https://edupro.edu",

    academicSession: "2025/2026",
    currentSemester: "First Semester",
    currentLevel: "Undergraduate",
    gradingSystem: "A - F",

    studentRegistration: true,
    courseRegistration: true,
    resultSubmission: true,
    admissionApplication: true,

    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    admissionNotifications: true,
    paymentNotifications: true,

    twoFactorAuthentication: false,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordExpiry: "90",

    paymentGateway: "Paystack",
    paymentCurrency: "NGN",
    maxPaymentAttempts: "3",
    paymentReceipts: true,

    liveClasses: true,
    videoProvider: "Institution Video Server",
    emailProvider: "SMTP",
    backupEnabled: true,
  });

  const updateSetting = (
    key: keyof typeof settings,
    value: string | boolean
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    // Replace this with your API request later.
    console.log("Saving system settings:", settings);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const sections = [
    {
      id: "institution" as SettingsSection,
      label: "Institution",
      description: "Basic institution information",
      icon: Building2,
    },
    {
      id: "academic" as SettingsSection,
      label: "Academic Settings",
      description: "Session and grading configuration",
      icon: GraduationCap,
    },
    {
      id: "registration" as SettingsSection,
      label: "Registration",
      description: "Student registration controls",
      icon: CalendarDays,
    },
    {
      id: "notifications" as SettingsSection,
      label: "Notifications",
      description: "Email, SMS and push alerts",
      icon: Bell,
    },
    {
      id: "security" as SettingsSection,
      label: "Security",
      description: "Authentication and access",
      icon: ShieldCheck,
    },
    {
      id: "payments" as SettingsSection,
      label: "Payments",
      description: "Payment configuration",
      icon: CreditCard,
    },
    {
      id: "integrations" as SettingsSection,
      label: "Integrations",
      description: "Connected services",
      icon: Video,
    },
  ];

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Settings className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              System Settings
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Configure institution-wide platform settings and operational
              rules.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2 border-slate-300 bg-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <Button
            onClick={handleSave}
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* ============================================================
          SAVE MESSAGE
      ============================================================ */}

      {saved && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          System settings have been saved successfully.
        </div>
      )}

      {/* ============================================================
          LAYOUT
      ============================================================ */}

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* ============================================================
            SETTINGS SIDEBAR
        ============================================================ */}

        <Card className="h-fit border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-2">
            <div className="mb-2 px-3 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Configuration
              </p>
            </div>

            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const active = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-blue-50 text-[#006dcc]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-[#006dcc] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold">
                        {section.label}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ============================================================
            CONTENT
        ============================================================ */}

        <div className="space-y-6">
          {/* ========================================================
              INSTITUTION
          ======================================================== */}

          {activeSection === "institution" && (
            <>
              <SectionHeader
                icon={Building2}
                title="Institution Information"
                description="Manage the basic information displayed throughout the platform."
              />

              <SettingsCard title="Institution Details">
                <div className="grid gap-5 md:grid-cols-2">
                  <InputField
                    label="Institution Name"
                    value={settings.institutionName}
                    onChange={(value) =>
                      updateSetting("institutionName", value)
                    }
                  />

                  <InputField
                    label="Institution Code"
                    value={settings.institutionCode}
                    onChange={(value) =>
                      updateSetting("institutionCode", value)
                    }
                  />

                  <InputField
                    label="Institution Email"
                    type="email"
                    value={settings.institutionEmail}
                    onChange={(value) =>
                      updateSetting("institutionEmail", value)
                    }
                  />

                  <InputField
                    label="Phone Number"
                    value={settings.institutionPhone}
                    onChange={(value) =>
                      updateSetting("institutionPhone", value)
                    }
                  />

                  <InputField
                    label="Address"
                    value={settings.institutionAddress}
                    onChange={(value) =>
                      updateSetting("institutionAddress", value)
                    }
                  />

                  <InputField
                    label="Website"
                    value={settings.website}
                    onChange={(value) =>
                      updateSetting("website", value)
                    }
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Platform Information">
                <InfoRow
                  icon={Database}
                  label="Platform Status"
                  value="Operational"
                  status="success"
                />

                <InfoRow
                  icon={Globe}
                  label="Environment"
                  value="Production"
                />

                <InfoRow
                  icon={Settings}
                  label="System Version"
                  value="1.0.0"
                />
              </SettingsCard>
            </>
          )}

          {/* ========================================================
              ACADEMIC
          ======================================================== */}

          {activeSection === "academic" && (
            <>
              <SectionHeader
                icon={GraduationCap}
                title="Academic Settings"
                description="Configure the academic session, semester and grading structure."
              />

              <SettingsCard title="Current Academic Period">
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Academic Session"
                    value={settings.academicSession}
                    options={[
                      "2025/2026",
                      "2026/2027",
                      "2027/2028",
                    ]}
                    onChange={(value) =>
                      updateSetting("academicSession", value)
                    }
                  />

                  <SelectField
                    label="Current Semester"
                    value={settings.currentSemester}
                    options={[
                      "First Semester",
                      "Second Semester",
                      "Summer Semester",
                    ]}
                    onChange={(value) =>
                      updateSetting("currentSemester", value)
                    }
                  />

                  <SelectField
                    label="Academic Level"
                    value={settings.currentLevel}
                    options={[
                      "Undergraduate",
                      "Postgraduate",
                      "All Levels",
                    ]}
                    onChange={(value) =>
                      updateSetting("currentLevel", value)
                    }
                  />

                  <SelectField
                    label="Grading System"
                    value={settings.gradingSystem}
                    options={[
                      "A - F",
                      "5 Point GPA",
                      "4 Point GPA",
                      "Percentage",
                    ]}
                    onChange={(value) =>
                      updateSetting("gradingSystem", value)
                    }
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {/* ========================================================
              REGISTRATION
          ======================================================== */}

          {activeSection === "registration" && (
            <>
              <SectionHeader
                icon={CalendarDays}
                title="Registration Controls"
                description="Control which student academic activities are currently available."
              />

              <SettingsCard title="Student Registration">
                <ToggleRow
                  icon={UserIcon}
                  title="Student Registration"
                  description="Allow students to complete their academic registration."
                  enabled={settings.studentRegistration}
                  onChange={(value) =>
                    updateSetting("studentRegistration", value)
                  }
                />

                <ToggleRow
                  icon={GraduationCap}
                  title="Course Registration"
                  description="Allow students to register courses for the active semester."
                  enabled={settings.courseRegistration}
                  onChange={(value) =>
                    updateSetting("courseRegistration", value)
                  }
                />

                <ToggleRow
                  icon={CheckCircle2}
                  title="Result Submission"
                  description="Allow lecturers to submit academic results."
                  enabled={settings.resultSubmission}
                  onChange={(value) =>
                    updateSetting("resultSubmission", value)
                  }
                />

                <ToggleRow
                  icon={NotebookIcon}
                  title="Admission Applications"
                  description="Allow prospective students to submit admission applications."
                  enabled={settings.admissionApplication}
                  onChange={(value) =>
                    updateSetting("admissionApplication", value)
                  }
                />
              </SettingsCard>
            </>
          )}

          {/* ========================================================
              NOTIFICATIONS
          ======================================================== */}

          {activeSection === "notifications" && (
            <>
              <SectionHeader
                icon={Bell}
                title="Notification Settings"
                description="Control how students and staff receive system notifications."
              />

              <SettingsCard title="Notification Channels">
                <ToggleRow
                  icon={Mail}
                  title="Email Notifications"
                  description="Send important platform notifications by email."
                  enabled={settings.emailNotifications}
                  onChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />

                <ToggleRow
                  icon={Smartphone}
                  title="Push Notifications"
                  description="Send notifications to supported mobile devices."
                  enabled={settings.pushNotifications}
                  onChange={(value) =>
                    updateSetting("pushNotifications", value)
                  }
                />

                <ToggleRow
                  icon={Smartphone}
                  title="SMS Notifications"
                  description="Send selected notifications through SMS."
                  enabled={settings.smsNotifications}
                  onChange={(value) =>
                    updateSetting("smsNotifications", value)
                  }
                />
              </SettingsCard>

              <SettingsCard title="Notification Categories">
                <ToggleRow
                  title="Admission Notifications"
                  description="Notify applicants when their admission status changes."
                  enabled={settings.admissionNotifications}
                  onChange={(value) =>
                    updateSetting("admissionNotifications", value)
                  }
                />

                <ToggleRow
                  title="Payment Notifications"
                  description="Notify students when payments are received or require attention."
                  enabled={settings.paymentNotifications}
                  onChange={(value) =>
                    updateSetting("paymentNotifications", value)
                  }
                />
              </SettingsCard>
            </>
          )}

          {/* ========================================================
              SECURITY
          ======================================================== */}

          {activeSection === "security" && (
            <>
              <SectionHeader
                icon={ShieldCheck}
                title="Security Settings"
                description="Manage authentication, sessions and account security."
              />

              <SettingsCard title="Authentication">
                <ToggleRow
                  icon={Lock}
                  title="Two-Factor Authentication"
                  description="Require administrators to verify their identity with a second authentication factor."
                  enabled={settings.twoFactorAuthentication}
                  onChange={(value) =>
                    updateSetting("twoFactorAuthentication", value)
                  }
                />

                <ToggleRow
                  icon={ShieldCheck}
                  title="Login Alerts"
                  description="Notify administrators when a new login is detected."
                  enabled={settings.loginAlerts}
                  onChange={(value) =>
                    updateSetting("loginAlerts", value)
                  }
                />
              </SettingsCard>

              <SettingsCard title="Session & Password Policy">
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Session Timeout"
                    value={settings.sessionTimeout}
                    options={["15", "30", "60", "120"]}
                    suffix="minutes"
                    onChange={(value) =>
                      updateSetting("sessionTimeout", value)
                    }
                  />

                  <SelectField
                    label="Password Expiry"
                    value={settings.passwordExpiry}
                    options={["30", "60", "90", "180", "Never"]}
                    suffix="days"
                    onChange={(value) =>
                      updateSetting("passwordExpiry", value)
                    }
                  />
                </div>
              </SettingsCard>
            </>
          )}

          {/* ========================================================
              PAYMENTS
          ======================================================== */}

          {activeSection === "payments" && (
            <>
              <SectionHeader
                icon={CreditCard}
                title="Payment Settings"
                description="Configure student payment processing and financial rules."
              />

              <SettingsCard title="Payment Configuration">
                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Payment Gateway"
                    value={settings.paymentGateway}
                    options={[
                      "Paystack",
                      "Flutterwave",
                      "Stripe",
                    ]}
                    onChange={(value) =>
                      updateSetting("paymentGateway", value)
                    }
                  />

                  <SelectField
                    label="Currency"
                    value={settings.paymentCurrency}
                    options={["NGN", "USD", "GBP", "CAD"]}
                    onChange={(value) =>
                      updateSetting("paymentCurrency", value)
                    }
                  />

                  <SelectField
                    label="Maximum Payment Attempts"
                    value={settings.maxPaymentAttempts}
                    options={["1", "2", "3"]}
                    suffix="attempts"
                    onChange={(value) =>
                      updateSetting("maxPaymentAttempts", value)
                    }
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Payment Receipts">
                <ToggleRow
                  icon={ReceiptIcon}
                  title="Automatic Payment Receipts"
                  description="Generate payment receipts automatically after successful transactions."
                  enabled={settings.paymentReceipts}
                  onChange={(value) =>
                    updateSetting("paymentReceipts", value)
                  }
                />
              </SettingsCard>

              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-bold text-amber-800">
                    Payment protection
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-700">
                    Payment limits should also be enforced by the backend.
                    Changing this setting in the dashboard should not be the
                    only protection against duplicate or excessive payments.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* ========================================================
              INTEGRATIONS
          ======================================================== */}

          {activeSection === "integrations" && (
            <>
              <SectionHeader
                icon={Video}
                title="Integrations"
                description="Manage services connected to the academic platform."
              />

              <SettingsCard title="Learning & Communication Services">
                <ToggleRow
                  icon={Video}
                  title="Live Classes"
                  description="Enable lecturers to create and conduct live academic sessions."
                  enabled={settings.liveClasses}
                  onChange={(value) =>
                    updateSetting("liveClasses", value)
                  }
                />

                <SelectField
                  label="Video Provider"
                  value={settings.videoProvider}
                  options={[
                    "Institution Video Server",
                    "Jitsi",
                    "Zoom",
                    "Google Meet",
                  ]}
                  onChange={(value) =>
                    updateSetting("videoProvider", value)
                  }
                />

                <SelectField
                  label="Email Provider"
                  value={settings.emailProvider}
                  options={[
                    "SMTP",
                    "SendGrid",
                    "Amazon SES",
                  ]}
                  onChange={(value) =>
                    updateSetting("emailProvider", value)
                  }
                />

                <ToggleRow
                  icon={Database}
                  title="Automatic Backups"
                  description="Automatically back up important platform data."
                  enabled={settings.backupEnabled}
                  onChange={(value) =>
                    updateSetting("backupEnabled", value)
                  }
                />
              </SettingsCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   REUSABLE COMPONENTS
======================================================================== */

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-[#006dcc]" />

        <h2 className="text-lg font-bold text-[#081022]">
          {title}
        </h2>
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
      <CardContent className="p-5">
        <h3 className="mb-5 text-sm font-bold text-[#081022]">
          {title}
        </h3>

        <div className="space-y-1">{children}</div>
      </CardContent>
    </Card>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <div className="flex gap-2">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc] focus:bg-white"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        {suffix && (
          <div className="flex items-center rounded-lg bg-slate-100 px-3 text-xs font-medium text-slate-500">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon?: any;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 sm:flex">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-[#081022]">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: any;
  label: string;
  value: string;
  status?: "success";
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span
        className={`text-xs font-bold ${
          status === "success"
            ? "text-emerald-600"
            : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

/* Simple icons used by registration/payment rows */

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function NotebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3z" />
      <path d="M8 8h8M8 12h8M8 16h4" />
    </svg>
  );
}