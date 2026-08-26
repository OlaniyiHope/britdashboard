import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Printer,
  Eye,
  Download,
  FileText,
  Users,
  CheckCircle2,
  Clock3,
  AlertCircle,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RegistrationStatus =
  | "Registered"
  | "Pending"
  | "Incomplete"
  | "Rejected";

interface RegistrationRecord {
  id: string;
  matricNumber: string;
  studentName: string;
  programme: string;
  department: string;
  level: string;
  session: string;
  semester: string;
  registrationDate: string;
  status: RegistrationStatus;
}

const registrations: RegistrationRecord[] = [
  {
    id: "1",
    matricNumber: "BTP/CSC/2024/001",
    studentName: "Daniel Mensah",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "200 Level",
    session: "2025/2026",
    semester: "Second Semester",
    registrationDate: "25 Aug 2026",
    status: "Registered",
  },
  {
    id: "2",
    matricNumber: "BTP/BUS/2024/014",
    studentName: "Sarah Williams",
    programme: "Business Administration",
    department: "Business Studies",
    level: "200 Level",
    session: "2025/2026",
    semester: "Second Semester",
    registrationDate: "24 Aug 2026",
    status: "Registered",
  },
  {
    id: "3",
    matricNumber: "BTP/ENG/2025/008",
    studentName: "Michael Johnson",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "100 Level",
    session: "2025/2026",
    semester: "Second Semester",
    registrationDate: "23 Aug 2026",
    status: "Pending",
  },
  {
    id: "4",
    matricNumber: "BTP/ACC/2023/031",
    studentName: "Grace Mensima",
    programme: "Accounting",
    department: "Business Studies",
    level: "300 Level",
    session: "2025/2026",
    semester: "Second Semester",
    registrationDate: "22 Aug 2026",
    status: "Incomplete",
  },
  {
    id: "5",
    matricNumber: "BTP/CVE/2022/017",
    studentName: "Samuel Okoro",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "400 Level",
    session: "2025/2026",
    semester: "Second Semester",
    registrationDate: "21 Aug 2026",
    status: "Registered",
  },
  {
    id: "6",
    matricNumber: "BTP/INF/2024/045",
    studentName: "Esther Adams",
    programme: "Information Technology",
    department: "Computing & Technology",
    level: "200 Level",
    session: "2025/2026",
    semester: "Second Semester",
    registrationDate: "20 Aug 2026",
    status: "Rejected",
  },
];

