import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Users,
  GraduationCap,
  BriefcaseBusiness,
  UserRound,
  ShieldCheck,
  MoreHorizontal,
  Download,
  Mail,
  Phone,
  CalendarDays,
  Lock,
  Unlock,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserRole = "Student" | "Staff" | "Parent" | "Admin";

type AccountStatus =
  | "Active"
  | "Inactive"
  | "Suspended"
  | "Locked"
  | "Pending";

interface UserRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: AccountStatus;
  createdAt: string;
  lastActive: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the user records endpoint
| is connected.
|
*/

const userRecords: UserRecord[] = [
  {
    id: "1",
    userId: "USR-0001",
    name: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    phone: "+234 801 234 5678",
    role: "Student",
    department: "Computing & Technology",
    status: "Active",
    createdAt: "12 Sep 2024",
    lastActive: "26 Aug 2026, 08:42 AM",
  },
  {
    id: "2",
    userId: "USR-0002",
    name: "Dr. Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+234 803 456 7890",
    role: "Staff",
    department: "Engineering",
    status: "Active",
    createdAt: "05 Jan 2023",
    lastActive: "26 Aug 2026, 07:58 AM",
  },
  {
    id: "3",
    userId: "USR-0003",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+234 802 345 6789",
    role: "Student",
    department: "Business Studies",
    status: "Active",
    createdAt: "18 Sep 2024",
    lastActive: "25 Aug 2026, 09:12 PM",
  },
  {
    id: "4",
    userId: "USR-0004",
    name: "Grace Mensima",
    email: "grace.mensima@example.com",
    phone: "+234 804 567 8901",
    role: "Parent",
    department: "Parent Account",
    status: "Active",
    createdAt: "21 Sep 2024",
    lastActive: "25 Aug 2026, 06:34 PM",
  },
  {
    id: "5",
    userId: "USR-0005",
    name: "Admin User",
    email: "admin@institution.edu",
    phone: "+234 805 123 4567",
    role: "Admin",
    department: "Administration",
    status: "Active",
    createdAt: "02 Jan 2023",
    lastActive: "26 Aug 2026, 08:55 AM",
  },
  {
    id: "6",
    userId: "USR-0006",
    name: "Samuel Okoro",
    email: "samuel.okoro@example.com",
    phone: "+234 805 678 9012",
    role: "Student",
    department: "Engineering",
    status: "Suspended",
    createdAt: "14 Oct 2023",
    lastActive: "20 Aug 2026, 11:18 AM",
  },
  {
    id: "7",
    userId: "USR-0007",
    name: "Esther Adams",
    email: "esther.adams@example.com",
    phone: "+234 806 789 0123",
    role: "Student",
    department: "Computing & Technology",
    status: "Locked",
    createdAt: "09 Oct 2024",
    lastActive: "19 Aug 2026, 04:25 PM",
  },
  {
    id: "8",
    userId: "USR-0008",
    name: "John Adeyemi",
    email: "john.adeyemi@example.com",
    phone: "+234 807 456 7890",
    role: "Staff",
    department: "Business Studies",
    status: "Pending",
    createdAt: "25 Aug 2026",
    lastActive: "Never",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({
  status,
}: {
  status: AccountStatus;
}) {
  const styles: Record<AccountStatus, string> = {
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive:
      "bg-slate-100 text-slate-600 border-slate-200",
    Suspended:
      "bg-red-50 text-red-700 border-red-200",
    Locked:
      "bg-orange-50 text-orange-700 border-orange-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
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
| ROLE BADGE
|--------------------------------------------------------------------------
*/

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    Student:
      "bg-blue-50 text-blue-700 border-blue-200",
    Staff:
      "bg-purple-50 text-purple-700 border-purple-200",
    Parent:
      "bg-cyan-50 text-cyan-700 border-cyan-200",
    Admin:
      "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold ${styles[role]}`}
    >
      {role}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| ROLE ICON
|--------------------------------------------------------------------------
*/

function RoleIcon({ role }: { role: UserRole }) {
  if (role === "Student") {
    return <GraduationCap className="h-4 w-4" />;
  }

  if (role === "Staff") {
    return <BriefcaseBusiness className="h-4 w-4" />;
  }

  if (role === "Parent") {
    return <UserRound className="h-4 w-4" />;
  }

  return <ShieldCheck className="h-4 w-4" />;
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function UserRecords() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] =
    useState<UserRecord | null>(null);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalUsers = userRecords.length;

  const studentCount = userRecords.filter(
    (user) => user.role === "Student"
  ).length;

  const staffCount = userRecords.filter(
    (user) => user.role === "Staff"
  ).length;

  const parentCount = userRecords.filter(
    (user) => user.role === "Parent"
  ).length;

  const adminCount = userRecords.filter(
    (user) => user.role === "Admin"
  ).length;

  const activeCount = userRecords.filter(
    (user) => user.status === "Active"
  ).length;

  const lockedCount = userRecords.filter(
    (user) => user.status === "Locked"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return userRecords.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.userId.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [search, roleFilter, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "User ID",
      "Name",
      "Email",
      "Phone",
      "Role",
      "Department",
      "Status",
      "Created At",
      "Last Active",
    ];

    const rows = filteredUsers.map((user) => [
      user.userId,
      user.name,
      user.email,
      user.phone,
      user.role,
      user.department,
      user.status,
      user.createdAt,
      user.lastActive,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "user-records.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All");
    setStatusFilter("All");
  };

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
              User Records Management
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              View and manage student, staff, parent, and administrator
              account records.
            </p>
          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="w-full gap-2 border-slate-300 bg-white sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Export Records
        </Button>

      </div>

      {/* ============================================================
          OVERVIEW CARDS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Users */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Users
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalUsers}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  All platform accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Students */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {studentCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Student accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <GraduationCap className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Staff */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Staff
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {staffCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Staff accounts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <BriefcaseBusiness className="h-5 w-5" />
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
                  Active Accounts
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {activeCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Currently active
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          ROLE SUMMARY
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                Students
              </p>

              <p className="mt-1 text-xl font-black text-blue-900">
                {studentCount}
              </p>
            </div>

            <div className="rounded-xl bg-purple-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Staff
              </p>

              <p className="mt-1 text-xl font-black text-purple-900">
                {staffCount}
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600">
                Parents
              </p>

              <p className="mt-1 text-xl font-black text-cyan-900">
                {parentCount}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Administrators
              </p>

              <p className="mt-1 text-xl font-black text-slate-900">
                {adminCount}
              </p>
            </div>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          SEARCH + FILTER
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email, phone, user ID or department..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">All Roles</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Parent">Parent</option>
                <option value="Admin">Admin</option>
              </select>

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
              <option value="Locked">Locked</option>
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          USER TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Platform User Records
              </h2>

              <p className="text-xs text-slate-500">
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            {(search ||
              roleFilter !== "All" ||
              statusFilter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  User ID
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Role
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Last Active
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredUsers.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <Users className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No user records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* User */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {user.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#081022]">
                            {user.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* User ID */}

                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-slate-700">
                        {user.userId}
                      </span>
                    </td>

                    {/* Role */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          <RoleIcon role={user.role} />
                        </div>

                        <RoleBadge role={user.role} />

                      </div>

                    </td>

                    {/* Department */}

                    <td className="px-5 py-4">

                      <p className="max-w-[190px] text-xs text-slate-600">
                        {user.department}
                      </p>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    {/* Last Active */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-medium text-slate-600">
                        {user.lastActive}
                      </p>

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedUser(user)
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

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* ============================================================
            FOOTER
        ============================================================ */}

        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredUsers.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalUsers}
            </strong>{" "}
            users
          </p>

          <div className="flex items-center gap-4 text-xs">

            <span className="text-slate-500">
              Locked:{" "}
              <strong className="text-orange-600">
                {lockedCount}
              </strong>
            </span>

            <span className="text-slate-500">
              Active:{" "}
              <strong className="text-emerald-600">
                {activeCount}
              </strong>
            </span>

          </div>

        </div>

      </Card>

      {/* ============================================================
          USER DETAILS MODAL
      ============================================================ */}

      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedUser.name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedUser.name}
                  </p>

                  <div className="mt-1 flex items-center gap-2">

                    <span className="text-xs text-slate-300">
                      {selectedUser.userId}
                    </span>

                    <span className="text-slate-500">
                      •
                    </span>

                    <span className="text-xs text-slate-300">
                      {selectedUser.role}
                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Account Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedUser.status}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedUser(null);

                    navigate(
                      `/admin/users/${selectedUser.id}`
                    );
                  }}
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  <Eye className="h-4 w-4" />
                  Open Full Record
                </Button>

              </div>

              {/* Basic Information */}

              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account Information
                </p>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Role
                    </p>

                    <div className="mt-2">
                      <RoleBadge role={selectedUser.role} />
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedUser.department}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Account Created
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#081022]">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {selectedUser.createdAt}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Last Active
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedUser.lastActive}
                    </p>
                  </div>

                </div>

              </div>

              {/* Contact */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </p>

                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <Mail className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedUser.email}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Phone className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedUser.phone}
                    </span>

                  </div>

                </div>

              </div>

              {/* Account Actions */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Account Actions
                </p>

                <div className="flex flex-col gap-2 sm:flex-row">

                  {selectedUser.status === "Locked" ? (

                    <Button
                      variant="outline"
                      className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Unlock className="h-4 w-4" />
                      Unlock Account
                    </Button>

                  ) : (

                    <Button
                      variant="outline"
                      className="gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Lock className="h-4 w-4" />
                      Lock Account
                    </Button>

                  )}

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
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