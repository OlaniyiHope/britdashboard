import { useEffect, useMemo, useState } from "react";
import {
  Video,
  Search,
  RefreshCw,
  Play,
  Users,
  Clock,
  CalendarDays,
  Radio,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  History,
  GraduationCap,
  Loader2,
  VideoOff,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";


// ============================================================
// TYPES
// ============================================================

type StreamStatus = "scheduled" | "live" | "ended";

type LiveStream = {
  _id: string;

  title: string;

  description?: string;

  courseId?: string;

  courseName?: string;

  courseCode?: string;

  roomName?: string;

  roomUrl: string;

  status: StreamStatus;

  scheduledAt?: string;

  lecturerName?: string;

  viewers?: number;

  createdAt?: string;

  /**
   * Optional recording URL.
   *
   * Your current lecturer page does not create recordings yet,
   * so this remains optional.
   *
   * When you later connect a recording service/backend,
   * put the recording URL here.
   */
  recordingUrl?: string;

  duration?: number;
};


// ============================================================
// STORAGE KEY
// ============================================================

const STORAGE_KEY = "staff_live_streams";


// ============================================================
// HELPERS
// ============================================================

function formatDate(date?: string) {
  if (!date) {
    return "Date not available";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date not available";
  }

  return parsed.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}


function formatDuration(minutes?: number) {
  if (!minutes) {
    return "Duration unavailable";
  }

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}


// ============================================================
// STATUS BADGE
// ============================================================

function statusBadge(status: StreamStatus) {
  if (status === "live") {
    return (
      <Badge className="gap-1 bg-red-600 hover:bg-red-600">
        <Radio className="h-3 w-3 animate-pulse" />
        LIVE NOW
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
        UPCOMING
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1"
    >
      <CheckCircle2 className="h-3 w-3" />
      RECORDED
    </Badge>
  );
}


// ============================================================
// COMPONENT
// ============================================================

export default function Meetings() {
  // ==========================================================
  // STATE
  // ==========================================================

  const [streams, setStreams] =
    useState<LiveStream[]>([]);

  const [search, setSearch] =
    useState("");

  const [activeFilter, setActiveFilter] =
    useState<"all" | "live" | "upcoming" | "recorded">(
      "all"
    );

  const [loading, setLoading] =
    useState(true);

  const [selectedStream, setSelectedStream] =
    useState<LiveStream | null>(null);

  const [showPlayer, setShowPlayer] =
    useState(false);


  // ==========================================================
  // LOAD LECTURES
  // ==========================================================

  const loadStreams = () => {
    setLoading(true);

    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setStreams([]);
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setStreams(parsed);
      } else {
        setStreams([]);
      }
    } catch (error) {
      console.error(
        "Unable to load lectures:",
        error
      );

      setStreams([]);

      toast.error(
        "Unable to load lectures"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadStreams();

    /**
     * Listen for changes made by another tab.
     *
     * This is useful when testing:
     *
     * Lecturer tab
     *        ↓
     * creates live class
     *        ↓
     * Student tab
     *        ↓
     * sees the lecture
     */
    const handleStorage =
      (event: StorageEvent) => {
        if (
          event.key === STORAGE_KEY
        ) {
          loadStreams();
        }
      };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);


  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredStreams =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();

      return streams.filter(
        (stream) => {
          const matchesSearch =
            !query ||
            `${stream.title}
             ${stream.courseName}
             ${stream.courseCode}
             ${stream.lecturerName}
             ${stream.description}`
              .toLowerCase()
              .includes(query);

          let matchesFilter = true;

          if (
            activeFilter === "live"
          ) {
            matchesFilter =
              stream.status === "live";
          }

          if (
            activeFilter === "upcoming"
          ) {
            matchesFilter =
              stream.status ===
              "scheduled";
          }

          if (
            activeFilter === "recorded"
          ) {
            matchesFilter =
              stream.status === "ended";
          }

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      streams,
      search,
      activeFilter,
    ]);


  // ==========================================================
  // COUNTERS
  // ==========================================================

  const liveLectures =
    streams.filter(
      (stream) =>
        stream.status === "live"
    );

  const upcomingLectures =
    streams.filter(
      (stream) =>
        stream.status === "scheduled"
    );

  const recordedLectures =
    streams.filter(
      (stream) =>
        stream.status === "ended"
    );


  // ==========================================================
  // OPEN LECTURE
  // ==========================================================

  const openLecture = (
    stream: LiveStream
  ) => {
    setSelectedStream(stream);
    setShowPlayer(true);
  };


  // ==========================================================
  // JOIN LIVE CLASS
  // ==========================================================

  const joinLiveClass = (
    stream: LiveStream
  ) => {
    if (!stream.roomUrl) {
      toast.error(
        "Live classroom link is not available"
      );

      return;
    }

    setSelectedStream(stream);
    setShowPlayer(true);
  };


  // ==========================================================
  // OPEN EXTERNAL CLASSROOM
  // ==========================================================

  const openExternalClassroom = (
    stream: LiveStream
  ) => {
    if (!stream.roomUrl) {
      toast.error(
        "Classroom link is not available"
      );

      return;
    }

    window.open(
      stream.roomUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // ==========================================================
  // REFRESH
  // ==========================================================

  const refresh = () => {
    loadStreams();

    toast.success(
      "Lectures refreshed"
    );
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">

      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#006dcc]/10">

            <GraduationCap className="h-6 w-6 text-[#006dcc]" />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight">
              Lectures & Meetings
            </h1>

            <p className="text-sm text-muted-foreground">
              Join live lectures and watch your previous classes.
            </p>

          </div>

        </div>


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

      </div>


      {/* ==================================================== */}
      {/* LIVE NOW BANNER */}
      {/* ==================================================== */}

      {liveLectures.length > 0 && (

        <Card className="overflow-hidden border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">

          <CardContent className="p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white">

                  <Radio className="h-6 w-6 animate-pulse" />

                </div>

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="font-semibold">
                      A lecture is live now
                    </h2>

                    <Badge className="bg-red-600 hover:bg-red-600">
                      LIVE
                    </Badge>

                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">

                    {liveLectures.length === 1
                      ? "Your lecturer is currently teaching."
                      : `${liveLectures.length} lecturers are currently teaching.`}

                  </p>

                </div>

              </div>


              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() =>
                  joinLiveClass(
                    liveLectures[0]
                  )
                }
              >

                <Play className="mr-2 h-4 w-4 fill-current" />

                Join Live Class

              </Button>

            </div>

          </CardContent>

        </Card>

      )}


      {/* ==================================================== */}
      {/* STATISTICS */}
      {/* ==================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              All Lectures
            </CardDescription>

            <CardTitle className="text-2xl">
              {streams.length}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Video className="h-4 w-4" />

              All classes

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Live Now
            </CardDescription>

            <CardTitle className="text-2xl text-red-600">
              {liveLectures.length}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-red-600">

              <Radio className="h-4 w-4 animate-pulse" />

              Join now

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Upcoming
            </CardDescription>

            <CardTitle className="text-2xl">
              {upcomingLectures.length}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <CalendarDays className="h-4 w-4" />

              Scheduled classes

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Recorded
            </CardDescription>

            <CardTitle className="text-2xl">
              {recordedLectures.length}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <History className="h-4 w-4" />

              Previous classes

            </div>

          </CardContent>

        </Card>

      </div>


      {/* ==================================================== */}
      {/* SEARCH + FILTER */}
      {/* ==================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <CardTitle>
                My Lectures
              </CardTitle>

              <CardDescription>
                Join your online classes or review previous lectures.
              </CardDescription>

            </div>


            <div className="relative w-full lg:w-80">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search lectures..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </CardHeader>


        <CardContent>

          {/* FILTER BUTTONS */}

          <div className="mb-6 flex flex-wrap gap-2">

            <Button
              size="sm"
              variant={
                activeFilter === "all"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveFilter("all")
              }
            >
              All
            </Button>


            <Button
              size="sm"
              variant={
                activeFilter === "live"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveFilter("live")
              }
            >
              <Radio className="mr-2 h-4 w-4" />
              Live Now
            </Button>


            <Button
              size="sm"
              variant={
                activeFilter === "upcoming"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveFilter("upcoming")
              }
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Upcoming
            </Button>


            <Button
              size="sm"
              variant={
                activeFilter === "recorded"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setActiveFilter("recorded")
              }
            >
              <History className="mr-2 h-4 w-4" />
              Recorded
            </Button>

          </div>


          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading ? (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-2 text-sm text-muted-foreground">

                <Loader2 className="h-5 w-5 animate-spin" />

                Loading lectures...

              </div>

            </div>

          ) : filteredStreams.length === 0 ? (

            /* ================================================= */
            /* EMPTY STATE */
            /* ================================================= */

            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">

                <VideoOff className="h-8 w-8 text-muted-foreground" />

              </div>

              <h3 className="font-semibold">
                No lectures found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">

                {search
                  ? "Try changing your search."
                  : "Your lectures will appear here when lecturers create online classes."}

              </p>

            </div>

          ) : (

            /* ================================================= */
            /* LECTURES */
            /* ================================================= */

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {filteredStreams.map(
                (stream) => (

                  <Card
                    key={stream._id}
                    className="overflow-hidden transition hover:shadow-md"
                  >

                    {/* TOP */}

                    <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-[#006dcc]/10 to-[#006dcc]/5">

                      <Video className="h-12 w-12 text-[#006dcc]/60" />


                      <div className="absolute left-3 top-3">

                        {statusBadge(
                          stream.status
                        )}

                      </div>


                      {stream.status ===
                        "live" && (

                        <div className="absolute right-3 top-3">

                          <div className="flex items-center gap-1 rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white">

                            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                            LIVE

                          </div>

                        </div>

                      )}

                    </div>


                    {/* CONTENT */}

                    <CardContent className="p-5">

                      <div className="space-y-4">

                        {/* TITLE */}

                        <div>

                          <h3 className="line-clamp-2 font-semibold">

                            {stream.title}

                          </h3>

                          {stream.description && (

                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">

                              {stream.description}

                            </p>

                          )}

                        </div>


                        {/* COURSE */}

                        <div className="flex items-center gap-2 text-sm">

                          <BookOpen className="h-4 w-4 shrink-0 text-[#006dcc]" />

                          <span className="truncate">

                            {stream.courseCode
                              ? `${stream.courseCode} — `
                              : ""}

                            {stream.courseName ||
                              "Course"}

                          </span>

                        </div>


                        {/* LECTURER */}

                        {stream.lecturerName && (

                          <div className="text-sm text-muted-foreground">

                            Lecturer:{" "}

                            <span className="font-medium text-foreground">

                              {stream.lecturerName}

                            </span>

                          </div>

                        )}


                        {/* DATE */}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">

                          <CalendarDays className="h-4 w-4" />

                          {formatDate(
                            stream.scheduledAt
                          )}

                        </div>


                        {/* VIEWERS */}

                        {stream.status ===
                          "live" && (

                          <div className="flex items-center gap-2 text-sm text-red-600">

                            <Users className="h-4 w-4" />

                            {stream.viewers ||
                              0}{" "}
                            students currently in class

                          </div>

                        )}


                        {/* DURATION */}

                        {stream.status ===
                          "ended" && (

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">

                            <Clock className="h-4 w-4" />

                            {formatDuration(
                              stream.duration
                            )}

                          </div>

                        )}


                        {/* ACTION */}

                        <div className="flex gap-2 pt-2">

                          {stream.status ===
                            "live" && (

                            <Button
                              className="flex-1 bg-red-600 hover:bg-red-700"
                              onClick={() =>
                                joinLiveClass(
                                  stream
                                )
                              }
                            >

                              <Play className="mr-2 h-4 w-4 fill-current" />

                              Join Live

                            </Button>

                          )}


                          {stream.status ===
                            "scheduled" && (

                            <Button
                              variant="outline"
                              className="flex-1"
                              disabled
                            >

                              <Clock className="mr-2 h-4 w-4" />

                              Upcoming

                            </Button>

                          )}


                          {stream.status ===
                            "ended" && (

                            <Button
                              className="flex-1 bg-[#006dcc] hover:bg-[#005ca8]"
                              onClick={() =>
                                openLecture(
                                  stream
                                )
                              }
                              disabled={
                                !stream.recordingUrl
                              }
                            >

                              <Play className="mr-2 h-4 w-4" />

                              {stream.recordingUrl
                                ? "Watch Recording"
                                : "Recording Unavailable"}

                            </Button>

                          )}


                          {stream.status ===
                            "live" && (

                            <Button
                              size="icon"
                              variant="outline"
                              title="Open classroom in new tab"
                              onClick={() =>
                                openExternalClassroom(
                                  stream
                                )
                              }
                            >

                              <ExternalLink className="h-4 w-4" />

                            </Button>

                          )}

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                )
              )}

            </div>

          )}

        </CardContent>

      </Card>


      {/* ==================================================== */}
      {/* LECTURE PLAYER */}
      {/* ==================================================== */}

      <Dialog
        open={showPlayer}
        onOpenChange={
          setShowPlayer
        }
      >

        <DialogContent className="max-w-6xl p-0">

          <DialogHeader className="border-b p-4">

            <div className="flex flex-col gap-1">

              <DialogTitle>
                {selectedStream?.title}
              </DialogTitle>

              <p className="text-xs text-muted-foreground">

                {selectedStream?.courseCode
                  ? `${selectedStream.courseCode} — `
                  : ""}

                {selectedStream?.courseName}

              </p>

            </div>

          </DialogHeader>


          {selectedStream && (

            <div className="flex flex-col">

              {/* ================================================= */}
              {/* LIVE JITSI CLASSROOM */}
              {/* ================================================= */}

              {selectedStream.status ===
                "live" && (

                <div className="aspect-video w-full bg-black">

                  <iframe
                    src={`${selectedStream.roomUrl}?userInfo.displayName=Student`}
                    title="Live Lecture Classroom"
                    className="h-full w-full border-0"
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                  />

                </div>

              )}


              {/* ================================================= */}
              {/* RECORDING */}
              {/* ================================================= */}

              {selectedStream.status ===
                "ended" &&
                selectedStream.recordingUrl && (

                <div className="aspect-video w-full bg-black">

                  <video
                    src={
                      selectedStream.recordingUrl
                    }
                    controls
                    className="h-full w-full"
                  />

                </div>

              )}


              {/* ================================================= */}
              {/* INFORMATION */}
              {/* ================================================= */}

              <div className="flex flex-col gap-4 border-t p-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    {statusBadge(
                      selectedStream.status
                    )}

                  </div>

                  <p className="text-sm font-medium">

                    {selectedStream.courseCode
                      ? `${selectedStream.courseCode} — `
                      : ""}

                    {selectedStream.courseName}

                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">

                    Lecturer:{" "}

                    {selectedStream.lecturerName ||
                      "Lecturer"}

                  </p>

                </div>


                {selectedStream.status ===
                  "live" && (

                  <Button
                    variant="outline"
                    onClick={() =>
                      openExternalClassroom(
                        selectedStream
                      )
                    }
                  >

                    <ExternalLink className="mr-2 h-4 w-4" />

                    Open Full Screen

                  </Button>

                )}

              </div>

            </div>

          )}

        </DialogContent>

      </Dialog>

    </div>
  );
}