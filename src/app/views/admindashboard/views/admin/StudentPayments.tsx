import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  ReceiptText,
  Users,
  Wallet,
  Clock3,
  AlertCircle,
  CheckCircle2,
  Download,
  MoreHorizontal,
  X,
  CreditCard,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PaymentStatus =
  | "Paid"
  | "Partial"
  | "Outstanding"
  | "Pending"
  | "Overdue";

interface StudentPayment {
  id: string;
  matricNumber: string;
  studentName: string;
  email: string;
  programme: string;
  level: string;
  session: string;
  totalFees: number;
  amountPaid: number;
  balance: number;
  lastPayment: string;
  status: PaymentStatus;
}

const studentPayments: StudentPayment[] = [
  {
    id: "1",
    matricNumber: "BTP/CSC/2024/001",
    studentName: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    programme: "Computer Science",
    level: "200 Level",
    session: "2026/2027",
    totalFees: 350000,
    amountPaid: 350000,
    balance: 0,
    lastPayment: "26 Aug 2026",
    status: "Paid",
  },
  {
    id: "2",
    matricNumber: "BTP/BUS/2024/014",
    studentName: "Sarah Williams",
    email: "sarah.williams@example.com",
    programme: "Business Administration",
    level: "200 Level",
    session: "2026/2027",
    totalFees: 320000,
    amountPaid: 200000,
    balance: 120000,
    lastPayment: "25 Aug 2026",
    status: "Partial",
  },
  {
    id: "3",
    matricNumber: "BTP/ENG/2025/008",
    studentName: "Michael Johnson",
    email: "michael.johnson@example.com",
    programme: "Mechanical Engineering",
    level: "100 Level",
    session: "2026/2027",
    totalFees: 400000,
    amountPaid: 0,
    balance: 400000,
    lastPayment: "No payment",
    status: "Outstanding",
  },
  {
    id: "4",
    matricNumber: "BTP/ACC/2023/031",
    studentName: "Grace Mensima",
    email: "grace.mensima@example.com",
    programme: "Accounting",
    level: "300 Level",
    session: "2026/2027",
    totalFees: 330000,
    amountPaid: 330000,
    balance: 0,
    lastPayment: "23 Aug 2026",
    status: "Paid",
  },
  {
    id: "5",
    matricNumber: "BTP/CVE/2022/017",
    studentName: "Samuel Okoro",
    email: "samuel.okoro@example.com",
    programme: "Civil Engineering",
    level: "400 Level",
    session: "2026/2027",
    totalFees: 390000,
    amountPaid: 250000,
    balance: 140000,
    lastPayment: "20 Aug 2026",
    status: "Overdue",
  },
  {
    id: "6",
    matricNumber: "BTP/INF/2024/045",
    studentName: "Esther Adams",
    email: "esther.adams@example.com",
    programme: "Information Technology",
    level: "200 Level",
    session: "2026/2027",
    totalFees: 350000,
    amountPaid: 150000,
    balance: 200000,
    lastPayment: "19 Aug 2026",
    status: "Pending",
  },
];

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function PaymentStatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const styles: Record<PaymentStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Partial: "bg-blue-50 text-blue-700 border-blue-200",
    Outstanding: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Overdue: "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function StudentPayments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentPayment | null>(null);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalPayments = useMemo(() => {
    return studentPayments.reduce(
      (total, student) => total + student.amountPaid,
      0
    );
  }, []);

  const totalOutstanding = useMemo(() => {
    return studentPayments.reduce(
      (total, student) => total + student.balance,
      0
    );
  }, []);

  const paidStudents = useMemo(() => {
    return studentPayments.filter(
      (student) => student.status === "Paid"
    ).length;
  }, []);

  const pendingStudents = useMemo(() => {
    return studentPayments.filter(
      (student) =>
        student.status === "Pending" ||
        student.status === "Outstanding" ||
        student.status === "Overdue"
    ).length;
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return studentPayments.filter((student) => {
      const matchesSearch =
        !query ||
        student.studentName.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.programme.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        student.status === statusFilter;

      const matchesLevel =
        levelFilter === "All" ||
        student.level === levelFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLevel
      );
    });
  }, [search, statusFilter, levelFilter]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Matric Number",
      "Student",
      "Programme",
      "Level",
      "Session",
      "Total Fees",
      "Amount Paid",
      "Balance",
      "Last Payment",
      "Status",
    ];

    const rows = filteredStudents.map((student) => [
      student.matricNumber,
      student.studentName,
      student.programme,
      student.level,
      student.session,
      student.totalFees,
      student.amountPaid,
      student.balance,
      student.lastPayment,
      student.status,
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
    link.download = "student-payment-records.csv";
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
            <ReceiptText className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Student Payment Records
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Review student fees, payments, balances and outstanding
              financial obligations.
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2 border-slate-300 bg-white"
          >
            <Download className="h-4 w-4" />
            Export Records
          </Button>

          <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
            <CreditCard className="h-4 w-4" />
            Record Payment
          </Button>

        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Payments */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Payments Received
                </p>

                <p className="mt-2 text-2xl font-black text-[#081022]">
                  {formatCurrency(totalPayments)}
                </p>

                <p className="mt-2 text-[11px] text-emerald-600">
                  Confirmed student payments
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Wallet className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Outstanding */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Outstanding Fees
                </p>

                <p className="mt-2 text-2xl font-black text-[#081022]">
                  {formatCurrency(totalOutstanding)}
                </p>

                <p className="mt-2 text-[11px] text-red-600">
                  Amount still owed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <AlertCircle className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Paid */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Fully Paid Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {paidStudents}
                </p>

                <p className="mt-2 text-[11px] text-slate-400">
                  Fees completely settled
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Pending */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Students With Balances
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingStudents}
                </p>

                <p className="mt-2 text-[11px] text-amber-600">
                  Require payment follow-up
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          SEARCH / FILTERS
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
                placeholder="Search student, matric number, email or programme..."
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
                <option value="All">All Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
                <option value="Outstanding">
                  Outstanding
                </option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>

            </div>

            <select
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Levels</option>
              <option value="100 Level">100 Level</option>
              <option value="200 Level">200 Level</option>
              <option value="300 Level">300 Level</option>
              <option value="400 Level">400 Level</option>
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          PAYMENT TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Student Payment Records
              </h2>

              <p className="text-xs text-slate-500">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            {(search ||
              statusFilter !== "All" ||
              levelFilter !== "All") && (

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setLevelFilter("All");
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

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Session
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Fees
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Paid
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Balance
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

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <ReceiptText className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No payment records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Student */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {student.studentName
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#081022]">
                            {student.studentName}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {student.matricNumber}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Programme */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {student.programme}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {student.level}
                      </p>

                    </td>

                    {/* Session */}

                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {student.session}
                      </span>

                    </td>

                    {/* Total */}

                    <td className="px-5 py-4 text-right">

                      <span className="text-xs font-semibold text-slate-700">
                        {formatCurrency(student.totalFees)}
                      </span>

                    </td>

                    {/* Paid */}

                    <td className="px-5 py-4 text-right">

                      <span className="text-xs font-bold text-emerald-600">
                        {formatCurrency(student.amountPaid)}
                      </span>

                    </td>

                    {/* Balance */}

                    <td className="px-5 py-4 text-right">

                      <span
                        className={`text-xs font-black ${
                          student.balance > 0
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {formatCurrency(student.balance)}
                      </span>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <PaymentStatusBadge
                        status={student.status}
                      />

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedStudent(student)
                          }
                          className="h-8 gap-1.5 text-xs"
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

        {/* Footer */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredStudents.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {studentPayments.length}
            </strong>{" "}
            students
          </p>

        </div>

      </Card>

      {/* ============================================================
          STUDENT PAYMENT DETAILS MODAL
      ============================================================ */}

      {selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedStudent.studentName
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedStudent.studentName}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedStudent.matricNumber}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              {/* Payment Summary */}

              <div className="grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Fees
                  </p>

                  <p className="mt-2 text-lg font-black text-[#081022]">
                    {formatCurrency(
                      selectedStudent.totalFees
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-emerald-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Amount Paid
                  </p>

                  <p className="mt-2 text-lg font-black text-emerald-700">
                    {formatCurrency(
                      selectedStudent.amountPaid
                    )}
                  </p>

                </div>

                <div className="rounded-xl bg-red-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                    Balance
                  </p>

                  <p className="mt-2 text-lg font-black text-red-700">
                    {formatCurrency(
                      selectedStudent.balance
                    )}
                  </p>

                </div>

              </div>

              {/* Status */}

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-slate-500">
                    Payment Status
                  </p>

                  <div className="mt-2">
                    <PaymentStatusBadge
                      status={selectedStudent.status}
                    />
                  </div>

                </div>

                {selectedStudent.balance > 0 && (

                  <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                    <CreditCard className="h-4 w-4" />
                    Record Payment
                  </Button>

                )}

              </div>

              {/* Details */}

              <div className="grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Programme
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedStudent.programme}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Level
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedStudent.level}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Academic Session
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedStudent.session}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last Payment
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedStudent.lastPayment}
                  </p>

                </div>

              </div>

              {/* Contact */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Student Contact
                </p>

                <p className="text-sm text-slate-600">
                  {selectedStudent.email}
                </p>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
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