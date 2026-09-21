// import {
//   CreditCard,
//   FileText,
//   ArrowRight,
//   AlertCircle,
// } from "lucide-react";
// import { Link } from "react-router-dom";

// const MakePayment = () => {
//   const outstandingPayments = [
//     {
//       id: "PAY-001",
//       title: "Application Fee",
//       application: "2025/2026 Batch C Application",
//       program: "BSc. Computer Science",
//       amount: 10000,
//       status: "Unpaid",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">

//       {/* HEADER */}
//       <div className="mb-7">
//         <h1 className="text-[20px] font-semibold text-[#333]">
//           Make Payment
//         </h1>

//         <p className="text-[12px] text-[#888] mt-1">
//           View your outstanding payments and complete payment securely.
//         </p>
//       </div>

//       {/* NOTICE */}
//       <div className="flex gap-3 items-start bg-[#fff8e6] border border-[#f1df9b] rounded-md p-4 mb-6">

//         <AlertCircle
//           size={18}
//           className="text-[#b7791f] mt-0.5"
//         />

//         <div>
//           <p className="text-[12px] font-medium text-[#7a5a13]">
//             Outstanding Payment
//           </p>

//           <p className="text-[11px] text-[#92752c] mt-1">
//             You have an outstanding payment that needs to be completed.
//           </p>
//         </div>

//       </div>

//       {/* PAYMENTS */}
//       <div className="space-y-4">

//         {outstandingPayments.map((payment) => (

//           <div
//             key={payment.id}
//             className="bg-white border border-[#ddd] rounded-md p-5"
//           >

//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

//               {/* DETAILS */}
//               <div className="flex gap-4">

//                 <div className="w-11 h-11 rounded-full bg-blue-50 text-[#006b5d] flex items-center justify-center flex-shrink-0">
//                   <FileText size={20} />
//                 </div>

//                 <div>

//                   <h2 className="text-[14px] font-semibold text-[#333]">
//                     {payment.title}
//                   </h2>

//                   <p className="text-[11px] text-[#777] mt-1">
//                     {payment.application}
//                   </p>

//                   <p className="text-[11px] text-[#999] mt-1">
//                     {payment.program}
//                   </p>

//                 </div>

//               </div>

//               {/* AMOUNT + BUTTON */}
//               <div className="flex items-center justify-between md:justify-end gap-6">

//                 <div className="text-right">

//                   <p className="text-[10px] text-[#999]">
//                     Amount Due
//                   </p>

//                   <p className="text-[18px] font-bold text-[#333]">
//                     ₦{payment.amount.toLocaleString()}
//                   </p>

//                 </div>

//                 <Link
//                   to={`/student/dashboard/payment/review/${payment.id}`}
//                   className="
//                     inline-flex
//                     items-center
//                     gap-2
//                     bg-[#006b5d]
//                     hover:bg-[#005548]
//                     text-white
//                     text-[11px]
//                     font-medium
//                     px-4
//                     py-2.5
//                     rounded-[3px]
//                   "
//                 >
//                   <CreditCard size={14} />
//                   PAY NOW
//                   <ArrowRight size={13} />
//                 </Link>

//               </div>

//             </div>

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default MakePayment;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  FileText,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const getToken = () => localStorage.getItem("jwtToken");

// Change if your course registration page is at a different path
const REGISTRATION_PATH = "/student/dashboard/course/course-registration";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

interface FeeItem {
  code: string;
  title: string;
  due: number;
  paid: number;
  balance: number;
  requiredNow: number;
  partPayment: boolean;
  status: string;
}

interface PaymentStatus {
  session: string;
  semester: string;
  items: FeeItem[];
  eligible: boolean;
  outstandingNow: number;
}

const naira = (n: number) => `₦${n.toLocaleString()}`;

const statusStyle: Record<string, string> = {
  Paid: "bg-[#eef8f6] text-[#006b5d]",
  Waived: "bg-[#eef8f6] text-[#006b5d]",
  Cleared: "bg-[#eaf2fb] text-[#2b6cb0]",
  "Part paid": "bg-[#fff8e6] text-[#b7791f]",
  Unpaid: "bg-[#fdecea] text-[#c0392b]",
};

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

