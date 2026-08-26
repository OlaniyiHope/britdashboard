import { useMemo, useState } from "react";
import {
  Search,
  Send,
  Plus,
  MoreHorizontal,
  Paperclip,
  Smile,
  CheckCheck,
  Users,
  UserRound,
  MessageSquare,
  X,
  ChevronDown,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type UserType = "Student" | "Staff";

interface Conversation {
  id: string;
  name: string;
  type: UserType;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: "admin" | "user";
  message: string;
  time: string;
  read?: boolean;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY CONVERSATIONS
|--------------------------------------------------------------------------
|
| Replace with API data when your messaging backend is connected.
|
*/

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Daniel Mensah",
    type: "Student",
    role: "Computer Science • 200 Level",
    avatar: "DM",
    lastMessage: "Thank you, I have received the information.",
    time: "10:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Dr. Michael Anderson",
    type: "Staff",
    role: "Lecturer • Computing & Technology",
    avatar: "MA",
    lastMessage: "The updated course materials are ready.",
    time: "9:31 AM",
    unread: 1,
    online: true,
  },
  {
    id: "3",
    name: "Sarah Williams",
    type: "Student",
    role: "Business Administration • 200 Level",
    avatar: "SW",
    lastMessage: "Please, can you clarify the registration deadline?",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "4",
    name: "Prof. James Okoro",
    type: "Staff",
    role: "Head of Department • Engineering",
    avatar: "JO",
    lastMessage: "I will send the department report shortly.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Esther Adams",
    type: "Student",
    role: "Information Technology • 200 Level",
    avatar: "EA",
    lastMessage: "I have a question about my result.",
    time: "Mon",
    unread: 0,
    online: false,
  },
];

/*
|--------------------------------------------------------------------------
| TEMPORARY MESSAGE DATA
|--------------------------------------------------------------------------
*/

