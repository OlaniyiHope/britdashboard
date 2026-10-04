import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export type AssignmentStatus = "draft" | "published" | "closed";

export type Assignment = {
  _id: string;
  allocation: string;
  title: string;
  description?: string;
  dueDate: string;
  maxMarks: number;
  status: AssignmentStatus;
  level?: string;
  semester?: string;
  createdAt: string;
  course?: { _id: string; code?: string; title?: string } | null;
  programme?: { name?: string; code?: string } | null;
  academicSession?: { name?: string } | null;
  hasAttachment: boolean;
  attachment?: { fileName: string; mimeType?: string; size?: number };
  submissionCount?: number; // filled in once students can submit
};

export type AllocationOption = {
  _id: string;
  level?: string;
  semester?: string;
  course?: { _id: string; code?: string; title?: string } | null;
  programme?: { name?: string; code?: string } | null;
  academicSession?: { name?: string } | null;
};

export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("jwtToken");
  const headers = new Headers(options.headers || {});
  // For FormData the browser sets the multipart boundary itself
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  }
  return data as T;
}

export const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export const courseLabel = (c?: { code?: string; title?: string } | null) =>
  c ? `${c.code || ""}${c.code && c.title ? " — " : ""}${c.title || ""}` : "Unknown course";

export const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "No due date";

export const formatFileSize = (bytes?: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ISO string -> value for <input type="datetime-local">
export const toLocalInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export async function openAttachment(id: string) {
  const data = await api<{ url: string }>(`/assignments/${id}/attachment`);
  window.location.assign(data.url); // short-lived presigned S3 link
}

export function StatusBadge({ status }: { status: AssignmentStatus }) {
  if (status === "published")
    return (
      <Badge className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Published
      </Badge>
    );
  if (status === "draft")
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Draft
      </Badge>
    );
  return (
    <Badge variant="outline" className="gap-1">
      <XCircle className="h-3 w-3" />
      Closed
    </Badge>
  );
}