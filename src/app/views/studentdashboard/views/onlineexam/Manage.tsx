import { useContext, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { SessionContext } from "@/contexts/SessionContext";
import { Zap } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type Activity = {
  _id?: string;
  message: string;
  timeAgo: string;
  date: string; // ISO date, used only for grouping/sorting
  variant?: "default" | "link"; // "link" = actionable (quiz, discussion, meeting invite)
};

// ─────────────────────────────────────────────────────────────────────────
// Fallback/mock data — swap out once the real activity-stream endpoint
// exists. Actor names below are placeholders, not real people.
// ─────────────────────────────────────────────────────────────────────────

const fallbackActivities: Activity[] = [
  { date: "2026-08-18", timeAgo: "14 hours ago", message: "Adebayo Michael has started MTH 101 Lectures meeting", variant: "link" },
  { date: "2026-08-18", timeAgo: "14 hours ago", message: "Ngozi Peters has invited you to a meeting for Differential and Integral Calculus - MATH 105", variant: "link" },
  { date: "2026-08-18", timeAgo: "14 hours ago", message: "Reminder: Ngozi Peters has invited you to a meeting" },
  { date: "2026-08-18", timeAgo: "15 hours ago", message: "Adebayo Michael has invited you to a meeting for Sets and Number System - MATH 101", variant: "link" },
  { date: "2026-08-18", timeAgo: "15 hours ago", message: "Reminder: Adebayo Michael has invited you to a meeting" },

  { date: "2026-08-17", timeAgo: "2 days ago", message: "Ibrahim Tanko has started PHYS 111 meeting", variant: "link" },
  { date: "2026-08-17", timeAgo: "2 days ago", message: "Adebayo Michael has started MTH 101 Lectures meeting - Sets and Number System - MATH 101 course", variant: "link" },
  { date: "2026-08-17", timeAgo: "2 days ago", message: 'You have a new quiz "maths 101 quiz" in Sets and Number System - MATH 101', variant: "link" },
  { date: "2026-08-17", timeAgo: "2 days ago", message: "Adebayo Michael has invited you to a meeting for Sets and Number System - MATH 101", variant: "link" },
  { date: "2026-08-17", timeAgo: "2 days ago", message: "Reminder: Adebayo Michael has invited you to a meeting" },

  { date: "2026-08-15", timeAgo: "4 days ago", message: "Grace Eze has started Microsoft Excel meeting", variant: "link" },

  { date: "2026-08-14", timeAgo: "5 days ago", message: 'You have a New Group Discussion "FRM3" in Mechanics - PHYS 111 course', variant: "link" },
];

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatGroupLabel(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleDateString(undefined, { month: "long" });
  return `${month} ${ordinal(d.getDate())} ${d.getFullYear()}`;
}

function groupByDate(activities: Activity[]) {
  const groups = new Map<string, Activity[]>();
  // preserve most-recent-first order as provided
  for (const activity of activities) {
    const label = formatGroupLabel(activity.date);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(activity);
  }
  return Array.from(groups.entries());
}

function DateBanner({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative inline-flex items-center bg-slate-800 py-1.5 pl-4 pr-7 text-xs font-bold text-white"
      style={{ clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)" }}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function ActivityStream() {
  const { currentSession } = useContext(SessionContext);

  const { data, loading } = useFetch(
    currentSession?._id ? `/activity-stream/${currentSession._id}` : null
  );
  const activities: Activity[] =
    Array.isArray(data) && data.length > 0 ? (data as Activity[]) : fallbackActivities;

  const grouped = useMemo(() => groupByDate(activities), [activities]);

  return (
    <div className="space-y-4">
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="flex items-center gap-2 p-4 text-sm font-semibold text-slate-700">
          <Zap className="h-4 w-4 text-[#081022]" />
          Activity Stream
        </CardContent>
      </Card>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Loading activity…
        </p>
      ) : grouped.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          No recent activity.
        </p>
      ) : (
        <div className="space-y-5">
          {grouped.map(([label, items]) => (
            <div key={label} className="space-y-2">
              <DateBanner>{label}</DateBanner>
              <Card className="border-none shadow-sm ring-1 ring-slate-200">
                <CardContent className="divide-y divide-slate-100 p-0">
                  {items.map((activity, i) => (
                    <div
                      key={activity._id || i}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
                    >
                      <span
                        className={
                          activity.variant === "link"
                            ? "text-blue-600 hover:underline cursor-pointer"
                            : "text-slate-700"
                        }
                      >
                        {activity.message}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {activity.timeAgo}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
