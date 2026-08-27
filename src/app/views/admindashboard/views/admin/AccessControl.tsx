import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ShieldCheck,
  Users,
  UserCheck,
  UserCog,
  Lock,
  Unlock,
  MoreHorizontal,
  Eye,
  KeyRound,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserRole = "Administrator" | "Lecturer" | "Staff" | "Student";
type AccountStatus = "Active" | "Inactive" | "Locked" | "Pending";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department: string;
  status: AccountStatus;
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the access-control endpoint
| is connected.
|
*/

const users: SystemUser[] = [
  {
    id: "USR-001",
    name: "Admin User",
    email: "admin@institution.edu",
    username: "admin",
    role: "Administrator",
    department: "Administration",
    status: "Active",
    lastLogin: "26 Aug 2026, 08:42 AM",
    createdAt: "10 Jan 2024",
    permissions: ["Full System Access", "User Management", "Finance"],
  },
  {
    id: "USR-002",
    name: "Dr. Michael Adeyemi",
    email: "michael.adeyemi@institution.edu",
    username: "michael.adeyemi",
    role: "Lecturer",
    department: "Computing & Technology",
    status: "Active",
    lastLogin: "26 Aug 2026, 07:56 AM",
    createdAt: "14 Sep 2024",
    permissions: ["Courses", "Results", "Assignments", "Forums"],
  },
  {
    id: "USR-003",
    name: "Grace Johnson",
    email: "grace.johnson@institution.edu",
    username: "grace.johnson",
    role: "Staff",
    department: "Registry",
    status: "Active",
    lastLogin: "25 Aug 2026, 04:21 PM",
    createdAt: "02 Feb 2025",
    permissions: ["Student Records", "Admissions"],
  },
  {
    id: "USR-004",
    name: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    username: "daniel.mensah",
    role: "Student",
    department: "Computing & Technology",
    status: "Active",
    lastLogin: "26 Aug 2026, 06:34 AM",
    createdAt: "15 Sep 2024",
    permissions: ["Student Portal"],
  },
  {
    id: "USR-005",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    username: "sarah.williams",
    role: "Student",
    department: "Business Studies",
    status: "Active",
    lastLogin: "25 Aug 2026, 09:18 PM",
    createdAt: "16 Sep 2024",
    permissions: ["Student Portal"],
  },
  {
    id: "USR-006",
    name: "John Okafor",
    email: "john.okafor@institution.edu",
    username: "john.okafor",
    role: "Staff",
    department: "Finance",
    status: "Locked",
    lastLogin: "21 Aug 2026, 11:03 AM",
    createdAt: "12 Mar 2025",
    permissions: ["Finance", "Student Payments"],
  },
  {
    id: "USR-007",
    name: "Esther Adams",
    email: "esther.adams@example.com",
    username: "esther.adams",
    role: "Student",
    department: "Computing & Technology",
    status: "Pending",
    lastLogin: "Never",
    createdAt: "25 Aug 2026",
    permissions: ["Student Portal"],
  },
  {
    id: "USR-008",
    name: "Samuel Brown",
    email: "samuel.brown@institution.edu",
    username: "samuel.brown",
    role: "Lecturer",
    department: "Engineering",
    status: "Inactive",
    lastLogin: "03 Aug 2026, 01:42 PM",
    createdAt: "18 Jan 2024",
    permissions: ["Courses", "Results"],
  },
];

