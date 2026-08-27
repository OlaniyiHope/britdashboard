import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock3,
  Search,
  Filter,
  Eye,
  ReceiptText,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  CreditCard,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TransactionStatus =
  | "Completed"
  | "Pending"
  | "Failed"
  | "Refunded";

type TransactionType =
  | "Student Payment"
  | "Refund"
  | "Staff Payment"
  | "Expense"
  | "Other";

interface FinanceTransaction {
  id: string;
  reference: string;
  description: string;
  type: TransactionType;
  payer: string;
  category: string;
  amount: number;
  status: TransactionStatus;
  date: string;
};

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your finance/payment API when the backend is connected.
|
*/

const transactions: FinanceTransaction[] = [
  {
    id: "1",
    reference: "PAY-2026-00124",
    description: "Tuition Fee Payment",
    type: "Student Payment",
    payer: "Daniel Mensah",
    category: "School Fees",
    amount: 185000,
    status: "Completed",
    date: "26 Aug 2026",
  },
  {
    id: "2",
    reference: "PAY-2026-00123",
    description: "Acceptance Fee",
    type: "Student Payment",
    payer: "Michael Johnson",
    category: "Admission",
    amount: 75000,
    status: "Pending",
    date: "26 Aug 2026",
  },
  {
    id: "3",
    reference: "EXP-2026-00031",
    description: "ICT Infrastructure",
    type: "Expense",
    payer: "ICT Department",
    category: "Operations",
    amount: 450000,
    status: "Completed",
    date: "25 Aug 2026",
  },
  {
    id: "4",
    reference: "PAY-2026-00121",
    description: "Hostel Accommodation",
    type: "Student Payment",
    payer: "Sarah Williams",
    category: "Accommodation",
    amount: 120000,
    status: "Completed",
    date: "25 Aug 2026",
  },
  {
    id: "5",
    reference: "REF-2026-00008",
    description: "Duplicate Payment Refund",
    type: "Refund",
    payer: "Esther Adams",
    category: "Refund",
    amount: 50000,
    status: "Refunded",
    date: "24 Aug 2026",
  },
  {
    id: "6",
    reference: "PAY-2026-00118",
    description: "Departmental Fee",
    type: "Student Payment",
    payer: "Grace Mensima",
    category: "Departmental Charges",
    amount: 35000,
    status: "Failed",
    date: "24 Aug 2026",
  },
];

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const styles: Record<TransactionStatus, string> = {
    Completed:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    Failed:
      "bg-red-50 text-red-700 border-red-200",
    Refunded:
      "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function BursaryFinance() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedTransaction, setSelectedTransaction] =
    useState<FinanceTransaction | null>(null);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalRevenue = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "Student Payment" &&
          transaction.status === "Completed"
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, []);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "Expense" &&
          transaction.status === "Completed"
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, []);

  const pendingAmount = useMemo(() => {
    return transactions
      .filter(
        (transaction) => transaction.status === "Pending"
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, []);

  const balance = totalRevenue - totalExpenses;

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        transaction.reference.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.payer.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        transaction.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Wallet className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Bursary & Finance Control
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor institutional finances, student payments,
              expenses and financial transactions.
            </p>
          </div>

        </div>

        <div className="flex gap-2">

          <Button
            variant="outline"
            className="gap-2 border-slate-300 bg-white"
          >
            <ReceiptText className="h-4 w-4" />
            Payment Records
          </Button>

          <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
            <Wallet className="h-4 w-4" />
            Record Transaction
          </Button>

        </div>

      </div>

      {/* ============================================================
          FINANCE SUMMARY
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Revenue */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Revenue
                </p>

                <p className="mt-2 text-2xl font-black text-[#081022]">
                  {formatCurrency(totalRevenue)}
                </p>

                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  Completed income
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Expenses */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Expenses
                </p>

                <p className="mt-2 text-2xl font-black text-[#081022]">
                  {formatCurrency(totalExpenses)}
                </p>

                <div className="mt-2 flex items-center gap-1 text-[11px] text-red-600">
                  <ArrowDownRight className="h-3 w-3" />
                  Recorded expenses
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <TrendingDown className="h-5 w-5" />
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
                  Pending Transactions
                </p>

                <p className="mt-2 text-2xl font-black text-[#081022]">
                  {formatCurrency(pendingAmount)}
                </p>

                <p className="mt-2 text-[11px] text-slate-400">
                  Awaiting confirmation
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Balance */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Current Balance
                </p>

                <p className="mt-2 text-2xl font-black text-[#081022]">
                  {formatCurrency(balance)}
                </p>

                <p className="mt-2 text-[11px] text-slate-400">
                  Revenue less expenses
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Wallet className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          QUICK FINANCE ACTIONS
      ============================================================ */}

      <div className="grid gap-4 md:grid-cols-3">

        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <CreditCard className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#081022]">
                Student Payments
              </p>

              <p className="text-xs text-slate-500">
                View fees and payment transactions
              </p>
            </div>

          </div>
        </button>

        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#081022]">
                Payment Verification
              </p>

              <p className="text-xs text-slate-500">
                Review pending payments
              </p>
            </div>

          </div>
        </button>

        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-700">
              <TrendingDown className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#081022]">
                Expenses
              </p>

              <p className="text-xs text-slate-500">
                Monitor institutional expenditure
              </p>
            </div>

          </div>
        </button>

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
                placeholder="Search reference, description, payer or category..."
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
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>

            </div>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
            >
              <option value="All">All Types</option>
              <option value="Student Payment">
                Student Payment
              </option>
              <option value="Refund">Refund</option>
              <option value="Staff Payment">
                Staff Payment
              </option>
              <option value="Expense">Expense</option>
              <option value="Other">Other</option>
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          TRANSACTIONS
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Recent Financial Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review recent payments, expenses and financial activity.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
              {filteredTransactions.length} records
            </span>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Transaction
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Payer / Source
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredTransactions.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <Wallet className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No transactions found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredTransactions.map((transaction) => (

                  <tr
                    key={transaction.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <ReceiptText className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-xs font-bold text-[#081022]">
                            {transaction.description}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {transaction.reference}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {transaction.payer}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {transaction.category}
                      </p>

                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-600">
                        {transaction.type}
                      </span>
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`text-sm font-black ${
                          transaction.type === "Expense" ||
                          transaction.type === "Refund"
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {transaction.type === "Expense" ||
                        transaction.type === "Refund"
                          ? "-"
                          : "+"}
                        {formatCurrency(transaction.amount)}
                      </span>

                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={transaction.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-600">
                        {transaction.date}
                      </span>
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedTransaction(transaction)
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

      </Card>

      {/* ============================================================
          TRANSACTION MODAL
      ============================================================ */}

      {selectedTransaction && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>

                <p className="text-lg font-bold">
                  Transaction Details
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {selectedTransaction.reference}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div>

                  <p className="text-xs text-slate-500">
                    Amount
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#081022]">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>

                </div>

                <StatusBadge
                  status={selectedTransaction.status}
                />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedTransaction.description}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Transaction Type
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedTransaction.type}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Payer / Source
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedTransaction.payer}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedTransaction.category}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedTransaction.date}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Reference
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedTransaction.reference}
                  </p>
                </div>

              </div>

              {selectedTransaction.status === "Pending" && (

                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-xs font-bold text-amber-800">
                      Payment requires verification
                    </p>

                    <p className="mt-1 text-xs text-amber-700">
                      This transaction has not yet been confirmed
                      by the bursary.
                    </p>
                  </div>

                </div>

              )}

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedTransaction(null)}
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