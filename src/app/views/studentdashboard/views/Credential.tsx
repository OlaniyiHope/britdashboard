import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, FileText, Loader2, RefreshCw, Search, Trash2, Upload } from "lucide-react";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

type CredentialStatus = "Pending Verification" | "Verified" | "Rejected" | "Issue Found";

interface Credential {
  _id: string;
  application: string;
  credentialType: string;
  examYear?: string;
  examNumber?: string;
  fileName: string;
  status: CredentialStatus;
  remark?: string;
  createdAt: string;
}

interface Application {
  _id: string;
  applicationNumber: string;
  status: "Pending" | "Submitted" | "Approved" | "Rejected";
  programme?: { name?: string; programmeName?: string; title?: string };
}

const CREDENTIAL_TYPES = [
  "WASSCE",
  "NECO",
  "NABTEC",
  "JAMB Result",
  "Birth Certificate",
  "State of Origin",
  "Passport Photograph",
  "Other",
];

const EXAM_TYPES = ["WASSCE", "NECO", "NABTEC", "JAMB Result"];
const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024;

const statusClasses: Record<CredentialStatus, string> = {
  "Pending Verification": "border-amber-300 bg-amber-50 text-amber-700",
  Verified: "border-green-600 bg-green-600 text-white",
  Rejected: "border-red-300 bg-red-50 text-red-700",
  "Issue Found": "border-orange-300 bg-orange-50 text-orange-700",
};

