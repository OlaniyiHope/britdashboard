import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import useFetch from "@/hooks/useFetch";

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const naira = (n?: number) => `₦${(n ?? 0).toLocaleString()}`;

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const Badge = ({
  tone,
  icon,
  children,
}: {
  tone: "green" | "red" | "orange" | "blue";
  icon: React.ReactNode;
  children: React.ReactNode;
}) => {
  const tones = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] ${tones[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
};

const statusBadge = (status: string) => {
  switch (status) {
    case "Approved":
      return <Badge tone="green" icon={<CheckCircle size={12} />}>Approved</Badge>;
    case "Rejected":
      return <Badge tone="red" icon={<XCircle size={12} />}>Rejected</Badge>;
    case "Submitted":
      return <Badge tone="blue" icon={<CheckCircle size={12} />}>Submitted</Badge>;
    default:
      return <Badge tone="orange" icon={<Clock size={12} />}>Pending</Badge>;
  }
};

const paidBadge = (paid: boolean) =>
  paid ? (
    <Badge tone="green" icon={<CheckCircle size={12} />}>Paid</Badge>
  ) : (
    <Badge tone="red" icon={<XCircle size={12} />}>Unpaid</Badge>
  );

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center border-b border-[#eee] last:border-b-0 py-3">
    <dt className="sm:w-56 text-[11px] text-[#999] mb-1 sm:mb-0">{label}</dt>
    <dd className="text-[13px] text-[#333]">{value}</dd>
  </div>
);

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

const ViewApplication = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(`/applications/${applicationId}`);

  const app: any =
    (data as any)?.application || (data as any)?.data || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[13px] text-[#888]">Loading application…</p>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <p className="text-[13px] text-red-600">
          Could not load this application.
        </p>
        <Link
          to="/student/dashboard/application/my-application"
          className="text-[11px] text-[#006b5d] underline"
        >
          Back to my applications
        </Link>
      </div>
    );
  }

  const user = app.user || {};
  const applicantName =
    user.fullName ||
    [user.firstName, user.middleName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    "—";

  const departmentName = app.department?.name || app.department?.code || "—";
  const sessionName = app.session?.name || "Current Session";

  return (
    <div className="min-h-screen bg-white text-[#333]">
      {/* Print only the document, hide dashboard sidebar/header */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-application, #printable-application * { visibility: visible !important; }
          #printable-application {
            position: absolute; left: 0; top: 0; width: 100%;
            padding: 24px; border: none !important;
          }
          .no-print { display: none !important; }
          @page { margin: 14mm; }
        }
      `}</style>

      {/* HEADER */}
      <div className="no-print border-b border-[#ddd] px-7 py-5 flex items-center justify-between">
        <h1 className="text-[18px] font-medium text-[#333]">
          View Application
        </h1>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-[#006b5d] hover:bg-[#005548] text-white text-[11px] px-4 py-2 rounded-[3px] transition"
        >
          <Printer size={14} />
          Print application
        </button>
      </div>

      <div className="px-7 md:px-8 py-10">
        {/* BREADCRUMB */}
        <div className="no-print flex items-center gap-2 text-[12px] text-[#999] mb-8">
          <Link to="/student/dashboard" className="hover:text-[#006b5d] transition">
            Dashboard
          </Link>
          <ChevronRight size={13} />
          <Link
            to="/student/dashboard/application/my-application"
            className="hover:text-[#006b5d] transition"
          >
            My Applications
          </Link>
          <ChevronRight size={13} />
          <span className="text-[#555]">{app.applicationNumber}</span>
        </div>

        {/* PRINTABLE DOCUMENT */}
        <div
          id="printable-application"
          className="max-w-3xl border border-[#ddd] rounded-[3px] bg-white"
        >
          {/* Document title */}
          <div className="px-8 py-6 border-b border-[#ddd] flex items-start justify-between gap-4">
            <div>
              <p className="text-[15px] font-semibold text-[#333]">
                British Transatlantic Poly
              </p>
              <p className="text-[11px] text-[#888] mt-1">
                Application record · {sessionName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#999]">Application No.</p>
              <p className="font-mono text-[14px] font-semibold text-[#333]">
                {app.applicationNumber}
              </p>
            </div>
          </div>

          {/* Applicant details */}
          <div className="px-8 py-6 border-b border-[#ddd]">
            <h2 className="text-[13px] font-semibold text-[#333] mb-2">
              Applicant
            </h2>
            <dl>
              <Row label="Full name" value={applicantName} />
              {user.email && <Row label="Email" value={user.email} />}
              {user.phone && <Row label="Phone" value={user.phone} />}
            </dl>
          </div>

          {/* Application details */}
          <div className="px-8 py-6 border-b border-[#ddd]">
            <h2 className="text-[13px] font-semibold text-[#333] mb-2">
              Application details
            </h2>
            <dl>
              <Row label="Department" value={departmentName} />
              <Row label="Session" value={sessionName} />
              <Row label="Date applied" value={formatDate(app.createdAt)} />
              <Row label="Status" value={statusBadge(app.status)} />
              {app.reviewedAt && (
                <Row label="Reviewed on" value={formatDate(app.reviewedAt)} />
              )}
              {app.reviewNotes && (
                <Row label="Reviewer notes" value={app.reviewNotes} />
              )}
            </dl>
          </div>

          {/* Fees */}
          <div className="px-8 py-6">
            <h2 className="text-[13px] font-semibold text-[#333] mb-2">
              Fees
            </h2>
            <dl>
              <Row
                label="Application fee"
                value={
                  <span className="inline-flex items-center gap-3">
                    <span className="font-semibold">{naira(app.applicationFee)}</span>
                    {paidBadge(!!app.applicationFeePaid)}
                  </span>
                }
              />
              {app.applicationFeePaid && app.applicationFeePaidAt && (
                <Row
                  label="Paid on"
                  value={formatDate(app.applicationFeePaidAt)}
                />
              )}

              {app.status === "Approved" && (
                <>
                  <Row
                    label="Acceptance fee"
                    value={
                      <span className="inline-flex items-center gap-3">
                        <span className="font-semibold">
                          {naira(app.acceptanceFee)}
                        </span>
                        {paidBadge(!!app.acceptanceFeePaid)}
                      </span>
                    }
                  />
                  {app.acceptanceFeePaid && app.acceptanceFeePaidAt && (
                    <Row
                      label="Paid on"
                      value={formatDate(app.acceptanceFeePaidAt)}
                    />
                  )}
                </>
              )}
            </dl>
          </div>

          <div className="px-8 py-4 border-t border-[#ddd] text-[10px] text-[#aaa]">
            Printed on {formatDate(new Date().toISOString())}
          </div>
        </div>

        {/* ACTIONS (not printed) */}
        <div className="no-print max-w-3xl mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/student/dashboard/application/my-application")}
            className="inline-flex items-center gap-1 text-[11px] text-[#006b5d] hover:underline"
          >
            <ArrowLeft size={13} />
            Back to my applications
          </button>

          {!app.applicationFeePaid && (
            <button
              type="button"
              onClick={() =>
                navigate(`/student/dashboard/payment/application/${app._id}`)
              }
              className="inline-flex items-center gap-1 bg-[#4caf50] hover:bg-[#43a047] text-white text-[11px] px-4 py-2 rounded-[2px] transition"
            >
              <CreditCard size={13} />
              Pay application fee
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewApplication;
