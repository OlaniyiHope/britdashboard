import { useContext, useEffect, useMemo, useState } from "react";

import {
  Video,
  VideoIcon,
  Plus,
  Search,
  RefreshCw,
  Play,
  Users,
  Clock,
  CalendarDays,
  Copy,
  ExternalLink,
  MoreVertical,
  Trash2,
  Radio,
  CheckCircle2,
  BookOpen,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

import useFetch from "@/hooks/useFetch";
import { SessionContext } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";


// ============================================================
// TYPES
// ============================================================

type Course = {
  _id?: string;
  id?: string;
  courseId?: string;

  course?: {
    _id?: string;
    code?: string;
    name?: string;
    title?: string;
  };

  code?: string;
  name?: string;
  title?: string;
};


type LiveStream = {
  _id: string;

  title: string;

  description?: string;

  courseId?: string;

  courseName?: string;

  courseCode?: string;

  roomName: string;

  roomUrl: string;

  status: "scheduled" | "live" | "ended";

  scheduledAt?: string;

  lecturerName?: string;

  viewers?: number;

  createdAt?: string;
};


// ============================================================
// RAW COURSE RESPONSE TYPE
// ============================================================

type CourseResponse = {
  data?: unknown;
  courses?: unknown;
};


// ============================================================
// CONSTANTS
// ============================================================

const JITSI_DOMAIN = "meet.jit.si";


// ============================================================
// COURSE HELPERS
// ============================================================

function getCourseId(course: Course): string {
  return (
    course._id ||
    course.id ||
    course.courseId ||
    course.course?._id ||
    ""
  );
}


function getCourseName(course: Course): string {
  return (
    course.name ||
    course.title ||
    course.course?.name ||
    course.course?.title ||
    "Unnamed Course"
  );
}


function getCourseCode(course: Course): string {
  return (
    course.code ||
    course.course?.code ||
    ""
  );
}


// ============================================================
// USER DISPLAY NAME
// ============================================================

function getUserDisplayName(user: unknown): string {
  if (!user || typeof user !== "object") {
    return "Lecturer";
  }

  const account = user as {
    username?: string;
    name?: string;
    fullName?: string;
    firstName?: string;
  };

  return (
    account.username ||
    account.name ||
    account.fullName ||
    account.firstName ||
    "Lecturer"
  );
}


// ============================================================
// ROOM NAME
// ============================================================

function createRoomName(
  title: string,
  courseCode: string
): string {
  const random = Math.random()
    .toString(36)
    .substring(2, 9);

  const cleanTitle = title
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .substring(0, 30);

  const cleanCourse = courseCode
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .substring(0, 20);

  return `BritishTransatlantic-${cleanCourse}-${cleanTitle}-${random}`;
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date?: string): string {
  if (!date) {
    return "Not scheduled";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}


// ============================================================
// STATUS BADGE
// ============================================================

function statusBadge(
  status: LiveStream["status"]
) {
  if (status === "live") {
    return (
      <Badge className="gap-1 bg-red-600 hover:bg-red-600">
        <Radio className="h-3 w-3 animate-pulse" />
        LIVE
      </Badge>
    );
  }

  if (status === "scheduled") {
    return (
      <Badge
        variant="secondary"
        className="gap-1"
      >
        <Clock className="h-3 w-3" />
        Scheduled
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1"
    >
      <CheckCircle2 className="h-3 w-3" />
      Ended
    </Badge>
  );
}


// ============================================================
// COMPONENT
// ============================================================

export default function LiveStream() {
  const { user } = useAuth();

  const { currentSession } =
    useContext(SessionContext);


  // ============================================================
  // FETCH COURSES
  // ============================================================

  const {
    data: rawCourses,
    loading: coursesLoading,
  } = useFetch(
    currentSession?._id
      ? `/class/${currentSession._id}`
      : null
  );


  // ============================================================
  // NORMALIZE COURSES
  //
  // IMPORTANT:
  // useFetch returns unknown.
  // We first convert it to CourseResponse.
  // Then we safely check whether data/courses is an array.
  // ============================================================

  const courses: Course[] = useMemo(() => {
    if (Array.isArray(rawCourses)) {
      return rawCourses as Course[];
    }

    if (
      rawCourses &&
      typeof rawCourses === "object"
    ) {
      const response =
        rawCourses as CourseResponse;

      if (Array.isArray(response.data)) {
        return response.data as Course[];
      }

      if (Array.isArray(response.courses)) {
        return response.courses as Course[];
      }
    }

    return [];
  }, [rawCourses]);


  // ============================================================
  // STATE
  // ============================================================

  const [streams, setStreams] =
    useState<LiveStream[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showCreate, setShowCreate] =
    useState(false);

  const [showLiveRoom, setShowLiveRoom] =
    useState(false);

  const [selectedStream, setSelectedStream] =
    useState<LiveStream | null>(null);


  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    scheduledAt: "",
  });


  // ============================================================
  // LOAD SAVED STREAMS
  // ============================================================

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          "staff_live_streams"
        );

      if (!saved) {
        return;
      }

      const parsed: unknown =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setStreams(
          parsed as LiveStream[]
        );
      }
    } catch (error) {
      console.error(
        "Unable to load live streams:",
        error
      );
    }
  }, []);


  // ============================================================
  // SAVE STREAMS
  // ============================================================

  const saveStreams = (
    items: LiveStream[]
  ) => {
    setStreams(items);

    localStorage.setItem(
      "staff_live_streams",
      JSON.stringify(items)
    );
  };


  // ============================================================
  // CREATE LIVE CLASS
  // ============================================================

  const createLiveClass = () => {
    if (!form.title.trim()) {
      toast.error(
        "Enter a lecture title"
      );
      return;
    }

    if (!form.courseId) {
      toast.error(
        "Select a course"
      );
      return;
    }


    const selectedCourse =
      courses.find(
        (course) =>
          getCourseId(course) ===
          form.courseId
      );


    if (!selectedCourse) {
      toast.error(
        "Selected course could not be found"
      );
      return;
    }


    const courseName =
      getCourseName(
        selectedCourse
      );

    const courseCode =
      getCourseCode(
        selectedCourse
      );


    const roomName =
      createRoomName(
        form.title,
        courseCode ||
          courseName
      );


    const roomUrl =
      `https://${JITSI_DOMAIN}/${roomName}`;


    let scheduledAt: string;

    if (form.scheduledAt) {
      const date =
        new Date(
          form.scheduledAt
        );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        toast.error(
          "Please enter a valid date and time"
        );
        return;
      }

      scheduledAt =
        date.toISOString();
    } else {
      scheduledAt =
        new Date().toISOString();
    }


    const isImmediatelyLive =
      !form.scheduledAt ||
      new Date(
        scheduledAt
      ).getTime() <= Date.now();


    const newStream: LiveStream = {
      _id:
        crypto.randomUUID(),

      title:
        form.title.trim(),

      description:
        form.description.trim(),

      courseId:
        form.courseId,

      courseName,

      courseCode,

      roomName,

      roomUrl,

      status:
        isImmediatelyLive
          ? "live"
          : "scheduled",

      scheduledAt,

      lecturerName:
        getUserDisplayName(user),

      viewers: 0,

      createdAt:
        new Date().toISOString(),
    };


    const updated = [
      newStream,
      ...streams,
    ];


    saveStreams(updated);


    setForm({
      title: "",
      description: "",
      courseId: "",
      scheduledAt: "",
    });


    setShowCreate(false);


    toast.success(
      "Live class created successfully"
    );


    // If immediately live,
    // open the classroom automatically.
    if (newStream.status === "live") {
      setSelectedStream(
        newStream
      );

      setShowLiveRoom(true);
    }
  };


  // ============================================================
  // START LIVE CLASS
  // ============================================================

  const startLiveClass = (
    stream: LiveStream
  ) => {
    const updated =
      streams.map(
        (item) =>
          item._id === stream._id
            ? {
                ...item,
                status:
                  "live" as const,
              }
            : item
      );


    saveStreams(updated);


    const liveStream =
      updated.find(
        (item) =>
          item._id ===
          stream._id
      );


    if (liveStream) {
      setSelectedStream(
        liveStream
      );

      setShowLiveRoom(true);
    }


    toast.success(
      "Live class started"
    );
  };


  // ============================================================
  // OPEN LIVE CLASS
  // ============================================================

  const openLiveClass = (
    stream: LiveStream
  ) => {
    setSelectedStream(
      stream
    );

    setShowLiveRoom(true);
  };


  // ============================================================
  // DELETE STREAM
  // ============================================================

  const deleteStream = (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this live class?"
      );

    if (!confirmed) {
      return;
    }


    const updated =
      streams.filter(
        (item) =>
          item._id !== id
      );


    saveStreams(updated);


    if (
      selectedStream?._id === id
    ) {
      setSelectedStream(null);
      setShowLiveRoom(false);
    }


    toast.success(
      "Live class deleted"
    );
  };


  // ============================================================
  // COPY ROOM LINK
  // ============================================================

  const copyRoomLink = async (
    url: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        url
      );

      toast.success(
        "Live classroom link copied"
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );

      toast.error(
        "Unable to copy classroom link"
      );
    }
  };


  // ============================================================
  // REFRESH
  // ============================================================

  const refresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      toast.success(
        "Live classes refreshed"
      );
    }, 500);
  };


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredStreams =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();


      if (!query) {
        return streams;
      }


      return streams.filter(
        (stream) =>
          `${stream.title}
           ${stream.courseName}
           ${stream.courseCode}
           ${stream.lecturerName}
           ${stream.status}`
            .toLowerCase()
            .includes(query)
      );
    }, [
      streams,
      search,
    ]);


  // ============================================================
  // COUNTERS
  // ============================================================

  const liveCount =
    streams.filter(
      (stream) =>
        stream.status ===
        "live"
    ).length;


  const scheduledCount =
    streams.filter(
      (stream) =>
        stream.status ===
        "scheduled"
    ).length;


  const endedCount =
    streams.filter(
      (stream) =>
        stream.status ===
        "ended"
    ).length;


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">

              <Video className="h-5 w-5 text-[#006dcc]" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Live Stream
              </h1>

              <p className="text-sm text-muted-foreground">
                Create and manage live online lectures for your students.
              </p>

            </div>

          </div>

        </div>


        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={refresh}
            disabled={loading}
          >

            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}

            Refresh

          </Button>


          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={() =>
              setShowCreate(true)
            }
          >

            <Plus className="mr-2 h-4 w-4" />

            Create Live Class

          </Button>

        </div>

      </div>


      {/* ====================================================== */}
      {/* INFO */}
      {/* ====================================================== */}

      <Card className="border-[#006dcc]/20 bg-[#006dcc]/5">

        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

          <div className="flex gap-4">

            <div className="hidden rounded-lg bg-[#006dcc] p-3 text-white sm:flex">

              <VideoIcon className="h-6 w-6" />

            </div>


            <div>

              <h2 className="font-semibold">
                Online Lecture Classroom
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a live classroom and allow your students to join your lecture from their student dashboard.
              </p>

            </div>

          </div>


          <Button
            variant="outline"
            onClick={() =>
              setShowCreate(true)
            }
          >

            <Radio className="mr-2 h-4 w-4" />

            Start a Class

          </Button>

        </CardContent>

      </Card>


      {/* ====================================================== */}
      {/* STATISTICS */}
      {/* ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Total Classes
            </CardDescription>

            <CardTitle className="text-2xl">
              {streams.length}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Video className="h-4 w-4" />

              All live classes

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Live Now
            </CardDescription>

            <CardTitle className="text-2xl text-red-600">
              {liveCount}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-red-600">

              <Radio className="h-4 w-4 animate-pulse" />

              Currently streaming

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Scheduled
            </CardDescription>

            <CardTitle className="text-2xl">
              {scheduledCount}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <CalendarDays className="h-4 w-4" />

              Upcoming lectures

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Completed
            </CardDescription>

            <CardTitle className="text-2xl">
              {endedCount}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <CheckCircle2 className="h-4 w-4" />

              Finished classes

            </div>

          </CardContent>

        </Card>

      </div>


      {/* ====================================================== */}
      {/* LIVE CLASSES */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <CardTitle>
                My Live Classes
              </CardTitle>

              <CardDescription>
                Manage your online lectures and live classrooms.
              </CardDescription>

            </div>


            <div className="relative w-full md:w-80">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search live classes..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </CardHeader>


        <CardContent>

          {filteredStreams.length ===
          0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">

                <Video className="h-7 w-7 text-muted-foreground" />

              </div>

              <h3 className="font-semibold">
                No live classes yet
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Create your first online lecture. Your students will be able to join the classroom from their student dashboard.
              </p>

              <Button
                className="mt-4 bg-[#006dcc] hover:bg-[#005ca8]"
                onClick={() =>
                  setShowCreate(true)
                }
              >

                <Plus className="mr-2 h-4 w-4" />

                Create Live Class

              </Button>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredStreams.map(
                (stream) => (

                  <div
                    key={stream._id}
                    className="group rounded-xl border p-4 transition hover:bg-muted/40"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* LEFT */}

                      <div className="flex min-w-0 gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">

                          <Video className="h-6 w-6 text-[#006dcc]" />

                        </div>


                        <div className="min-w-0">

                          <div className="mb-1 flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {stream.title}
                            </h3>

                            {statusBadge(
                              stream.status
                            )}

                          </div>


                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">

                            <span className="flex items-center gap-1">

                              <BookOpen className="h-3.5 w-3.5" />

                              {stream.courseCode
                                ? `${stream.courseCode} — `
                                : ""}

                              {stream.courseName ||
                                "Course"}

                            </span>


                            <span className="flex items-center gap-1">

                              <CalendarDays className="h-3.5 w-3.5" />

                              {formatDate(
                                stream.scheduledAt
                              )}

                            </span>


                            {stream.status ===
                              "live" && (

                              <span className="flex items-center gap-1 text-red-600">

                                <Users className="h-3.5 w-3.5" />

                                {stream.viewers ||
                                  0}{" "}
                                viewers

                              </span>

                            )}

                          </div>


                          {stream.description && (

                            <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                              {stream.description}
                            </p>

                          )}

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        {stream.status ===
                          "scheduled" && (

                          <Button
                            className="bg-[#006dcc] hover:bg-[#005ca8]"
                            onClick={() =>
                              startLiveClass(
                                stream
                              )
                            }
                          >

                            <Play className="mr-2 h-4 w-4" />

                            Start Live

                          </Button>

                        )}


                        {stream.status ===
                          "live" && (

                          <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() =>
                              openLiveClass(
                                stream
                              )
                            }
                          >

                            <Radio className="mr-2 h-4 w-4" />

                            Open Live Room

                          </Button>

                        )}


                        <Button
                          variant="outline"
                          onClick={() =>
                            copyRoomLink(
                              stream.roomUrl
                            )
                          }
                        >

                          <Copy className="mr-2 h-4 w-4" />

                          Copy Link

                        </Button>


                        <DropdownMenu>

                          <DropdownMenuTrigger
                            asChild
                          >

                            <Button
                              size="icon"
                              variant="outline"
                            >

                              <MoreVertical className="h-4 w-4" />

                            </Button>

                          </DropdownMenuTrigger>


                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              onClick={() =>
                                openLiveClass(
                                  stream
                                )
                              }
                            >

                              <ExternalLink className="mr-2 h-4 w-4" />

                              Open Classroom

                            </DropdownMenuItem>


                            <DropdownMenuItem
                              onClick={() =>
                                copyRoomLink(
                                  stream.roomUrl
                                )
                              }
                            >

                              <Copy className="mr-2 h-4 w-4" />

                              Copy Classroom Link

                            </DropdownMenuItem>


                            <DropdownMenuSeparator />


                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                deleteStream(
                                  stream._id
                                )
                              }
                            >

                              <Trash2 className="mr-2 h-4 w-4" />

                              Delete

                            </DropdownMenuItem>

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>


      {/* ====================================================== */}
      {/* CREATE LIVE CLASS DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={showCreate}
        onOpenChange={
          setShowCreate
        }
      >

        <DialogContent className="sm:max-w-[550px]">

          <DialogHeader>

            <DialogTitle>
              Create Live Class
            </DialogTitle>

            <DialogDescription>
              Create an online classroom for one of your assigned courses.
            </DialogDescription>

          </DialogHeader>


          <div className="space-y-5 py-3">

            {/* TITLE */}

            <div className="space-y-2">

              <Label>
                Lecture Title
              </Label>

              <Input
                placeholder="e.g. Introduction to Digital Electronics"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />

            </div>


            {/* COURSE */}

            <div className="space-y-2">

              <Label>
                Course
              </Label>

              <Select
                value={
                  form.courseId
                }
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    courseId:
                      value,
                  })
                }
              >

                <SelectTrigger>

                  <SelectValue
                    placeholder={
                      coursesLoading
                        ? "Loading courses..."
                        : "Select your course"
                    }
                  />

                </SelectTrigger>


                <SelectContent>

                  {courses.length ===
                  0 ? (

                    <SelectItem
                      value="no-course"
                      disabled
                    >
                      {coursesLoading
                        ? "Loading courses..."
                        : "No courses assigned"}
                    </SelectItem>

                  ) : (

                    courses.map(
                      (course) => {

                        const id =
                          getCourseId(
                            course
                          );

                        const name =
                          getCourseName(
                            course
                          );

                        const code =
                          getCourseCode(
                            course
                          );


                        if (!id) {
                          return null;
                        }


                        return (

                          <SelectItem
                            key={id}
                            value={id}
                          >

                            {code
                              ? `${code} — ${name}`
                              : name}

                          </SelectItem>

                        );

                      }
                    )

                  )}

                </SelectContent>

              </Select>

            </div>


            {/* DESCRIPTION */}

            <div className="space-y-2">

              <Label>
                Lecture Description
              </Label>

              <textarea
                className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="What will students learn in this lecture?"
                value={
                  form.description
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />

            </div>


            {/* DATE */}

            <div className="space-y-2">

              <Label>
                Start Date & Time
              </Label>

              <Input
                type="datetime-local"
                value={
                  form.scheduledAt
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    scheduledAt:
                      e.target.value,
                  })
                }
              />

              <p className="text-xs text-muted-foreground">
                Leave this empty if you want to create the class and start it immediately.
              </p>

            </div>


            {/* NOTICE */}

            <div className="rounded-lg border bg-muted/40 p-4">

              <div className="flex gap-3">

                <Video className="mt-0.5 h-5 w-5 text-[#006dcc]" />

                <div>

                  <p className="text-sm font-medium">
                    Live classroom
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    A classroom URL will be generated automatically. The lecturer and students will use the same classroom.
                  </p>

                </div>

              </div>

            </div>

          </div>


          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setShowCreate(false)
              }
            >
              Cancel
            </Button>


            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={
                createLiveClass
              }
            >

              <Video className="mr-2 h-4 w-4" />

              Create Live Class

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>


      {/* ====================================================== */}
      {/* LIVE CLASSROOM */}
      {/* ====================================================== */}

      <Dialog
        open={showLiveRoom}
        onOpenChange={
          setShowLiveRoom
        }
      >

        <DialogContent className="max-w-6xl p-0">

          <div className="flex flex-col">

            {/* HEADER */}

            <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="font-semibold">
                  {selectedStream?.title}
                </h2>

                <p className="text-xs text-muted-foreground">

                  {selectedStream?.courseCode
                    ? `${selectedStream.courseCode} — `
                    : ""}

                  {selectedStream?.courseName}

                </p>

              </div>


              <div className="flex items-center gap-2">

                {selectedStream &&
                  statusBadge(
                    selectedStream.status
                  )}


                {selectedStream && (

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      copyRoomLink(
                        selectedStream.roomUrl
                      )
                    }
                  >

                    <Copy className="mr-2 h-4 w-4" />

                    Copy Link

                  </Button>

                )}

              </div>

            </div>


            {/* JITSI ROOM */}

            {selectedStream && (

              <div className="aspect-video w-full bg-black">

                <iframe
                  src={`${selectedStream.roomUrl}?userInfo.displayName=${encodeURIComponent(
                    getUserDisplayName(
                      user
                    )
                  )}`}
                  title="Live Classroom"
                  className="h-full w-full border-0"
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                />

              </div>

            )}


            {/* FOOTER */}

            <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-sm font-medium">
                  Live Classroom
                </p>

                <p className="text-xs text-muted-foreground">
                  Students can join this same classroom from their student dashboard.
                </p>

              </div>


              {selectedStream && (

                <Button
                  variant="outline"
                  onClick={() =>
                    window.open(
                      selectedStream.roomUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >

                  <ExternalLink className="mr-2 h-4 w-4" />

                  Open Full Screen

                </Button>

              )}

            </div>

          </div>

        </DialogContent>

      </Dialog>

    </div>
  );
}