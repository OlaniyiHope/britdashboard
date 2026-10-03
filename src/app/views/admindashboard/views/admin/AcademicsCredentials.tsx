import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

type CredentialStatus =
  | "Pending Verification"
  | "Verified"
  | "Rejected"
  | "Issue Found";

type ReviewDecision = "Verified" | "Issue Found" | "Rejected";

type ApiCredential = {
  _id: string;
  credentialType: string;
  examYear?: string;
  examNumber?: string;
  fileName: string;
  status: CredentialStatus;
  remark?: string;
  verifiedAt?: string;
  createdAt: string;
  user?: {
    _id: string;
    username?: string;
    studentName?: string;
    email?: string;
  } | null;
  application?: {
    _id: string;
    applicationNumber?: string;
    programme?: { name?: string; code?: string } | null;
  } | null;
};

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("jwtToken");
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || `Request failed (${response.status})`
    );
  }
  return data as T;
}

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const statusClasses: Record<CredentialStatus, string> = {
  "Pending Verification": "bg-amber-50 text-amber-700 border-amber-200",
  Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  "Issue Found": "bg-orange-50 text-orange-700 border-orange-200",
};

function StatusBadge({ status }: { status: CredentialStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

const applicantName = (c: ApiCredential) =>
  c.user?.studentName || c.user?.username || "Unknown applicant";

const programmeName = (c: ApiCredential) =>
  c.application?.programme?.name || "—";

const applicationNo = (c: ApiCredential) =>
  c.application?.applicationNumber || "—";

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function AcademicsCredentials() {
  const [credentials, setCredentials] = useState<ApiCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | CredentialStatus>(
    "All"
  );

  const [reviewing, setReviewing] = useState<ApiCredential | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  /* ---------------------------- LOAD ---------------------------- */

  const loadCredentials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api<{ credentials: ApiCredential[] }>("/credentials");
      setCredentials(data.credentials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credentials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCredentials();
  }, [loadCredentials]);

  /* --------------------------- ACTIONS -------------------------- */

  const handleDownload = async (id: string) => {
    try {
      setDownloadingId(id);
      const data = await api<{ url: string }>(`/credentials/${id}/download`);
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleReviewed = (updated: ApiCredential) => {
    // Keep populated fields (user/application); the PATCH response has only IDs
    setCredentials((current) =>
      current.map((c) =>
        c._id === updated._id
          ? {
              ...c,
              status: updated.status,
              remark: updated.remark,
              verifiedAt: updated.verifiedAt,
            }
          : c
      )
    );
    setReviewing(null);
    setNotice(`Credential marked as ${updated.status}`);
  };

  /* --------------------------- DERIVED -------------------------- */

  const filteredCredentials = useMemo(() => {
    const q = search.toLowerCase().trim();

    return credentials.filter((c) => {
      const matchesSearch =
        !q ||
        applicantName(c).toLowerCase().includes(q) ||
        applicationNo(c).toLowerCase().includes(q) ||
        programmeName(c).toLowerCase().includes(q) ||
        c.credentialType.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "All" || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [credentials, search, statusFilter]);

  const totalDocuments = credentials.length;
  const pendingCount = credentials.filter(
    (c) => c.status === "Pending Verification"
  ).length;
  const verifiedCount = credentials.filter((c) => c.status === "Verified").length;
  const issueCount = credentials.filter(
    (c) => c.status === "Issue Found" || c.status === "Rejected"
  ).length;

  /* --------------------------- RENDER --------------------------- */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#006dcc]">
              <GraduationCap className="h-5 w-5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                Admissions
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#081022] md:text-3xl">
              Academics & Credentials
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review and verify academic qualifications and supporting
              documents submitted by applicants.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-300"
              onClick={loadCredentials}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button variant="outline" className="border-slate-300">
              <FileCheck2 className="mr-2 h-4 w-4" />
              Verification Guidelines
            </Button>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {notice && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Documents Submitted"
          value={totalDocuments}
          description="Academic documents received"
          icon={FileText}
          tone="bg-blue-50 text-blue-700"
          loading={loading}
        />
        <StatCard
          label="Pending Verification"
          value={pendingCount}
          description="Documents requiring review"
          icon={Clock3}
          tone="bg-amber-50 text-amber-700"
          loading={loading}
        />
        <StatCard
          label="Verified"
          value={verifiedCount}
          description="Successfully verified documents"
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-700"
          loading={loading}
        />
        <StatCard
          label="Issues / Rejected"
          value={issueCount}
          description="Documents requiring attention"
          icon={ShieldAlert}
          tone="bg-red-50 text-red-700"
          loading={loading}
        />
      </div>

      {/* MAIN CARD */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-bold text-[#081022]">
                Applicant Credentials
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Verify the academic evidence submitted with admission
                applications.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search applicant, application..."
                  className="w-full pl-9 sm:w-[260px]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "All" | CredentialStatus)
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">All Status</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Verified">Verified</option>
                <option value="Issue Found">Issue Found</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-[#081022]" />
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left">
                    {["Applicant", "Programme", "Credential", "Document", "Submitted", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500"
                        >
                          {h}
                        </th>
                      )
                    )}
                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredCredentials.map((credential) => (
                    <tr
                      key={credential._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* APPLICANT */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#081022]">
                          {applicantName(credential)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {applicationNo(credential)}
                        </p>
                      </td>

                      {/* PROGRAMME */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {programmeName(credential)}
                        </p>
                      </td>

                      {/* CREDENTIAL */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {credential.credentialType}
                        </p>
                        {(credential.examYear || credential.examNumber) && (
                          <p className="mt-1 text-xs text-slate-400">
                            {[credential.examYear, credential.examNumber]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </td>

                      {/* DOCUMENT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span
                            className="max-w-[180px] truncate text-xs font-medium text-slate-600"
                            title={credential.fileName}
                          >
                            {credential.fileName}
                          </span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {formatDate(credential.createdAt)}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <StatusBadge status={credential.status} />
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => setReviewing(credential)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Review
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            disabled={downloadingId === credential._id}
                            onClick={() => handleDownload(credential._id)}
                          >
                            {downloadingId === credential._id ? (
                              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Download className="mr-1.5 h-3.5 w-3.5" />
                            )}
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY STATE */}
            {filteredCredentials.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <FileText className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-bold text-slate-600">
                  No credentials found
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {credentials.length === 0
                    ? "No applicant has uploaded a document yet."
                    : "Try changing your search or status filter."}
                </p>
              </div>
            )}
          </>
        )}
      </Card>

      {/* VERIFICATION NOTE */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />
          <div>
            <p className="text-sm font-bold text-blue-900">
              Credential verification
            </p>
            <p className="mt-1 text-xs leading-5 text-blue-800">
              Verify the applicant's academic documents before the admission
              application is finally approved. Any missing, invalid, or
              questionable document should be flagged for correction before
              admission processing continues.
            </p>
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {reviewing && (
        <ReviewModal
          credential={reviewing}
          onClose={() => setReviewing(null)}
          onDone={handleReviewed}
          onDownload={() => handleDownload(reviewing._id)}
          downloading={downloadingId === reviewing._id}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STAT CARD                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ElementType;
  tone: string;
  loading: boolean;
}) {
  return (
    <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#081022]">
              {loading ? "..." : value}
            </p>
          </div>
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* REVIEW MODAL                                                        */
/* ------------------------------------------------------------------ */

function ReviewModal({
  credential,
  onClose,
  onDone,
  onDownload,
  downloading,
}: {
  credential: ApiCredential;
  onClose: () => void;
  onDone: (updated: ApiCredential) => void;
  onDownload: () => void;
  downloading: boolean;
}) {
  const [remark, setRemark] = useState(credential.remark || "");
  const [submitting, setSubmitting] = useState<ReviewDecision | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (status: ReviewDecision) => {
    if (status !== "Verified" && !remark.trim()) {
      setError("Add a remark so the applicant knows what to fix.");
      return;
    }

    try {
      setSubmitting(status);
      setError(null);

      const data = await api<{ credential: ApiCredential }>(
        `/credentials/${credential._id}/verify`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status,
            remark: status === "Verified" ? undefined : remark.trim(),
          }),
        }
      );

      onDone(data.credential);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save review");
    } finally {
      setSubmitting(null);
    }
  };

  const busy = submitting !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-[#081022]">
              Review Credential
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {applicantName(credential)} · {applicationNo(credential)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          {/* DETAILS */}
          <div className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <Detail label="Programme" value={programmeName(credential)} />
            <Detail label="Document type" value={credential.credentialType} />
            <Detail label="Exam year" value={credential.examYear || "—"} />
            <Detail label="Exam number" value={credential.examNumber || "—"} />
            <Detail label="Submitted" value={formatDate(credential.createdAt)} />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Current status
              </p>
              <div className="mt-1">
                <StatusBadge status={credential.status} />
              </div>
            </div>
          </div>

          {/* FILE */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <FileText className="h-4 w-4" />
              </div>
              <span className="truncate text-sm font-medium text-slate-700">
                {credential.fileName}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="mr-1.5 h-3.5 w-3.5" />
              )}
              Open file
            </Button>
          </div>

          {/* REMARK */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Remark{" "}
              <span className="font-normal text-slate-400">
                (required for Issue Found / Rejected)
              </span>
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              placeholder="e.g. Scan is blurred, please upload a clearer copy."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          {/* DECISION BUTTONS */}
          <div className="flex flex-col gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              disabled={busy}
              onClick={() => submit("Rejected")}
            >
              {submitting === "Rejected" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Reject
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
              disabled={busy}
              onClick={() => submit("Issue Found")}
            >
              {submitting === "Issue Found" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Flag Issue
            </Button>

            <Button
              type="button"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={busy}
              onClick={() => submit("Verified")}
            >
              {submitting === "Verified" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-medium text-slate-700">{value}</p>
    </div>
  );
}