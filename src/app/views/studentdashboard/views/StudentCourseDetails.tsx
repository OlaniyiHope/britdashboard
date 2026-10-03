import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

type Course = {
  _id: string;
  code: string;
  title: string;
  credits?: number;
  level?: string;
  semester?: string;
};

type Material = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
  uploadedBy?: {
    firstName?: string;
    lastName?: string;
    name?: string;
    username?: string;
  } | null;
};

const getToken = () => localStorage.getItem("jwtToken") || "";

const formatSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const lecturerName = (m: Material) => {
  const u = m.uploadedBy;
  if (!u) return "";
  return (
    `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
    u.name ||
    u.username ||
    ""
  );
};

const FileIcon = ({ material }: { material: Material }) => {
  const type = (material.mimeType || material.originalName || "").toLowerCase();
  if (type.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
  if (type.includes("image") || /\.(jpg|jpeg|png)$/.test(type))
    return <FileImage className="h-5 w-5 text-blue-500" />;
  if (type.includes("video") || /\.mp4$/.test(type))
    return <FileVideo className="h-5 w-5 text-purple-500" />;
  if (type.includes("zip") || /\.zip$/.test(type))
    return <FileArchive className="h-5 w-5 text-yellow-600" />;
  if (type.includes("word") || /\.(doc|docx)$/.test(type))
    return <FileText className="h-5 w-5 text-blue-600" />;
  return <File className="h-5 w-5 text-slate-400" />;
};

export default function StudentCourseDetails() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/course-materials/course/${courseId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok)
        throw new Error(data?.message || `Request failed (${response.status})`);

      setCourse(data.course || null);
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course materials");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDownload = async (material: Material) => {
    try {
      setDownloadingId(material._id);

      const response = await fetch(
        `${API_BASE_URL}/api/course-materials/student/${material._id}/download`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok)
        throw new Error(data?.message || `Request failed (${response.status})`);

      window.location.assign(data.url); // short-lived presigned S3 link
    } catch (err) {
      alert(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(materials.map((m) => m.category || "Other")))],
    [materials]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return materials.filter((m) => {
      const matchesCategory = category === "All" || (m.category || "Other") === category;
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q) ||
        (m.originalName || "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [materials, search, category]);

  return (
    <div className="space-y-4">
      <Link
        to="/student/dashboard/my-courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#081022]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Courses
      </Link>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#081022]" />
        </div>
      ) : error ? (
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="py-14 text-center">
            <p className="text-sm font-semibold text-rose-600">{error}</p>
            <Link
              to="/student/dashboard/my-courses"
              className="mt-4 inline-block rounded-md bg-[#081022] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Go to My Courses
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Course header */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="flex items-center gap-4 p-5 md:p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#081022]">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  {course?.code}
                </p>
                <h1 className="truncate text-xl font-bold text-[#081022] md:text-2xl">
                  {course?.title}
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  {[
                    course?.credits != null &&
                      `${course.credits} ${course.credits === 1 ? "unit" : "units"}`,
                    course?.level,
                    course?.semester,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Materials */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="space-y-4 p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-sm font-bold text-slate-800">
                  Course Materials ({filtered.length})
                </h3>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search materials..."
                    className="h-9 w-full rounded-md border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#081022] md:w-[240px]"
                  />
                </div>
              </div>

              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                        category === c
                          ? "border-[#081022] bg-[#081022] text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">
                    {materials.length === 0
                      ? "No materials have been uploaded yet"
                      : "No materials match your search"}
                  </p>
                  {materials.length === 0 && (
                    <p className="mt-1 text-xs text-slate-400">
                      Your lecturer's notes and resources will appear here.
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filtered.map((m) => (
                    <div key={m._id} className="flex items-center gap-4 py-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                        <FileIcon material={m} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#081022]">
                          {m.title}
                        </p>
                        {m.description && (
                          <p className="truncate text-xs text-slate-500">
                            {m.description}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {[
                            m.category || "Other",
                            formatSize(m.size),
                            formatDate(m.createdAt),
                            lecturerName(m) && `by ${lecturerName(m)}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownload(m)}
                        disabled={downloadingId === m._id}
                        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-slate-300 px-3 text-xs font-medium text-slate-700 transition hover:border-[#081022] hover:text-[#081022] disabled:opacity-50"
                      >
                        {downloadingId === m._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}