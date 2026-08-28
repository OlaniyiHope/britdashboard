import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  FileText,
  Video,
  BookOpen,
  Bell,
  Users,
  CalendarDays,
  Clock,
  GraduationCap,
  ClipboardList,
  Activity,
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

import { toast } from "sonner";


// ============================================================
// TYPES
// ============================================================

type ActivityType =
  | "announcement"
  | "lecture"
  | "assignment"
  | "material"
  | "quiz"
  | "discussion"
  | "attendance"
  | "course";

type ActivityStatus =
  | "New"
  | "Completed"
  | "Upcoming";

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  course: string;
  courseCode: string;
  actor: string;
  createdAt: string;
};


// ============================================================
// STORAGE KEY
// ============================================================

const STORAGE_KEY = "polytechnic_activity_stream";


// ============================================================
// DEMO DATA
// ============================================================

const seedActivities: ActivityItem[] = [
  {
    id: "activity-1",
    title: "Digital Electronics Lecture",
    description:
      "A new live lecture has been scheduled for Digital Electronics.",
    type: "lecture",
    status: "Upcoming",
    course: "Digital Electronics",
    courseCode: "EEE 214",
    actor: "Lecturer",
    createdAt: new Date().toISOString(),
  },

  {
    id: "activity-2",
    title: "New Course Material Available",
    description:
      "Lecture materials for Basic Electricity have been uploaded.",
    type: "material",
    status: "New",
    course: "Basic Electricity",
    courseCode: "EEE 202",
    actor: "Lecturer",
    createdAt: new Date(
      Date.now() - 60 * 60 * 1000
    ).toISOString(),
  },

  {
    id: "activity-3",
    title: "Quiz Available",
    description:
      "A new online quiz is now available for students.",
    type: "quiz",
    status: "New",
    course: "Computer Electronics",
    courseCode: "ECE 302",
    actor: "Lecturer",
    createdAt: new Date(
      Date.now() - 2 * 60 * 60 * 1000
    ).toISOString(),
  },

  {
    id: "activity-4",
    title: "Assignment Submitted",
    description:
      "Students have submitted their latest programming assignment.",
    type: "assignment",
    status: "Completed",
    course: "Computer Programming",
    courseCode: "CMP 204",
    actor: "Student",
    createdAt: new Date(
      Date.now() - 4 * 60 * 60 * 1000
    ).toISOString(),
  },

  {
    id: "activity-5",
    title: "Class Announcement",
    description:
      "The lecturer has posted a new announcement for the class.",
    type: "announcement",
    status: "New",
    course: "School of Engineering",
    courseCode: "ENG",
    actor: "Lecturer",
    createdAt: new Date(
      Date.now() - 6 * 60 * 60 * 1000
    ).toISOString(),
  },
];


// ============================================================
// HELPERS
// ============================================================

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case "lecture":
      return Video;

    case "assignment":
      return ClipboardList;

    case "material":
      return FileText;

    case "quiz":
      return GraduationCap;

    case "discussion":
      return MessageSquare;

    case "attendance":
      return CheckCircle2;

    case "course":
      return BookOpen;

    case "announcement":
    default:
      return Bell;
  }
}


function getActivityTypeLabel(type: ActivityType) {
  switch (type) {
    case "lecture":
      return "Lecture";

    case "assignment":
      return "Assignment";

    case "material":
      return "Study Material";

    case "quiz":
      return "Quiz";

    case "discussion":
      return "Discussion";

    case "attendance":
      return "Attendance";

    case "course":
      return "Course";

    case "announcement":
      return "Announcement";

    default:
      return "Activity";
  }
}


function getActivityBadgeVariant(
  status: ActivityStatus
) {
  switch (status) {
    case "New":
      return "default";

    case "Upcoming":
      return "secondary";

    case "Completed":
      return "outline";

    default:
      return "outline";
  }
}


function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "Unknown date";
  }
}


function formatRelativeTime(date: string) {
  const timestamp = new Date(date).getTime();

  const difference =
    Date.now() - timestamp;

  const minutes =
    Math.floor(difference / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    } ago`;
  }

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} ${
      hours === 1 ? "hour" : "hours"
    } ago`;
  }

  const days =
    Math.floor(hours / 24);

  if (days < 7) {
    return `${days} ${
      days === 1 ? "day" : "days"
    } ago`;
  }

  return formatDate(date);
}


