import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileQuestion,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

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

import useFetch from "@/hooks/useFetch";

type QuestionType = "multiple-choice" | "true-false" | "short-answer";

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  type: QuestionType;
  question: string;
  marks: number;
  options: Option[];
  correctAnswer: string;
};

type CourseAllocation = {
  _id: string;
  course?: {
    _id?: string;
    name?: string;
    code?: string;
    title?: string;
  };
  courseName?: string;
  courseCode?: string;
  className?: string;
};

const createOption = (): Option => ({
  id: crypto.randomUUID(),
  text: "",
});

const createQuestion = (): Question => ({
  id: crypto.randomUUID(),
  type: "multiple-choice",
  question: "",
  marks: 1,
  options: [
    createOption(),
    createOption(),
    createOption(),
    createOption(),
  ],
  correctAnswer: "",
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { allocationId } = useParams<{ allocationId: string }>();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [allocation, setAllocation] =
    useState<CourseAllocation | null>(null);

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");

  const [duration, setDuration] = useState("30");
  const [passMark, setPassMark] = useState("50");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [questions, setQuestions] = useState<Question[]>([
    createQuestion(),
  ]);

  /*
   * ---------------------------------------------------------
   * FETCH COURSE ALLOCATION
   * ---------------------------------------------------------
   *
   * Your allocationId comes from:
   *
   * /staff/dashboard/course/:allocationId/quiz/create
   *
   */

  useEffect(() => {
    if (!allocationId) return;

    const fetchAllocation = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("jwtToken");

        const response = await fetch(
          `http://localhost:5001/api/course-allocations/${allocationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load course allocation");
        }

        const data = await response.json();

        setAllocation(data?.allocation || data);
      } catch (error) {
        console.error("Course allocation error:", error);

        toast.error("Unable to load course information");
      } finally {
        setLoading(false);
      }
    };

    fetchAllocation();
  }, [allocationId]);

  /*
   * ---------------------------------------------------------
   * COURSE INFORMATION
   * ---------------------------------------------------------
   */

  const courseName = useMemo(() => {
    if (!allocation) return "Course";

    return (
      allocation.course?.name ||
      allocation.course?.title ||
      allocation.courseName ||
      "Assigned Course"
    );
  }, [allocation]);

  const courseCode = useMemo(() => {
    if (!allocation) return "";

    return (
      allocation.course?.code ||
      allocation.courseCode ||
      ""
    );
  }, [allocation]);

  /*
   * ---------------------------------------------------------
   * QUESTION HANDLERS
   * ---------------------------------------------------------
   */

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createQuestion()]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) => {
      if (prev.length === 1) {
        toast.error("A quiz must contain at least one question.");
        return prev;
      }

      return prev.filter((q) => q.id !== questionId);
    });
  };

  const updateQuestion = (
    questionId: string,
    field: keyof Question,
    value: any
  ) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  /*
   * ---------------------------------------------------------
   * QUESTION TYPE
   * ---------------------------------------------------------
   */

  const changeQuestionType = (
    questionId: string,
    type: QuestionType
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) {
          return question;
        }

        if (type === "multiple-choice") {
          return {
            ...question,
            type,
            options:
              question.options.length >= 2
                ? question.options
                : [
                    createOption(),
                    createOption(),
                    createOption(),
                    createOption(),
                  ],
            correctAnswer: "",
          };
        }

        if (type === "true-false") {
          return {
            ...question,
            type,
            options: [],
            correctAnswer: "",
          };
        }

        return {
          ...question,
          type,
          options: [],
          correctAnswer: "",
        };
      })
    );
  };

  /*
   * ---------------------------------------------------------
   * OPTIONS
   * ---------------------------------------------------------
   */

  const addOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: [...question.options, createOption()],
        };
      })
    );
  };

  const removeOption = (
    questionId: string,
    optionId: string
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;

        if (question.options.length <= 2) {
          toast.error("Multiple choice questions need at least 2 options.");
          return question;
        }

        const remainingOptions = question.options.filter(
          (option) => option.id !== optionId
        );

        const correctAnswer =
          question.correctAnswer === optionId
            ? ""
            : question.correctAnswer;

        return {
          ...question,
          options: remainingOptions,
          correctAnswer,
        };
      })
    );
  };

  const updateOption = (
    questionId: string,
    optionId: string,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;

        return {
          ...question,
          options: question.options.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  text: value,
                }
              : option
          ),
        };
      })
    );
  };

  /*
   * ---------------------------------------------------------
   * VALIDATION
   * ---------------------------------------------------------
   */

  const validateQuiz = () => {
    if (!allocationId) {
      toast.error("Course allocation is missing.");
      return false;
    }

    if (!title.trim()) {
      toast.error("Enter a quiz title.");
      return false;
    }

    if (!duration || Number(duration) <= 0) {
      toast.error("Enter a valid quiz duration.");
      return false;
    }

    if (!passMark || Number(passMark) < 0 || Number(passMark) > 100) {
      toast.error("Pass mark must be between 0 and 100.");
      return false;
    }

    if (questions.length === 0) {
      toast.error("Add at least one question.");
      return false;
    }

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index];

      if (!question.question.trim()) {
        toast.error(
          `Question ${index + 1} cannot be empty.`
        );
        return false;
      }

      if (!question.marks || Number(question.marks) <= 0) {
        toast.error(
          `Enter marks for question ${index + 1}.`
        );
        return false;
      }

      if (question.type === "multiple-choice") {
        if (question.options.length < 2) {
          toast.error(
            `Question ${index + 1} needs at least 2 options.`
          );
          return false;
        }

        const emptyOption = question.options.some(
          (option) => !option.text.trim()
        );

        if (emptyOption) {
          toast.error(
            `Complete all options in question ${index + 1}.`
          );
          return false;
        }

        if (!question.correctAnswer) {
          toast.error(
            `Select the correct answer for question ${index + 1}.`
          );
          return false;
        }
      }

      if (question.type === "true-false") {
        if (!question.correctAnswer) {
          toast.error(
            `Select the correct answer for question ${index + 1}.`
          );
          return false;
        }
      }

      if (question.type === "short-answer") {
        if (!question.correctAnswer.trim()) {
          toast.error(
            `Enter the expected answer for question ${index + 1}.`
          );
          return false;
        }
      }
    }

    return true;
  };

  /*
   * ---------------------------------------------------------
   * SAVE QUIZ
   * ---------------------------------------------------------
   */

  const saveQuiz = async (status: "draft" | "published") => {
    if (!validateQuiz()) return;

    try {
      setSaving(true);

      const token = localStorage.getItem("jwtToken");

      const payload = {
        allocationId,

        title: title.trim(),

        instructions: instructions.trim(),

        duration: Number(duration),

        passMark: Number(passMark),

        startDate: startDate || null,

        endDate: endDate || null,

        status,

        questions: questions.map((question, index) => ({
          questionNumber: index + 1,

          type: question.type,

          question: question.question.trim(),

          marks: Number(question.marks),

          options:
            question.type === "multiple-choice"
              ? question.options.map((option) => ({
                  text: option.text.trim(),
                }))
              : [],

          correctAnswer:
            question.type === "multiple-choice"
              ? question.options.find(
                  (option) =>
                    option.id === question.correctAnswer
                )?.text || ""
              : question.correctAnswer,
        })),
      };

      const response = await fetch(
        "http://localhost:5001/api/quizzes",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Unable to create quiz"
        );
      }

      toast.success(
        status === "published"
          ? "Quiz published successfully."
          : "Quiz saved as draft."
      );

      navigate(
        `/staff/dashboard/course/${allocationId}`
      );
    } catch (error: any) {
      console.error("Create quiz error:", error);

      toast.error(
        error?.message || "Unable to create quiz."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * TOTAL MARKS
   * ---------------------------------------------------------
   */

  const totalMarks = questions.reduce(
    (total, question) =>
      total + Number(question.marks || 0),
    0
  );

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[#006dcc]" />

          <p className="text-sm text-muted-foreground">
            Loading course...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-start gap-3">

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                navigate(
                  `/staff/dashboard/course/${allocationId}`
                )
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="text-2xl font-bold tracking-tight">
                  Create Quiz
                </h1>

                <Badge>
                  {courseCode || "Course"}
                </Badge>

              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Create an assessment for{" "}
                <span className="font-medium text-foreground">
                  {courseName}
                </span>
              </p>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <Button
              variant="outline"
              disabled={saving}
              onClick={() => saveQuiz("draft")}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              disabled={saving}
              onClick={() => saveQuiz("published")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Publish Quiz
            </Button>

          </div>

        </div>

        {/* QUIZ INFORMATION */}

        <Card>

          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>

            <CardDescription>
              Enter the basic information students will see before
              starting the quiz.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="grid gap-5 md:grid-cols-2">

              <div className="space-y-2">

                <Label htmlFor="title">
                  Quiz Title
                </Label>

                <Input
                  id="title"
                  placeholder="e.g. Introduction to Digital Electronics Quiz"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Course
                </Label>

                <Input
                  value={
                    courseCode
                      ? `${courseCode} - ${courseName}`
                      : courseName
                  }
                  disabled
                />

              </div>

            </div>

            <div className="space-y-2">

              <Label htmlFor="instructions">
                Instructions
              </Label>

              <Textarea
                id="instructions"
                placeholder="Enter instructions students should read before starting..."
                value={instructions}
                onChange={(e) =>
                  setInstructions(e.target.value)
                }
                rows={4}
              />

            </div>

            <div className="grid gap-5 md:grid-cols-4">

              <div className="space-y-2">

                <Label>
                  Duration (minutes)
                </Label>

                <div className="relative">

                  <Clock3 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                  <Input
                    type="number"
                    min="1"
                    className="pl-9"
                    value={duration}
                    onChange={(e) =>
                      setDuration(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="space-y-2">

                <Label>
                  Pass Mark (%)
                </Label>

                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={passMark}
                  onChange={(e) =>
                    setPassMark(e.target.value)
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Start Date
                </Label>

                <Input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(e.target.value)
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>
                  End Date
                </Label>

                <Input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) =>
                    setEndDate(e.target.value)
                  }
                />

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
                <p className="text-sm text-muted-foreground">
                  Questions
                </p>

                <p className="text-2xl font-bold">
                  {questions.length}
                </p>
              </div>

            </CardContent>

          </Card>

          <Card>

            <CardContent className="flex items-center gap-3 p-5">

              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Marks
                </p>

                <p className="text-2xl font-bold">
                  {totalMarks}
                </p>
              </div>

            </CardContent>

          </Card>

          <Card>

            <CardContent className="flex items-center gap-3 p-5">

              <div className="rounded-lg bg-orange-100 p-2">
                <Clock3 className="h-5 w-5 text-orange-700" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Duration
                </p>

                <p className="text-2xl font-bold">
                  {duration} min
                </p>
              </div>

            </CardContent>

          </Card>

        </div>

        {/* QUESTIONS */}

        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold">
                Quiz Questions
              </h2>

              <p className="text-sm text-muted-foreground">
                Add questions and select the correct answers.
              </p>

            </div>

            <Button
              variant="outline"
              onClick={addQuestion}
            >
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

                      <CardTitle className="text-base">
                        Question {index + 1}
                      </CardTitle>

                      <CardDescription>
                        Select the question type and provide the answer.
                      </CardDescription>

                    </div>

                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() =>
                      removeQuestion(question.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>

              </CardHeader>

              <CardContent className="space-y-6 pt-6">

                <div className="grid gap-5 md:grid-cols-3">

                  <div className="space-y-2 md:col-span-2">

                    <Label>
                      Question
                    </Label>

                    <Textarea
                      placeholder="Enter your question..."
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "question",
                          e.target.value
                        )
                      }
                      rows={3}
                    />

                  </div>

                  <div className="space-y-5">

                    <div className="space-y-2">

                      <Label>
                        Question Type
                      </Label>

                      <Select
                        value={question.type}
                        onValueChange={(value) =>
                          changeQuestionType(
                            question.id,
                            value as QuestionType
                          )
                        }
                      >

                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>

                          <SelectItem value="multiple-choice">
                            Multiple Choice
                          </SelectItem>

                          <SelectItem value="true-false">
                            True / False
                          </SelectItem>

                          <SelectItem value="short-answer">
                            Short Answer
                          </SelectItem>

                        </SelectContent>

                      </Select>

                    </div>

                    <div className="space-y-2">

                      <Label>
                        Marks
                      </Label>

                      <Input
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "marks",
                            Number(e.target.value)
                          )
                        }
                      />

                    </div>

                  </div>

                </div>

                {/* MULTIPLE CHOICE */}

                {question.type === "multiple-choice" && (

                  <div className="rounded-lg border bg-muted/20 p-4">

                    <div className="mb-4 flex items-center justify-between">

                      <div>

                        <h3 className="font-medium">
                          Answer Options
                        </h3>

                        <p className="text-xs text-muted-foreground">
                          Select the radio button beside the correct answer.
                        </p>

                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          addOption(question.id)
                        }
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Option
                      </Button>

                    </div>

                    <RadioGroup
                      value={question.correctAnswer}
                      onValueChange={(value) =>
                        updateQuestion(
                          question.id,
                          "correctAnswer",
                          value
                        )
                      }
                      className="space-y-3"
                    >

                      {question.options.map(
                        (option, optionIndex) => (

                          <div
                            key={option.id}
                            className="flex items-center gap-3"
                          >

                            <RadioGroupItem
                              value={option.id}
                              id={option.id}
                            />

                            <Label
                              htmlFor={option.id}
                              className="w-7 text-sm font-medium"
                            >
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </Label>

                            <Input
                              className="flex-1"
                              placeholder={`Option ${String.fromCharCode(
                                65 + optionIndex
                              )}`}
                              value={option.text}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  option.id,
                                  e.target.value
                                )
                              }
                            />

                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="text-red-500"
                              onClick={() =>
                                removeOption(
                                  question.id,
                                  option.id
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>

                          </div>

                        )
                      )}

                    </RadioGroup>

                  </div>

                )}

                {/* TRUE / FALSE */}

                {question.type === "true-false" && (

                  <div className="rounded-lg border bg-muted/20 p-4">

                    <Label className="mb-4 block">
                      Correct Answer
                    </Label>

                    <RadioGroup
                      value={question.correctAnswer}
                      onValueChange={(value) =>
                        updateQuestion(
                          question.id,
                          "correctAnswer",
                          value
                        )
                      }
                      className="flex gap-6"
                    >

                      <div className="flex items-center gap-2">

                        <RadioGroupItem
                          value="True"
                          id={`${question.id}-true`}
                        />

                        <Label
                          htmlFor={`${question.id}-true`}
                        >
                          True
                        </Label>

                      </div>

                      <div className="flex items-center gap-2">

                        <RadioGroupItem
                          value="False"
                          id={`${question.id}-false`}
                        />

                        <Label
                          htmlFor={`${question.id}-false`}
                        >
                          False
                        </Label>

                      </div>

                    </RadioGroup>

                  </div>

                )}

                {/* SHORT ANSWER */}

                {question.type === "short-answer" && (

                  <div className="rounded-lg border bg-muted/20 p-4">

                    <Label className="mb-2 block">
                      Expected Answer
                    </Label>

                    <Input
                      placeholder="Enter the expected answer..."
                      value={question.correctAnswer}
                      onChange={(e) =>
                        updateQuestion(
                          question.id,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                    />

                    <p className="mt-2 text-xs text-muted-foreground">
                      This answer can be used by the system for
                      automatic or assisted grading.
                    </p>

                  </div>

                )}

              </CardContent>

            </Card>

          ))}

          <div className="flex justify-center">

            <Button
              variant="outline"
              onClick={addQuestion}
              className="min-w-[200px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Question
            </Button>

          </div>

        </div>

        {/* BOTTOM ACTIONS */}

        <Card>

          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-medium">
                Ready to create this quiz?
              </p>

              <p className="text-sm text-muted-foreground">
                You can save it as a draft or publish it for students.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <Button
                variant="outline"
                disabled={saving}
                onClick={() => saveQuiz("draft")}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>

              <Button
                disabled={saving}
                className="bg-[#006dcc] hover:bg-[#005ca8]"
                onClick={() => saveQuiz("published")}
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