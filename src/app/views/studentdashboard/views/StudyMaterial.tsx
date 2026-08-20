import { useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Inbox,
  Send,
  MailOpen,
} from "lucide-react";

interface Message {
  id: number;
  sender: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const messages: Message[] = [];

export default function Messaging() {
  const [activeFolder, setActiveFolder] = useState<"inbox" | "sent">(
    "inbox"
  );

  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const [search, setSearch] = useState("");

  const filteredMessages = useMemo(() => {
    let result = messages;

    // Folder filtering
    if (activeFolder === "inbox") {
      result = result.filter((message) => true);
    }

    if (activeFolder === "sent") {
      result = result.filter((message) => false);
    }

    // Read / unread filtering
    if (filter === "read") {
      result = result.filter((message) => message.read);
    }

    if (filter === "unread") {
      result = result.filter((message) => !message.read);
    }

    // Search
    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (message) =>
          message.sender.toLowerCase().includes(query) ||
          message.subject.toLowerCase().includes(query) ||
          message.message.toLowerCase().includes(query)
      );
    }

    return result;
  }, [activeFolder, filter, search]);

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">Home</span>

          <span className="text-slate-400">›</span>

          <span className="font-semibold text-slate-800">
            Messaging
          </span>
        </div>
      </div>

      {/* Messaging Layout */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[270px_1fr]">
        {/* LEFT SIDEBAR */}
        <div className="space-y-3">
          {/* Compose */}
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#004aaa] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003d8f]"
          >
            <span>Compose</span>

            <Pencil className="h-4 w-4" />
          </button>

          {/* Inbox */}
          <button
            type="button"
            onClick={() => {
              setActiveFolder("inbox");
              setFilter("all");
            }}
            className={`flex h-12 w-full items-center justify-between border px-5 text-sm font-semibold transition ${
              activeFolder === "inbox"
                ? "border-slate-300 bg-white text-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Inbox className="h-4 w-4" />
              <span>Inbox</span>
            </div>

            <span className="flex h-6 min-w-7 items-center justify-center rounded-full bg-[#004aaa] px-2 text-xs font-bold text-white">
              0
            </span>
          </button>

          {/* Sent */}
          <button
            type="button"
            onClick={() => {
              setActiveFolder("sent");
              setFilter("all");
            }}
            className={`flex h-12 w-full items-center justify-between border px-5 text-sm transition ${
              activeFolder === "sent"
                ? "border-slate-300 bg-white font-semibold text-slate-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <Send className="h-4 w-4" />
              <span>Sent</span>
            </div>

            <span className="flex h-6 min-w-7 items-center justify-center rounded-full bg-[#004aaa] px-2 text-xs font-bold text-white">
              0
            </span>
          </button>
        </div>

        {/* RIGHT CONTENT */}
        <div className="rounded-sm border border-slate-200 bg-white p-4 sm:p-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search in your Inbox messages..."
              className="h-12 w-full rounded-sm border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#004aaa]"
            />

            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Filters */}
          <div className="mt-4 flex">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`border px-5 py-2 text-sm ${
                filter === "all"
                  ? "border-slate-300 bg-slate-100 font-medium text-slate-800"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("read")}
              className={`border-y border-r px-5 py-2 text-sm ${
                filter === "read"
                  ? "bg-slate-100 font-medium text-slate-800"
                  : "bg-white text-slate-600"
              }`}
            >
              Read
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`border-y border-r px-5 py-2 text-sm ${
                filter === "unread"
                  ? "bg-slate-100 font-medium text-slate-800"
                  : "bg-white text-slate-600"
              }`}
            >
              Unread
            </button>
          </div>

          {/* Messages */}
          <div className="mt-5">
            {filteredMessages.length === 0 ? (
              <div className="flex min-h-[72px] items-center border border-slate-200 bg-white px-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[#4c86ad]">
                    <MailOpen className="h-5 w-5 text-white" />
                  </div>

                  <p className="text-sm font-semibold text-slate-700">
                    You have no messages.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 border border-slate-200">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="cursor-pointer px-5 py-4 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {message.sender}
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {message.subject}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {message.message}
                        </p>
                      </div>

                      <span className="whitespace-nowrap text-xs text-slate-500">
                        {message.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}