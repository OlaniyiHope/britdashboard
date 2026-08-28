import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  Clock,
  Download,
  Mail,
  Phone,
  X,
  MoreHorizontal,
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type StaffStatus =
  | "Active"
  | "On Leave"
  | "Inactive"
  | "Suspended";

type StaffType =
  | "Lecturer"
  | "Administrator"
  | "Support Staff"
  | "Technician";

type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract";

type TeachingStatus =
  | "Teaching"
  | "Not Teaching";

interface Staff {
  id: string;

  staffNumber: string;

  name: string;

  email: string;

  phone: string;

  gender?: string;

  birthday?: string;

  address?: string;

  department: string;

  designation: string;

  staffType: StaffType;

  employmentType: EmploymentType;

  status: StaffStatus;

  joinedDate: string;

  lastUpdated: string;

  teachingStatus?: TeachingStatus;

  subjectTaught?: string;

  session?: {
    _id: string;
    name?: string;
    isActive?: boolean;
  }[];
}

/*
|--------------------------------------------------------------------------
| API TYPES
|--------------------------------------------------------------------------
|
| This represents the actual MongoDB user/staff object returned
| by your backend.
|--------------------------------------------------------------------------
*/

interface ApiStaff {
  _id: string;

  session?: (
    | string
    | {
        _id: string;
        name?: string;
        isActive?: boolean;
      }
  )[];

  role?: string;

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

  joinedDate?: string;

  createdAt?: string;

  updatedAt?: string;
}

/*
|--------------------------------------------------------------------------
| API RESPONSE TYPE
|--------------------------------------------------------------------------
|
| Supports both:
|
| [
|   {...},
|   {...}
| ]
|
| and:
|
| {
|   staff: [...]
| }
|
| or:
|
| {
|   data: [...]
| }
|--------------------------------------------------------------------------
*/

interface StaffApiResponse {
  staff?: ApiStaff[];

  data?: ApiStaff[];

  users?: ApiStaff[];
}

/*
|--------------------------------------------------------------------------
| API CONFIGURATION
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:5001";

/*
|--------------------------------------------------------------------------
| API REQUEST
|--------------------------------------------------------------------------
*/

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
const token = localStorage.getItem("jwtToken");
  const headers = new Headers(
    options.headers || {}
  );

  headers.set("Content-Type", "application/json");

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

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      message =
        errorData?.message ||
        errorData?.error ||
        message;
    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}

/*
|--------------------------------------------------------------------------
| NORMALIZE STAFF ROLE
|--------------------------------------------------------------------------
*/

function normalizeStaffType(
  role?: string
): StaffType {
  const value =
    role?.trim().toLowerCase() || "";

  if (value.includes("lecturer")) {
    return "Lecturer";
  }

  if (
    value.includes("administrator") ||
    value.includes("admin")
  ) {
    return "Administrator";
  }

  if (
    value.includes("technician") ||
    value.includes("technologist")
  ) {
    return "Technician";
  }

  return "Support Staff";
}

/*
|--------------------------------------------------------------------------
| NORMALIZE STATUS
|--------------------------------------------------------------------------
|
| Your sample MongoDB document does not have a status field.
| Therefore, existing active staff default to Active.
|--------------------------------------------------------------------------
*/

function normalizeStatus(
  status?: string
): StaffStatus {
  const value =
    status?.trim().toLowerCase() || "";

  if (value === "on leave") {
    return "On Leave";
  }

  if (value === "inactive") {
    return "Inactive";
  }

  if (value === "suspended") {
    return "Suspended";
  }

  return "Active";
}

/*
|--------------------------------------------------------------------------
| NORMALIZE EMPLOYMENT TYPE
|--------------------------------------------------------------------------
|
| If backend doesn't return this field, Full-time is used as
| the UI fallback. This does NOT create a staff record.
|--------------------------------------------------------------------------
*/

