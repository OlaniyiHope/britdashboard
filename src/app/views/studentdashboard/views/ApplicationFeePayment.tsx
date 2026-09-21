import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Loader2,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";

/*
  One page for both routes. Add these to your router:

  <Route
    path="/student/dashboard/payment/application/:id"
    element={<ApplicationFeePayment kind="application" />}
  />
  <Route
    path="/student/dashboard/payment/acceptance/:id"
    element={<ApplicationFeePayment kind="acceptance" />}
  />
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const getToken = () => localStorage.getItem("jwtToken");

// Change to wherever your My Applications page lives
const APPLICATIONS_PATH = "/student/dashboard/application/my-applications";

type Kind = "application" | "acceptance";

const CONFIG = {
  application: {
    title: "Application Fee",
    amountField: "applicationFee",
    paidField: "applicationFeePaid",
    fallbackAmount: 5000,
    Icon: FileText,
  },
  acceptance: {
    title: "Acceptance Fee",
    amountField: "acceptanceFee",
    paidField: "acceptanceFeePaid",
    fallbackAmount: 40000,
    Icon: Award,
  },
} as const;

const naira = (n: number) => `₦${n.toLocaleString()}`;

const ApplicationFeePayment = ({ kind }: { kind: Kind }) => {
  const { id } = useParams();
  const config = CONFIG[kind];

  const { data, loading, error } = useFetch("/applications/mine");

  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState("");

  const applications = (data as { applications?: any[] } | null)?.applications || [];
  const application = applications.find((a: any) => String(a._id) === String(id));

  const stored = Number(application?.[config.amountField]);
  const amount = stored > 0 ? stored : config.fallbackAmount;
  const alreadyPaid = Boolean(application?.[config.paidField]);
  const notApproved = kind === "acceptance" && application?.status !== "Approved";

  const pay = async () => {
    try {
      setBusy(true);
      setPayError("");

      const res = await fetch(`${API_URL}/api/payments/application/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ applicationId: id, kind }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || json.error || "Could not start payment.");
      }

      window.location.href = json.authorizationUrl;
    } catch (err: any) {
      setPayError(err.message || "Something went wrong.");
      setBusy(false);
    }
  };

  /* ---------------------------- STATES ---------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#777] text-[12px]">
          <Loader2 size={18} className="animate-spin text-[#006b5d]" />
          Loading your application...
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
            Application not found
          </p>
          <Link
            to={APPLICATIONS_PATH}
            className="inline-block mt-4 text-[11px] text-[#006b5d] underline"
          >
            Back to My Applications
          </Link>
        </div>
      </div>
    );
  }

  /* ----------------------------- PAGE ----------------------------- */

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#333]">
      <div className="border-b border-[#ddd] bg-white px-7 py-5">
        <h1 className="text-[18px] font-medium text-[#333]">{config.title}</h1>
      </div>

      <div className="px-5 md:px-8 py-7 max-w-2xl">
        <div className="flex items-center gap-2 text-[11px] text-[#999] mb-7">
          <Link to="/student/dashboard" className="hover:text-[#006b5d] transition">
            Dashboard
          </Link>
          <ChevronRight size={13} />
          <Link to={APPLICATIONS_PATH} className="hover:text-[#006b5d] transition">
            My Applications
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#555]">{config.title}</span>
        </div>

        <div className="bg-white border border-[#ddd] rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-[#eee] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#eef8f6] text-[#006b5d] flex items-center justify-center">
              <config.Icon size={19} />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-[#333]">
                {config.title}
              </h2>
              <p className="text-[10px] text-[#999]">
                Review the details, then pay securely with Paystack.
              </p>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#888]">Application number</span>
              <span className="font-mono text-[#444]">
                {application.applicationNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#888]">Programme</span>
              <span className="text-[#444]">
                {application.programme?.name || application.programme?.code || "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#eee] pt-3">
              <span className="text-[#888]">Amount</span>
              <span className="text-[18px] font-bold text-[#006b5d]">
                {naira(amount)}
              </span>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#eee] bg-[#fcfcfc]">
            {alreadyPaid ? (
              <div className="flex items-center gap-2 text-[12px] text-[#006b5d]">
                <CheckCircle2 size={16} />
                This fee has been paid.
              </div>
            ) : notApproved ? (
              <div className="flex items-start gap-2 text-[11px] text-[#7a5a13]">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                You can pay the acceptance fee once your application is approved.
              </div>
            ) : (
              <>
                {payError && (
                  <p className="mb-3 text-[11px] text-[#c0392b]">{payError}</p>
                )}
                <button
                  type="button"
                  onClick={pay}
                  disabled={busy}
                  className="inline-flex items-center gap-2 bg-[#006b5d] hover:bg-[#005548] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[11px] font-medium px-5 py-3 rounded-[3px]"
                >
                  {busy ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CreditCard size={14} />
                  )}
                  PAY {naira(amount)}
                  {!busy && <ArrowRight size={13} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFeePayment;