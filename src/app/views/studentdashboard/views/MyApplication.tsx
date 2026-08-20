import {
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  ChevronRight,
  Award,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface MyApplication {
  id: number;
  applicationName: string;
  program: string;
  applicationNumber: string;
  dateApplied: string;

  applicationFee: number;
  applicationPaymentStatus: "Paid" | "Unpaid";

  acceptanceFee: number;
  acceptancePaymentStatus: "Paid" | "Unpaid";

  status: "Pending" | "Submitted" | "Approved" | "Rejected";
}

const myApplications: MyApplication[] = [
  {
    id: 1,
    applicationName: "2025/2026 Batch C Application",
    program: "BSc. Computer Science",
    applicationNumber: "APP-2026-000124",
    dateApplied: "August 19, 2026",

    applicationFee: 10000,
    applicationPaymentStatus: "Paid",

    acceptanceFee: 40000,
    acceptancePaymentStatus: "Unpaid",

    status: "Approved",
  },
];

const MyApplications = () => {
  const navigate = useNavigate();

  /* -------------------------------------------------------
     APPLICATION STATUS
  ------------------------------------------------------- */

  const getStatus = (status: MyApplication["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded text-[11px]">
            <CheckCircle size={12} />
            Approved
          </span>
        );

      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded text-[11px]">
            <XCircle size={12} />
            Rejected
          </span>
        );

      case "Submitted":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded text-[11px]">
            <CheckCircle size={12} />
            Submitted
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded text-[11px]">
            <Clock size={12} />
            Pending
          </span>
        );
    }
  };

  /* -------------------------------------------------------
     PAYMENT STATUS
  ------------------------------------------------------- */

  const getPaymentStatus = (
    status: "Paid" | "Unpaid"
  ) => {
    if (status === "Paid") {
      return (
        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded text-[11px]">
          <CheckCircle size={12} />
          Paid
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded text-[11px]">
        <XCircle size={12} />
        Unpaid
      </span>
    );
  };

  /* -------------------------------------------------------
     PAYMENT COUNTS
  ------------------------------------------------------- */

  const unpaidApplicationPayments = myApplications.filter(
    (application) =>
      application.applicationPaymentStatus === "Unpaid"
  ).length;

  const unpaidAcceptancePayments = myApplications.filter(
    (application) =>
      application.status === "Approved" &&
      application.acceptancePaymentStatus === "Unpaid"
  ).length;

  const totalUnpaidPayments =
    unpaidApplicationPayments + unpaidAcceptancePayments;

  /* -------------------------------------------------------
     PAGE
  ------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-white text-[#333]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-[#ddd] px-7 py-5">

        <h1 className="text-[18px] font-medium text-[#333]">
          My Applications
        </h1>

      </div>

      <div className="px-7 md:px-8 py-10">

        {/* =====================================================
            BREADCRUMB
        ====================================================== */}

        <div className="flex items-center gap-2 text-[12px] text-[#999] mb-8">

          <Link
            to="/student/dashboard"
            className="hover:text-[#006b5d] transition"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span>
            Application
          </span>

          <ChevronRight size={13} />

          <span className="text-[#555]">
            My Applications
          </span>

        </div>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <div className="mb-6">

          <h2 className="text-[17px] font-medium text-[#333]">
            My Applications
          </h2>

          <p className="text-[12px] text-[#888] mt-1">
            View and manage applications you have started or submitted.
          </p>

        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

          {/* TOTAL APPLICATIONS */}

          <div className="border border-[#ddd] bg-white p-5 rounded-[3px]">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-blue-50 text-[#006b5d] rounded-full flex items-center justify-center">
                <FileText size={19} />
              </div>

              <div>

                <p className="text-[11px] text-[#999]">
                  Total Applications
                </p>

                <p className="text-xl font-semibold text-[#333]">
                  {myApplications.length}
                </p>

              </div>

            </div>

          </div>

          {/* PENDING */}

          <div className="border border-[#ddd] bg-white p-5 rounded-[3px]">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                <Clock size={19} />
              </div>

              <div>

                <p className="text-[11px] text-[#999]">
                  Pending Applications
                </p>

                <p className="text-xl font-semibold text-[#333]">
                  {
                    myApplications.filter(
                      (application) =>
                        application.status === "Pending"
                    ).length
                  }
                </p>

              </div>

            </div>

          </div>

          {/* UNPAID */}

          <div className="border border-[#ddd] bg-white p-5 rounded-[3px]">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <CreditCard size={19} />
              </div>

              <div>

                <p className="text-[11px] text-[#999]">
                  Unpaid Payments
                </p>

                <p className="text-xl font-semibold text-[#333]">
                  {totalUnpaidPayments}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            APPLICATION TABLE
        ====================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] border-collapse border border-[#d5dbe2]">

            {/* TABLE HEADER */}

            <thead>

              <tr className="bg-[#e9edf3]">

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  #
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  APPLICATION
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  PROGRAM
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  APPLICATION NO.
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  DATE
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  STATUS
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  APPLICATION FEE
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  ACCEPTANCE
                </th>

                <th className="border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold">
                  ACTION
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}

            <tbody>

              {myApplications.map(
                (application, index) => (

                  <tr
                    key={application.id}
                    className="hover:bg-[#fafafa]"
                  >

                    {/* NUMBER */}

                    <td className="border border-[#d5dbe2] px-4 py-4 text-[12px] text-[#777] align-top">
                      {index + 1}
                    </td>

                    {/* APPLICATION */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      <p className="text-[12px] font-medium text-[#555]">
                        {application.applicationName}
                      </p>

                    </td>

                    {/* PROGRAM */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      <p className="text-[12px] text-[#777]">
                        {application.program}
                      </p>

                    </td>

                    {/* APPLICATION NUMBER */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      <span className="font-mono text-[11px] text-[#777]">
                        {application.applicationNumber}
                      </span>

                    </td>

                    {/* DATE */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      <p className="text-[12px] text-[#777]">
                        {application.dateApplied}
                      </p>

                    </td>

                    {/* APPLICATION STATUS */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      {getStatus(application.status)}

                    </td>

                    {/* APPLICATION FEE */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      <div className="space-y-2">

                        <p className="text-[11px] font-semibold text-[#444]">
                          ₦{application.applicationFee.toLocaleString()}
                        </p>

                        {getPaymentStatus(
                          application.applicationPaymentStatus
                        )}

                      </div>

                    </td>

                    {/* ACCEPTANCE FEE */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      {application.status === "Approved" ? (

                        <div className="space-y-2">

                          <p className="text-[11px] font-semibold text-[#444]">
                            ₦{application.acceptanceFee.toLocaleString()}
                          </p>

                          {getPaymentStatus(
                            application.acceptancePaymentStatus
                          )}

                        </div>

                      ) : (

                        <span className="text-[10px] text-[#aaa]">
                          Not Available
                        </span>

                      )}

                    </td>

                    {/* ACTION */}

                    <td className="border border-[#d5dbe2] px-4 py-4 align-top">

                      <div className="flex flex-col gap-2">

                        {/* VIEW APPLICATION */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/student/dashboard/application/${application.id}`
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-1
                            bg-[#006b5d]
                            hover:bg-[#005548]
                            text-white
                            text-[10px]
                            px-3
                            py-2
                            rounded-[2px]
                            transition
                          "
                        >
                          <Eye size={12} />
                          VIEW APPLICATION
                        </button>

                        {/* APPLICATION FEE PAYMENT */}

                        {application.applicationPaymentStatus ===
                          "Unpaid" && (

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/student/dashboard/payment/application/${application.id}`
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-1
                              bg-[#4caf50]
                              hover:bg-[#43a047]
                              text-white
                              text-[10px]
                              px-3
                              py-2
                              rounded-[2px]
                              transition
                            "
                          >
                            <CreditCard size={12} />
                            PAY APPLICATION
                          </button>

                        )}

                        {/* ACCEPTANCE FEE PAYMENT */}

                        {application.status === "Approved" &&
                          application.acceptancePaymentStatus ===
                            "Unpaid" && (

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/student/dashboard/payment/acceptance/${application.id}`
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-1
                              bg-[#006b5d]
                              hover:bg-[#005548]
                              text-white
                              text-[10px]
                              px-3
                              py-2
                              rounded-[2px]
                              transition
                            "
                          >
                            <Award size={12} />
                            PAY ACCEPTANCE
                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {/* =====================================================
            NO APPLICATIONS
        ====================================================== */}

        {myApplications.length === 0 && (

          <div className="border border-[#ddd] border-t-0 py-14 text-center">

            <FileText
              size={40}
              className="mx-auto text-[#bbb] mb-3"
            />

            <h3 className="text-sm font-medium text-[#555]">
              No applications yet
            </h3>

            <p className="text-xs text-[#999] mt-1">
              You have not started any application.
            </p>

            <Link
              to="/student/dashboard/application/all-application"
              className="
                inline-block
                mt-4
                bg-[#006b5d]
                text-white
                text-xs
                px-4
                py-2
                rounded
                hover:bg-[#005548]
                transition
              "
            >
              View Available Applications
            </Link>

          </div>

        )}

      </div>

    </div>
  );
};

export default MyApplications;