import { api } from "@/lib/assignments";

export type StudentStatus = "Available" | "Submitted" | "Graded" | "Overdue" | "Closed";

export interface StudentSubmission {
  status: "Submitted" | "Graded";
  text?: string;
  fileName?: string;
  submittedAt: string;
  score?: number;
  feedback?: string;
}

export interface StudentAssignment {
  _id: string;
  title: string;
  description?: string;
  lecturer: string;
  course?: { _id: string; code?: string; title?: string } | null;
  maxMarks: number;
  dueDate?: string; // empty/undefined => "No due date" (via formatDate)
  createdAt: string;
  hasAttachment: boolean;
  canSubmit: boolean;
  studentStatus: StudentStatus;
  submission?: StudentSubmission | null;
}

const BADGE: Record<StudentStatus, string> = {
  Available: "border-green-300 bg-green-50 text-green-700",
  Submitted: "border-green-600 bg-green-600 text-white",
  Graded: "border-blue-600 bg-blue-600 text-white",
  Overdue: "border-red-300 bg-red-50 text-red-700",
  Closed: "border-slate-300 bg-slate-100 text-slate-600",
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <span
      className={`rounded-sm border px-2 py-1 text-[10px] font-medium ${BADGE[status] || BADGE.Closed}`}
    >
      {status}
    </span>
  );
}

export function actionLabel(a: StudentAssignment) {
  if (a.submission?.status === "Graded") return "View grade";
  if (a.submission) return a.canSubmit ? "Resubmit" : "View";
  return a.canSubmit ? "Submit" : "View";
}

/** Same presigned-S3 flow as the lecturer side, but on the student route. */
export async function openAssignmentFile(id: string) {
  const data = await api<{ url: string }>(`/assignments/student/${id}/attachment`);
  window.location.assign(data.url);
}

export const submitAssignment = (id: string, form: FormData) =>
  api<{ assignment: StudentAssignment }>(`/assignments/student/${id}/submit`, {
    method: "POST",
    body: form,
  });