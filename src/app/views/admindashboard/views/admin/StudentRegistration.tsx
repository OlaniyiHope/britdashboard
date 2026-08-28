import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  GraduationCap,
  Users,
  UserCheck,
  Download,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";

/* ================================================================
   TYPES
================================================================ */

type Level = "ND1" | "ND2";
type StudyMode = "full-time" | "part-time";
type Gender = "male" | "female";

interface BackendStudentUser {
  _id: string;
  role: "student";
  username: string;
  email?: string;
  address?: string;
  phone?: number | string;
  gender?: Gender;
  birthday?: string;
  studentName?: string;
  matricNo?: string;
  programme?: string; // stored as a raw ObjectId string — NOT populated (see note above)
  level?: Level;
  studyMode?: StudyMode;
  session?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// From programmeController.js — field names are a best guess since you
// haven't shared the Programme model. Adjust getProgrammeLabel() below
// if your actual fields differ (e.g. "title" instead of "name").
interface BackendProgramme {
  _id: string;
  name?: string;
  programmeName?: string;
  title?: string;
  code?: string;
}

interface Student {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  matricNo: string;
  programmeId: string;
  programmeName: string;
  level: string;
  studyMode: string;
  gender: string;
  address: string;
  birthday: string;
  profileComplete: boolean;
  createdAt: string;
}

/* ================================================================
   HELPERS
================================================================ */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const formatDate = (date?: string): string => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};

const isProfileComplete = (s: BackendStudentUser): boolean =>
  Boolean(s.matricNo && s.programme && s.level);

const getProgrammeLabel = (p?: BackendProgramme): string => {
  if (!p) return "Not set";
  return p.name || p.programmeName || p.title || p.code || "Unnamed Programme";
};

const getProgrammeCode = (p?: BackendProgramme): string => {
  if (!p) return "GEN";
  return (p.code || p.name || "GEN").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "GEN";
};

/*
|--------------------------------------------------------------------------
| BADGES
|--------------------------------------------------------------------------
*/