function normalizeEmploymentType(
  employmentType?: string
): EmploymentType {
  const value =
    employmentType?.trim().toLowerCase() || "";

  if (value === "part-time") {
    return "Part-time";
  }

  if (value === "contract") {
    return "Contract";
  }

  return "Full-time";
}

/*
|--------------------------------------------------------------------------
| FORMAT DATE
|--------------------------------------------------------------------------
*/

function formatDate(
  date?: string
): string {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toISOString().split("T")[0];
}

/*
|--------------------------------------------------------------------------
| MAP DATABASE STAFF TO UI STAFF
|--------------------------------------------------------------------------
*/

function mapStaff(
  staff: ApiStaff
): Staff {
  const staffType = normalizeStaffType(
    staff.staffRole
  );

  const name =
    staff.fullname ||
    staff.name ||
    staff.username ||
    "Unnamed Staff";

  const joinedDate =
    staff.joinedDate ||
    staff.createdAt ||
    "";

  const lastUpdated =
    staff.updatedAt ||
    staff.createdAt ||
    "";

  const session = Array.isArray(
    staff.session
  )
    ? staff.session.map((item) => {
        if (typeof item === "string") {
          return {
            _id: item,
          };
        }

        return {
          _id: item._id,
          name: item.name,
          isActive: item.isActive,
        };
      })
    : undefined;

  return {
    id: staff._id,

    /*
     * Your current database does not contain a staffNumber.
     * Use the MongoDB ID as a stable identifier rather than
     * inventing STF-001, STF-002, etc.
     */
    staffNumber: staff._id,

    name,

    email: staff.email || "—",

    phone:
      staff.phone !== undefined &&
      staff.phone !== null
        ? String(staff.phone)
        : "",

    gender: staff.gender,

    birthday: formatDate(
      staff.birthday
    ),

    address: staff.address,

    department:
      staff.department || "—",

    designation:
      staff.staffRole || "—",

    staffType,

    employmentType:
      normalizeEmploymentType(
        staff.employmentType
      ),

    status:
      normalizeStatus(
        staff.status
      ),

    joinedDate:
      formatDate(joinedDate),

    lastUpdated:
      formatDate(lastUpdated),

    teachingStatus:
      staffType === "Lecturer"
        ? "Teaching"
        : undefined,

    subjectTaught:
      staff.subjectTaught,

    session,
  };
}

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

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

    "On Leave":
      "bg-amber-50 text-amber-700 border-amber-200",

    Inactive:
      "bg-slate-100 text-slate-600 border-slate-200",

    Suspended:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| STAFF TYPE BADGE
|--------------------------------------------------------------------------
*/

