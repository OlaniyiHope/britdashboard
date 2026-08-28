import { useEffect, useMemo, useState } from "react";
import {
  UserPlus,
  Users,
  UserCheck,
  Clock3,
  Building2,
  Search,
  Mail,
  Phone,
  Briefcase,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ======================================================
// API CONFIGURATION
// ======================================================

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:5001";

// ======================================================
// TYPES
// ======================================================

type StaffStatus = "Active" | "Pending" | "Inactive";

type StaffType =
  | "Lecturer"
  | "Academic Staff"
  | "Non-Academic Staff"
  | "Administrator";

interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  staffType: StaffType;
  department: string;
  role: string;
  status: StaffStatus;
  registered: string;
}

interface ApiStaff {
  _id: string;

  staffId?: string;

  username?: string;

  fullname?: string;

  name?: string;

  email?: string;

  phone?: number | string;

  gender?: string;

  birthday?: string;

  address?: string;

  staffRole?: string;

  department?: string;

  subjectTaught?: string;

  employmentType?: string;

  status?: string;

  staffType?: string;

  employmentDate?: string;

  joinedDate?: string;

  createdAt?: string;

  updatedAt?: string;

  role?: string;
}

interface StaffListResponse {
  success: boolean;
  count?: number;
  staff: ApiStaff[];
}

interface RegisterStaffResponse {
  success: boolean;
  message: string;
  staff: ApiStaff;
}

// ======================================================
// DATA
// ======================================================

const departments = [
  "Computing & Technology",
  "Engineering",
  "Business Studies",
  "Sciences",
  "Arts & Humanities",
  "Administration",
  "Registry",
  "Student Affairs",
];

const roles = [
  "Professor",
  "Associate Professor",
  "Senior Lecturer",
  "Lecturer",
  "Assistant Lecturer",
  "Graduate Assistant",
  "Administrative Officer",
  "Registry Officer",
  "Department Administrator",
  "Other",
];

// ======================================================
// HELPERS
// ======================================================

function normalizeStaffType(value?: string): StaffType {
  const type = value?.trim().toLowerCase() || "";

  if (type.includes("lecturer")) {
    return "Lecturer";
  }

  if (
    type.includes("administrator") ||
    type.includes("admin")
  ) {
    return "Administrator";
  }

  if (type.includes("academic")) {
    return "Academic Staff";
  }

  return "Non-Academic Staff";
}

function normalizeStatus(value?: string): StaffStatus {
  const status = value?.trim().toLowerCase();

  if (status === "pending") {
    return "Pending";
  }

  if (status === "inactive") {
    return "Inactive";
  }

  return "Active";
}

function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStaffName(staff: ApiStaff) {
  if (staff.fullname) return staff.fullname;

  if (staff.name) return staff.name;

  if (staff.username) return staff.username;

  return "Unknown Staff";
}

function mapApiStaffToStaffMember(
  staff: ApiStaff
): StaffMember {
  return {
    id: staff._id,

    staffId:
      staff.staffId ||
      staff._id,

    name: getStaffName(staff),

    email:
      staff.email ||
      "No email",

    phone:
      staff.phone
        ? String(staff.phone)
        : "-",

    staffType: normalizeStaffType(
      staff.staffType ||
        staff.staffRole
    ),

    department:
      staff.department ||
      "Not assigned",

    role:
      staff.staffRole ||
      "Staff",

    status: normalizeStatus(
      staff.status
    ),

    registered: formatDate(
      staff.createdAt
    ),
  };
}

// ======================================================
// API REQUEST
// ======================================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    localStorage.getItem("jwtToken") ||
    localStorage.getItem(
      "lanbeth-auth-token"
    );

  const headers = new Headers(
    options.headers || {}
  );

  headers.set(
    "Content-Type",
    "application/json"
  );

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({
  status,
}: {
  status: StaffStatus;
}) {
  const styles: Record<
    StaffStatus,
    string
  > = {
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",

    Inactive:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

// ======================================================
// COMPONENT
// ======================================================

export default function StaffRegistration() {
  // ======================================================
  // STATE
  // ======================================================

  const [staff, setStaff] =
    useState<StaffMember[]>([]);

  const [search, setSearch] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    staffType:
      "Lecturer" as StaffType,

    department: "",
    role: "",

    status:
      "Active" as StaffStatus,

    employmentDate: "",

    employmentType:
      "Full-time",

    gender: "",

    birthday: "",

    address: "",

    subjectTaught: "",

    password: "",
  });

  // ======================================================
  // FETCH STAFF
  // ======================================================

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response =
        await apiRequest<StaffListResponse>(
          "/staff"
        );

      const mappedStaff =
        response.staff.map(
          mapApiStaffToStaffMember
        );

      setStaff(mappedStaff);
    } catch (error) {
      console.error(
        "Failed to fetch staff:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load staff."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD STAFF ON PAGE OPEN
  // ======================================================

  useEffect(() => {
    fetchStaff();
  }, []);

  // ======================================================
  // FORM UPDATE
  // ======================================================

  const updateForm = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ======================================================
  // STATISTICS
  // ======================================================

  const totalStaff = staff.length;

  const activeStaff =
    staff.filter(
      (member) =>
        member.status === "Active"
    ).length;

  const pendingStaff =
    staff.filter(
      (member) =>
        member.status === "Pending"
    ).length;

  const departmentCount = new Set(
    staff
      .filter(
        (member) =>
          member.department !==
          "Not assigned"
      )
      .map(
        (member) =>
          member.department
      )
  ).size;

  // ======================================================
  // SEARCH
  // ======================================================

  const filteredStaff = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return staff;
    }

    return staff.filter(
      (member) =>
        member.name
          .toLowerCase()
          .includes(query) ||
        member.staffId
          .toLowerCase()
          .includes(query) ||
        member.email
          .toLowerCase()
          .includes(query) ||
        member.department
          .toLowerCase()
          .includes(query) ||
        member.role
          .toLowerCase()
          .includes(query)
    );
  }, [staff, search]);

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",

      staffType: "Lecturer",

      department: "",
      role: "",

      status: "Active",

      employmentDate: "",

      employmentType:
        "Full-time",

      gender: "",

      birthday: "",

      address: "",

      subjectTaught: "",

      password: "",
    });
  };

  // ======================================================
  // SUBMIT STAFF
  // ======================================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    // ------------------------------------------------------
    // VALIDATION
    // ------------------------------------------------------