/* ------------------------------------------------------------------ */
/* API                                                                 */
/* ------------------------------------------------------------------ */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("jwtToken");
  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  // Do NOT set Content-Type for FormData; the browser adds the boundary.

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed (${response.status})`);
  }
  return data as T;
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function Credentials() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicationId, setApplicationId] = useState("");
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  // upload form
  const [credentialType, setCredentialType] = useState(CREDENTIAL_TYPES[0]);
  const [examYear, setExamYear] = useState("");
  const [examNumber, setExamNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // resubmit
  const resubmitInputRef = useRef<HTMLInputElement>(null);
  const [resubmitId, setResubmitId] = useState<string | null>(null);

  const selectedApplication = applications.find((a) => a._id === applicationId);
  const applicationClosed =
    selectedApplication?.status === "Approved" || selectedApplication?.status === "Rejected";

  /* ---------------------------- LOADERS ---------------------------- */

  const loadCredentials = useCallback(async (id: string) => {
    if (!id) {
      setCredentials([]);
      return;
    }
    try {
      const data = await api<{ credentials: Credential[] }>(`/credentials/mine?applicationId=${id}`);
      setCredentials(data.credentials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credentials");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await api<{ applications: Application[] }>("/applications/mine");
        const list = data.applications || [];
        setApplications(list);
        if (list.length > 0) setApplicationId(list[0]._id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applications");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    loadCredentials(applicationId);
  }, [applicationId, loadCredentials]);

  /* ---------------------------- HELPERS ---------------------------- */

  const flash = (type: "error" | "success", message: string) => {
    setError(type === "error" ? message : null);
    setSuccess(type === "success" ? message : null);
  };

  const validateFile = (f: File): string | null => {
    if (!ALLOWED_MIME.includes(f.type)) return "Only PDF, JPG or PNG files are allowed";
    if (f.size > MAX_SIZE) return "File must be 5MB or smaller";
    return null;
  };

  /* ---------------------------- ACTIONS ---------------------------- */

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationId) return flash("error", "Select an application first");
    if (!file) return flash("error", "Choose a file to upload");

    const problem = validateFile(file);
    if (problem) return flash("error", problem);

    const form = new FormData();
    form.append("file", file);
    form.append("applicationId", applicationId);
    form.append("credentialType", credentialType);
    if (EXAM_TYPES.includes(credentialType)) {
      if (examYear) form.append("examYear", examYear);
      if (examNumber) form.append("examNumber", examNumber);
    }

    try {
      setUploading(true);
      await api("/credentials", { method: "POST", body: form });
      flash("success", "Credential uploaded successfully");
      setFile(null);
      setExamYear("");
      setExamNumber("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadCredentials(applicationId);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      setBusyId(id);
      const data = await api<{ url: string }>(`/credentials/${id}/download`);
      window.location.assign(data.url); // presigned URL, downloads without leaving the page
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Download failed");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (credential: Credential) => {
    if (!window.confirm(`Delete "${credential.fileName}"?`)) return;
    try {
      setBusyId(credential._id);
      await api(`/credentials/${credential._id}`, { method: "DELETE" });
      flash("success", "Credential deleted");
      await loadCredentials(applicationId);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const startResubmit = (id: string) => {
    setResubmitId(id);
    resubmitInputRef.current?.click();
  };

  const handleResubmitFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    e.target.value = "";
    if (!chosen || !resubmitId) return;

    const problem = validateFile(chosen);
    if (problem) return flash("error", problem);

    const form = new FormData();
    form.append("file", chosen);

    try {
      setBusyId(resubmitId);
      await api(`/credentials/${resubmitId}/resubmit`, { method: "PUT", body: form });
      flash("success", "Credential resubmitted for verification");
      await loadCredentials(applicationId);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Resubmit failed");
    } finally {
      setBusyId(null);
      setResubmitId(null);
    }
  };

  /* ---------------------------- DERIVED ---------------------------- */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return credentials;
    return credentials.filter(
      (c) =>
        c.credentialType.toLowerCase().includes(q) ||
        c.fileName.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [credentials, search]);

  const programmeName = (a: Application) =>
    a.programme?.name || a.programme?.programmeName || a.programme?.title || "Programme";

  const verifiedCount = credentials.filter((c) => c.status === "Verified").length;
  const needsAttention = credentials.filter(
    (c) => c.status === "Issue Found" || c.status === "Rejected"
  ).length;

  /* ----------------------------- RENDER ---------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#081022]" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-0">
        <h2 className="text-2xl font-semibold text-slate-800">My Credentials</h2>
      </div>

      {/* Breadcrumb */}
      <div className="mt-5 border-y border-slate-200 bg-slate-50 px-4 py-4">
        <div className="text-sm text-slate-700">
          <span>Home</span>
          <span className="mx-3 text-slate-400">/</span>
          <span>Application</span>
          <span className="mx-3 text-slate-400">/</span>
          <span>Credentials</span>
        </div>
      </div>

      <div className="w-full px-1 pt-12">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-slate-800">Credential Submission</h1>
          <p className="mt-1 text-xs text-slate-500">
            Upload your academic documents for verification. Accepted: PDF, JPG, PNG (max 5MB).
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="border border-slate-200 py-12 text-center text-sm text-slate-500">
            You have no application yet. Submit an application before uploading credentials.
          </div>
        ) : (
          <>
            {/* Application selector + summary */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Application</label>
                <select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className="h-10 min-w-[320px] rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#081022]"
                >
                  {applications.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.applicationNumber} · {programmeName(a)} ({a.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-6 text-sm text-slate-600">
                <span>
                  Uploaded: <strong className="text-[#081022]">{credentials.length}</strong>
                </span>
                <span>
                  Verified: <strong className="text-[#081022]">{verifiedCount}</strong>
                </span>
                <span>
                  Needs attention: <strong className="text-[#081022]">{needsAttention}</strong>
                </span>
              </div>
            </div>

            {/* Upload form */}
            <form
              onSubmit={handleUpload}
              className="mb-10 rounded border border-slate-200 bg-white p-5"
            >
              <h3 className="mb-4 text-sm font-bold text-[#081022]">Upload a document</h3>

              {applicationClosed ? (
                <p className="text-sm text-slate-500">
                  This application is already {selectedApplication?.status?.toLowerCase()}, so new
                  documents can't be added.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">Document type</label>
                    <select
                      value={credentialType}
                      onChange={(e) => setCredentialType(e.target.value)}
                      className="h-10 rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#081022]"
                    >
                      {CREDENTIAL_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {EXAM_TYPES.includes(credentialType) && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700">Exam year</label>
                        <input
                          value={examYear}
                          onChange={(e) => setExamYear(e.target.value)}
                          placeholder="e.g. 2025"
                          maxLength={4}
                          className="h-10 rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#081022]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-slate-700">Exam number</label>
                        <input
                          value={examNumber}
                          onChange={(e) => setExamNumber(e.target.value)}
                          placeholder="Examination number"
                          className="h-10 rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#081022]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-slate-700">File</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="h-10 rounded border border-slate-300 px-2 py-1.5 text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1 file:text-xs"
                    />
                  </div>
                </div>
              )}

              {!applicationClosed && (
                <div className="mt-5 flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading || !file}
                    className="inline-flex h-10 items-center gap-2 rounded bg-[#081022] px-5 text-sm font-medium text-white transition hover:bg-[#111c32] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )}
            </form>

            {/* Search */}
            <div className="mb-6 flex items-center justify-end gap-2">
              <label className="text-sm text-slate-700">Search:</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-[220px] border-b border-slate-400 bg-transparent px-2 pr-8 text-sm outline-none focus:border-[#081022]"
                />
                <Search className="absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[1050px] border-t border-slate-300">
                <div className="grid grid-cols-[190px_280px_150px_160px_270px] border-b border-slate-300 bg-white">
                  <TableHeader title="Document" />
                  <TableHeader title="File" />
                  <TableHeader title="Submitted" />
                  <TableHeader title="Status" />
                  <TableHeader title="Actions" />
                </div>

                {filtered.map((c) => {
                  const canReplace = c.status === "Issue Found" || c.status === "Rejected";
                  const canDelete = c.status !== "Verified";
                  const busy = busyId === c._id;

                  return (
                    <div
                      key={c._id}
                      className="grid min-h-[66px] grid-cols-[190px_280px_150px_160px_270px] border-b border-slate-200 bg-white text-sm hover:bg-slate-50"
                    >
                      {/* Document */}
                      <div className="flex flex-col justify-center px-4">
                        <span className="font-medium text-slate-700">{c.credentialType}</span>
                        {(c.examYear || c.examNumber) && (
                          <span className="text-xs text-slate-400">
                            {[c.examYear, c.examNumber].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </div>

                      {/* File */}
                      <div className="flex items-center gap-2 px-3 text-slate-600">
                        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate" title={c.fileName}>
                          {c.fileName}
                        </span>
                      </div>

                      {/* Submitted */}
                      <div className="flex items-center px-3 text-slate-600">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>

                      {/* Status + remark */}
                      <div className="flex flex-col justify-center gap-1 px-2 py-2">
                        <span
                          className={`w-fit rounded-sm border px-2 py-1 text-[10px] font-medium ${statusClasses[c.status]}`}
                        >
                          {c.status}
                        </span>
                        {c.remark && (
                          <span className="text-[11px] leading-4 text-slate-500">{c.remark}</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 px-3">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDownload(c._id)}
                          title="Download"
                          className="inline-flex h-8 items-center gap-1.5 rounded border border-slate-300 px-2.5 text-xs text-slate-600 hover:border-[#081022] hover:text-[#081022] disabled:opacity-50"
                        >
                          {busy ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          Download
                        </button>

                        {canReplace && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => startResubmit(c._id)}
                            title="Upload a corrected file"
                            className="inline-flex h-8 items-center gap-1.5 rounded border border-orange-300 px-2.5 text-xs text-orange-700 hover:bg-orange-50 disabled:opacity-50"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Replace
                          </button>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDelete(c)}
                            title="Delete"
                            className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-300 text-slate-500 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="border-b border-slate-200 py-12 text-center text-sm text-slate-500">
                    No credentials uploaded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 text-xs text-slate-500">
              Showing {filtered.length} of {credentials.length} entries
            </div>
          </>
        )}
      </div>

      {/* Hidden input used by "Replace" */}
      <input
        ref={resubmitInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleResubmitFile}
      />
    </div>
  );
}

/* Table Header Component */
function TableHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center border-r border-slate-200 px-3 py-4 last:border-r-0">
      <span className="text-xs font-bold text-slate-800">{title}</span>
    </div>
  );
}