function StaffTypeBadge({
  type,
}: {
  type: StaffType;
}) {
  const styles: Record<
    StaffType,
    string
  > = {
    Lecturer:
      "bg-blue-50 text-blue-700 border-blue-200",

    Administrator:
      "bg-purple-50 text-purple-700 border-purple-200",

    "Support Staff":
      "bg-slate-50 text-slate-700 border-slate-200",

    Technician:
      "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles[type]}`}
    >
      {type}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function StaffManagement() {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [staffMembers, setStaffMembers] =
    useState<Staff[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StaffStatus | "All">("All");

  const [typeFilter, setTypeFilter] =
    useState<StaffType | "All">("All");

  const [departmentFilter, setDepartmentFilter] =
    useState<string>("All");

  const [selectedStaff, setSelectedStaff] =
    useState<Staff | null>(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH STAFF
  |--------------------------------------------------------------------------
  */

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);

      /*
       * Existing backend route:
       *
       * GET http://localhost:5001/api/staff
       */
      const response =
        await apiRequest<
          ApiStaff[] | StaffApiResponse
        >("/staff");

      let staffData: ApiStaff[] = [];

      if (Array.isArray(response)) {
        staffData = response;
      } else if (
        Array.isArray(response.staff)
      ) {
        staffData = response.staff;
      } else if (
        Array.isArray(response.data)
      ) {
        staffData = response.data;
      } else if (
        Array.isArray(response.users)
      ) {
        staffData = response.users;
      }

      setStaffMembers(
        staffData.map(mapStaff)
      );
    } catch (err) {
      console.error(
        "Failed to fetch staff:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load staff"
      );

      setStaffMembers([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD STAFF WHEN PAGE OPENS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchStaff();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const staffCount =
    staffMembers.length;

  const activeCount =
    staffMembers.filter(
      (staff) =>
        staff.status === "Active"
    ).length;

  const onLeaveCount =
    staffMembers.filter(
      (staff) =>
        staff.status === "On Leave"
    ).length;

  const inactiveCount =
    staffMembers.filter(
      (staff) =>
        staff.status === "Inactive" ||
        staff.status === "Suspended"
    ).length;

  /*
  |--------------------------------------------------------------------------
  | DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        staffMembers
          .map(
            (staff) =>
              staff.department
          )
          .filter(
            (department) =>
              department &&
              department !== "—"
          )
      )
    ).sort();
  }, [staffMembers]);

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredStaff = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return staffMembers.filter(
      (staff) => {
        const matchesSearch =
          !query ||
          staff.name
            .toLowerCase()
            .includes(query) ||
          staff.staffNumber
            .toLowerCase()
            .includes(query) ||
          staff.email
            .toLowerCase()
            .includes(query) ||
          staff.department
            .toLowerCase()
            .includes(query) ||
          staff.designation
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          staff.status ===
            statusFilter;

        const matchesType =
          typeFilter === "All" ||
          staff.staffType ===
            typeFilter;

        const matchesDepartment =
          departmentFilter ===
            "All" ||
          staff.department ===
            departmentFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesType &&
          matchesDepartment
        );
      }
    );
  }, [
    staffMembers,
    search,
    statusFilter,
    typeFilter,
    departmentFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT CSV
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    if (
      filteredStaff.length === 0
    ) {
      return;
    }

    const headers = [
      "Staff ID",
      "Name",
      "Email",
      "Phone",
      "Department",
      "Designation",
      "Staff Type",
      "Employment Type",
      "Status",
      "Joined Date",
    ];

    const rows =
      filteredStaff.map(
        (staff) => [
          staff.staffNumber,
          staff.name,
          staff.email,
          staff.phone,
          staff.department,
          staff.designation,
          staff.staffType,
          staff.employmentType,
          staff.status,
          staff.joinedDate,
        ]
      );

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "staff-management.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setDepartmentFilter("All");
  };

  const hasFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    typeFilter !== "All" ||
    departmentFilter !== "All";

  /*
  |--------------------------------------------------------------------------
  | INITIALS
  |--------------------------------------------------------------------------
  */

  const getInitials = (
    name: string
  ) => {
    return name
      .trim()
      .split(/\s+/)
      .map(
        (part) => part[0]
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Users className="h-5 w-5" />
          </div>

          <div>

            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Staff Management
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage staff profiles, roles,
              departments and employment status.
            </p>

          </div>

        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={
              loading ||
              filteredStaff.length === 0
            }
            className="gap-2 border-slate-300 bg-white"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button
            onClick={() =>
              navigate(
                "/admin/staff/registration"
              )
            }
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            <UserPlus className="h-4 w-4" />
            Register Staff
          </Button>

        </div>

      </div>

      {/* ============================================================
          ERROR
      ============================================================ */}

      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm font-bold text-red-800">
              Unable to load staff
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>

          </div>

          <Button
            variant="outline"
            onClick={fetchStaff}
            className="border-red-200 bg-white text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>

        </div>
      )}

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Total Staff
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {loading
                    ? "..."
                    : staffCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  All registered staff
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Active */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Active Staff
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {loading
                    ? "..."
                    : activeCount}
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

        {/* On Leave */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  On Leave
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {loading
                    ? "..."
                    : onLeaveCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Temporarily unavailable
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Inactive */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Inactive / Suspended
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {loading
                    ? "..."
                    : inactiveCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Require administrative attention
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <UserX className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ============================================================
          SEARCH + FILTERS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 xl:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by name, staff ID, email, department or designation..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Status */}

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 shrink-0 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | StaffStatus
                      | "All"
                  )
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="On Leave">
                  On Leave
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Suspended">
                  Suspended
                </option>

              </select>

            </div>

            {/* Staff Type */}

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target.value as
                    | StaffType
                    | "All"
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Staff Types
              </option>

              <option value="Lecturer">
                Lecturer
              </option>

              <option value="Administrator">
                Administrator
              </option>

              <option value="Support Staff">
                Support Staff
              </option>

              <option value="Technician">
                Technician
              </option>

            </select>

            {/* Department */}

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Departments
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

        </CardContent>

      </Card>

      {/* ============================================================
          STAFF TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        {/* Table Header */}

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-bold text-[#081022]">
                Staff Directory
              </h2>

              <p className="text-xs text-slate-500">

                {loading
                  ? "Loading staff..."
                  : `${filteredStaff.length} staff member${
                      filteredStaff.length !==
                      1
                        ? "s"
                        : ""
                    } displayed`}

              </p>

            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >

                <X className="h-3 w-3" />

                Clear filters

              </button>
            )}

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Staff
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Staff ID
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Designation
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Teaching
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {/* Loading */}

              {loading ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#006dcc]" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      Loading staff...
                    </p>

                  </td>

                </tr>

              ) : filteredStaff.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <Users className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No staff found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {hasFilters
                        ? "Try changing your search or filters."
                        : "There are currently no staff records in the database."}
                    </p>

                  </td>

                </tr>

              ) : (

                filteredStaff.map(
                  (staff) => (

                    <tr
                      key={staff.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Staff */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">

                            {getInitials(
                              staff.name
                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-[#081022]">
                              {staff.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {staff.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Staff ID */}

                      <td className="px-5 py-4">

                        <span
                          className="block max-w-[180px] truncate text-xs font-semibold text-slate-700"
                          title={
                            staff.staffNumber
                          }
                        >
                          {staff.staffNumber}
                        </span>

                      </td>

                      {/* Department */}

                      <td className="px-5 py-4">

                        <p className="max-w-[180px] text-xs text-slate-600">
                          {staff.department}
                        </p>

                      </td>

                      {/* Designation */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-slate-700">
                          {staff.designation}
                        </p>

                      </td>

                      {/* Type */}

                      <td className="px-5 py-4">

                        <StaffTypeBadge
                          type={
                            staff.staffType
                          }
                        />

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={
                            staff.status
                          }
                        />

                      </td>

                      {/* Teaching */}

                      <td className="px-5 py-4">

                        {staff.staffType ===
                        "Lecturer" ? (

                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                              staff.teachingStatus ===
                              "Teaching"
                                ? "text-emerald-700"
                                : "text-slate-400"
                            }`}
                          >

                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                staff.teachingStatus ===
                                "Teaching"
                                  ? "bg-emerald-500"
                                  : "bg-slate-300"
                              }`}
                            />

                            {staff.teachingStatus ??
                              "Not Teaching"}

                          </span>

                        ) : (

                          <span className="text-xs text-slate-400">
                            —
                          </span>

                        )}

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedStaff(
                                staff
                              )
                            }
                            className="h-8 gap-1.5 border-slate-200 text-xs"
                          >

                            <Eye className="h-3.5 w-3.5" />

                            View

                          </Button>

                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                          >

                            <MoreHorizontal className="h-4 w-4" />

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">

            Showing{" "}

            <strong className="text-slate-700">
              {loading
                ? "..."
                : filteredStaff.length}
            </strong>{" "}

            of{" "}

            <strong className="text-slate-700">
              {loading
                ? "..."
                : staffCount}
            </strong>{" "}

            staff

          </p>

          <div className="text-xs text-slate-400">
            Staff directory
          </div>

        </div>

      </Card>

      {/* ============================================================
          STAFF DETAILS MODAL
      ============================================================ */}

      {selectedStaff && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedStaff(
                null
              );
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">

                  {getInitials(
                    selectedStaff.name
                  )}

                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedStaff.name}
                  </p>

                  <p className="mt-1 max-w-[300px] truncate text-xs text-slate-300">
                    {selectedStaff.staffNumber}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedStaff(
                    null
                  )
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* Modal Content */}

            <div className="space-y-5 p-6">

              {/* Status */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs text-slate-500">
                    Employment Status
                  </p>

                  <div className="mt-2">

                    <StatusBadge
                      status={
                        selectedStaff.status
                      }
                    />

                  </div>

                </div>

                <StaffTypeBadge
                  type={
                    selectedStaff.staffType
                  }
                />

              </div>

              {/* Information */}

              <div className="grid gap-4 sm:grid-cols-2">

                {/* Designation */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Designation
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {
                      selectedStaff.designation
                    }
                  </p>

                </div>

                {/* Department */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <GraduationCap className="h-4 w-4 text-slate-400" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Department
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {
                      selectedStaff.department
                    }
                  </p>

                </div>

                {/* Employment */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Employment Type
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {
                      selectedStaff.employmentType
                    }
                  </p>

                </div>

                {/* Joined */}

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Joined Date
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {
                      selectedStaff.joinedDate
                    }
                  </p>

                </div>

                {/* Gender */}

                {selectedStaff.gender && (
                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Gender
                    </p>

                    <p className="mt-2 text-sm font-bold capitalize text-[#081022]">
                      {
                        selectedStaff.gender
                      }
                    </p>

                  </div>
                )}

                {/* Birthday */}

                {selectedStaff.birthday &&
                  selectedStaff.birthday !==
                    "—" && (
                    <div className="rounded-xl bg-slate-50 p-4">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Birthday
                      </p>

                      <p className="mt-2 text-sm font-bold text-[#081022]">
                        {
                          selectedStaff.birthday
                        }
                      </p>

                    </div>
                  )}

                {/* Subject */}

                {selectedStaff.subjectTaught && (
                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Subject Taught
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {
                        selectedStaff.subjectTaught
                      }
                    </p>

                  </div>
                )}

              </div>

              {/* Teaching */}

              {selectedStaff.staffType ===
                "Lecturer" && (

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex items-center justify-between gap-4">

                    <div>

                      <p className="text-xs font-bold text-blue-900">
                        Teaching Status
                      </p>

                      <p className="mt-1 text-xs text-blue-700">
                        Current academic teaching assignment status.
                      </p>

                    </div>

                    <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-700">
                      {
                        selectedStaff.teachingStatus ??
                        "Not Teaching"
                      }
                    </span>

                  </div>

                </div>

              )}

              {/* Contact */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </p>

                <div className="space-y-3">

                  {/* Email */}

                  <div className="flex items-center gap-3">

                    <Mail className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {
                        selectedStaff.email
                      }
                    </span>

                  </div>

                  {/* Phone */}

                  <div className="flex items-center gap-3">

                    <Phone className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedStaff.phone ||
                        "No phone number"}
                    </span>

                  </div>

                  {/* Address */}

                  {selectedStaff.address && (
                    <div className="flex items-start gap-3">

                      <span className="mt-0.5 h-4 w-4 shrink-0 text-center text-xs text-slate-400">
                        📍
                      </span>

                      <span className="text-sm text-slate-600">
                        {
                          selectedStaff.address
                        }
                      </span>

                    </div>
                  )}

                </div>

              </div>

              {/* Last Updated */}

              <div className="border-t border-slate-200 pt-5">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Last Updated
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {
                    selectedStaff.lastUpdated
                  }
                </p>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedStaff(
                    null
                  )
                }
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}