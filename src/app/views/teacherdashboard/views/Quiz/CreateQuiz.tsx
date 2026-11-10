import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, useParams   } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
 import { normalizeSemester } from "@/lib/semester";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

import { SessionContext } from "@/contexts/SessionContext";
import { API_BASE_URL, getToken } from "@/lib/api";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

type QuizType = "Test" | "Exam";
type QuestionType = "multiple-choice" | "true-false" | "short-answer";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  type: QuestionType;
  question: string;
  marks: string; // kept as a string so an empty input is allowed while typing
  options: Option[];
  // multiple-choice: the selected option's id
  // true-false: "True" or "False"
  // short-answer: the expected answer text
  correctAnswer: string;
};

type CourseAllocation = {
  _id: string;
  status: string;
  level?: string;
  semester: "First" | "Second" | string;
  course?: {
    _id?: string;
    code?: string;
    title?: string;
  };
  academicSession?: {
    _id?: string;
    name?: string;
  };
};

const createOption = (): Option => ({
  id: crypto.randomUUID(),
  text: "",
});
// Combines the chosen date with a time and returns a UTC ISO string
// (no offset in the string, so the browser reads it as local time)
const toQuizDateTime = (date: string, time: string) => {
  if (!date || !time) return null;
  const value = new Date(`${date}T${time}`);
  return Number.isNaN(value.getTime()) ? null : value.toISOString();
};
const createQuestion = (): Question => ({
  id: crypto.randomUUID(),
  type: "multiple-choice",
  question: "",
  marks: "1",
  options: [createOption(), createOption(), createOption(), createOption()],
  correctAnswer: "",
});

const getCourseLabel = (allocation: CourseAllocation) => {
  const code = allocation.course?.code;
  const title = allocation.course?.title || "Untitled Course";
  return code ? `${code} - ${title}` : title;
};

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */
const pad = (n: number) => String(n).padStart(2, "0");

// Convert a stored UTC ISO string back into the browser's local date and HH:mm
const isoToLocalDate = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const isoToLocalTime = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export default function CreateQuiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Optional: /staff/dashboard/quiz/create?allocation=<id> preselects a course
  const requestedAllocationId = searchParams.get("allocation") || "";

  const { currentSession, currentSemester } = useContext(SessionContext);

  const [allocations, setAllocations] = useState<CourseAllocation[]>([]);
  const [loadingAllocations, setLoadingAllocations] = useState(true);
  const [selectedAllocationId, setSelectedAllocationId] =
    useState(requestedAllocationId);

  const [quizType, setQuizType] = useState<QuizType>("Test");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [duration, setDuration] = useState("30");
  const [passMark, setPassMark] = useState("50");
const [quizDate, setQuizDate] = useState("");   // "YYYY-MM-DD"
const [fromTime, setFromTime] = useState("");   // "HH:mm"
const [toTime, setToTime] = useState("");       // "HH:mm"
  const [questions, setQuestions] = useState<Question[]>([createQuestion()]);
  const [saving, setSaving] = useState(false);