/*
|--------------------------------------------------------------------------
| BADGES
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: AccountStatus }) {
  const styles: Record<AccountStatus, string> = {
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive:
      "bg-slate-100 text-slate-600 border-slate-200",
    Locked:
      "bg-red-50 text-red-700 border-red-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status === "Active" && (
        <CheckCircle2 className="h-3 w-3" />
      )}

      {status === "Locked" && (
        <Lock className="h-3 w-3" />
      )}

      {status === "Pending" && (
        <AlertTriangle className="h-3 w-3" />
      )}

      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    Administrator:
      "bg-purple-50 text-purple-700 border-purple-200",
    Lecturer:
      "bg-blue-50 text-blue-700 border-blue-200",
    Staff:
      "bg-cyan-50 text-cyan-700 border-cyan-200",
    Student:
      "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-md border px-2.5 py-1 text-[11px] font-bold ${styles[role]}`}
    >
      {role}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function AccessControl() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] =
    useState<SystemUser | null>(null);

  const [userStatuses, setUserStatuses] = useState<
    Record<string, AccountStatus>
  >({});

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const totalUsers = users.length;

  const administrators = users.filter(
    (user) => user.role === "Administrator"
  ).length;

  const staffUsers = users.filter(
    (user) =>
      user.role === "Staff" || user.role === "Lecturer"
  ).length;

  const lockedUsers = users.filter(
    (user) => user.status === "Locked"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const currentStatus =
        userStatuses[user.id] || user.status;

      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" ||
        currentStatus === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    search,
    roleFilter,
    statusFilter,
    userStatuses,
  ]);

  /*
  |--------------------------------------------------------------------------
  | ACCOUNT ACTIONS
  |--------------------------------------------------------------------------
  */

  const toggleAccountLock = (user: SystemUser) => {
    const currentStatus =
      userStatuses[user.id] || user.status;

    const nextStatus =
      currentStatus === "Locked"
        ? "Active"
        : "Locked";

    setUserStatuses((previous) => ({
      ...previous,
      [user.id]: nextStatus,
    }));
  };

  const getCurrentStatus = (user: SystemUser) =>
    userStatuses[user.id] || user.status;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              User Access Control
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage platform accounts, roles, permissions and
              access security.
            </p>
          </div>

        </div>

        <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
          <UserCog className="h-4 w-4" />
          Manage Roles & Permissions
        </Button>

      </div>

      {/* ============================================================
          SECURITY NOTICE
      ============================================================ */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

        <div>
          <p className="text-sm font-bold text-blue-900">
            Access Control Centre
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Control who can access the institution's academic,
            administrative and financial systems. Locked accounts
            cannot sign in until an administrator restores access.
          </p>
        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

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
                  Registered platform accounts
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
                  Administrators
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {administrators}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Users with admin privileges
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <ShieldCheck className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Staff & Lecturers
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {staffUsers}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Academic and support users
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
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
                  Locked Accounts
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {lockedUsers}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Require administrator action
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <Lock className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          SEARCH & FILTER
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
                placeholder="Search by name, email, username or department..."
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
                <option value="Administrator">
                  Administrators
                </option>
                <option value="Lecturer">
                  Lecturers
                </option>
                <option value="Staff">Staff</option>
                <option value="Student">Students</option>
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
              <option value="Locked">Locked</option>
              <option value="Inactive">Inactive</option>
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          USER TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Platform Users
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            {(search ||
              roleFilter !== "All" ||
              statusFilter !== "All") && (

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("All");
                  setStatusFilter("All");
                }}
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
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

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  User
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
                  Last Login
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
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <Users className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No users found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => {

                  const currentStatus =
                    getCurrentStatus(user);

                  return (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
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

                      {/* ROLE */}

                      <td className="px-5 py-4">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* DEPARTMENT */}

                      <td className="px-5 py-4">

                        <p className="max-w-[180px] text-xs text-slate-600">
                          {user.department}
                        </p>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <StatusBadge status={currentStatus} />

                      </td>

                      {/* LAST LOGIN */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-medium text-slate-700">
                          {user.lastLogin}
                        </p>

                      </td>

                      {/* ACTIONS */}

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
                            onClick={() =>
                              toggleAccountLock(user)
                            }
                            title={
                              currentStatus === "Locked"
                                ? "Unlock account"
                                : "Lock account"
                            }
                            className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                              currentStatus === "Locked"
                                ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                : "border-red-200 text-red-500 hover:bg-red-50"
                            }`}
                          >
                            {currentStatus === "Locked" ? (
                              <Unlock className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

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

          <div className="flex items-center gap-1">

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#081022] px-2 text-xs font-bold text-white"
            >
              1
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>

        </div>

      </Card>

      {/* ============================================================
          USER DETAILS MODAL
      ============================================================ */}

      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

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

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedUser.username}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* CONTENT */}

            <div className="space-y-5 p-6">

              <div className="flex flex-wrap items-center justify-between gap-3">

                <div className="flex items-center gap-2">
                  <RoleBadge role={selectedUser.role} />
                  <StatusBadge
                    status={getCurrentStatus(selectedUser)}
                  />
                </div>

                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <KeyRound className="h-4 w-4" />
                  Reset Password
                </Button>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Email Address
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#081022]">
                    {selectedUser.email}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Department
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#081022]">
                    {selectedUser.department}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Account Created
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#081022]">
                    {selectedUser.createdAt}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last Login
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#081022]">
                    {selectedUser.lastLogin}
                  </p>

                </div>

              </div>

              {/* PERMISSIONS */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Permissions
                </p>

                <div className="flex flex-wrap gap-2">

                  {selectedUser.permissions.map(
                    (permission) => (
                      <span
                        key={permission}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        {permission}
                      </span>
                    )
                  )}

                </div>

              </div>

              {/* ACCESS ACTIONS */}

              <div className="rounded-xl border border-slate-200 p-4">

                <p className="text-sm font-bold text-[#081022]">
                  Account Access
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Administrators can temporarily restrict this
                  account without deleting the user's records.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <Button
                    variant="outline"
                    onClick={() =>
                      toggleAccountLock(selectedUser)
                    }
                    className="gap-2"
                  >
                    {getCurrentStatus(selectedUser) ===
                    "Locked" ? (
                      <>
                        <Unlock className="h-4 w-4" />
                        Unlock Account
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Lock Account
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="gap-2"
                  >
                    <UserCog className="h-4 w-4" />
                    Edit Role
                  </Button>

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedUser(null)
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