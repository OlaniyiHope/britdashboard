import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  CreditCard,
  ArrowRight,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const getToken = () => localStorage.getItem("jwtToken");
const BACK_LINK = "/student/dashboard/application/my-application";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

interface ApplicationData {
  _id: string;
  applicationNumber: string;
  status: "Pending" | "Submitted" | "Approved" | "Rejected";
  acceptanceFee: number;
  acceptanceFeePaid: boolean;
  acceptanceFeePaidAt?: string;
}

const naira = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

const PayAcceptanceFee = () => {
  const { applicationId } = useParams<{ applicationId: string }>();

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState("");

  /* ======================== LOAD APPLICATION ======================== */

  useEffect(() => {
    const load = async () => {
      if (!applicationId) {
        setError("Application ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/api/applications/${applicationId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.message || json.error || "Could not load application"
          );
        }

        setApplication(json.application || json.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [applicationId]);

  /* ======================== PAY FEE ======================== */

  const handlePay = async () => {
    if (!application) return;

    try {
      setBusy(true);
      setPayError("");

      const res = await fetch(
        `${API_URL}/api/payments/acceptance-fee/${application._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || json.error || "Could not start payment"
        );
      }

      // Redirect to Paystack
      window.location.href = json.authorizationUrl;
    } catch (err: any) {
      setPayError(err.message || "Something went wrong");
      setBusy(false);
    }
  };

  /* ======================== STATES ======================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#777] text-[12px]">
          <Loader2 size={18} className="animate-spin text-[#006b5d]" />
          Loading application...
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-5">
        <div className="bg-white border border-[#ddd] rounded-md p-8 max-w-md text-center">
          <AlertCircle size={32} className="mx-auto text-[#c0392b] mb-3" />
          <p className="text-[13px] font-semibold text-[#333]">
            Could not load application
          </p>
          <p className="text-[11px] text-[#888] mt-2">{error}</p>
          <Link
            to={BACK_LINK}
            className="inline-block mt-4 text-[11px] text-[#006b5d] underline hover:font-semibold"
          >
            Back to my applications
          </Link>
        </div>
      </div>
    );
  }

  /* ======================== NOT APPROVED YET ======================== */

  if (application.status !== "Approved") {
    return (
      <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">
        <div className="max-w-md mx-auto bg-white border border-[#ddd] rounded-md p-8 text-center">
          <Clock size={40} className="mx-auto text-[#b7791f] mb-3" />
          <h1 className="text-[16px] font-semibold text-[#333]">
            Acceptance fee not available yet
          </h1>
          <p className="text-[12px] text-[#888] mt-2">
            You can pay the acceptance fee once your application has been
            approved. Your application is currently{" "}
            <span className="font-semibold">{application.status}</span>.
          </p>
          <Link
            to={BACK_LINK}
            className="inline-block mt-6 bg-[#006b5d] text-white text-[11px] px-4 py-2 rounded hover:bg-[#005548] transition"
          >
            Back to applications
          </Link>
        </div>
      </div>
    );
  }

  /* ======================== ALREADY PAID ======================== */

  if (application.acceptanceFeePaid) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white border border-[#ddd] rounded-md p-8 text-center">
            <CheckCircle2 size={40} className="mx-auto text-[#006b5d] mb-3" />
            <h1 className="text-[16px] font-semibold text-[#333]">
              Payment Already Made
            </h1>
            <p className="text-[12px] text-[#888] mt-2">
              Your acceptance fee of {naira(application.acceptanceFee)} has
              already been paid.
            </p>
            {application.acceptanceFeePaidAt && (
              <p className="text-[11px] text-[#999] mt-3">
                Paid on{" "}
                {new Date(application.acceptanceFeePaidAt).toLocaleDateString(
                  "en-NG"
                )}
              </p>
            )}
            <Link
              to={BACK_LINK}
              className="inline-block mt-6 bg-[#006b5d] text-white text-[11px] px-4 py-2 rounded hover:bg-[#005548] transition"
            >
              Back to applications
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ======================== PAYMENT PAGE ======================== */

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-8">
      {/* HEADER */}
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-[22px] font-semibold text-[#333]">
          Pay Acceptance Fee
        </h1>
        <p className="text-[12px] text-[#888] mt-2">
          Application No:{" "}
          <span className="font-mono font-semibold">
            {application.applicationNumber}
          </span>
        </p>
      </div>

      {/* CARD */}
      <div className="max-w-2xl mx-auto bg-white border border-[#ddd] rounded-md overflow-hidden">
        {/* FEE DETAILS */}
        <div className="p-6 border-b border-[#ddd]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-[#006b5d] flex items-center justify-center flex-shrink-0">
              <CreditCard size={24} />
            </div>

            <div className="flex-1">
              <h2 className="text-[16px] font-semibold text-[#333]">
                Acceptance Fee
              </h2>

              <div className="mt-4 space-y-2 text-[13px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#666]">Fee Amount:</span>
                  <span className="font-semibold text-[#333]">
                    {naira(application.acceptanceFee)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-[#eee]">
                  <span className="font-semibold text-[#333]">Total Due:</span>
                  <span className="text-[18px] font-bold text-[#006b5d]">
                    {naira(application.acceptanceFee)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="bg-[#f8f9fb] p-6 border-b border-[#ddd]">
          <div className="flex gap-3 items-start">
            <AlertCircle
              size={18}
              className="text-[#b7791f] mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-[12px] font-medium text-[#7a5a13]">
                Payment Information
              </p>
              <p className="text-[11px] text-[#92752c] mt-1">
                Paying this fee confirms that you accept your place. Payments
                are processed securely by Paystack and you will be redirected
                to complete your payment.
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {payError && (
          <div className="p-6 border-b border-[#ddd] bg-[#fdecea]">
            <p className="text-[11px] text-[#c0392b]">{payError}</p>
          </div>
        )}

        {/* BUTTON */}
        <div className="p-6">
          <button
            type="button"
            onClick={handlePay}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#006b5d] hover:bg-[#005548] text-white font-medium px-6 py-3 rounded-md disabled:opacity-60 disabled:cursor-not-allowed transition text-[13px]"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Pay {naira(application.acceptanceFee)}
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <p className="text-[11px] text-[#888] text-center mt-3">
            You'll be redirected to Paystack to complete the payment securely.
          </p>
        </div>
      </div>

      {/* BACK LINK */}
      <div className="max-w-2xl mx-auto mt-6">
        <Link to={BACK_LINK} className="text-[11px] text-[#006b5d] hover:underline">
          ← Back to my applications
        </Link>
      </div>
    </div>
  );
};

export default PayAcceptanceFee;
