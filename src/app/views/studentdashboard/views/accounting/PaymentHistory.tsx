import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Meeting {
  id: number;
  name: string;
  instructor: string;
  startTime: string;
  duration: string;
  status: "Completed" | "Upcoming";
  meetingUrl?: string;
}

const meetings: Meeting[] = [
  {
    id: 1,
    name: "MATH 105 Lecture",
    instructor: "ABDULSALAM Abdulwasiu",
    startTime: "Tue 18 Aug 2026, 20:30",
    duration: "1 hour",
    status: "Completed",
  },
  {
    id: 2,
    name: "MTH 101 Lectures",
    instructor: "GABRIEL Samaila",
    startTime: "Tue 18 Aug 2026, 20:00",
    duration: "1 hour",
    status: "Completed",
  },
  {
    id: 3,
    name: "MTH 101 Lectures",
    instructor: "GABRIEL Samaila",
    startTime: "Mon 17 Aug 2026, 19:00",
    duration: "1 hour",
    status: "Completed",
  },
  {
    id: 4,
    name: "PHYS111",
    instructor: "DANJUMA Dauda",
    startTime: "Mon 17 Aug 2026, 19:00",
    duration: "1 hour",
    status: "Completed",
  },
  {
    id: 5,
    name: "Microsoft Excel",
    instructor: "SAFIYA Umar",
    startTime: "Sat 15 Aug 2026, 22:00",
    duration: "2 hours",
    status: "Completed",
  },
  {
    id: 6,
    name: "PHYS111",
    instructor: "DANJUMA Dauda",
    startTime: "Fri 14 Aug 2026, 19:00",
    duration: "3 hours",
    status: "Completed",
  },
  {
    id: 7,
    name: "MATH 103 CLASS",
    instructor: "SAMINU Garba",
    startTime: "Thu 13 Aug 2026, 20:00",
    duration: "30 mins",
    status: "Completed",
  },
  {
    id: 8,
    name: "MS WORD CONTINUATION",
    instructor: "SAFIYA Umar",
    startTime: "Thu 13 Aug 2026, 19:00",
    duration: "1 hour",
    status: "Completed",
  },
  {
    id: 9,
    name: "MS WORD CONTINUATION",
    instructor: "SAFIYA Umar",
    startTime: "Thu 13 Aug 2026, 17:30",
    duration: "1 hour",
    status: "Completed",
  },
  {
    id: 10,
    name: "Introduction to Computing",
    instructor: "SAFIYA Umar",
    startTime: "Thu 13 Aug 2026, 17:00",
    duration: "1 hour",
    status: "Completed",
  },
];

export default function Meetings() {
  const [entries, setEntries] = useState("10");

  const visibleMeetings = useMemo(() => {
    if (entries === "all") return meetings;

    return meetings.slice(0, Number(entries));
  }, [entries]);

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-0">
        <h2 className="text-2xl font-semibold text-slate-800">
          All Meetings
        </h2>
      </div>

      {/* Breadcrumb */}
      <div className="mt-5 border-y border-slate-200 bg-slate-50 px-4 py-4">
        <div className="text-sm text-slate-700">
          <span>Home</span>
          <span className="mx-3 text-slate-400">/</span>
          <span>Meetings</span>
        </div>
      </div>

      {/* Main Content */}
      <Card className="mt-0 border-none shadow-none">
        <CardContent className="px-0 pt-12">
          {/* Entries selector */}
          <div className="mb-24 flex items-center gap-3 px-4">
            <span className="text-sm text-slate-700">
              Show
            </span>

            <select
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              className="h-9 w-[90px] rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>

            <span className="text-sm text-slate-700">
              entries
            </span>
          </div>

          {/* Meetings Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[1100px] overflow-hidden border-t border-slate-300">
              {/* Header */}
              <div className="grid grid-cols-[minmax(500px,1fr)_280px_210px_150px] border-b border-slate-300 bg-white">
                <div className="flex items-center justify-between px-7 py-4">
                  <span className="text-sm font-bold text-slate-800">
                    Name
                  </span>

                  <span className="text-xs text-slate-400">
                    ↑↓
                  </span>
                </div>

                <div className="flex items-center justify-between border-l border-slate-200 px-5 py-4">
                  <span className="text-sm font-bold text-slate-800">
                    Start Time
                  </span>

                  <span className="text-xs text-slate-400">
                    ↑↓
                  </span>
                </div>

                <div className="border-l border-slate-200 px-5 py-4">
                  <span className="text-sm font-bold text-slate-800">
                    Start/Join
                  </span>
                </div>

                <div className="border-l border-slate-200 px-5 py-4">
                  <span className="text-sm font-bold text-slate-800">
                    Duration
                  </span>
                </div>
              </div>

              {/* Rows */}
              {visibleMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="grid min-h-[72px] grid-cols-[minmax(500px,1fr)_280px_210px_150px] border-b border-slate-200 bg-white hover:bg-slate-50"
                >
                  {/* Name */}
                  <div className="flex items-center px-7">
                    <span className="text-sm text-slate-700">
                      {meeting.name}

                      <span className="mx-1">-</span>

                      <span className="italic text-slate-600">
                        {meeting.instructor}
                      </span>
                    </span>
                  </div>

                  {/* Start Time */}
                  <div className="flex items-center border-l border-slate-200 px-5">
                    <span className="text-sm text-slate-600">
                      {meeting.startTime}
                    </span>
                  </div>

                  {/* Start / Join */}
                  <div className="flex items-center border-l border-slate-200 px-5">
                    {meeting.status === "Completed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="h-9 min-w-[105px] border-slate-300 bg-slate-50 text-xs text-slate-500"
                      >
                        Completed
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-9 min-w-[105px] bg-[#004aaa] text-xs text-white hover:bg-[#004aaa]/90"
                        onClick={() => {
                          if (meeting.meetingUrl) {
                            window.open(
                              meeting.meetingUrl,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        }}
                      >
                        Start / Join
                      </Button>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center border-l border-slate-200 px-5">
                    <span className="text-sm text-slate-600">
                      {meeting.duration}
                    </span>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {visibleMeetings.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-500">
                  No meetings found.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}