function ProfileStatusBadge({ complete }: { complete: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${
        complete
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
      }`}
    >
      {complete ? "Profile Complete" : "Incomplete"}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| REGISTER STUDENT MODAL (admin creating a brand-new student)
|--------------------------------------------------------------------------
*/

interface RegisterFormState {
  username: string;
  password: string;
  studentName: string;
  email: string;
  matricNo: string;
  programmeId: string;
  level: Level | "";
  studyMode: StudyMode | "";
  gender: Gender | "";
  phone: string;
  address: string;
  birthday: string;
  assignCurrentSession: boolean;
}

const emptyForm: RegisterFormState = {
  username: "",
  password: "",
  studentName: "",
  email: "",
  matricNo: "",
  programmeId: "",
  level: "",
  studyMode: "",
  gender: "",
  phone: "",
  address: "",
  birthday: "",
  assignCurrentSession: true,
};

function RegisterStudentModal({
  programmes,
  onClose,
  onSuccess,
  currentSessionId,
  currentSessionName,
}: {
  programmes: BackendProgramme[];
  onClose: () => void;
  onSuccess: () => void;
  currentSessionId?: string;
  currentSessionName?: string;
}) {
  const [form, setForm] = useState<RegisterFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const update = <K extends keyof RegisterFormState>(
    key: K,
    value: RegisterFormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const selectedProgramme = programmes.find(
    (p) => p._id === form.programmeId
  );

  const suggestMatric = () => {
    if (!selectedProgramme) return;

    const code = getProgrammeCode(selectedProgramme);

    const year =
      currentSessionName?.match(/\d{4}/)?.[0] ||
      new Date().getFullYear();

    update("matricNo", `BTP/${code}/${year}/___`);
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!form.username.trim()) {
      setFormError("Username is required.");
      return;
    }

    if (!form.password.trim()) {
      setFormError("Password is required.");
      return;
    }

    if (!form.matricNo.trim()) {
      setFormError("Matric number is required.");
      return;
    }

    if (!form.programmeId) {
      setFormError("Please select a programme.");
      return;
    }

    if (!form.level) {
      setFormError("Please select a level.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("jwtToken");

      const payload: Record<string, unknown> = {
        role: "student",
        username: form.username.trim(),
        password: form.password,

        studentName: form.studentName.trim() || undefined,
        email: form.email.trim() || undefined,

        matricNo: form.matricNo.trim(),

        // Backend student field
        programme: form.programmeId,

        level: form.level,
        studyMode: form.studyMode || undefined,

        gender: form.gender || undefined,

        phone: form.phone
          ? form.phone
          : undefined,

        address: form.address.trim() || undefined,

        birthday: form.birthday || undefined,
      };

      if (form.assignCurrentSession && currentSessionId) {
        payload.session = [currentSessionId];
      }

      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Registration failed (${response.status}).`
        );
      }

      onSuccess();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to register student."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-slate-200 bg-[#081022] p-6 text-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Student Registration
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Register New Student
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">

          {/* ERROR */}
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-medium text-red-700">
                {formError}
              </p>
            </div>
          )}

          {/* LOGIN */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Login Credentials
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              <Field label="Username *">
                <input
                  value={form.username}
                  onChange={(e) =>
                    update("username", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                  placeholder="e.g. dmensah2026"
                />
              </Field>

              <Field label="Password *">
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    update("password", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                  placeholder="Temporary password"
                />
              </Field>

            </div>
          </div>

          {/* PERSONAL */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Personal Information
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              <Field label="Full Name">
                <input
                  value={form.studentName}
                  onChange={(e) =>
                    update("studentName", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    update("email", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                />
              </Field>

              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) =>
                    update("phone", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                />
              </Field>

              <Field label="Gender">
                <select
                  value={form.gender}
                  onChange={(e) =>
                    update(
                      "gender",
                      e.target.value as Gender
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>

              <Field label="Birthday">
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(e) =>
                    update("birthday", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                />
              </Field>

              <Field label="Address">
                <input
                  value={form.address}
                  onChange={(e) =>
                    update("address", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                />
              </Field>

            </div>
          </div>

          {/* ACADEMIC */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Academic Information
            </p>

            <div className="grid gap-3 sm:grid-cols-2">

              <Field label="Programme *">
                <select
                  value={form.programmeId}
                  onChange={(e) =>
                    update("programmeId", e.target.value)
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                >
                  <option value="">
                    Select programme
                  </option>

                  {programmes.map((p) => (
                    <option key={p._id} value={p._id}>
                      {getProgrammeLabel(p)}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Level *">
                <select
                  value={form.level}
                  onChange={(e) =>
                    update(
                      "level",
                      e.target.value as Level
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                >
                  <option value="">Select</option>
                  <option value="ND1">ND1</option>
                  <option value="ND2">ND2</option>
                </select>
              </Field>

              <Field label="Study Mode">
                <select
                  value={form.studyMode}
                  onChange={(e) =>
                    update(
                      "studyMode",
                      e.target.value as StudyMode
                    )
                  }
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                >
                  <option value="">Select</option>
                  <option value="full-time">
                    Full-time
                  </option>
                  <option value="part-time">
                    Part-time
                  </option>
                </select>
              </Field>

              <Field label="Matric Number *">
                <div className="flex gap-2">

                  <input
                    value={form.matricNo}
                    onChange={(e) =>
                      update("matricNo", e.target.value)
                    }
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]"
                    placeholder="e.g. BTP/CSC/2026/001"
                  />

                  <button
                    type="button"
                    onClick={suggestMatric}
                    disabled={!selectedProgramme}
                    className="shrink-0 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Suggest
                  </button>

                </div>
              </Field>

            </div>

            {currentSessionId && (
              <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={form.assignCurrentSession}
                  onChange={(e) =>
                    update(
                      "assignCurrentSession",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />

                Assign to current session (
                {currentSessionName || "active session"})
              </label>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            {submitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {submitting
              ? "Registering..."
              : "Register Student"}
          </Button>

        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| COMPLETE REGISTRATION MODAL
| For students who already self-registered (have username, email,
| studentName, programme — but NO matricNo/level/studyMode yet, exactly
| like the "hopeolaniyan" record you pasted). Admin assigns the missing
| academic fields here.
|
| ⚠️ BACKEND REQUIREMENT: your routes only expose POST /register and
| POST /login — there is no update-user endpoint yet. This calls
| PATCH ${API_BASE_URL}/users/:id as a placeholder. You need to add
| something like:
|
|   router.patch("/users/:id", authenticateUser, updateUser);
|
| with an updateUser controller that does User.findByIdAndUpdate(id, req.body).
| Adjust the URL/method below once that route exists.
|--------------------------------------------------------------------------
*/

function CompleteRegistrationModal({
  student,
  programmes,
  onClose,
  onSuccess,
}: {
  student: Student;
  programmes: BackendProgramme[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [matricNo, setMatricNo] = useState(student.matricNo === "Not assigned" ? "" : student.matricNo);
  const [programmeId, setProgrammeId] = useState(student.programmeId);
  const [level, setLevel] = useState<Level | "">((student.level as Level) || "");
  const [studyMode, setStudyMode] = useState<StudyMode | "">((student.studyMode as StudyMode) || "");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const selectedProgramme = programmes.find((p) => p._id === programmeId);

  const suggestMatric = () => {
    if (!selectedProgramme) return;
    const code = getProgrammeCode(selectedProgramme);
    const year = new Date().getFullYear();
    setMatricNo(`BTP/${code}/${year}/___`);
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!matricNo.trim() || !programmeId || !level) {
      setFormError("Matric number, programme and level are all required to complete registration.");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("jwtToken");

      const response = await fetch(`${API_BASE_URL}/api/put-students/${student.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          matricNo: matricNo.trim(),
          programme: programmeId,
          level,
          studyMode: studyMode || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error ||
          `Unable to update student — endpoint PATCH /users/:id may not exist yet on your backend (${response.status}).`
        );
      }

      onSuccess();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Unable to complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 bg-[#081022] p-6 text-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">Complete Registration</p>
            <h2 className="mt-1 text-xl font-bold">{student.name}</h2>
            <p className="mt-1 text-xs text-slate-300">@{student.username}</p>
          </div>
          <button type="button" onClick={onClose} disabled={submitting} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-medium text-red-700">{formError}</p>
            </div>
          )}

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs leading-5 text-blue-700">
              This student self-registered and is missing academic details. Assign the fields below to
              activate their full profile.
            </p>
          </div>

          <Field label="Programme">
            <select value={programmeId} onChange={(e) => setProgrammeId(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
              <option value="">Select programme</option>
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>{getProgrammeLabel(p)}</option>
              ))}
            </select>
          </Field>

          <Field label="Level">
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
              <option value="">Select</option>
              <option value="ND1">ND1</option>
              <option value="ND2">ND2</option>
            </select>
          </Field>

          <Field label="Study Mode">
            <select value={studyMode} onChange={(e) => setStudyMode(e.target.value as StudyMode)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
              <option value="">Select</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
            </select>
          </Field>

          <Field label="Matric Number">
            <div className="flex gap-2">
              <input value={matricNo} onChange={(e) => setMatricNo(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc]" placeholder="e.g. BTP/CSC/2026/001" />
              <button type="button" onClick={suggestMatric} disabled={!selectedProgramme}
                className="shrink-0 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                Suggest
              </button>
            </div>
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting} className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving..." : "Save & Complete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function StudentRegistration() {
  const { currentSession } = useContext(SessionContext);
  const sessionId = currentSession?._id;

  const {
    data: rawStudents,
    loading,
    error,
    reFetch,
  } = useFetch(sessionId ? `/users/student/${sessionId}` : null);

  // NEW: fetch real programmes so IDs can be resolved to names.
  const { data: rawProgrammes, loading: programmesLoading } = useFetch("/programmes");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [studyModeFilter, setStudyModeFilter] = useState("All");
  const [completionFilter, setCompletionFilter] = useState("All");
  const [programmeFilter, setProgrammeFilter] = useState("All");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [completingStudent, setCompletingStudent] = useState<Student | null>(null);

  /* ==============================================================
     NORMALIZE PROGRAMMES
  ============================================================== */

  const programmes = useMemo<BackendProgramme[]>(() => {
    if (Array.isArray(rawProgrammes)) return rawProgrammes as BackendProgramme[];
    if (
      rawProgrammes &&
      typeof rawProgrammes === "object" &&
      Array.isArray((rawProgrammes as { programmes?: BackendProgramme[] }).programmes)
    ) {
      return (rawProgrammes as { programmes: BackendProgramme[] }).programmes;
    }
    if (
      rawProgrammes &&
      typeof rawProgrammes === "object" &&
      Array.isArray((rawProgrammes as { data?: BackendProgramme[] }).data)
    ) {
      return (rawProgrammes as { data: BackendProgramme[] }).data;
    }
    return [];
  }, [rawProgrammes]);

  const programmeMap = useMemo(() => {
    const map = new Map<string, BackendProgramme>();
    programmes.forEach((p) => map.set(p._id, p));
    return map;
  }, [programmes]);

  /* ==============================================================
     NORMALIZE STUDENTS — resolves programme id -> name via programmeMap
  ============================================================== */

  const students = useMemo<Student[]>(() => {
    let list: BackendStudentUser[] = [];

    if (Array.isArray(rawStudents)) {
      list = rawStudents as BackendStudentUser[];
    } else if (
      rawStudents &&
      typeof rawStudents === "object" &&
      Array.isArray((rawStudents as { students?: BackendStudentUser[] }).students)
    ) {
      list = (rawStudents as { students: BackendStudentUser[] }).students;
    } else if (
      rawStudents &&
      typeof rawStudents === "object" &&
      Array.isArray((rawStudents as { data?: BackendStudentUser[] }).data)
    ) {
      list = (rawStudents as { data: BackendStudentUser[] }).data;
    }

    return list.map((s): Student => {
      const programmeId = s.programme || "";
      const programme = programmeMap.get(programmeId);

      return {
        id: s._id,
        username: s.username,
        name: s.studentName || s.username,
        email: s.email || "No email",
        phone: s.phone !== undefined && s.phone !== null ? String(s.phone) : "No phone",
        matricNo: s.matricNo || "Not assigned",
        programmeId,
        programmeName: programme ? getProgrammeLabel(programme) : programmeId ? "Unknown programme" : "Not set",
        level: s.level || "Not set",
        studyMode: s.studyMode || "Not set",
        gender: s.gender || "Not set",
        address: s.address || "Not provided",
        birthday: formatDate(s.birthday),
        profileComplete: isProfileComplete(s),
        createdAt: formatDate(s.createdAt),
      };
    });
  }, [rawStudents, programmeMap]);

  /* ==============================================================
     COUNTS
  ============================================================== */

  const totalStudents = students.length;
  const completedCount = students.filter((s) => s.profileComplete).length;
  const incompleteCount = students.filter((s) => !s.profileComplete).length;

  /* ==============================================================
     FILTER OPTIONS + FILTERING
  ============================================================== */

  const levels = useMemo(
    () => Array.from(new Set(students.map((s) => s.level).filter((l) => l !== "Not set"))),
    [students]
  );

  const studyModes = useMemo(
    () => Array.from(new Set(students.map((s) => s.studyMode).filter((m) => m !== "Not set"))),
    [students]
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.matricNo.toLowerCase().includes(query) ||
        student.username.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.programmeName.toLowerCase().includes(query);

      const matchesLevel = levelFilter === "All" || student.level === levelFilter;
      const matchesStudyMode = studyModeFilter === "All" || student.studyMode === studyModeFilter;
      const matchesProgramme = programmeFilter === "All" || student.programmeId === programmeFilter;
      const matchesCompletion =
        completionFilter === "All" ||
        (completionFilter === "Complete" && student.profileComplete) ||
        (completionFilter === "Incomplete" && !student.profileComplete);

      return matchesSearch && matchesLevel && matchesStudyMode && matchesProgramme && matchesCompletion;
    });
  }, [students, search, levelFilter, studyModeFilter, programmeFilter, completionFilter]);

  /* ==============================================================
     EXPORT
  ============================================================== */

  const handleExport = () => {
    const headers = ["Username", "Matric Number", "Name", "Email", "Phone", "Programme", "Level", "Study Mode"];
    const rows = filteredStudents.map((s) => [
      s.username, s.matricNo, s.name, s.email, s.phone, s.programmeName, s.level, s.studyMode,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-registration.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setLevelFilter("All");
    setStudyModeFilter("All");
    setProgrammeFilter("All");
    setCompletionFilter("All");
  };

  /* ==============================================================
     LOADING / NO SESSION
  ============================================================== */

  if (!sessionId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-500">No active session selected</p>
        </div>
      </div>
    );
  }

  if (loading || programmesLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading students and programmes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">Student Registration</h1>
            <p className="mt-1 text-xs text-slate-500">
              Register students and manage their academic profile — {currentSession?.name || "current session"}.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleExport} className="gap-2 border-slate-300 bg-white">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowRegisterModal(true)} className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
            <UserPlus className="h-4 w-4" />
            Register Student
          </Button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Unable to load students</p>
          </div>
          <button type="button" onClick={() => reFetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50">
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* INFO BANNER */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900">Student registration workflow</p>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-700">
              Students may self-register with just a username, email and programme. A profile is considered
              complete once an administrator has assigned matric number, level and study mode via "Complete".
            </p>
          </div>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Students</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{totalStudents}</p>
                <p className="mt-1 text-[11px] text-slate-400">This session</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Profile Complete</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{completedCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">Matric no., programme &amp; level set</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UserCheck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Incomplete Profiles</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{incompleteCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">Need matric no. / level assigned</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <AlertCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH + FILTERS */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, matric number, username or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select value={completionFilter} onChange={(e) => setCompletionFilter(e.target.value)}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                  <option value="All">All Profiles</option>
                  <option value="Complete">Complete</option>
                  <option value="Incomplete">Incomplete</option>
                </select>
              </div>

              <select value={programmeFilter} onChange={(e) => setProgrammeFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                <option value="All">All Programmes</option>
                {programmes.map((p) => (
                  <option key={p._id} value={p._id}>{getProgrammeLabel(p)}</option>
                ))}
              </select>

              <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                <option value="All">All Levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <select value={studyModeFilter} onChange={(e) => setStudyModeFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                <option value="All">All Study Modes</option>
                {studyModes.map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#081022]">Student Registration Records</h2>
              <p className="text-xs text-slate-500">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} displayed
              </p>
            </div>
            {(search || levelFilter !== "All" || studyModeFilter !== "All" || programmeFilter !== "All" || completionFilter !== "All") && (
              <button type="button" onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline">
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Student</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Matric Number</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Programme</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Level</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Study Mode</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Profile</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-500">No registration records found</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {students.length === 0
                        ? "No students have been registered for this session yet."
                        : "Try changing your search or filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#081022]">{student.name}</p>
                          <p className="truncate text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-slate-700">{student.matricNo}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-slate-700">{student.programmeName}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {student.level}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-600">{student.studyMode}</span>
                    </td>
                    <td className="px-5 py-4">
                      <ProfileStatusBadge complete={student.profileComplete} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {!student.profileComplete && (
                          <Button
                            size="sm"
                            onClick={() => setCompletingStudent(student)}
                            className="h-8 gap-1.5 bg-[#006dcc] text-xs hover:bg-[#005ca8]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Complete
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)} className="h-8 gap-1.5 border-slate-200 text-xs">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-700">{filteredStudents.length}</strong> of{" "}
            <strong className="text-slate-700">{totalStudents}</strong> students
          </p>
          <div className="flex items-center gap-1">
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#081022] px-2 text-xs font-bold text-white">1</button>
            <button type="button" disabled className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* VIEW MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedStudent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedStudent.name}</p>
                  <p className="mt-1 text-xs text-slate-300">@{selectedStudent.username}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedStudent(null)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Profile Status</p>
                  <div className="mt-2">
                    <ProfileStatusBadge complete={selectedStudent.profileComplete} />
                  </div>
                </div>
                {!selectedStudent.profileComplete && (
                  <Button
                    onClick={() => {
                      setCompletingStudent(selectedStudent);
                      setSelectedStudent(null);
                    }}
                    className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                  >
                    <Pencil className="h-4 w-4" />
                    Complete Registration
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Matric Number</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.matricNo}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Programme</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.programmeName}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Level</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.level}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Study Mode</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.studyMode}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Contact &amp; Bio</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><p className="text-[10px] text-slate-400">Email</p><p className="mt-1 text-sm text-slate-600">{selectedStudent.email}</p></div>
                  <div><p className="text-[10px] text-slate-400">Phone</p><p className="mt-1 text-sm text-slate-600">{selectedStudent.phone}</p></div>
                  <div><p className="text-[10px] text-slate-400">Gender</p><p className="mt-1 text-sm text-slate-600">{selectedStudent.gender}</p></div>
                  <div><p className="text-[10px] text-slate-400">Birthday</p><p className="mt-1 text-sm text-slate-600">{selectedStudent.birthday}</p></div>
                  <div className="sm:col-span-2"><p className="text-[10px] text-slate-400">Address</p><p className="mt-1 text-sm text-slate-600">{selectedStudent.address}</p></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {showRegisterModal && (
        <RegisterStudentModal
          programmes={programmes}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            reFetch();
          }}
          currentSessionId={currentSession?._id}
          currentSessionName={currentSession?.name}
        />
      )}

      {/* COMPLETE REGISTRATION MODAL */}
      {completingStudent && (
        <CompleteRegistrationModal
          student={completingStudent}
          programmes={programmes}
          onClose={() => setCompletingStudent(null)}
          onSuccess={() => {
            setCompletingStudent(null);
            reFetch();
          }}
        />
      )}
    </div>
  );
}