function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `activity-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}


// ============================================================
// COMPONENT
// ============================================================

export default function ActivityStream() {
  // ============================================================
  // STATE
  // ============================================================

  const [activities, setActivities] =
    useState<ActivityItem[]>(() => {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (error) {
        console.error(
          "Unable to load activity stream:",
          error
        );
      }

      return seedActivities;
    });

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<string>("all");

  const [showCreate, setShowCreate] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "announcement" as ActivityType,
    course: "",
    courseCode: "",
    status: "New" as ActivityStatus,
  });


  // ============================================================
  // SAVE
  // ============================================================

  const saveActivities = (
    items: ActivityItem[]
  ) => {
    setActivities(items);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Unable to save activities:",
        error
      );
    }
  };


  // ============================================================
  // FILTER ACTIVITIES
  // ============================================================

  const filteredActivities =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return activities.filter(
        (activity) => {
          const matchesSearch =
            !query ||
            `${activity.title}
             ${activity.description}
             ${activity.course}
             ${activity.courseCode}
             ${activity.actor}
             ${getActivityTypeLabel(
               activity.type
             )}`
              .toLowerCase()
              .includes(query);

          const matchesFilter =
            filter === "all" ||
            activity.type === filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      activities,
      search,
      filter,
    ]);


  // ============================================================
  // COUNTERS
  // ============================================================

  const totalActivities =
    activities.length;

  const newActivities =
    activities.filter(
      (activity) =>
        activity.status === "New"
    ).length;

  const upcomingActivities =
    activities.filter(
      (activity) =>
        activity.status === "Upcoming"
    ).length;

  const completedActivities =
    activities.filter(
      (activity) =>
        activity.status === "Completed"
    ).length;


  // ============================================================
  // CREATE ACTIVITY
  // ============================================================

  const createActivity = () => {
    if (!form.title.trim()) {
      toast.error(
        "Enter an activity title"
      );
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        "Enter an activity description"
      );
      return;
    }

    if (!form.course.trim()) {
      toast.error(
        "Enter the course name"
      );
      return;
    }

    const newActivity: ActivityItem = {
      id: createId(),

      title:
        form.title.trim(),

      description:
        form.description.trim(),

      type:
        form.type,

      status:
        form.status,

      course:
        form.course.trim(),

      courseCode:
        form.courseCode.trim(),

      actor:
        "Lecturer",

      createdAt:
        new Date().toISOString(),
    };

    saveActivities([
      newActivity,
      ...activities,
    ]);

    setForm({
      title: "",
      description: "",
      type: "announcement",
      course: "",
      courseCode: "",
      status: "New",
    });

    setShowCreate(false);

    toast.success(
      "Activity posted successfully"
    );
  };


  // ============================================================
  // DELETE
  // ============================================================

  const deleteActivity = (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this activity?"
      );

    if (!confirmed) {
      return;
    }

    const updated =
      activities.filter(
        (activity) =>
          activity.id !== id
      );

    saveActivities(updated);

    toast.success(
      "Activity deleted"
    );
  };


  // ============================================================
  // REFRESH
  // ============================================================

  const refreshActivities = () => {
    setRefreshing(true);

    setTimeout(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setActivities(parsed);
          }
        }
      } catch (error) {
        console.error(
          "Unable to refresh activity stream:",
          error
        );
      }

      setRefreshing(false);

      toast.success(
        "Activity stream refreshed"
      );
    }, 500);
  };


  // ============================================================
  // RESET DEMO DATA
  // ============================================================

  const resetActivities = () => {
    saveActivities(
      seedActivities
    );

    toast.success(
      "Demo activities restored"
    );
  };


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

              <Activity className="h-5 w-5 text-[#006dcc]" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Activity Stream
              </h1>

              <p className="text-sm text-muted-foreground">
                Stay updated with lectures, assignments,
                quizzes, materials and other academic activities.
              </p>

            </div>

          </div>

        </div>


        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={
              refreshActivities
            }
            disabled={refreshing}
          >

            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh

          </Button>


          <Button
            variant="outline"
            onClick={
              resetActivities
            }
          >

            <RefreshCw className="mr-2 h-4 w-4" />

            Reset Demo

          </Button>


          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={() =>
              setShowCreate(true)
            }
          >

            <Plus className="mr-2 h-4 w-4" />

            Post Activity

          </Button>

        </div>

      </div>


      {/* ====================================================== */}
      {/* INTRO CARD */}
      {/* ====================================================== */}

      <Card className="border-[#006dcc]/20 bg-[#006dcc]/5">

        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

          <div className="flex gap-4">

            <div className="hidden rounded-lg bg-[#006dcc] p-3 text-white sm:flex">

              <Bell className="h-6 w-6" />

            </div>


            <div>

              <h2 className="font-semibold">
                Academic Activity Feed
              </h2>

              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                View important updates from your courses,
                including new learning materials, live lectures,
                assignments, quizzes and announcements.
              </p>

            </div>

          </div>


          <Button
            variant="outline"
            onClick={() =>
              setShowCreate(true)
            }
          >

            <Plus className="mr-2 h-4 w-4" />

            New Activity

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
              Total Activities
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalActivities}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Activity className="h-4 w-4" />

              All academic updates

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              New
            </CardDescription>

            <CardTitle className="text-2xl text-[#006dcc]">
              {newActivities}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Bell className="h-4 w-4" />

              New updates

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Upcoming
            </CardDescription>

            <CardTitle className="text-2xl">
              {upcomingActivities}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <CalendarDays className="h-4 w-4" />

              Upcoming activities

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Completed
            </CardDescription>

            <CardTitle className="text-2xl">
              {completedActivities}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <CheckCircle2 className="h-4 w-4" />

              Completed activities

            </div>

          </CardContent>

        </Card>

      </div>


      {/* ====================================================== */}
      {/* ACTIVITY FEED */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <CardTitle>
                Recent Activity
              </CardTitle>

              <CardDescription>
                Latest updates from your academic environment.
              </CardDescription>

            </div>


            <div className="flex flex-col gap-2 sm:flex-row">

              {/* SEARCH */}

              <div className="relative w-full sm:w-72">

                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-9"
                  placeholder="Search activities..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* FILTER */}

              <Select
                value={filter}
                onValueChange={
                  setFilter
                }
              >

                <SelectTrigger className="w-full sm:w-[180px]">

                  <SelectValue placeholder="Filter" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="all">
                    All Activities
                  </SelectItem>

                  <SelectItem value="announcement">
                    Announcements
                  </SelectItem>

                  <SelectItem value="lecture">
                    Lectures
                  </SelectItem>

                  <SelectItem value="assignment">
                    Assignments
                  </SelectItem>

                  <SelectItem value="material">
                    Study Materials
                  </SelectItem>

                  <SelectItem value="quiz">
                    Quizzes
                  </SelectItem>

                  <SelectItem value="discussion">
                    Discussions
                  </SelectItem>

                  <SelectItem value="attendance">
                    Attendance
                  </SelectItem>

                  <SelectItem value="course">
                    Courses
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>

          </div>

        </CardHeader>


        <CardContent>

          {filteredActivities.length === 0 ? (

            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">

                <Activity className="h-7 w-7 text-muted-foreground" />

              </div>

              <h3 className="font-semibold">
                No activities found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                There are no activities matching your
                current search or filter.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </Button>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredActivities.map(
                (activity) => {

                  const Icon =
                    getActivityIcon(
                      activity.type
                    );

                  return (

                    <div
                      key={activity.id}
                      className="group rounded-xl border p-4 transition hover:bg-muted/40"
                    >

                      <div className="flex gap-4">

                        {/* ICON */}

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">

                          <Icon className="h-5 w-5 text-[#006dcc]" />

                        </div>


                        {/* CONTENT */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                              <div className="flex flex-wrap items-center gap-2">

                                <h3 className="font-semibold">

                                  {activity.title}

                                </h3>


                                <Badge
                                  variant={getActivityBadgeVariant(
                                    activity.status
                                  )}
                                >
                                  {activity.status}
                                </Badge>


                                <Badge variant="outline">

                                  {getActivityTypeLabel(
                                    activity.type
                                  )}

                                </Badge>

                              </div>


                              <p className="mt-1 text-sm text-muted-foreground">

                                {activity.description}

                              </p>

                            </div>


                            {/* DELETE */}

                            <Button
                              size="icon"
                              variant="ghost"
                              className="shrink-0 text-muted-foreground hover:text-red-600"
                              onClick={() =>
                                deleteActivity(
                                  activity.id
                                )
                              }
                            >

                              <Trash2 className="h-4 w-4" />

                            </Button>

                          </div>


                          {/* META */}

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">

                            <span className="flex items-center gap-1">

                              <BookOpen className="h-3.5 w-3.5" />

                              {activity.courseCode
                                ? `${activity.courseCode} — `
                                : ""}

                              {activity.course}

                            </span>


                            <span className="flex items-center gap-1">

                              <Users className="h-3.5 w-3.5" />

                              {activity.actor}

                            </span>


                            <span className="flex items-center gap-1">

                              <Clock className="h-3.5 w-3.5" />

                              {formatRelativeTime(
                                activity.createdAt
                              )}

                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}

        </CardContent>

      </Card>


      {/* ====================================================== */}
      {/* CREATE ACTIVITY DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={showCreate}
        onOpenChange={
          setShowCreate
        }
      >

        <DialogContent className="sm:max-w-[600px]">

          <DialogHeader>

            <DialogTitle>
              Post Academic Activity
            </DialogTitle>

            <DialogDescription>
              Publish an update that can appear in the
              activity stream for the selected course.
            </DialogDescription>

          </DialogHeader>


          <div className="space-y-5 py-3">

            {/* TITLE */}

            <div className="space-y-2">

              <Label>
                Activity Title
              </Label>

              <Input
                placeholder="e.g. New Digital Electronics Material"
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


            {/* TYPE */}

            <div className="space-y-2">

              <Label>
                Activity Type
              </Label>

              <Select
                value={form.type}
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    type:
                      value as ActivityType,
                  })
                }
              >

                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="announcement">
                    Announcement
                  </SelectItem>

                  <SelectItem value="lecture">
                    Lecture
                  </SelectItem>

                  <SelectItem value="assignment">
                    Assignment
                  </SelectItem>

                  <SelectItem value="material">
                    Study Material
                  </SelectItem>

                  <SelectItem value="quiz">
                    Quiz
                  </SelectItem>

                  <SelectItem value="discussion">
                    Discussion
                  </SelectItem>

                  <SelectItem value="attendance">
                    Attendance
                  </SelectItem>

                  <SelectItem value="course">
                    Course
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>


            {/* COURSE */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="space-y-2">

                <Label>
                  Course Name
                </Label>

                <Input
                  placeholder="Digital Electronics"
                  value={form.course}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      course:
                        e.target.value,
                    })
                  }
                />

              </div>


              <div className="space-y-2">

                <Label>
                  Course Code
                </Label>

                <Input
                  placeholder="EEE 214"
                  value={
                    form.courseCode
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      courseCode:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>


            {/* STATUS */}

            <div className="space-y-2">

              <Label>
                Activity Status
              </Label>

              <Select
                value={
                  form.status
                }
                onValueChange={(
                  value
                ) =>
                  setForm({
                    ...form,
                    status:
                      value as ActivityStatus,
                  })
                }
              >

                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="New">
                    New
                  </SelectItem>

                  <SelectItem value="Upcoming">
                    Upcoming
                  </SelectItem>

                  <SelectItem value="Completed">
                    Completed
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>


            {/* DESCRIPTION */}

            <div className="space-y-2">

              <Label>
                Description
              </Label>

              <textarea
                className="min-h-[120px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Write the activity description..."
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


            {/* INFO */}

            <div className="rounded-lg border bg-muted/40 p-4">

              <div className="flex gap-3">

                <Activity className="mt-0.5 h-5 w-5 text-[#006dcc]" />

                <div>

                  <p className="text-sm font-medium">
                    Activity Stream
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    This activity will appear at the top
                    of the activity stream and is stored
                    locally for testing until your backend
                    endpoint is connected.
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
                createActivity
              }
            >

              <Plus className="mr-2 h-4 w-4" />

              Post Activity

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}