const MakePayment = () => {
  const [data, setData] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/payments/status`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || json.error || "Could not load fees.");
        }

        setData(json);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Asks the server to start a Paystack payment, then sends the student there
  const pay = async (feeCode: string, amount?: number) => {
    const key = `${feeCode}:${amount ?? "full"}`;

    try {
      setBusy(key);
      setPayError("");

      const res = await fetch(`${API_URL}/api/payments/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ feeCode, amount }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || json.error || "Could not start payment.");
      }

      window.location.href = json.authorizationUrl;
    } catch (err: any) {
      setPayError(err.message || "Something went wrong.");
      setBusy(null);
    }
  };

  /* ---------------------------- STATES ---------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#777] text-[12px]">
          <Loader2 size={18} className="animate-spin text-[#006b5d]" />
          Loading your fees...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-5">
        <div className="bg-white border border-[#ddd] rounded-md p-8 max-w-md text-center">
          <AlertCircle size={32} className="mx-auto text-[#c0392b] mb-3" />
          <p className="text-[13px] font-semibold text-[#333]">
            Could not load your fees
          </p>
          <p className="text-[11px] text-[#888] mt-2">{error}</p>
        </div>
      </div>
    );
  }

  /* ----------------------------- PAGE ----------------------------- */

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-7">
        <h1 className="text-[20px] font-semibold text-[#333]">Make Payment</h1>
        <p className="text-[12px] text-[#888] mt-1">
          Fees for {data.session} — {data.semester}. Payments are processed
          securely by Paystack.
        </p>
      </div>

      {/* NOTICE */}
      {data.eligible ? (
        <div className="flex gap-3 items-start bg-[#f0f8f6] border border-[#cce5df] rounded-md p-4 mb-6">
          <CheckCircle2 size={18} className="text-[#006b5d] mt-0.5" />
          <div>
            <p className="text-[12px] font-medium text-[#006b5d]">
              You have paid the fees required for registration
            </p>
            <Link
              to={REGISTRATION_PATH}
              className="text-[11px] text-[#006b5d] underline mt-1 inline-block"
            >
              Go to course registration
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 items-start bg-[#fff8e6] border border-[#f1df9b] rounded-md p-4 mb-6">
          <AlertCircle size={18} className="text-[#b7791f] mt-0.5" />
          <div>
            <p className="text-[12px] font-medium text-[#7a5a13]">
              Outstanding payments
            </p>
            <p className="text-[11px] text-[#92752c] mt-1">
              You need to pay {naira(data.outstandingNow)} before you can
              register your courses.
            </p>
          </div>
        </div>
      )}

      {payError && (
        <p className="mb-4 text-[11px] text-[#c0392b]">{payError}</p>
      )}

      {/* FEES */}
      <div className="space-y-4">
        {data.items.map((item) => (
          <div
            key={item.code}
            className="bg-white border border-[#ddd] rounded-md p-5"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* DETAILS */}
              <div className="flex gap-4 lg:w-1/3">
                <div className="w-11 h-11 rounded-full bg-blue-50 text-[#006b5d] flex items-center justify-center flex-shrink-0">
                  <FileText size={20} />
                </div>

                <div>
                  <h2 className="text-[14px] font-semibold text-[#333]">
                    {item.title}
                  </h2>
                  <span
                    className={`inline-block text-[10px] px-2 py-0.5 rounded mt-1.5 ${
                      statusStyle[item.status] ?? "bg-[#f3f3f3] text-[#777]"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* AMOUNTS */}
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] text-[#999]">Total</p>
                  <p className="text-[13px] font-semibold text-[#333]">
                    {naira(item.due)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#999]">Paid</p>
                  <p className="text-[13px] font-semibold text-[#006b5d]">
                    {naira(item.paid)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-[#999]">Balance</p>
                  <p className="text-[13px] font-bold text-[#333]">
                    {naira(item.balance)}
                  </p>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-2 lg:justify-end">
                {item.balance === 0 ? null : item.partPayment ? (
                  <>
                    {item.requiredNow > 0 && item.requiredNow < item.balance && (
                      <PayButton
                        label={`PAY ${naira(item.requiredNow)} (HALF)`}
                        busy={busy === `${item.code}:${item.requiredNow}`}
                        disabled={busy !== null}
                        onClick={() => pay(item.code, item.requiredNow)}
                        outline
                      />
                    )}
                    <PayButton
                      label={`PAY ${naira(item.balance)}${
                        item.paid > 0 ? " BALANCE" : " IN FULL"
                      }`}
                      busy={busy === `${item.code}:${item.balance}`}
                      disabled={busy !== null}
                      onClick={() => pay(item.code, item.balance)}
                    />
                  </>
                ) : (
                  <PayButton
                    label={`PAY ${naira(item.balance)}`}
                    busy={busy === `${item.code}:full`}
                    disabled={busy !== null}
                    onClick={() => pay(item.code)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PayButton = ({
  label,
  onClick,
  busy,
  disabled,
  outline = false,
}: {
  label: string;
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  outline?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-2 text-[11px] font-medium px-4 py-2.5 rounded-[3px] disabled:opacity-60 disabled:cursor-not-allowed ${
      outline
        ? "border border-[#006b5d] text-[#006b5d] hover:bg-[#eef8f6]"
        : "bg-[#006b5d] hover:bg-[#005548] text-white"
    }`}
  >
    {busy ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
    {label}
    {!busy && <ArrowRight size={13} />}
  </button>
);

export default MakePayment;