const messageData: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "user",
      message:
        "Good morning Admin. I wanted to confirm if my course registration has been approved.",
      time: "10:35 AM",
      read: true,
    },
    {
      id: "2",
      sender: "admin",
      message:
        "Good morning Daniel. Yes, your course registration has been approved.",
      time: "10:39 AM",
      read: true,
    },
    {
      id: "3",
      sender: "user",
      message:
        "Thank you, I have received the information.",
      time: "10:42 AM",
      read: true,
    },
  ],

  "2": [
    {
      id: "1",
      sender: "user",
      message:
        "Good morning Admin. The updated course materials are ready.",
      time: "9:30 AM",
      read: true,
    },
    {
      id: "2",
      sender: "user",
      message:
        "The materials have been uploaded for the students.",
      time: "9:31 AM",
      read: false,
    },
  ],

  "3": [
    {
      id: "1",
      sender: "user",
      message:
        "Please, can you clarify the registration deadline?",
      time: "Yesterday",
      read: true,
    },
    {
      id: "2",
      sender: "admin",
      message:
        "The current registration deadline is Friday. Please complete your registration before then.",
      time: "Yesterday",
      read: true,
    },
  ],

  "4": [
    {
      id: "1",
      sender: "user",
      message:
        "I will send the department report shortly.",
      time: "Yesterday",
      read: true,
    },
  ],

  "5": [
    {
      id: "1",
      sender: "user",
      message:
        "I have a question about my result.",
      time: "Mon",
      read: true,
    },
  ],
};

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function Messaging() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Unread" | "Students" | "Staff">(
    "All"
  );

  const [selectedId, setSelectedId] = useState("1");

  const [message, setMessage] = useState("");

  const [showNewMessage, setShowNewMessage] = useState(false);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  /*
  |--------------------------------------------------------------------------
  | FILTER CONVERSATIONS
  |--------------------------------------------------------------------------
  */

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        !query ||
        conversation.name.toLowerCase().includes(query) ||
        conversation.role.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query);

      const matchesFilter =
        filter === "All" ||
        (filter === "Unread" && conversation.unread > 0) ||
        (filter === "Students" && conversation.type === "Student") ||
        (filter === "Staff" && conversation.type === "Staff");

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const unreadCount = conversations.reduce(
    (total, conversation) => total + conversation.unread,
    0
  );

  const studentConversationCount = conversations.filter(
    (conversation) => conversation.type === "Student"
  ).length;

  const staffConversationCount = conversations.filter(
    (conversation) => conversation.type === "Staff"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | SEND MESSAGE
  |--------------------------------------------------------------------------
  */

  const sendMessage = () => {
    if (!message.trim()) return;

    /*
     * Connect this to your backend later.
     */

    setMessage("");
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <MessageSquare className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Messaging
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Communicate with students and staff from one place.
            </p>
          </div>

        </div>

        <Button
          onClick={() => setShowNewMessage(true)}
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
        >
          <Plus className="h-4 w-4" />
          New Message
        </Button>

      </div>

      {/* ============================================================
          SUMMARY
      ============================================================ */}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Conversations
              </p>

              <p className="mt-2 text-2xl font-black text-[#081022]">
                {conversations.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <MessageSquare className="h-5 w-5" />
            </div>

          </div>
        </Card>

        <Card className="border-none bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Unread Messages
              </p>

              <p className="mt-2 text-2xl font-black text-[#081022]">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <MessageSquare className="h-5 w-5" />
            </div>

          </div>
        </Card>

        <Card className="border-none bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Students
              </p>

              <p className="mt-2 text-2xl font-black text-[#081022]">
                {studentConversationCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <UserRound className="h-5 w-5" />
            </div>

          </div>
        </Card>

        <Card className="border-none bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-slate-500">
                Staff
              </p>

              <p className="mt-2 text-2xl font-black text-[#081022]">
                {staffConversationCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="h-5 w-5" />
            </div>

          </div>
        </Card>

      </div>

      {/* ============================================================
          MESSAGING PANEL
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="grid min-h-[650px] lg:grid-cols-[350px_1fr]">

          {/* ========================================================
              LEFT — CONVERSATIONS
          ======================================================== */}

          <div className="flex flex-col border-b border-slate-200 lg:border-b-0 lg:border-r">

            {/* Search */}

            <div className="border-b border-slate-200 p-4">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search conversations..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Filters */}

              <div className="mt-3 flex gap-2 overflow-x-auto">

                {(["All", "Unread", "Students", "Staff"] as const).map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFilter(item)}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                        filter === item
                          ? "bg-[#081022] text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              </div>

            </div>

            {/* Conversation List */}

            <div className="flex-1 overflow-y-auto">

              {filteredConversations.length === 0 ? (

                <div className="px-5 py-12 text-center">

                  <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    No conversations found
                  </p>

                </div>

              ) : (

                filteredConversations.map((conversation) => (

                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      setSelectedId(conversation.id)
                    }
                    className={`flex w-full gap-3 border-b border-slate-100 px-4 py-4 text-left transition ${
                      selectedId === conversation.id
                        ? "bg-blue-50/70"
                        : "hover:bg-slate-50"
                    }`}
                  >

                    {/* Avatar */}

                    <div className="relative shrink-0">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                        {conversation.avatar}
                      </div>

                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      )}

                    </div>

                    {/* Details */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-2">

                        <p className="truncate text-sm font-bold text-[#081022]">
                          {conversation.name}
                        </p>

                        <span className="shrink-0 text-[10px] text-slate-400">
                          {conversation.time}
                        </span>

                      </div>

                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        {conversation.type} • {conversation.role}
                      </p>

                      <div className="mt-1 flex items-center justify-between gap-2">

                        <p className="truncate text-xs text-slate-500">
                          {conversation.lastMessage}
                        </p>

                        {conversation.unread > 0 && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#006dcc] px-1.5 text-[10px] font-bold text-white">
                            {conversation.unread}
                          </span>
                        )}

                      </div>

                    </div>

                  </button>

                ))

              )}

            </div>

          </div>

          {/* ========================================================
              RIGHT — CHAT
          ======================================================== */}

          <div className="flex min-h-[600px] flex-col">

            {selectedConversation ? (
              <>
                {/* Chat Header */}

                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

                  <div className="flex items-center gap-3">

                    <div className="relative">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                        {selectedConversation.avatar}
                      </div>

                      {selectedConversation.online && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      )}

                    </div>

                    <div>

                      <p className="text-sm font-bold text-[#081022]">
                        {selectedConversation.name}
                      </p>

                      <p className="text-[11px] text-slate-500">
                        {selectedConversation.type} •{" "}
                        {selectedConversation.role}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                </div>

                {/* Messages */}

                <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-5">

                  {(messageData[selectedId] || []).map(
                    (item) => {

                      const isAdmin =
                        item.sender === "admin";

                      return (
                        <div
                          key={item.id}
                          className={`flex ${
                            isAdmin
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`max-w-[75%] ${
                              isAdmin
                                ? "items-end"
                                : "items-start"
                            }`}
                          >

                            <div
                              className={`rounded-2xl px-4 py-3 text-sm ${
                                isAdmin
                                  ? "rounded-br-md bg-[#006dcc] text-white"
                                  : "rounded-bl-md bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
                              }`}
                            >
                              {item.message}
                            </div>

                            <div
                              className={`mt-1 flex items-center gap-1 text-[10px] text-slate-400 ${
                                isAdmin
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <span>
                                {item.time}
                              </span>

                              {isAdmin && (
                                <CheckCheck className="h-3 w-3" />
                              )}
                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* Composer */}

                <div className="border-t border-slate-200 bg-white p-4">

                  <div className="flex items-end gap-2">

                    <button
                      type="button"
                      className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>

                    <div className="relative flex-1">

                      <textarea
                        value={message}
                        onChange={(event) =>
                          setMessage(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.shiftKey
                          ) {
                            event.preventDefault();
                            sendMessage();
                          }
                        }}
                        rows={2}
                        placeholder="Type a message..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />

                      <button
                        type="button"
                        className="absolute bottom-3 right-3 text-slate-400 hover:text-slate-600"
                      >
                        <Smile className="h-4 w-4" />
                      </button>

                    </div>

                    <Button
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="mb-1 h-9 w-9 shrink-0 rounded-lg bg-[#006dcc] p-0 hover:bg-[#005ca8]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>

                  </div>

                  <p className="mt-2 text-[10px] text-slate-400">
                    Press Enter to send • Shift + Enter for a new line
                  </p>

                </div>
              </>
            ) : (

              <div className="flex flex-1 items-center justify-center">

                <div className="text-center">

                  <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />

                  <p className="mt-3 text-sm font-bold text-slate-500">
                    Select a conversation
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Choose a conversation from the list to start messaging.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </Card>

      {/* ============================================================
          NEW MESSAGE MODAL
      ============================================================ */}

      {showNewMessage && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="text-sm font-bold text-[#081022]">
                  New Message
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Start a conversation with a student or staff member.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewMessage(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-4 p-5">

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Recipient
                </label>

                <div className="relative">

                  <select className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm outline-none focus:border-[#006dcc]">
                    <option value="">
                      Select recipient
                    </option>

                    {conversations.map((conversation) => (
                      <option
                        key={conversation.id}
                        value={conversation.id}
                      >
                        {conversation.name} —{" "}
                        {conversation.type}
                      </option>
                    ))}

                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">

              <Button
                variant="outline"
                onClick={() => setShowNewMessage(false)}
              >
                Cancel
              </Button>

              <Button
                className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                onClick={() => setShowNewMessage(false)}
              >
                <Send className="h-4 w-4" />
                Send Message
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}