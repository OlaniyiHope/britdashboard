import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { API_BASE_URL, getToken } from "@/lib/api";

type QuizQuestion = {
  questionNumber: number;
  type: "multiple-choice" | "true-false" | "short-answer";
  question: string;
  marks: number;
  options: { text: string }[];
  correctAnswer: string;
};

type QuizDetail = {
  _id: string;
  title: string;
  instructions?: string;
  type: "Test" | "Exam";
  duration: number;
  passMark: number;
  totalMarks: number;
  status: "draft" | "published";
  semester: "First" | "Second";
  startDate?: string | null;
  endDate?: string | null;
  course?: { code?: string; title?: string };
  questions: QuizQuestion[];
};

const TYPE_LABEL: Record<QuizQuestion["type"], string> = {
  "multiple-choice": "Multiple Choice",
  "true-false": "True / False",
  "short-answer": "Short Answer",
};

const formatWhen = (iso?: string | null) => {
  if (!iso) return "Not set";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function QuizDetails() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!quizId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load this quiz.");
        }

        setQuiz(data.quiz);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load this quiz.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [quizId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex min-h-[250px] flex-col items-center justify-center gap-4">
            <p className="text-sm text-muted-foreground">
              {error || "Quiz not found."}
            </p>
            <Button variant="outline" onClick={() => navigate("/staff/dashboard/quiz/manage")}>
              Back to Manage Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPublished = quiz.status === "published";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/staff/dashboard/quiz/manage")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
              <Badge variant="secondary">{quiz.type}</Badge>
              <Badge variant={isPublished ? "default" : "outline"}>
                {isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {quiz.course?.code ? `${quiz.course.code} - ` : ""}
              {quiz.course?.title || "Course"} · {quiz.semester} Semester
            </p>
          </div>
        </div>

        <Button
          className="bg-[#006dcc] hover:bg-[#005ca8]"
          disabled={isPublished}
          title={isPublished ? "Unpublish this quiz before editing" : "Edit quiz"}
          onClick={() => navigate(`/staff/dashboard/quiz/${quiz._id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Quiz
        </Button>
      </div>

      {/* DETAILS */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>What students see before they start.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Duration" value={`${quiz.duration} mins`} />
            <Info label="Pass Mark" value={`${quiz.passMark}%`} />
            <Info label="Total Marks" value={String(quiz.totalMarks)} />
            <Info label="Questions" value={String(quiz.questions.length)} />
            <Info label="Opens" value={formatWhen(quiz.startDate)} />
            <Info label="Closes" value={formatWhen(quiz.endDate)} />
          </div>

          {quiz.instructions && (
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <p className="mb-1 font-medium">Instructions</p>
              <p className="whitespace-pre-line text-muted-foreground">{quiz.instructions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUESTIONS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Questions</h2>

        {quiz.questions.map((q, index) => (
          <Card key={index}>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base">
                  Question {q.questionNumber || index + 1}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{TYPE_LABEL[q.type]}</Badge>
                  <Badge variant="secondary">{q.marks} mark{q.marks === 1 ? "" : "s"}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              <p className="font-medium">{q.question}</p>

              {q.type === "multiple-choice" && (
                <ul className="space-y-2">
                  {q.options.map((option, i) => {
                    const isCorrect = option.text === q.correctAnswer;
                    return (
                      <li
                        key={i}
                        className={`rounded-md border px-3 py-2 text-sm ${
                          isCorrect ? "border-green-300 bg-green-50 text-green-800" : ""
                        }`}
                      >
                        <span className="mr-2 font-semibold">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {option.text}
                        {isCorrect && <span className="ml-2 text-xs font-medium">(correct)</span>}
                      </li>
                    );
                  })}
                </ul>
              )}

              {q.type !== "multiple-choice" && (
                <p className="text-sm text-muted-foreground">
                  Answer: <span className="font-medium text-foreground">{q.correctAnswer}</span>
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}