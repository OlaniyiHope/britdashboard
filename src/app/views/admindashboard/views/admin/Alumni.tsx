import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Users,
  UserCheck,
  UserPlus,
  CalendarDays,
  GraduationCap,
  Mail,
  Phone,
  BriefcaseBusiness,
  MapPin,
  Download,
  X,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AlumniStatus =
  | "Active"
  | "New"
  | "Inactive"
  | "Unreachable";

interface AlumniRecord {
  id: string;
  matricNumber: string;
  name: string;
  email: string;
  phone: string;
  programme: string;
  department: string;
  graduationYear: string;
  graduationSession: string;
  status: AlumniStatus;
  occupation: string;
  employer: string;
  location: string;
  lastEngagement: string;
  eventsAttended: number;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
*/

const alumni: AlumniRecord[] = [
  {
    id: "1",
    matricNumber: "BTP/CSC/2019/014",
    name: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    phone: "+234 801 234 5678",
    programme: "Computer Science",
    department: "Computing & Technology",
    graduationYear: "2023",
    graduationSession: "2022/2023",
    status: "Active",
    occupation: "Software Engineer",
    employer: "Tech Solutions Ltd",
    location: "Lagos, Nigeria",
    lastEngagement: "20 Aug 2026",
    eventsAttended: 6,
  },

  {
    id: "2",
    matricNumber: "BTP/BUS/2020/031",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+234 802 345 6789",
    programme: "Business Administration",
    department: "Business Studies",
    graduationYear: "2024",
    graduationSession: "2023/2024",
    status: "New",
    occupation: "Business Consultant",
    employer: "Williams Consulting",
    location: "Abuja, Nigeria",
    lastEngagement: "18 Aug 2026",
    eventsAttended: 2,
  },

  {
    id: "3",
    matricNumber: "BTP/ENG/2018/008",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+234 803 456 7890",
    programme: "Mechanical Engineering",
    department: "Engineering",
    graduationYear: "2022",
    graduationSession: "2021/2022",
    status: "Active",
    occupation: "Mechanical Engineer",
    employer: "Industrial Engineering Ltd",
    location: "Port Harcourt, Nigeria",
    lastEngagement: "15 Aug 2026",
    eventsAttended: 9,
  },

  {
    id: "4",
    matricNumber: "BTP/ACC/2017/042",
    name: "Grace Mensima",
    email: "grace.mensima@example.com",
    phone: "+234 804 567 8901",
    programme: "Accounting",
    department: "Business Studies",
    graduationYear: "2021",
    graduationSession: "2020/2021",
    status: "Active",
    occupation: "Chartered Accountant",
    employer: "Mensima & Co.",
    location: "Accra, Ghana",
    lastEngagement: "12 Aug 2026",
    eventsAttended: 11,
  },

  {
    id: "5",
    matricNumber: "BTP/CVE/2016/019",
    name: "Samuel Okoro",
    email: "samuel.okoro@example.com",
    phone: "+234 805 678 9012",
    programme: "Civil Engineering",
    department: "Engineering",
    graduationYear: "2020",
    graduationSession: "2019/2020",
    status: "Inactive",
    occupation: "Project Manager",
    employer: "Construction Group",
    location: "Ibadan, Nigeria",
    lastEngagement: "03 Mar 2025",
    eventsAttended: 3,
  },

  {
    id: "6",
    matricNumber: "BTP/INF/2021/045",
    name: "Esther Adams",
    email: "esther.adams@example.com",
    phone: "+234 806 789 0123",
    programme: "Information Technology",
    department: "Computing & Technology",
    graduationYear: "2025",
    graduationSession: "2024/2025",
    status: "New",
    occupation: "IT Specialist",
    employer: "Digital Systems Ltd",
    location: "Lagos, Nigeria",
    lastEngagement: "22 Aug 2026",
    eventsAttended: 1,
  },

  {
    id: "7",
    matricNumber: "BTP/MKT/2019/027",
    name: "David Thompson",
    email: "david.thompson@example.com",
    phone: "+234 807 890 1234",
    programme: "Marketing",
    department: "Business Studies",
    graduationYear: "2023",
    graduationSession: "2022/2023",
    status: "Unreachable",
    occupation: "Marketing Manager",
    employer: "Growth Africa",
    location: "Kano, Nigeria",
    lastEngagement: "10 Jan 2025",
    eventsAttended: 2,
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
  status: AlumniStatus;
}) {
  const styles: Record<AlumniStatus, string> = {
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    New:
      "bg-blue-50 text-blue-700 border-blue-200",

    Inactive:
      "bg-slate-100 text-slate-600 border-slate-200",

    Unreachable:
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
| PAGE
|--------------------------------------------------------------------------
*/

export default function Alumni() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [selectedAlumni, setSelectedAlumni] =
    useState<AlumniRecord | null>(null);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const alumniCount = alumni.length;

  const activeCount = alumni.filter(
    (person) => person.status === "Active"
  ).length;

  const newCount = alumni.filter(
    (person) => person.status === "New"
  ).length;

  const totalEvents = alumni.reduce(
    (total, person) => total + person.eventsAttended,
    0
  );

  /*
  |--------------------------------------------------------------------------
  | YEARS
  |--------------------------------------------------------------------------
  */

  const graduationYears = useMemo(() => {
    return Array.from(
      new Set(alumni.map((person) => person.graduationYear))
    ).sort((a, b) => Number(b) - Number(a));
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredAlumni = useMemo(() => {
    const query = search.trim().toLowerCase();

    return alumni.filter((person) => {
      const matchesSearch =
        !query ||
        person.name.toLowerCase().includes(query) ||
        person.matricNumber.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query) ||
        person.programme.toLowerCase().includes(query) ||
        person.employer.toLowerCase().includes(query) ||
        person.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        person.status === statusFilter;

      const matchesYear =
        yearFilter === "All" ||
        person.graduationYear === yearFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesYear
      );
    });
  }, [search, statusFilter, yearFilter]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Matric Number",
      "Name",
      "Email",
      "Phone",
      "Programme",
      "Department",
      "Graduation Year",
      "Graduation Session",
      "Status",
      "Occupation",
      "Employer",
      "Location",
      "Events Attended",
    ];

    const rows = filteredAlumni.map((person) => [
      person.matricNumber,
      person.name,
      person.email,
      person.phone,
      person.programme,
      person.department,
      person.graduationYear,
      person.graduationSession,
      person.status,
      person.occupation,
      person.employer,
      person.location,
      person.eventsAttended,
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
    link.download = "alumni-directory.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Alumni Directory
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage graduates, alumni records, engagement and contact information.
            </p>
          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 border-slate-300 bg-white"
        >
          <Download className="h-4 w-4" />
          Export Alumni
        </Button>

      </div>

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
                  Total Alumni
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {alumniCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Registered graduates
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
                  Active Alumni
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {activeCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Currently engaged
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UserCheck className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* New */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  New Alumni
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {newCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Recently added graduates
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <UserPlus className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Events */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Event Attendance
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalEvents}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Alumni event attendances
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CalendarDays className="h-5 w-5" />
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

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search alumni by name, matric number, programme, employer..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="New">
                  New
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Unreachable">
                  Unreachable
                </option>
              </select>

            </div>

            <select
              value={yearFilter}
              onChange={(event) =>
                setYearFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">
                All Graduation Years
              </option>

              {graduationYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}

            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          ALUMNI TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-bold text-[#081022]">
                Alumni Directory
              </h2>

              <p className="text-xs text-slate-500">
                {filteredAlumni.length} alumni displayed
              </p>

            </div>

            {(search ||
              statusFilter !== "All" ||
              yearFilter !== "All") && (

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setYearFilter("All");
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

          <table className="w-full min-w-[1150px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Alumni
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Graduation
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Current Position
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Location
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredAlumni.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >

                    <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No alumni found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredAlumni.map((person) => (

                  <tr
                    key={person.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Alumni */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {person.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#081022]">
                            {person.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {person.matricNumber}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Programme */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {person.programme}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {person.department}
                      </p>

                    </td>

                    {/* Graduation */}

                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {person.graduationYear}
                      </span>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {person.graduationSession}
                      </p>

                    </td>

                    {/* Current Position */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {person.occupation}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {person.employer}
                      </p>

                    </td>

                    {/* Location */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1.5 text-xs text-slate-600">

                        <MapPin className="h-3.5 w-3.5 text-slate-400" />

                        {person.location}

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge status={person.status} />

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedAlumni(person)
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

        {/* Pagination */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredAlumni.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {alumniCount}
            </strong>{" "}
            alumni
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
          ALUMNI PROFILE MODAL
      ============================================================ */}

      {selectedAlumni && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedAlumni.name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedAlumni.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedAlumni.matricNumber}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAlumni(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-6 p-6">

              {/* Status */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Alumni Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedAlumni.status}
                    />
                  </div>

                </div>

                <div className="text-right">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Graduation
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedAlumni.graduationSession}
                  </p>

                </div>

              </div>

              {/* Academic Information */}

              <div>

                <h3 className="mb-3 text-sm font-bold text-[#081022]">
                  Academic Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Programme
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedAlumni.programme}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedAlumni.department}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Graduation Year
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedAlumni.graduationYear}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Events Attended
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedAlumni.eventsAttended}
                    </p>

                  </div>

                </div>

              </div>

              {/* Career */}

              <div>

                <h3 className="mb-3 text-sm font-bold text-[#081022]">
                  Career Information
                </h3>

                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <BriefcaseBusiness className="h-4 w-4 text-slate-400" />

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Occupation
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {selectedAlumni.occupation}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <Building2 className="h-4 w-4 text-slate-400" />

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Employer
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {selectedAlumni.employer}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <MapPin className="h-4 w-4 text-slate-400" />

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Location
                      </p>

                      <p className="text-sm font-semibold text-slate-700">
                        {selectedAlumni.location}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Contact */}

              <div>

                <h3 className="mb-3 text-sm font-bold text-[#081022]">
                  Contact Information
                </h3>

                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <Mail className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedAlumni.email}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Phone className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedAlumni.phone}
                    </span>

                  </div>

                </div>

              </div>

              {/* Engagement */}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-bold text-blue-900">
                      Alumni Engagement
                    </p>

                    <p className="mt-1 text-[11px] text-blue-700">
                      Last recorded engagement
                    </p>

                  </div>

                  <CalendarDays className="h-5 w-5 text-blue-600" />

                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-lg bg-white p-3">

                    <p className="text-[10px] text-slate-400">
                      Last Engagement
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#081022]">
                      {selectedAlumni.lastEngagement}
                    </p>

                  </div>

                  <div className="rounded-lg bg-white p-3">

                    <p className="text-[10px] text-slate-400">
                      Events Attended
                    </p>

                    <p className="mt-1 text-xs font-bold text-[#081022]">
                      {selectedAlumni.eventsAttended}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedAlumni(null)
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