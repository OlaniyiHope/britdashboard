import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const getToken = () => localStorage.getItem("jwtToken");

// Change these if your pages are at different paths
const PAYMENT_PATH = "/student/dashboard/payment/make-payment";
const REGISTRATION_PATH = "/student/dashboard/course/course-registration";

type Outcome =
  | { state: "checking" }
  | { state: "success"; title: string; amount: number }
  | { state: "pending" }
  | { state: "failed" }
  | { state: "error"; message: string };

/*
  Paystack sends the student back here with ?reference=... after paying.
  Add this route:
  <Route path="/student/dashboard/payment/callback" element={<PaymentCallback />} />
*/
const PaymentCallback = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference") || params.get("trxref");

  const [outcome, setOutcome] = useState<Outcome>({ state: "checking" });

  useEffect(() => {
    if (!reference) {
      setOutcome({ state: "error", message: "No payment reference found." });
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/payments/verify/${encodeURIComponent(reference)}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || json.error || "Could not verify payment.");
        }

        if (json.status === "success") {
          setOutcome({ state: "success", title: json.title, amount: json.amount });
        } else if (json.status === "failed") {
          setOutcome({ state: "failed" });
        } else {
          setOutcome({ state: "pending" });
        }
      } catch (err: any) {
        setOutcome({ state: "error", message: err.message || "Something went wrong." });
      }
    };

    verify();
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-5">
      <div className="bg-white border border-[#ddd] rounded-md p-8 max-w-md w-full text-center">
        {outcome.state === "checking" && (
          <>
            <Loader2 size={32} className="mx-auto animate-spin text-[#006b5d] mb-3" />
            <p className="text-[13px] font-semibold text-[#333]">
              Confirming your payment...
            </p>
            <p className="text-[11px] text-[#888] mt-2">Please do not close this page.</p>
          </>
        )}

        {outcome.state === "success" && (
          <>
            <CheckCircle2 size={36} className="mx-auto text-[#006b5d] mb-3" />
            <p className="text-[14px] font-semibold text-[#333]">Payment successful</p>
            <p className="text-[11px] text-[#888] mt-2">
              {outcome.title}: ₦{outcome.amount.toLocaleString()}
            </p>
          </>
        )}

        {outcome.state === "pending" && (
          <>
            <Clock size={36} className="mx-auto text-[#b7791f] mb-3" />
            <p className="text-[14px] font-semibold text-[#333]">Payment not confirmed yet</p>
            <p className="text-[11px] text-[#888] mt-2">
              If you were charged, it can take a few minutes to show. Check your
              payments page shortly.
            </p>
          </>
        )}

        {outcome.state === "failed" && (
          <>
            <AlertCircle size={36} className="mx-auto text-[#c0392b] mb-3" />
            <p className="text-[14px] font-semibold text-[#333]">Payment failed</p>
            <p className="text-[11px] text-[#888] mt-2">
              You have not been charged for this attempt. Please try again.
            </p>
          </>
        )}

        {outcome.state === "error" && (
          <>
            <AlertCircle size={36} className="mx-auto text-[#c0392b] mb-3" />
            <p className="text-[14px] font-semibold text-[#333]">Could not check payment</p>
            <p className="text-[11px] text-[#888] mt-2">{outcome.message}</p>
          </>
        )}

        {outcome.state !== "checking" && (
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
            <Link
              to={PAYMENT_PATH}
              className="border border-[#006b5d] text-[#006b5d] hover:bg-[#eef8f6] text-[11px] font-medium px-4 py-2.5 rounded-[3px]"
            >
              BACK TO PAYMENTS
            </Link>
            <Link
              to={REGISTRATION_PATH}
              className="bg-[#006b5d] hover:bg-[#005548] text-white text-[11px] font-medium px-4 py-2.5 rounded-[3px]"
            >
              REGISTER COURSES
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
