import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  GraduationCap,
  User,
  Save,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function StudentProfile() {
  const { user } = useAuth();

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [activeTab, setActiveTab] = useState<
    "update" | "courses" | "preferences"
  >("update");

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    surname: "",
    firstName: "",
    middleName: "",
    email: "",
    phone: "",
    birthDay: "",
    gender: "",
    studentId: "",
    highSchool: "",
    nationality: "",
  });

  useEffect(() => {
    if (!user) return;

 
  }, [user]);

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const authHeaders = () => {
    const token = localStorage.getItem("jwtToken");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  };

  const getUpdateEndpoint = () => {
    const id = user?._id || user?.id;

    if (!id) return null;

    if (user?.role === "staff") {
      return `${apiUrl}/api/teachers/${id}`;
    }

    if (user?.role === "student") {
      return `${apiUrl}/api/put-students/${id}`;
    }


    return `${apiUrl}/api/admin/${id}`;
  };

  const handleSave = async () => {
    const endpoint = getUpdateEndpoint();

    if (!endpoint) {
      toast.error("Unable to determine user profile");
      return;
    }

    setLoading(true);

    try {
      await axios.put(
        endpoint,
        {
          surname: form.surname,
          firstName: form.firstName,
          middleName: form.middleName,
          username: form.firstName,
          email: form.email,
          phone: form.phone,
          birthday: form.birthDay,
          gender: form.gender,
          studentId: form.studentId,
          highSchool: form.highSchool,
          nationality: form.nationality,
          address: user?.address || "",
        },
        {
          headers: authHeaders(),
        }
      );

      toast.success("Profile updated successfully");

      setEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /*
   * COURSES TAB
   */
  if (activeTab === "courses") {
    return (
      <div className="min-h-screen bg-white px-5 py-6">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#081022] text-[#081022]"
            onClick={() => setActiveTab("update")}
          >
            About Me
          </Button>

          <Button
            className="bg-[#081022] hover:bg-[#081022]/90"
            onClick={() => setEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("update")}
              className="pb-3 text-sm text-slate-500"
            >
              Update Profile
            </button>

            <button
              className="border-b-2 border-[#081022] pb-3 text-sm font-semibold text-[#081022]"
            >
              Courses
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className="pb-3 text-sm text-slate-500"
            >
              Preferences
            </button>
          </div>
        </div>

        <div className="mt-8 max-w-5xl">
          <h2 className="text-xl font-semibold text-slate-800">
            Courses
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your registered courses will appear here.
          </p>

          <div className="mt-6 rounded border border-slate-200 p-6 text-center text-sm text-slate-500">
            No additional course information available.
          </div>
        </div>
      </div>
    );
  }

  /*
   * PREFERENCES TAB
   */
  if (activeTab === "preferences") {
    return (
      <div className="min-h-screen bg-white px-5 py-6">
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="outline"
            className="border-[#081022] text-[#081022]"
            onClick={() => setActiveTab("update")}
          >
            About Me
          </Button>

          <Button
            className="bg-[#081022] hover:bg-[#081022]/90"
            onClick={() => setEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        <div className="border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("update")}
              className="pb-3 text-sm text-slate-500"
            >
              Update Profile
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className="pb-3 text-sm text-slate-500"
            >
              Courses
            </button>

            <button className="border-b-2 border-[#081022] pb-3 text-sm font-semibold text-[#081022]">
              Preferences
            </button>
          </div>
        </div>

        <div className="mt-8 max-w-5xl">
          <h2 className="text-xl font-semibold text-slate-800">
            Preferences
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your profile preferences.
          </p>
        </div>
      </div>
    );
  }

  /*
   * MAIN PROFILE PAGE
   */
  return (
    <div className="min-h-screen bg-white px-5 py-5">
      {/* PROFILE HEADER */}
      <div className="mx-auto max-w-5xl">
        <div className="relative border-b border-slate-200 pb-5">
          {/* Student Name */}
          <div className="text-center">
            <h1 className="text-sm font-semibold uppercase text-slate-700">
              {[
                form.firstName,
                form.middleName,
                form.surname,
              ]
                .filter(Boolean)
                .join(" ") || "Student"}
            </h1>

            {/* Rating */}
            <div className="mt-2 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className="text-lg text-[#777]"
                >
                  ★
                </span>
              ))}
            </div>

            {/* Course Count */}
            <div className="mt-5 flex justify-center">
              <div className="rounded bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                Course(s)
                <span className="ml-2 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] text-white">
                  8
                </span>
              </div>
            </div>
          </div>

          {/* ABOUT / EDIT */}
          <div className="mt-5 flex gap-1">
            <Button
              variant="outline"
              className="h-9 rounded border-[#081022] bg-white px-4 text-sm font-semibold text-[#081022]"
              onClick={() => {
                setActiveTab("update");
                setEditing(false);
              }}
            >
              About Me
            </Button>

            <Button
              className="h-9 rounded bg-[#081022] px-4 text-sm font-semibold hover:bg-[#081022]/90"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-5 border-b border-slate-200">
          <div className="flex gap-7">
            <button
              onClick={() => setActiveTab("update")}
              className={`pb-3 text-sm ${
                activeTab === "update"
                  ? "border-b-2 border-[#081022] font-semibold text-[#081022]"
                  : "text-slate-600"
              }`}
            >
              Update Profile
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className="pb-3 text-sm text-slate-600"
            >
              Courses
            </button>

            <button
              onClick={() => setActiveTab("preferences")}
              className="pb-3 text-sm text-slate-600"
            >
              Preferences
            </button>
          </div>
        </div>

        {/* GENERAL */}
        <div className="mt-7">
          <h2 className="text-lg font-semibold text-slate-800">
            General
          </h2>

          <p className="mt-2 text-xs text-[#b88745]">
            You can update your profile from SIS.
          </p>
        </div>

        {/* CONTACT INFO */}
        <div className="mt-7">
          <h3 className="mb-5 text-sm font-bold text-slate-800">
            Contact Info
          </h3>

          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-3">
            {/* SURNAME */}
            <ProfileField
              label="Surname"
              value={form.surname}
              editing={editing}
              onChange={(value) =>
                handleChange("surname", value)
              }
            />

            {/* FIRST NAME */}
            <ProfileField
              label="FirstName"
              value={form.firstName}
              editing={editing}
              onChange={(value) =>
                handleChange("firstName", value)
              }
            />

            {/* MIDDLE NAME */}
            <ProfileField
              label="Middlename"
              value={form.middleName}
              editing={editing}
              onChange={(value) =>
                handleChange("middleName", value)
              }
            />

            {/* EMAIL */}
            <ProfileField
              label="Email"
              value={form.email}
              editing={editing}
              icon={<Mail className="h-4 w-4" />}
              onChange={(value) =>
                handleChange("email", value)
              }
            />

            {/* PHONE */}
            <ProfileField
              label="Phone"
              value={form.phone}
              editing={editing}
              icon={<Phone className="h-4 w-4" />}
              onChange={(value) =>
                handleChange("phone", value)
              }
            />

            {/* BIRTHDAY */}
            <ProfileField
              label="Birth Day"
              value={form.birthDay}
              editing={editing}
              onChange={(value) =>
                handleChange("birthDay", value)
              }
            />
          </div>
        </div>

        {/* GENDER */}
        <div className="mt-6">
          <label className="text-xs font-medium text-slate-600">
            Gender
          </label>

          <div className="mt-3 flex gap-6 text-sm text-slate-500">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={
                  String(form.gender).toLowerCase() ===
                  "male"
                }
                disabled={!editing}
                onChange={(e) =>
                  handleChange("gender", e.target.value)
                }
              />
              Male
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={
                  String(form.gender).toLowerCase() ===
                  "female"
                }
                disabled={!editing}
                onChange={(e) =>
                  handleChange("gender", e.target.value)
                }
              />
              Female
            </label>
          </div>
        </div>

        {/* STUDENT INFORMATION */}
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          {/* STUDENT ID */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Student ID
            </label>

            <div className="mt-2 flex items-center gap-2 border-b border-slate-200 py-2 text-sm text-slate-700">
              <User className="h-4 w-4 text-slate-500" />

              <Input
                value={form.studentId}
                disabled={!editing}
                onChange={(e) =>
                  handleChange(
                    "studentId",
                    e.target.value
                  )
                }
                className="h-7 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Approved by your institution. Contact your
              institution to make changes.
            </p>
          </div>

          {/* HIGH SCHOOL */}
          <div>
            <label className="text-xs font-medium text-slate-600">
              Current / Last High School Attended
            </label>

            <div className="mt-2 flex items-center gap-2 border-b border-slate-200 py-2">
              <GraduationCap className="h-4 w-4 text-slate-500" />

              <Input
                value={form.highSchool}
                disabled={!editing}
                placeholder="e.g Springfield High School"
                onChange={(e) =>
                  handleChange(
                    "highSchool",
                    e.target.value
                  )
                }
                className="h-7 border-0 p-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
        </div>

        {/* NATIONALITY */}
        <div className="mt-7">
          <label className="text-xs font-medium text-slate-600">
            Nationality / Nationalities
          </label>

          <Input
            value={form.nationality}
            disabled={!editing}
            placeholder="Search and select your nationality/nationalities"
            onChange={(e) =>
              handleChange(
                "nationality",
                e.target.value
              )
            }
            className="mt-2 h-10 rounded border-slate-200 text-sm"
          />
        </div>

        {/* SAVE BUTTON */}
        {editing && (
          <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#081022] px-7 hover:bg-[#081022]/90"
            >
              <Save className="mr-2 h-4 w-4" />

              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * REUSABLE PROFILE FIELD
 */
function ProfileField({
  label,
  value,
  editing,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  icon?: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-600">
        {label}
      </label>

      <div className="mt-2 flex items-center gap-2 border-b border-slate-200">
        {icon && (
          <span className="text-slate-500">
            {icon}
          </span>
        )}

        <Input
          value={value}
          disabled={!editing}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="h-9 border-0 px-0 text-sm text-slate-700 shadow-none focus-visible:ring-0 disabled:cursor-default disabled:opacity-100"
        />
      </div>
    </div>
  );
}