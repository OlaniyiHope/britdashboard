import { useMemo, useState } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Send,
  Users,
  X,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type NotificationStatus =
  | "Sent"
  | "Scheduled"
  | "Draft"
  | "Failed";

type NotificationChannel =
  | "In-App"
  | "Email"
  | "SMS"
  | "All Channels";

interface Notification {
  id: string;
  title: string;
  message: string;
  audience: string;
  channel: NotificationChannel;
  recipients: number;
  status: NotificationStatus;
  created: string;
  scheduledFor?: string;
  sentAt?: string;
}

const notifications: Notification[] = [
  {
    id: "NTF-001",
    title: "Course Registration Reminder",
    message:
      "Course registration for the 2026/2027 academic session closes soon.",
    audience: "All Students",
    channel: "In-App",
    recipients: 1248,
    status: "Sent",
    created: "25 Aug 2026",
    sentAt: "25 Aug 2026, 09:30 AM",
  },
  {
    id: "NTF-002",
    title: "Lecturer Meeting",
    message:
      "All lecturers are reminded of the academic staff meeting scheduled for Friday.",
    audience: "Lecturers",
    channel: "Email",
    recipients: 86,
    status: "Scheduled",
    created: "25 Aug 2026",
    scheduledFor: "28 Aug 2026, 08:00 AM",
  },
  {
    id: "NTF-003",
    title: "Admission Application Update",
    message:
      "Admission applications are currently being reviewed by the admissions team.",
    audience: "Applicants",
    channel: "All Channels",
    recipients: 342,
    status: "Sent",
    created: "24 Aug 2026",
    sentAt: "24 Aug 2026, 02:15 PM",
  },
  {
    id: "NTF-004",
    title: "Semester Examination Notice",
    message:
      "The examination timetable will be published shortly.",
    audience: "200 Level Students",
    channel: "In-App",
    recipients: 318,
    status: "Draft",
    created: "24 Aug 2026",
  },
  {
    id: "NTF-005",
    title: "System Maintenance",
    message:
      "The student portal will be temporarily unavailable for scheduled maintenance.",
    audience: "All Users",
    channel: "Email",
    recipients: 1489,
    status: "Failed",
    created: "23 Aug 2026",
  },
];