if (
  !form.firstName.trim() ||
  !form.lastName.trim() ||
  !form.email.trim() ||
  !form.phone.trim() ||
  !form.department ||
  !form.role ||
  !form.password
) {
  setErrorMessage(
    "Please complete all required fields, including the staff password."
  );

  return;
}

    try {
      setSubmitting(true);

   const response =
  await apiRequest<RegisterStaffResponse>(
    "/staff/register",
    {
      method: "POST",

      body: JSON.stringify({
        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        phone:
          form.phone.trim(),

        staffType:
          form.staffType,

        department:
          form.department,

        staffRole:
          form.role,

        status:
          form.status,

        employmentDate:
          form.employmentDate ||
          undefined,

        employmentType:
          form.employmentType,

        gender:
          form.gender ||
          undefined,

        birthday:
          form.birthday ||
          undefined,

        address:
          form.address ||
          undefined,

        subjectTaught:
          form.staffType === "Lecturer"
            ? form.subjectTaught ||
              undefined
            : undefined,

        password:
          form.password,
      }),
    }
  );

      setSuccessMessage(
        `${response.message} Staff ID: ${
          response.staff.staffId ||
          response.staff._id
        }`
      );

      resetForm();

      setShowForm(false);

      // Reload the actual MongoDB data
      await fetchStaff();

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error(
        "Failed to register staff:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to register staff."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    if (submitting) return;

    resetForm();

    setShowForm(false);

    setErrorMessage("");
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Staff Registration
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Register and onboard lecturers,
              academic staff, administrators
              and other employees.
            </p>
          </div>

        </div>

        <Button
          onClick={() => {
            setErrorMessage("");
            setShowForm(true);
          }}
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
        >
          <UserPlus className="h-4 w-4" />
          Register New Staff
        </Button>

      </div>

      {/* SUCCESS MESSAGE */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">

          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span>
            {successMessage}
          </span>

        </div>
      )}

      {/* ERROR MESSAGE */}

      {errorMessage && !showForm && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <AlertCircle className="h-5 w-5 shrink-0" />

          <span>
            {errorMessage}
          </span>

        </div>
      )}

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Total Staff
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalStaff}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Registered staff members
                </p>

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

                <p className="text-xs font-medium text-slate-500">
                  Active Staff
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {activeStaff}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Currently active
                </p>

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

                <p className="text-xs font-medium text-slate-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingStaff}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting onboarding
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Departments
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {departmentCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  With registered staff
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Building2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* SEARCH */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, staff ID, email, department or role..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </CardContent>

      </Card>

      {/* STAFF TABLE */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-sm font-bold text-[#081022]">
            Registered Staff
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Staff members registered in the
            administration portal.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Staff
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Staff ID
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Loading staff...

                  </td>

                </tr>

              ) : filteredStaff.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >

                    <Users className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No staff found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try another search or register
                      a new staff member.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredStaff.map((member) => (

                  <tr
                    key={member.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">

                          {member.name
                            .split(" ")
                            .map(
                              (name) =>
                                name[0]
                            )
                            .slice(0, 2)
                            .join("")}

                        </div>

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {member.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {member.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <span className="text-xs font-semibold text-slate-700">
                        {member.staffId}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {member.staffType}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span className="text-xs text-slate-600">
                        {member.department}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <span className="text-xs font-semibold text-slate-700">
                        {member.role}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={
                          member.status
                        }
                      />

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        <div className="border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">

            Showing{" "}

            <strong className="text-slate-700">
              {filteredStaff.length}
            </strong>{" "}

            staff member
            {filteredStaff.length !== 1
              ? "s"
              : ""}

          </p>

        </div>

      </Card>

      {/* REGISTRATION MODAL */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between bg-[#081022] px-6 py-5 text-white">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                  <UserPlus className="h-5 w-5" />

                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    Register New Staff
                  </h2>

                  <p className="text-xs text-slate-300">
                    Create a staff profile and
                    begin onboarding.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="space-y-6 p-6">

                {errorMessage && (

                  <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

                    <AlertCircle className="h-5 w-5 shrink-0" />

                    {errorMessage}

                  </div>

                )}

                {/* PERSONAL INFORMATION */}

                <div>

                  <div className="mb-4">

                    <h3 className="text-sm font-bold text-[#081022]">
                      Personal Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Enter the staff member's
                      basic details.
                    </p>

                  </div>

                  <div className="grid gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        First Name *
                      </label>

                      <input
                        required
                        value={form.firstName}
                        onChange={(event) =>
                          updateForm(
                            "firstName",
                            event.target.value
                          )
                        }
                        placeholder="Enter first name"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Last Name *
                      </label>

                      <input
                        required
                        value={form.lastName}
                        onChange={(event) =>
                          updateForm(
                            "lastName",
                            event.target.value
                          )
                        }
                        placeholder="Enter last name"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                    <div>

                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">

                        <Mail className="h-3.5 w-3.5" />

                        Email Address *

                      </label>

                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          updateForm(
                            "email",
                            event.target.value
                          )
                        }
                        placeholder="staff@example.com"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                    <div>

                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">

                        <Phone className="h-3.5 w-3.5" />

                        Phone Number *

                      </label>

                      <input
                        required
                        value={form.phone}
                        onChange={(event) =>
                          updateForm(
                            "phone",
                            event.target.value
                          )
                        }
                        placeholder="+234..."
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>

                </div>

                {/* EMPLOYMENT INFORMATION */}

                <div className="border-t border-slate-200 pt-6">

                  <div className="mb-4">

                    <h3 className="text-sm font-bold text-[#081022]">
                      Employment Information
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Assign the staff member to
                      the appropriate academic or
                      administrative structure.
                    </p>

                  </div>

                  <div className="grid gap-4 md:grid-cols-2">

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Staff Type *
                      </label>

                      <select
                        value={form.staffType}
                        onChange={(event) =>
                          updateForm(
                            "staffType",
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                      >

                        <option value="Lecturer">
                          Lecturer
                        </option>

                        <option value="Academic Staff">
                          Academic Staff
                        </option>

                        <option value="Non-Academic Staff">
                          Non-Academic Staff
                        </option>

                        <option value="Administrator">
                          Administrator
                        </option>

                      </select>

                    </div>

                    <div>

                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">

                        <Building2 className="h-3.5 w-3.5" />

                        Department *

                      </label>

                      <select
                        required
                        value={form.department}
                        onChange={(event) =>
                          updateForm(
                            "department",
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                      >

                        <option value="">
                          Select department
                        </option>

                        {departments.map(
                          (department) => (

                            <option
                              key={department}
                              value={department}
                            >
                              {department}
                            </option>

                          )
                        )}

                      </select>

                    </div>

                    <div>

                      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">

                        <Briefcase className="h-3.5 w-3.5" />

                        Position / Role *

                      </label>

                      <select
                        required
                        value={form.role}
                        onChange={(event) =>
                          updateForm(
                            "role",
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                      >

                        <option value="">
                          Select role
                        </option>

                        {roles.map((role) => (

                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>

                        ))}

                      </select>

                    </div>

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Employment Date
                      </label>

                      <input
                        type="date"
                        value={
                          form.employmentDate
                        }
                        onChange={(event) =>
                          updateForm(
                            "employmentDate",
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                      />

                    </div>

                    <div>

                      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                        Account Status
                      </label>

                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateForm(
                            "status",
                            event.target.value
                          )
                        }
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
                      >

                        <option value="Active">
                          Active
                        </option>

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Inactive">
                          Inactive
                        </option>

                      </select>

                    </div>
                    <div>

  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
    Password *
  </label>

  <input
    required
    type="password"
    value={form.password}
    onChange={(event) =>
      updateForm(
        "password",
        event.target.value
      )
    }
    placeholder="Enter staff password"
    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
  />

  <p className="mt-1 text-[11px] text-slate-400">
    This password will be used by the staff
    member to log in.
  </p>

</div>

                  </div>

                </div>

                {/* INFORMATION NOTE */}

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">

                      <UserPlus className="h-4 w-4" />

                    </div>

                    <div>

                      <p className="text-xs font-bold text-blue-900">
                        Staff account creation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-blue-700">
                        The staff record will be
                        saved directly to the
                        database and assigned a
                        unique staff ID by the
                        backend.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >

                  <Save className="h-4 w-4" />

                  {submitting
                    ? "Registering..."
                    : "Register Staff"}

                </Button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}