function StatusBadge({
  status,
}: {
  status: RegistrationStatus;
}) {
  const styles: Record<RegistrationStatus, string> = {
    Registered:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pending:
      "border-amber-200 bg-amber-50 text-amber-700",
    Incomplete:
      "border-orange-200 bg-orange-50 text-orange-700",
    Rejected:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function RegistrationPrintout() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [selectedRegistration, setSelectedRegistration] =
    useState<RegistrationRecord | null>(null);

  /*
   * ---------------------------------------------------------------
   * STATISTICS
   * ---------------------------------------------------------------
   */

  const totalStudents = registrations.length;

  const registeredCount = registrations.filter(
    (item) => item.status === "Registered"
  ).length;

  const pendingCount = registrations.filter(
    (item) => item.status === "Pending"
  ).length;

  const incompleteCount = registrations.filter(
    (item) => item.status === "Incomplete"
  ).length;

  /*
   * ---------------------------------------------------------------
   * FILTERS
   * ---------------------------------------------------------------
   */

  const sessions = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((item) => item.session))
      ),
    []
  );

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesSearch =
        !query ||
        item.studentName.toLowerCase().includes(query) ||
        item.matricNumber.toLowerCase().includes(query) ||
        item.programme.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      const matchesSession =
        sessionFilter === "All" ||
        item.session === sessionFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSession
      );
    });
  }, [search, statusFilter, sessionFilter]);

  /*
   * ---------------------------------------------------------------
   * PRINT
   * ---------------------------------------------------------------
   */

  const handlePrint = (registration: RegistrationRecord) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Registration - ${registration.studentName}</title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #081022;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #081022;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }

            h1 {
              margin: 0;
              font-size: 22px;
            }

            h2 {
              margin: 8px 0 0;
              font-size: 16px;
              font-weight: normal;
            }

            .section {
              margin-top: 25px;
            }

            .section-title {
              background: #f1f5f9;
              padding: 10px;
              font-weight: bold;
              margin-bottom: 12px;
            }

            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
            }

            .field {
              border: 1px solid #ddd;
              padding: 12px;
            }

            .label {
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
            }

            .value {
              margin-top: 5px;
              font-weight: bold;
            }

            .footer {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              color: #64748b;
            }
          </style>
        </head>

        <body>

          <div class="header">
            <h1>BRITISH TRANSATLANTIC POLYTECHNIC</h1>
            <h2>Student Registration Record</h2>
          </div>

          <div class="section">
            <div class="section-title">
              Student Information
            </div>

            <div class="grid">

              <div class="field">
                <div class="label">Student Name</div>
                <div class="value">
                  ${registration.studentName}
                </div>
              </div>

              <div class="field">
                <div class="label">Matric Number</div>
                <div class="value">
                  ${registration.matricNumber}
                </div>
              </div>

              <div class="field">
                <div class="label">Programme</div>
                <div class="value">
                  ${registration.programme}
                </div>
              </div>

              <div class="field">
                <div class="label">Department</div>
                <div class="value">
                  ${registration.department}
                </div>
              </div>

              <div class="field">
                <div class="label">Level</div>
                <div class="value">
                  ${registration.level}
                </div>
              </div>

              <div class="field">
                <div class="label">Registration Status</div>
                <div class="value">
                  ${registration.status}
                </div>
              </div>

            </div>
          </div>

          <div class="section">
            <div class="section-title">
              Academic Registration
            </div>

            <div class="grid">

              <div class="field">
                <div class="label">Academic Session</div>
                <div class="value">
                  ${registration.session}
                </div>
              </div>

              <div class="field">
                <div class="label">Semester</div>
                <div class="value">
                  ${registration.semester}
                </div>
              </div>

              <div class="field">
                <div class="label">Registration Date</div>
                <div class="value">
                  ${registration.registrationDate}
                </div>
              </div>

            </div>
          </div>

          <div class="footer">
            <span>Administrative Copy</span>
            <span>Generated: ${new Date().toLocaleDateString()}</span>
          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  /*
   * ---------------------------------------------------------------
   * EXPORT
   * ---------------------------------------------------------------
   */

  const handleExport = () => {
    const headers = [
      "Matric Number",
      "Student Name",
      "Programme",
      "Department",
      "Level",
      "Session",
      "Semester",
      "Registration Date",
      "Status",
    ];

    const rows = filteredRegistrations.map((item) => [
      item.matricNumber,
      item.studentName,
      item.programme,
      item.department,
      item.level,
      item.session,
      item.semester,
      item.registrationDate,
      item.status,
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
    link.download = "student-registration-printout.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Registration Printout
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Generate and print official student registration records.
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2 bg-white"
          >
            <Download className="h-4 w-4" />
            Export Records
          </Button>

        </div>

      </div>

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500">
                  Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalStudents}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Registration records
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
                <p className="text-xs text-slate-500">
                  Registered
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {registeredCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Fully registered
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting completion
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
                <p className="text-xs text-slate-500">
                  Incomplete
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {incompleteCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Require attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <AlertCircle className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}

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
                placeholder="Search student, matric number, programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#006dcc] focus:bg-white"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="All">All Status</option>
                <option value="Registered">Registered</option>
                <option value="Pending">Pending</option>
                <option value="Incomplete">Incomplete</option>
                <option value="Rejected">Rejected</option>
              </select>

            </div>

            <select
              value={sessionFilter}
              onChange={(event) =>
                setSessionFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="All">All Sessions</option>

              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}

            </select>

          </div>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-sm font-bold text-[#081022]">
            Student Registration Records
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select a student to view or print their registration record.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Level
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Session
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Registration Date
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredRegistrations.map((registration) => (

                <tr
                  key={registration.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                        {registration.studentName
                          .split(" ")
                          .map((name) => name[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>

                        <p className="text-sm font-bold text-[#081022]">
                          {registration.studentName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {registration.matricNumber}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <p className="text-xs font-semibold text-slate-700">
                      {registration.programme}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {registration.department}
                    </p>

                  </td>

                  <td className="px-5 py-4">

                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold">
                      {registration.level}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {registration.session}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {registration.semester}
                      </p>
                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <span className="text-xs text-slate-600">
                      {registration.registrationDate}
                    </span>

                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={registration.status} />
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedRegistration(registration)
                        }
                        className="h-8 gap-1.5 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>

                      <Button
                        size="sm"
                        onClick={() =>
                          handlePrint(registration)
                        }
                        className="h-8 gap-1.5 bg-[#081022] text-xs hover:bg-[#101b33]"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print
                      </Button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

      {/* VIEW REGISTRATION */}

      {selectedRegistration && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>

                <p className="text-lg font-bold">
                  Registration Record
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {selectedRegistration.studentName} •{" "}
                  {selectedRegistration.matricNumber}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRegistration(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Registration Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedRegistration.status}
                    />
                  </div>
                </div>

                <Button
                  onClick={() =>
                    handlePrint(selectedRegistration)
                  }
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  <Printer className="h-4 w-4" />
                  Print Registration
                </Button>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Student
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.studentName}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Matric Number
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.matricNumber}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Programme
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.programme}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Department
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.department}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Level
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.level}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Academic Session
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.session}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Semester
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.semester}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Registration Date
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.registrationDate}
                  </p>
                </div>

              </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedRegistration(null)
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