function StatusBadge({
  status,
}: {
  status: NotificationStatus;
}) {
  const styles: Record<NotificationStatus, string> = {
    Sent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function Notifications() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const [showComposer, setShowComposer] = useState(false);

  const sentCount = notifications.filter(
    (item) => item.status === "Sent"
  ).length;

  const scheduledCount = notifications.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const draftCount = notifications.filter(
    (item) => item.status === "Draft"
  ).length;

  const totalRecipients = notifications.reduce(
    (total, item) => total + item.recipients,
    0
  );

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      const matchesSearch =
        !query ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.audience.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        notification.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Notifications
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Create, send, schedule and monitor institution-wide notifications.
            </p>
          </div>

        </div>

        <Button
          onClick={() => setShowComposer(true)}
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
        >
          <Plus className="h-4 w-4" />
          Create Notification
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Sent
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {sentCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Successfully delivered
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Scheduled
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {scheduledCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Waiting to be delivered
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <CalendarClock className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Drafts
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {draftCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Not yet published
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FileText className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Recipients
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalRecipients.toLocaleString()}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Across notification records
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Users className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          QUICK ACTIONS
      ============================================================ */}

      <div className="grid gap-4 md:grid-cols-3">

        <button
          onClick={() => setShowComposer(true)}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Send className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-bold text-[#081022]">
            Send Notification
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Send an immediate notification to selected users.
          </p>
        </button>

        <button
          onClick={() => setShowComposer(true)}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
            <CalendarClock className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-bold text-[#081022]">
            Schedule Notification
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Prepare a notification for delivery at a future time.
          </p>
        </button>

        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("Draft");
          }}
          className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <FileText className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-bold text-[#081022]">
            View Drafts
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Continue working on saved notification drafts.
          </p>
        </button>

      </div>

      {/* ============================================================
          SEARCH / FILTER
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search notifications by title, message or audience..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Status</option>
              <option value="Sent">Sent</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
              <option value="Failed">Failed</option>
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          NOTIFICATION TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-sm font-bold text-[#081022]">
            Notification History
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Review notifications that have been sent, scheduled or saved.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Notification
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Audience
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Channel
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Recipients
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredNotifications.map((notification) => (

                <tr
                  key={notification.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <Bell className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-[#081022]">
                          {notification.title}
                        </p>

                        <p className="mt-1 max-w-[300px] truncate text-xs text-slate-500">
                          {notification.message}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-slate-700">
                      {notification.audience}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                      {notification.channel === "Email" ? (
                        <Mail className="h-3.5 w-3.5" />
                      ) : notification.channel === "In-App" ? (
                        <Bell className="h-3.5 w-3.5" />
                      ) : (
                        <MessageSquare className="h-3.5 w-3.5" />
                      )}
                      {notification.channel}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold text-slate-700">
                      {notification.recipients.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={notification.status} />
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-xs text-slate-500">

                      {notification.status === "Scheduled" ? (
                        <Clock3 className="h-3.5 w-3.5" />
                      ) : (
                        <CalendarClock className="h-3.5 w-3.5" />
                      )}

                      {notification.scheduledFor ||
                        notification.sentAt ||
                        notification.created}

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedNotification(notification)
                        }
                        className="h-8 gap-1.5 border-slate-200 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>

                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

      {/* ============================================================
          CREATE NOTIFICATION MODAL
      ============================================================ */}

      {showComposer && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-[#081022]">
                  Create Notification
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Compose a notification for students, staff or other users.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div>

                <label className="text-xs font-bold text-slate-600">
                  Notification Title
                </label>

                <input
                  placeholder="Enter notification title"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="text-xs font-bold text-slate-600">
                    Audience
                  </label>

                  <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
                    <option>All Users</option>
                    <option>All Students</option>
                    <option>All Lecturers</option>
                    <option>Applicants</option>
                    <option>100 Level Students</option>
                    <option>200 Level Students</option>
                    <option>300 Level Students</option>
                    <option>400 Level Students</option>
                    <option>Specific Programme</option>
                    <option>Specific Department</option>
                  </select>

                </div>

                <div>

                  <label className="text-xs font-bold text-slate-600">
                    Delivery Channel
                  </label>

                  <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
                    <option>In-App</option>
                    <option>Email</option>
                    <option>SMS</option>
                    <option>All Channels</option>
                  </select>

                </div>

              </div>

              <div>

                <label className="text-xs font-bold text-slate-600">
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="Write your notification message..."
                  className="mt-2 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="text-xs font-bold text-slate-600">
                  Delivery
                </label>

                <select className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
                  <option>Send Immediately</option>
                  <option>Schedule for Later</option>
                  <option>Save as Draft</option>
                </select>

              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <div className="flex gap-3">

                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

                  <div>

                    <p className="text-xs font-bold text-blue-900">
                      Notification Preview
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-800">
                      The notification will be delivered to the selected
                      audience through the selected channel.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

              <Button
                variant="outline"
                onClick={() => setShowComposer(false)}
              >
                Cancel
              </Button>

              <Button
                variant="outline"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Save Draft
              </Button>

              <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                <Send className="h-4 w-4" />
                Send Notification
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ============================================================
          VIEW NOTIFICATION MODAL
      ============================================================ */}

      {selectedNotification && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="bg-[#081022] p-6 text-white">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <Bell className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-lg font-bold">
                      {selectedNotification.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-300">
                      {selectedNotification.id}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedNotification.status}
                    />
                  </div>

                </div>

                <div className="text-right">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recipients
                  </p>

                  <p className="mt-1 text-lg font-black text-[#081022]">
                    {selectedNotification.recipients.toLocaleString()}
                  </p>

                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Message
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedNotification.message}
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Audience
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedNotification.audience}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Channel
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {selectedNotification.channel}
                  </p>

                </div>

              </div>

              {selectedNotification.scheduledFor && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <div className="flex items-center gap-2">

                    <CalendarClock className="h-4 w-4 text-blue-700" />

                    <p className="text-xs font-bold text-blue-900">
                      Scheduled Delivery
                    </p>

                  </div>

                  <p className="mt-1 text-sm text-blue-800">
                    {selectedNotification.scheduledFor}
                  </p>

                </div>
              )}

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}