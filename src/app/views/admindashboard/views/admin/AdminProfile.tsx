import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Camera,
  Save,
  KeyRound,
  Activity,
  Clock3,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminProfile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "System",
    lastName: "Administrator",
    email: "admin@institution.edu",
    phone: "+234 801 234 5678",
    role: "Super Administrator",
    department: "Administration",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

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

  const handleProfileSave = () => {
    // Replace with API request later
    console.log("Saving profile:", profile);
  };

  const handlePasswordUpdate = () => {
    if (!passwords.current || !passwords.newPassword) {
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      return;
    }

    // Replace with API request later
    console.log("Updating password");

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });
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
              Admin Profile
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage your administrator profile, account information,
              and security settings.
            </p>
          </div>

        </div>
      </div>

      {/* ============================================================
          PROFILE OVERVIEW
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="bg-[#081022] px-5 py-7 text-white md:px-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              {/* Avatar */}

              <div className="relative">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-2xl font-black ring-4 ring-white/10">
                  SA
                </div>

                <button
                  type="button"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#006dcc] text-white shadow-lg transition hover:bg-[#005ca8]"
                >
                  <Camera className="h-4 w-4" />
                </button>

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  {profile.email}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300 ring-1 ring-emerald-300/20">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-slate-200">
                    <ShieldCheck className="h-3 w-3" />
                    Super Administrator
                  </span>

                </div>

              </div>

            </div>

            <div className="text-left sm:text-right">

              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Last Login
              </p>

              <p className="mt-1 text-sm font-semibold">
                Today, 08:42 AM
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Lagos, Nigeria
              </p>

            </div>

          </div>

        </div>

        {/* ========================================================
            ACCOUNT SUMMARY
        ======================================================== */}

        <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="flex items-center gap-3 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account Role
              </p>

              <p className="mt-1 text-sm font-bold text-[#081022]">
                Super Administrator
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-700">
                Active
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3 p-5">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
              <Clock3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Member Since
              </p>

              <p className="mt-1 text-sm font-bold text-[#081022]">
                January 2026
              </p>
            </div>

          </div>

        </div>

      </Card>

      {/* ============================================================
          MAIN CONTENT
      ============================================================ */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* ==========================================================
            PERSONAL INFORMATION
        ========================================================== */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200 xl:col-span-2">

          <CardContent className="p-5 md:p-6">

            <div className="mb-6">

              <h2 className="text-sm font-bold text-[#081022]">
                Personal Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Update the information associated with your administrator
                account.
              </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* First Name */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  First Name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={profile.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Last Name */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Last Name
                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={profile.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Email */}

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
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Phone */}

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
                    className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* Role */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Role
                </label>

                <input
                  value={profile.role}
                  disabled
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 outline-none"
                />

                <p className="mt-1.5 text-[10px] text-slate-400">
                  Contact another administrator to change your role.
                </p>

              </div>

              {/* Department */}

              <div>

                <label className="mb-2 block text-xs font-semibold text-slate-600">
                  Department
                </label>

                <input
                  value={profile.department}
                  onChange={(e) =>
                    handleProfileChange("department", e.target.value)
                  }
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

              <Button
                onClick={handleProfileSave}
                className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>

            </div>

          </CardContent>

        </Card>

        {/* ==========================================================
            SECURITY SUMMARY
        ========================================================== */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5 md:p-6">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#081022]">
                  Account Security
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep your administrator account secure by regularly
                  updating your password.
                </p>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">

                <div className="flex items-center gap-2">

                  <Lock className="h-4 w-4 text-emerald-600" />

                  <span className="text-xs font-semibold text-slate-700">
                    Password
                  </span>

                </div>

                <span className="text-[10px] font-bold text-emerald-600">
                  Strong
                </span>

              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">

                <div className="flex items-center gap-2">

                  <KeyRound className="h-4 w-4 text-blue-600" />

                  <span className="text-xs font-semibold text-slate-700">
                    Two-Factor Authentication
                  </span>

                </div>

                <span className="text-[10px] font-bold text-amber-600">
                  Not Enabled
                </span>

              </div>

              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">

                <div className="flex items-center gap-2">

                  <Activity className="h-4 w-4 text-purple-600" />

                  <span className="text-xs font-semibold text-slate-700">
                    Active Sessions
                  </span>

                </div>

                <span className="text-[10px] font-bold text-slate-600">
                  2
                </span>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ============================================================
          CHANGE PASSWORD
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-5 md:p-6">

          <div className="mb-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Lock className="h-5 w-5" />
              </div>

              <div>

                <h2 className="text-sm font-bold text-[#081022]">
                  Change Password
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Update your administrator account password.
                </p>

              </div>

            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {/* Current Password */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Current Password
              </label>

              <div className="relative">

                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwords.current}
                  onChange={(e) =>
                    handlePasswordChange("current", e.target.value)
                  }
                  placeholder="Enter current password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>

            {/* New Password */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                New Password
              </label>

              <div className="relative">

                <input
                  type={showNewPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  placeholder="Enter new password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>

            {/* Confirm Password */}

            <div>

              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Confirm New Password
              </label>

              <div className="relative">

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    handlePasswordChange("confirm", e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-10 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>

              </div>

            </div>

          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[11px] text-slate-400">
              Use at least 8 characters with a combination of letters,
              numbers, and symbols.
            </p>

            <Button
              onClick={handlePasswordUpdate}
              className="gap-2 bg-[#081022] hover:bg-[#101a32]"
            >
              <KeyRound className="h-4 w-4" />
              Update Password
            </Button>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          RECENT ACCOUNT ACTIVITY
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-5 md:p-6">

          <div className="mb-5">

            <h2 className="text-sm font-bold text-[#081022]">
              Recent Account Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recent security and account activity associated with this
              administrator account.
            </p>

          </div>

          <div className="space-y-1">

            {[
              {
                title: "Successful login",
                description: "Administrator account signed in.",
                time: "Today, 08:42 AM",
              },
              {
                title: "Profile updated",
                description: "Administrator profile information was updated.",
                time: "Yesterday, 04:18 PM",
              },
              {
                title: "Password changed",
                description: "Account password was successfully changed.",
                time: "12 Aug 2026, 10:21 AM",
              },
            ].map((activity, index) => (

              <div
                key={index}
                className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
              >

                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-xs font-bold text-[#081022]">
                    {activity.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {activity.description}
                  </p>

                </div>

                <span className="whitespace-nowrap text-[10px] text-slate-400">
                  {activity.time}
                </span>

              </div>

            ))}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}