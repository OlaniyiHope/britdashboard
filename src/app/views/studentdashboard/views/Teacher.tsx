import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { SessionContext } from "@/contexts/SessionContext";
import { Mail, Phone, User } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type Learner = {
  _id?: string;
  name: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
};

type CourseInfo = {
  code: string;
  title: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Fallback/mock data — swap out once the real course/learners endpoints
// exist. Names below are placeholders, not real students.
// ─────────────────────────────────────────────────────────────────────────

const fallbackCourse: CourseInfo = {
  code: "COSC 101",
  title: "Introduction to Computing",
};

const fallbackLearners: Learner[] = [
  { name: "Amara Nwosu", phone: "08061234567", email: "amara.nwosu@example.com" } as Learner,
  { name: "Joshua Bello", phone: "08023456789", email: "joshua.bello@example.com" } as Learner,
  { name: "Danladi Stephen", phone: "08034567890", email: "danladi.stephen@example.com" } as Learner,
  { name: "Esther David", phone: "08045678901", email: "esther.david@example.com" } as Learner,
  { name: "Ogechukwu Nnamdi", phone: "08056789012", email: "ogechukwu.n@example.com" } as Learner,
  { name: "Abdullahi Rafiu", phone: "08067890123", email: "abdullahi.rafiu@example.com" } as Learner,
  { name: "Akilu Nura", phone: "08078901234", email: "akilu.nura@example.com" } as Learner,
  { name: "Yetunde Adekunle", phone: "08089012345", email: "yetunde.adekunle@example.com" } as Learner,
  { name: "Kpeikaan Yandang", phone: "08090123456", email: "kpeikaan.yandang@example.com" } as Learner,
  { name: "Muhammad Bashir", phone: "08001234567", email: "muhammad.bashir@example.com" } as Learner,
  { name: "Adeola Olushola", phone: "08012340987", email: "adeola.olushola@example.com" } as Learner,
  { name: "Mariam Asimiyu", phone: "08023450987", email: "mariam.asimiyu@example.com" } as Learner,
];

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function LearnersList() {
  const { courseSlug } = useParams();
  const { currentSession } = useContext(SessionContext);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: courseData, loading: courseLoading } = useFetch(
    currentSession?._id && courseSlug
      ? `/course/${courseSlug}/${currentSession._id}`
      : null
  );
  const course: CourseInfo =
    courseData && typeof courseData === "object"
      ? (courseData as CourseInfo)
      : fallbackCourse;

  const { data: learnersData, loading: learnersLoading } = useFetch(
    currentSession?._id && courseSlug
      ? `/course/${courseSlug}/${currentSession._id}/learners`
      : null
  );
  const learners: Learner[] =
    Array.isArray(learnersData) && learnersData.length > 0
      ? (learnersData as Learner[])
      : fallbackLearners;

  const selectedLearner = useMemo(() => {
    if (learners.length === 0) return null;
    if (!selectedId) return learners[0];
    return learners.find((l) => (l._id || l.name) === selectedId) || learners[0];
  }, [learners, selectedId]);

  const loading = courseLoading || learnersLoading;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Learners List</h2>
      <p className="text-sm text-slate-500">
        Home <span className="mx-1">/</span>
        <span className="font-medium text-slate-600">{course.code}</span>
        <span className="mx-1">/</span>
        <span className="font-medium text-slate-600">Learners</span>
      </p>

      {/* Info banner */}
      <Card className="border-none bg-slate-100 shadow-none ring-1 ring-slate-200">
        <CardContent className="p-4 text-sm text-slate-700">
          <span className="font-bold text-slate-800">
            {course.title} ({course.code})
          </span>{" "}
          Learners are listed below
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        {/* Learner grid */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="space-y-4 p-5 md:p-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Learner's List</h3>
              <p className="text-xs text-slate-500">
                {loading
                  ? "Loading learners…"
                  : `${learners.length} Learner${learners.length !== 1 ? "s" : ""} is/are currently grouped in this course`}
              </p>
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-slate-500">
                Loading learners…
              </p>
            ) : learners.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">
                No learners are grouped in this course yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {learners.map((learner) => {
                  const id = learner._id || learner.name;
                  const isSelected = selectedLearner && (selectedLearner._id || selectedLearner.name) === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedId(id)}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-[#004aaa] bg-blue-50 text-[#004aaa]"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                        <User className="h-4 w-4" />
                      </span>
                      <span className="truncate">{learner.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Selected learner profile */}
        <Card className="h-fit border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="space-y-3 p-5 text-center">
            {selectedLearner ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-500">
                  <User className="h-8 w-8" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {selectedLearner.name}
                </p>
                <div className="space-y-1.5 text-left text-xs text-slate-600">
                  {selectedLearner.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {selectedLearner.phone}
                    </p>
                  )}
                  {selectedLearner.email && (
                    <p className="flex items-center gap-2 break-all">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      {selectedLearner.email}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="py-6 text-sm text-slate-400">
                Select a learner to see their details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