const { quizId } = useParams<{ quizId: string }>();
const isEditing = Boolean(quizId);
const [loadingQuiz, setLoadingQuiz] = useState(isEditing);
  /* ----------------------------------------------------------------
   * LOAD THE STAFF MEMBER'S ALLOCATED COURSES
   * ---------------------------------------------------------------- */

  useEffect(() => {
    const loadAllocations = async () => {
      try {
        setLoadingAllocations(true);

        const response = await fetch(`${API_BASE_URL}/course-allocations/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load your courses.");
        }

        setAllocations(Array.isArray(data?.allocations) ? data.allocations : []);
      } catch (error) {
        console.error("Load allocations error:", error);
        toast.error(
          error instanceof Error ? error.message : "Unable to load your courses."
        );
      } finally {
        setLoadingAllocations(false);
      }
    };

    loadAllocations();
  }, []);
useEffect(() => {
  if (!quizId) return;

  const loadQuiz = async () => {
    try {
      setLoadingQuiz(true);

      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data?.message || "Unable to load quiz.");

      const quiz = data.quiz;

      if (quiz.status === "published") {
        toast.error("Unpublish this quiz before editing it.");
        navigate(`/staff/dashboard/quiz/${quizId}`, { replace: true });
        return;
      }

      setSelectedAllocationId(String(quiz.allocation));
      setQuizType(quiz.type || "Test");
      setTitle(quiz.title || "");
      setInstructions(quiz.instructions || "");
      setDuration(String(quiz.duration ?? 30));
      setPassMark(String(quiz.passMark ?? 50));
      setQuizDate(isoToLocalDate(quiz.startDate));
      setFromTime(isoToLocalTime(quiz.startDate));
      setToTime(isoToLocalTime(quiz.endDate));

      setQuestions(
        quiz.questions.map((q: any) => {
          const options: Option[] = (q.options || []).map((o: any) => ({
            id: crypto.randomUUID(),
            text: o.text,
          }));

          // Multiple choice stores the answer text; the form selects by option id
          const correctAnswer =
            q.type === "multiple-choice"
              ? options.find((o) => o.text === q.correctAnswer)?.id || ""
              : q.correctAnswer;

          return {
            id: crypto.randomUUID(),
            type: q.type,
            question: q.question,
            marks: String(q.marks),
            options: q.type === "multiple-choice" ? options : [],
            correctAnswer,
          };
        })
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to load quiz.");
      navigate("/staff/dashboard/quiz/manage", { replace: true });
    } finally {
      setLoadingQuiz(false);
    }
  };

  loadQuiz();
}, [quizId]);
  /* ----------------------------------------------------------------
   * ONLY COURSES IN THE CURRENT SEMESTER CAN GET A QUIZ
   * ---------------------------------------------------------------- */

 
const eligibleAllocations = useMemo(
  () =>
    allocations.filter(
      (a) =>
        a.status === "Active" &&
        normalizeSemester(a.semester) === currentSemester
    ),
  [allocations, currentSemester]
);

  const otherSemesterCount = useMemo(
    () =>
      allocations.filter(
        (allocation) =>
          allocation.status === "Active" &&
          allocation.semester !== currentSemester
      ).length,
    [allocations, currentSemester]
  );

  const selectedAllocation = useMemo(
    () =>
      eligibleAllocations.find(
        (allocation) => allocation._id === selectedAllocationId
      ) || null,
    [eligibleAllocations, selectedAllocationId]
  );

  // Clear a selection that's no longer valid, and auto-pick when there's only one course
  useEffect(() => {
    if (
      selectedAllocationId &&
      !eligibleAllocations.some((a) => a._id === selectedAllocationId)
    ) {
      setSelectedAllocationId("");
      return;
    }

    if (!selectedAllocationId && eligibleAllocations.length === 1) {
      setSelectedAllocationId(eligibleAllocations[0]._id);
    }
  }, [eligibleAllocations, selectedAllocationId]);

  /* ----------------------------------------------------------------
   * QUESTION HELPERS
   * ---------------------------------------------------------------- */

  const patchQuestion = (questionId: string, patch: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, ...patch } : q))
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length === 1) {
      toast.error("A quiz must contain at least one question.");
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const changeQuestionType = (questionId: string, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;

        if (type === "multiple-choice") {
          return {
            ...q,
            type,
            options:
              q.options.length >= 2
                ? q.options
                : [createOption(), createOption(), createOption(), createOption()],
            correctAnswer: "",
          };
        }

        return { ...q, type, options: [], correctAnswer: "" };
      })
    );
  };

  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;
    patchQuestion(questionId, { options: [...question.options, createOption()] });
  };

  const removeOption = (questionId: string, optionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.options.length <= 2) {
      toast.error("Multiple choice questions need at least 2 options.");
      return;
    }

    patchQuestion(questionId, {
      options: question.options.filter((o) => o.id !== optionId),
      correctAnswer:
        question.correctAnswer === optionId ? "" : question.correctAnswer,
    });
  };

  const updateOptionText = (questionId: string, optionId: string, text: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    patchQuestion(questionId, {
      options: question.options.map((o) =>
        o.id === optionId ? { ...o, text } : o
      ),
    });
  };

  /* ----------------------------------------------------------------
   * VALIDATION (returns the first error message, or null)
   * ---------------------------------------------------------------- */

  const validate = (): string | null => {
    if (!selectedAllocation) return "Select the course this quiz is for.";
    if (!title.trim()) return "Enter a quiz title.";

    const durationValue = Number(duration);
    if (!Number.isFinite(durationValue) || durationValue <= 0) {
      return "Enter a valid duration in minutes.";
    }

    const passValue = Number(passMark);
    if (!Number.isFinite(passValue) || passValue < 0 || passValue > 100) {
      return "Pass mark must be between 0 and 100.";
    }

if (!quizDate) return "Select the date of the quiz.";
if (!fromTime || !toTime) return "Set both the From and To times.";

const opens = new Date(`${quizDate}T${fromTime}`);
const closes = new Date(`${quizDate}T${toTime}`);

if (closes <= opens) {
  return "The To time must be after the From time.";
}

const windowMinutes = (closes.getTime() - opens.getTime()) / 60000;
if (windowMinutes < Number(duration)) {
  return `The time window (${windowMinutes} min) must be at least as long as the duration (${duration} min).`;
}

    if (questions.length === 0) return "Add at least one question.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const n = i + 1;

      if (!q.question.trim()) return `Question ${n} cannot be empty.`;

      const marks = Number(q.marks);
      if (!Number.isFinite(marks) || marks <= 0) {
        return `Question ${n} needs marks greater than 0.`;
      }

      if (q.type === "multiple-choice") {
        if (q.options.length < 2) return `Question ${n} needs at least 2 options.`;
        if (q.options.some((o) => !o.text.trim())) {
          return `Complete all options in question ${n}.`;
        }

        const texts = q.options.map((o) => o.text.trim().toLowerCase());
        if (new Set(texts).size !== texts.length) {
          return `The options in question ${n} must be different.`;
        }

        if (!q.correctAnswer) {
          return `Select the correct answer for question ${n}.`;
        }
      } else if (q.type === "true-false") {
        if (!["True", "False"].includes(q.correctAnswer)) {
          return `Select True or False for question ${n}.`;
        }
      } else if (!q.correctAnswer.trim()) {
        return `Enter the expected answer for question ${n}.`;
      }
    }

    return null;
  };

  /* ----------------------------------------------------------------
   * PAYLOAD (no semester: the server reads it from the session)
   * ---------------------------------------------------------------- */

  const buildPayload = (status: "draft" | "published") => ({
    allocationId: selectedAllocationId,
    title: title.trim(),
    instructions: instructions.trim(),
    type: quizType,
    duration: Number(duration),
    passMark: Number(passMark),
    startDate: toQuizDateTime(quizDate, fromTime),
endDate: toQuizDateTime(quizDate, toTime),
    status,

    questions: questions.map((q) => {
      if (q.type === "multiple-choice") {
        const correctText =
          q.options.find((o) => o.id === q.correctAnswer)?.text.trim() || "";

        return {
          type: q.type,
          question: q.question.trim(),
          marks: Number(q.marks),
          options: q.options.map((o) => ({ text: o.text.trim() })),
          correctAnswer: correctText,
        };
      }

      return {
        type: q.type,
        question: q.question.trim(),
        marks: Number(q.marks),
        options: [],
        correctAnswer: q.correctAnswer.trim(),
      };
    }),
  });

  /* ----------------------------------------------------------------
   * SAVE
   * ---------------------------------------------------------------- */

  const submitQuiz = async (status: "draft" | "published") => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(buildPayload(status)),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to save quiz.");
      }

      toast.success(
        status === "published" ? "Quiz published." : "Quiz saved as draft."
      );

      navigate("/staff/dashboard/quiz/manage");
    } catch (error) {
      console.error("Create quiz error:", error);
      toast.error(error instanceof Error ? error.message : "Unable to save quiz.");
    } finally {
      setSaving(false);
    }
  };

  const totalMarks = questions.reduce(
    (total, q) => total + (Number(q.marks) || 0),
    0
  );

  const canSubmit = Boolean(selectedAllocation) && !saving;

  /* ----------------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Create Quiz</h1>
                <Badge variant="secondary">{quizType}</Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {selectedAllocation
                  ? `For ${getCourseLabel(selectedAllocation)}`
                  : "Select a course to begin"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={!canSubmit}
              onClick={() => submitQuiz("draft")}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              disabled={!canSubmit}
              onClick={() => submitQuiz("published")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Publish Quiz
            </Button>
          </div>
        </div>

        {/* COURSE AND SESSION */}
        <Card>
          <CardHeader>
            <CardTitle>Course and Session</CardTitle>
            <CardDescription>
              Quizzes are saved to the current semester of the active session.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {loadingAllocations ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-[#006dcc]" />
                Loading your courses...
              </div>
            ) : eligibleAllocations.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
                <p className="font-medium">
                  No courses available for {currentSemester} Semester
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {otherSemesterCount > 0
                    ? `You have ${otherSemesterCount} course(s) in the other semester. Quizzes can only be created for the current semester.`
                    : "Courses assigned to you by the administrator will appear here."}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Course</Label>
                  <Select
                    value={selectedAllocationId || undefined}
                    onValueChange={setSelectedAllocationId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleAllocations.map((allocation) => (
                        <SelectItem key={allocation._id} value={allocation._id}>
                          {getCourseLabel(allocation)}
                          {allocation.level ? ` (${allocation.level})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Current Semester</Label>
                  <div className="flex h-10 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm font-medium">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {currentSemester} Semester
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span>Session:</span>
              <Badge variant="outline">{currentSession?.name || "Not available"}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* QUIZ INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
            <CardDescription>
              What students will see before they start.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="quiz-title">Title</Label>
                <Input
                  id="quiz-title"
                  placeholder="e.g. Digital Electronics Test 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={quizType}
                  onValueChange={(value) => setQuizType(value as QuizType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Test">Test</SelectItem>
                    <SelectItem value="Exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Instructions students should read before starting..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>
<div className="grid gap-5 md:grid-cols-2">
  <div className="space-y-2">
    <Label>Duration (minutes)</Label>
    <div className="relative">
      <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="number"
        min="1"
        className="h-11 pl-9"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
    </div>
  </div>

  <div className="space-y-2">
    <Label>Pass Mark (%)</Label>
    <Input
      type="number"
      min="0"
      max="100"
      className="h-11"
      value={passMark}
      onChange={(e) => setPassMark(e.target.value)}
    />
  </div>
</div>

<div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
  <div className="min-w-0 space-y-2">
    <Label htmlFor="quiz-date">Quiz Date</Label>
    <Input
      id="quiz-date"
      type="date"
      className="h-11 w-full"
      value={quizDate}
      onChange={(e) => setQuizDate(e.target.value)}
    />
  </div>

  <div className="min-w-0 space-y-2">
    <Label htmlFor="quiz-from">From</Label>
    <div className="relative">
      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="quiz-from"
        type="time"
        lang="en-US"
        className="h-11 w-full pl-9"
        value={fromTime}
        onChange={(e) => setFromTime(e.target.value)}
      />
    </div>
  </div>

  <div className="min-w-0 space-y-2">
    <Label htmlFor="quiz-to">To</Label>
    <div className="relative">
      <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        id="quiz-to"
        type="time"
        lang="en-US"
        className="h-11 w-full pl-9"
        value={toTime}
        onChange={(e) => setToTime(e.target.value)}
      />
    </div>
  </div>
</div>
          </CardContent>
        </Card>

        {/* SUMMARY */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileQuestion className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="text-2xl font-bold">{totalMarks}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-3 p-5">
              <div className="rounded-lg bg-orange-100 p-2">
                <Clock3 className="h-5 w-5 text-orange-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{duration || 0} min</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Questions</h2>
              <p className="text-sm text-muted-foreground">
                Add questions and set the correct answers.
              </p>
            </div>

            <Button variant="outline" onClick={addQuestion}>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>

          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#006dcc] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <CardTitle className="text-base">Question {index + 1}</CardTitle>
                      <CardDescription>
                        Choose the type, then provide the answer.
                      </CardDescription>
                    </div>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Question</Label>
                    <Textarea
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) =>
                        patchQuestion(question.id, { question: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          changeQuestionType(question.id, value as QuestionType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True / False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Marks</Label>
                      <Input
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(e) =>
                          patchQuestion(question.id, { marks: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {question.type === "multiple-choice" && (
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Answer Options</h3>
                        <p className="text-xs text-muted-foreground">
                          Select the radio button beside the correct answer.
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addOption(question.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>
                    </div>

                    <RadioGroup
                      value={question.correctAnswer}
                      onValueChange={(value) =>
                        patchQuestion(question.id, { correctAnswer: value })
                      }
                      className="space-y-3"
                    >
                      {question.options.map((option, optionIndex) => {
                        const letter = String.fromCharCode(65 + optionIndex);
                        return (
                          <div key={option.id} className="flex items-center gap-3">
                            <RadioGroupItem value={option.id} id={option.id} />

                            <Label htmlFor={option.id} className="w-7 text-sm font-medium">
                              {letter}
                            </Label>

                            <Input
                              className="flex-1"
                              placeholder={`Option ${letter}`}
                              value={option.text}
                              onChange={(e) =>
                                updateOptionText(question.id, option.id, e.target.value)
                              }
                            />

                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="text-red-500"
                              onClick={() => removeOption(question.id, option.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </div>
                )}

                {question.type === "true-false" && (
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <Label className="mb-4 block">Correct Answer</Label>

                    <RadioGroup
                      value={question.correctAnswer}
                      onValueChange={(value) =>
                        patchQuestion(question.id, { correctAnswer: value })
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="True" id={`${question.id}-true`} />
                        <Label htmlFor={`${question.id}-true`}>True</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="False" id={`${question.id}-false`} />
                        <Label htmlFor={`${question.id}-false`}>False</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {question.type === "short-answer" && (
                  <div className="rounded-lg border bg-muted/20 p-4">
                    <Label className="mb-2 block">Expected Answer</Label>
                    <Input
                      placeholder="Enter the expected answer..."
                      value={question.correctAnswer}
                      onChange={(e) =>
                        patchQuestion(question.id, { correctAnswer: e.target.value })
                      }
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Short answers are matched against this text when grading.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center">
            <Button variant="outline" onClick={addQuestion} className="min-w-[200px]">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Question
            </Button>
          </div>
        </div>

        {/* BOTTOM ACTIONS */}
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Ready to save this quiz?</p>
              <p className="text-sm text-muted-foreground">
                Save it as a draft or publish it for students.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={!canSubmit}
                onClick={() => submitQuiz("draft")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>

              <Button
                className="bg-[#006dcc] hover:bg-[#005ca8]"
                disabled={!canSubmit}
                onClick={() => submitQuiz("published")}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Publish Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}