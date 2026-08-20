import { useMemo, useState } from "react";
import {
  Search,
  Receipt,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Payment {
  id: string;
  reference: string;
  description: string;
  type: string;
  amount: number;
  date: string;
  method: string;
  status: "Successful" | "Pending" | "Failed";
}

const payments: Payment[] = [
  {
    id: "1",
    reference: "PSK-APP-20260819-001",
    description: "Application Fee",
    type: "Application",
    amount: 10000,
    date: "August 19, 2026",
    method: "Paystack",
    status: "Successful",
  },
  {
    id: "2",
    reference: "PSK-HST-20260817-002",
    description: "Hostel & Accommodation Fee",
    type: "Accommodation",
    amount: 50000,
    date: "August 17, 2026",
    method: "Paystack",
    status: "Successful",
  },
  {
    id: "3",
    reference: "PSK-REG-20260815-003",
    description: "Late Registration Fee",
    type: "Registration",
    amount: 5000,
    date: "August 15, 2026",
    method: "Paystack",
    status: "Pending",
  },
  {
    id: "4",
    reference: "PSK-ID-20260810-004",
    description: "Student Identity Card",
    type: "Student Services",
    amount: 3000,
    date: "August 10, 2026",
    method: "Paystack",
    status: "Failed",
  },
];

const StudentPaymentHistorys = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {

      const searchValue = search.toLowerCase();

      const matchesSearch =
        payment.reference.toLowerCase().includes(searchValue) ||
        payment.description.toLowerCase().includes(searchValue) ||
        payment.type.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalSuccessful = payments
    .filter((payment) => payment.status === "Successful")
    .reduce((total, payment) => total + payment.amount, 0);

  const totalPending = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((total, payment) => total + payment.amount, 0);

  const getStatusBadge = (status: Payment["status"]) => {

    if (status === "Successful") {
      return (
        <span className="
          inline-flex
          items-center
          gap-1.5
          bg-green-100
          text-green-700
          px-2.5
          py-1
          rounded
          text-[10px]
          font-medium
        ">
          <CheckCircle size={12} />
          Successful
        </span>
      );
    }

    if (status === "Pending") {
      return (
        <span className="
          inline-flex
          items-center
          gap-1.5
          bg-orange-100
          text-orange-700
          px-2.5
          py-1
          rounded
          text-[10px]
          font-medium
        ">
          <Clock size={12} />
          Pending
        </span>
      );
    }

    return (
      <span className="
        inline-flex
        items-center
        gap-1.5
        bg-red-100
        text-red-700
        px-2.5
        py-1
        rounded
        text-[10px]
        font-medium
      ">
        <XCircle size={12} />
        Failed
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#333]">

      {/* HEADER */}
      <div className="border-b border-[#ddd] bg-white px-7 py-5">

        <h1 className="text-[18px] font-medium text-[#333]">
          Payment History
        </h1>

      </div>

      <div className="px-6 md:px-8 py-8">

        {/* BREADCRUMB */}
        <div className="
          flex
          items-center
          gap-2
          text-[12px]
          text-[#999]
          mb-7
        ">

          <Link
            to="/student/dashboard"
            className="hover:text-[#006b5d]"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span>Payment</span>

          <ChevronRight size={13} />

          <span className="text-[#555]">
            Payment History
          </span>

        </div>

        {/* PAGE INTRO */}
        <div className="mb-7">

          <h2 className="text-[20px] font-semibold text-[#333]">
            Payment History
          </h2>

          <p className="text-[12px] text-[#888] mt-1">
            View all your payments and transaction records.
          </p>

        </div>

        {/* SUMMARY CARDS */}
        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-4
          mb-7
        ">

          {/* TOTAL TRANSACTIONS */}
          <div className="
            bg-white
            border
            border-[#ddd]
            rounded-md
            p-5
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-full
                bg-blue-50
                text-[#006b5d]
                flex
                items-center
                justify-center
              ">
                <Receipt size={19} />
              </div>

              <div>

                <p className="text-[11px] text-[#999]">
                  Total Transactions
                </p>

                <p className="text-xl font-semibold text-[#333]">
                  {payments.length}
                </p>

              </div>

            </div>

          </div>

          {/* SUCCESSFUL */}
          <div className="
            bg-white
            border
            border-[#ddd]
            rounded-md
            p-5
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-full
                bg-green-50
                text-green-600
                flex
                items-center
                justify-center
              ">
                <CheckCircle size={19} />
              </div>

              <div>

                <p className="text-[11px] text-[#999]">
                  Successfully Paid
                </p>

                <p className="text-xl font-semibold text-[#333]">
                  ₦{totalSuccessful.toLocaleString()}
                </p>

              </div>

            </div>

          </div>

          {/* PENDING */}
          <div className="
            bg-white
            border
            border-[#ddd]
            rounded-md
            p-5
          ">

            <div className="flex items-center gap-3">

              <div className="
                w-10
                h-10
                rounded-full
                bg-orange-50
                text-orange-500
                flex
                items-center
                justify-center
              ">
                <Clock size={19} />
              </div>

              <div>

                <p className="text-[11px] text-[#999]">
                  Pending
                </p>

                <p className="text-xl font-semibold text-[#333]">
                  ₦{totalPending.toLocaleString()}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE CONTAINER */}
        <div className="
          bg-white
          border
          border-[#ddd]
          rounded-md
          overflow-hidden
        ">

          {/* TOOLBAR */}
          <div className="
            p-4
            border-b
            border-[#eee]
            flex
            flex-col
            lg:flex-row
            gap-3
            lg:items-center
            lg:justify-between
          ">

            {/* SEARCH */}
            <div className="relative w-full lg:w-[320px]">

              <Search
                size={15}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[#999]
                "
              />

              <input
                type="text"
                placeholder="Search transactions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  h-[36px]
                  border
                  border-[#ccc]
                  rounded-[3px]
                  pl-9
                  pr-3
                  text-[11px]
                  outline-none
                  focus:border-[#006b5d]
                "
              />

            </div>

            {/* FILTER */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
                h-[36px]
                border
                border-[#ccc]
                rounded-[3px]
                px-3
                text-[11px]
                text-[#666]
                outline-none
                focus:border-[#006b5d]
                bg-white
              "
            >
              <option value="All">
                All Status
              </option>

              <option value="Successful">
                Successful
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Failed">
                Failed
              </option>

            </select>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="
              w-full
              min-w-[950px]
              border-collapse
            ">

              <thead>

                <tr className="bg-[#e9edf3]">

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    #
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    REFERENCE
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    PAYMENT
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    DATE
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    AMOUNT
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    METHOD
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    STATUS
                  </th>

                  <th className="
                    border-b
                    border-[#d5dbe2]
                    px-4
                    py-4
                    text-left
                    text-[11px]
                    font-bold
                    text-[#444]
                  ">
                    ACTION
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredPayments.map((payment, index) => (

                  <tr
                    key={payment.id}
                    className="hover:bg-[#fafafa]"
                  >

                    {/* NUMBER */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      text-[11px]
                      text-[#777]
                      align-top
                    ">
                      {index + 1}
                    </td>

                    {/* REFERENCE */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      align-top
                    ">

                      <span className="
                        font-mono
                        text-[10px]
                        text-[#666]
                      ">
                        {payment.reference}
                      </span>

                    </td>

                    {/* PAYMENT */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      align-top
                    ">

                      <p className="
                        text-[12px]
                        font-medium
                        text-[#444]
                      ">
                        {payment.description}
                      </p>

                      <p className="
                        text-[10px]
                        text-[#999]
                        mt-1
                      ">
                        {payment.type}
                      </p>

                    </td>

                    {/* DATE */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      text-[11px]
                      text-[#777]
                      align-top
                    ">
                      {payment.date}
                    </td>

                    {/* AMOUNT */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      text-[12px]
                      font-semibold
                      text-[#333]
                      align-top
                    ">
                      ₦{payment.amount.toLocaleString()}
                    </td>

                    {/* METHOD */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      align-top
                    ">

                      <span className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[10px]
                        text-[#555]
                      ">
                        <CreditCard size={12} />
                        {payment.method}
                      </span>

                    </td>

                    {/* STATUS */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      align-top
                    ">
                      {getStatusBadge(payment.status)}
                    </td>

                    {/* ACTION */}
                    <td className="
                      border-b
                      border-[#eee]
                      px-4
                      py-4
                      align-top
                    ">

                      {payment.status === "Successful" ? (

                        <button
                          onClick={() =>
                            navigate(
                              `/student/dashboard/payment/receipt/${payment.id}`
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            bg-[#006b5d]
                            hover:bg-[#005548]
                            text-white
                            text-[10px]
                            px-3
                            py-1.5
                            rounded-[2px]
                          "
                        >
                          <Eye size={12} />
                          VIEW RECEIPT
                        </button>

                      ) : payment.status === "Pending" ? (

                        <button
                          onClick={() =>
                            navigate(
                              `/student/dashboard/payment/review/${payment.id}`
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            bg-orange-500
                            hover:bg-orange-600
                            text-white
                            text-[10px]
                            px-3
                            py-1.5
                            rounded-[2px]
                          "
                        >
                          <CreditCard size={12} />
                          CONTINUE
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            navigate(
                              `/student/dashboard/payment/review/${payment.id}`
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            text-[10px]
                            px-3
                            py-1.5
                            rounded-[2px]
                          "
                        >
                          <CreditCard size={12} />
                          RETRY
                        </button>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* EMPTY STATE */}
          {filteredPayments.length === 0 && (
            <div className="
              py-14
              text-center
              border-t
              border-[#eee]
            ">

              <Receipt
                size={38}
                className="mx-auto text-[#bbb] mb-3"
              />

              <h3 className="
                text-[14px]
                font-medium
                text-[#555]
              ">
                No Transactions Found
              </h3>

              <p className="
                text-[11px]
                text-[#999]
                mt-1
              ">
                No payment records match your search.
              </p>

            </div>
          )}

        </div>

        {/* DOWNLOAD NOTE */}
        <div className="
          mt-5
          flex
          items-center
          gap-2
          text-[11px]
          text-[#999]
        ">
          <Download size={13} />

          <span>
            You can view and print receipts for successful payments.
          </span>
        </div>

      </div>

    </div>
  );
};

export default StudentPaymentHistorys;