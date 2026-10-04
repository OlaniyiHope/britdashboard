import { useEffect, useState } from "react";
import { Download, Loader2, X } from "lucide-react";

import { courseLabel, errorMessage, formatDate } from "@/lib/assignments";
import {
  StudentStatusBadge,
  openAssignmentFile,
  submitAssignment,
  type StudentAssignment,
} from "@/lib/studentAssignments";

interface Props {
  assignment: StudentAssignment | null;
  onClose: () => void;
  onUpdated: (a: StudentAssignment) => void;
}

export default function AssignmentDialog({ assignment, onClose, onUpdated }: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setText(assignment?.submission?.text || "");
    setFile(null);
    setError("");
  }, [assignment?._id]);

  useEffect(() => {
    if (!assignment) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [assignment, onClose]);

  if (!assignment) return null;
  const a = assignment;
  const sub = a.submission;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await openAssignmentFile(a._id);
    } catch (err) {
      setError(errorMessage(err, "Could not open the file"));
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !file) {
      setError("Add an answer or attach a file before submitting.");
      return;
    }
    try {
      setSubmitting(true);
      setError("");
      const form = new FormData();
      form.append("text", text.trim());
      if (file) form.append("file", file);
      const data = await submitAssignment(a._id, form);
      onUpdated(data.assignment);
      setFile(null);
    } catch (err) {
      setError(errorMessage(err, "Submission failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{a.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{courseLabel(a.course)}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-500 hover:text-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-4 text-sm text-slate-700">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <Info label="Lecturer" value={a.lecturer || "—"} />
            <Info label="Marks" value={String(a.maxMarks)} />
            <Info label="Due" value={formatDate(a.dueDate)} />
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="mt-1">
                <StudentStatusBadge status={a.studentStatus} />
              </dd>
            </div>
          </dl>

          {a.description && (
            <div>
              <h4 className="mb-1 text-xs font-bold text-slate-800">Instructions</h4>
              <p className="whitespace-pre-wrap text-slate-600">{a.description}</p>
            </div>
          )}

          {a.hasAttachment && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-xs hover:border-[#081022] disabled:opacity-50"
            >
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download assignment file
            </button>
          )}

          {sub?.status === "Graded" && (
            <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="font-semibold text-blue-800">
                Score: {sub.score}/{a.maxMarks}
              </p>
              {sub.feedback && <p className="mt-1 text-slate-700">{sub.feedback}</p>}
            </div>
          )}

          {sub && (
            <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-xs">
              <p className="font-semibold text-slate-800">Your submission</p>
              <p className="mt-1 text-slate-500">Submitted {formatDate(sub.submittedAt)}</p>
              {sub.fileName && <p className="mt-1 text-slate-600">File: {sub.fileName}</p>}
            </div>
          )}

          {a.canSubmit && sub?.status !== "Graded" && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">{sub ? "Update your submission" : "Your answer"}</h4>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={5}
                placeholder="Type your answer (optional if you attach a file)"
                className="w-full rounded border border-slate-300 p-3 text-sm outline-none focus:border-[#081022]"
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:rounded file:border file:border-slate-300 file:bg-white file:px-3 file:py-1.5 file:text-xs"
              />
            </div>
          )}

          {!a.canSubmit && !sub && (
            <p className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              Submissions are closed for this assignment.
            </p>
          )}

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 px-4 py-2 text-xs text-slate-700 hover:border-[#081022]"
          >
            Close
          </button>
          {a.canSubmit && sub?.status !== "Graded" && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded border border-[#081022] bg-[#081022] px-4 py-2 text-xs font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {sub ? "Save changes" : "Submit assignment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-800">{value}</dd>
    </div>
  );
}