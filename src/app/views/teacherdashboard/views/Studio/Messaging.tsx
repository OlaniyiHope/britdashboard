import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Send,
  MoreVertical,
  MessageSquare,
  Users,
  User,
  ShieldCheck,
  Trash2,
  Archive,
  Paperclip,
  Smile,
  ArrowLeft,
  CheckCheck,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

import { Textarea } from "@/components/ui/textarea";

import { toast } from "sonner";


// ============================================================
// TYPES
// ============================================================

type UserType =
  | "student"
  | "staff"
  | "admin";


type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
};


type Conversation = {
  id: string;

  participantId: string;

  participantName: string;

  participantRole: UserType;

  course?: string;

  lastMessage: string;

  lastMessageTime: string;

  unreadCount: number;

  messages: Message[];
};


// ============================================================
// CURRENT STAFF
// ============================================================

const CURRENT_STAFF_ID = "staff-001";


// ============================================================
// DEMO CONVERSATIONS
// ============================================================

const initialConversations: Conversation[] = [
  {
    id: "conversation-1",

    participantId: "student-001",

    participantName: "Daniel Okafor",

    participantRole: "student",

    course: "Computer Engineering",

    lastMessage:
      "Good afternoon sir, I have a question about today's lecture.",

    lastMessageTime: "10:42 AM",

    unreadCount: 2,

    messages: [
      {
        id: "message-1",

        senderId: "student-001",

        senderName: "Daniel Okafor",

        text:
          "Good afternoon sir, I have a question about today's lecture.",

        timestamp: "10:40 AM",

        read: false,
      },

      {
        id: "message-2",

        senderId: "student-001",

        senderName: "Daniel Okafor",

        text:
          "Please can you explain the practical assignment again?",

        timestamp: "10:42 AM",

        read: false,
      },
    ],
  },

  {
    id: "conversation-2",

    participantId: "staff-002",

    participantName: "Michael Adeyemi",

    participantRole: "staff",

    course: "Electrical Engineering",

    lastMessage:
      "I have uploaded the revised course material.",

    lastMessageTime: "Yesterday",

    unreadCount: 0,

    messages: [
      {
        id: "message-3",

        senderId: "staff-002",

        senderName: "Michael Adeyemi",

        text:
          "I have uploaded the revised course material.",

        timestamp: "Yesterday",

        read: true,
      },

      {
        id: "message-4",

        senderId: CURRENT_STAFF_ID,

        senderName: "You",

        text:
          "Great. I will review it before the next lecture.",

        timestamp: "Yesterday",

        read: true,
      },
    ],
  },

  {
    id: "conversation-3",

    participantId: "admin-001",

    participantName: "Academic Administrator",

    participantRole: "admin",

    lastMessage:
      "The timetable has been updated for next week.",

    lastMessageTime: "Monday",

    unreadCount: 1,

    messages: [
      {
        id: "message-5",

        senderId: "admin-001",

        senderName: "Academic Administrator",

        text:
          "The timetable has been updated for next week.",

        timestamp: "Monday",

        read: false,
      },
    ],
  },

  {
    id: "conversation-4",

    participantId: "student-002",

    participantName: "Sarah Williams",

    participantRole: "student",

    course: "Software Engineering",

    lastMessage:
      "Thank you sir, that makes sense now.",

    lastMessageTime: "Friday",

    unreadCount: 0,

    messages: [
      {
        id: "message-6",

        senderId: CURRENT_STAFF_ID,

        senderName: "You",

        text:
          "Please check chapter 4 of the course material.",

        timestamp: "Friday",

        read: true,
      },

      {
        id: "message-7",

        senderId: "student-002",

        senderName: "Sarah Williams",

        text:
          "Thank you sir, that makes sense now.",

        timestamp: "Friday",

        read: true,
      },
    ],
  },
];


// ============================================================
// HELPER
// ============================================================

function getRoleLabel(role: UserType) {
  switch (role) {
    case "student":
      return "Student";

    case "staff":
      return "Staff";

    case "admin":
      return "Administrator";

    default:
      return "User";
  }
}


function getRoleIcon(role: UserType) {
  switch (role) {
    case "student":
      return <User className="h-4 w-4" />;

    case "staff":
      return <Users className="h-4 w-4" />;

    case "admin":
      return <ShieldCheck className="h-4 w-4" />;

    default:
      return <User className="h-4 w-4" />;
  }
}


// ============================================================
// COMPONENT
// ============================================================

export default function StaffMessaging() {
  const [conversations, setConversations] = useState<
    Conversation[]
  >(initialConversations);

  const [search, setSearch] = useState("");

  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(
      initialConversations[0]?.id || null
    );

  const [message, setMessage] = useState("");

  const [showNewMessage, setShowNewMessage] =
    useState(false);

  const [newRecipient, setNewRecipient] =
    useState("");

  const [newSubject, setNewSubject] =
    useState("");

  const [newMessage, setNewMessage] =
    useState("");


  // ============================================================
  // FILTER CONVERSATIONS
  // ============================================================

  const filteredConversations = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      `
      ${conversation.participantName}
      ${conversation.participantRole}
      ${conversation.course || ""}
      ${conversation.lastMessage}
      `
        .toLowerCase()
        .includes(query)
    );
  }, [conversations, search]);


  // ============================================================
  // SELECTED CONVERSATION
  // ============================================================

  const selectedConversation =
    conversations.find(
      (conversation) =>
        conversation.id === selectedConversationId
    ) || null;


  // ============================================================
  // UNREAD COUNT
  // ============================================================

  const unreadCount = conversations.reduce(
    (total, conversation) =>
      total + conversation.unreadCount,
    0
  );


  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const sendMessage = () => {
    if (!selectedConversation) {
      return;
    }

    if (!message.trim()) {
      return;
    }


    const newMsg: Message = {
      id: crypto.randomUUID(),

      senderId: CURRENT_STAFF_ID,

      senderName: "You",

      text: message.trim(),

      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      read: true,
    };


    setConversations((previous) =>
      previous.map((conversation) => {
        if (
          conversation.id !==
          selectedConversation.id
        ) {
          return conversation;
        }

        return {
          ...conversation,

          lastMessage: newMsg.text,

          lastMessageTime: newMsg.timestamp,

          messages: [
            ...conversation.messages,
            newMsg,
          ],
        };
      })
    );


    setMessage("");

    toast.success("Message sent");
  };


  // ============================================================
  // START NEW MESSAGE
  // ============================================================

  const startNewMessage = () => {
    if (!newRecipient) {
      toast.error("Select a recipient");
      return;
    }

    if (!newMessage.trim()) {
      toast.error("Enter your message");
      return;
    }


    const recipientMap: Record<
      string,
      {
        id: string;
        name: string;
        role: UserType;
        course?: string;
      }
    > = {
      student: {
        id: "student-new",
        name: "New Student",
        role: "student",
        course: "Student",
      },

      staff: {
        id: "staff-new",
        name: "New Staff Member",
        role: "staff",
        course: "Staff",
      },

      admin: {
        id: "admin-new",
        name: "Academic Administrator",
        role: "admin",
        course: "Administration",
      },
    };


    const recipient =
      recipientMap[newRecipient];


    if (!recipient) {
      toast.error("Invalid recipient");
      return;
    }


    const timestamp =
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });


    const firstMessage: Message = {
      id: crypto.randomUUID(),

      senderId: CURRENT_STAFF_ID,

      senderName: "You",

      text: newMessage.trim(),

      timestamp,

      read: true,
    };


    const newConversation: Conversation = {
      id: crypto.randomUUID(),

      participantId: recipient.id,

      participantName: recipient.name,

      participantRole: recipient.role,

      course: recipient.course,

      lastMessage: newMessage.trim(),

      lastMessageTime: timestamp,

      unreadCount: 0,

      messages: [firstMessage],
    };


    setConversations((previous) => [
      newConversation,
      ...previous,
    ]);


    setSelectedConversationId(
      newConversation.id
    );


    setShowNewMessage(false);

    setNewRecipient("");

    setNewSubject("");

    setNewMessage("");

    toast.success("Message sent");
  };


  // ============================================================
  // DELETE CONVERSATION
  // ============================================================

  const deleteConversation = (
    conversationId: string
  ) => {
    setConversations((previous) =>
      previous.filter(
        (conversation) =>
          conversation.id !== conversationId
      )
    );


    if (
      selectedConversationId ===
      conversationId
    ) {
      setSelectedConversationId(null);
    }


    toast.success("Conversation deleted");
  };


  // ============================================================
  // MARK AS READ
  // ============================================================

  const markAsRead = (
    conversationId: string
  ) => {
    setConversations((previous) =>
      previous.map((conversation) => {
        if (
          conversation.id !==
          conversationId
        ) {
          return conversation;
        }

        return {
          ...conversation,

          unreadCount: 0,

          messages:
            conversation.messages.map(
              (msg) => ({
                ...msg,
                read: true,
              })
            ),
        };
      })
    );
  };


  // ============================================================
  // SELECT CONVERSATION
  // ============================================================

  const selectConversation = (
    conversationId: string
  ) => {
    setSelectedConversationId(
      conversationId
    );

    markAsRead(conversationId);
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex min-h-full flex-col gap-6 p-4 md:p-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">

              <MessageSquare className="h-5 w-5 text-[#006dcc]" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Messaging
              </h1>

              <p className="text-sm text-muted-foreground">
                Communicate with students, staff and administrators.
              </p>

            </div>

          </div>

        </div>


        <Button
          className="bg-[#006dcc] hover:bg-[#005ca8]"
          onClick={() =>
            setShowNewMessage(true)
          }
        >

          <Plus className="mr-2 h-4 w-4" />

          New Message

        </Button>

      </div>


      {/* ====================================================== */}
      {/* STATISTICS */}
      {/* ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Conversations
            </CardDescription>

            <CardTitle className="text-2xl">
              {conversations.length}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <MessageSquare className="h-4 w-4" />

              Total conversations

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Unread Messages
            </CardDescription>

            <CardTitle className="text-2xl">
              {unreadCount}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <CheckCheck className="h-4 w-4" />

              Messages requiring attention

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Contacts
            </CardDescription>

            <CardTitle className="text-2xl">
              Students & Staff
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Users className="h-4 w-4" />

              Internal communication

            </div>

          </CardContent>

        </Card>

      </div>


      {/* ====================================================== */}
      {/* MESSAGING AREA */}
      {/* ====================================================== */}

      <Card className="flex min-h-[600px] flex-1 overflow-hidden">

        <div className="flex w-full flex-col md:flex-row">

          {/* ================================================== */}
          {/* CONVERSATIONS */}
          {/* ================================================== */}

          <div
            className={`
              w-full border-r
              md:w-[340px]
              ${
                selectedConversation
                  ? "hidden md:flex"
                  : "flex"
              }
              flex-col
            `}
          >

            <div className="border-b p-4">

              <div className="mb-3">

                <CardTitle className="text-lg">
                  Conversations
                </CardTitle>

                <CardDescription>
                  Your recent messages
                </CardDescription>

              </div>


              <div className="relative">

                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-9"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>


            <div className="flex-1 overflow-y-auto">

              {filteredConversations.length ===
              0 ? (

                <div className="flex h-48 flex-col items-center justify-center px-4 text-center">

                  <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground" />

                  <p className="font-medium">
                    No conversations
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Start a new message to begin a conversation.
                  </p>

                </div>

              ) : (

                filteredConversations.map(
                  (conversation) => (

                    <button
                      key={
                        conversation.id
                      }
                      type="button"
                      onClick={() =>
                        selectConversation(
                          conversation.id
                        )
                      }
                      className={`
                        w-full border-b p-4 text-left
                        transition
                        hover:bg-muted/50
                        ${
                          selectedConversationId ===
                          conversation.id
                            ? "bg-muted"
                            : ""
                        }
                      `}
                    >

                      <div className="flex gap-3">

                        {/* AVATAR */}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006dcc]/10 text-[#006dcc]">

                          {getRoleIcon(
                            conversation.participantRole
                          )}

                        </div>


                        {/* DETAILS */}

                        <div className="min-w-0 flex-1">

                          <div className="flex items-center justify-between gap-2">

                            <p className="truncate text-sm font-semibold">

                              {
                                conversation.participantName
                              }

                            </p>

                            <span className="shrink-0 text-[11px] text-muted-foreground">

                              {
                                conversation.lastMessageTime
                              }

                            </span>

                          </div>


                          <div className="mt-1 flex items-center gap-2">

                            <Badge
                              variant="outline"
                              className="text-[10px]"
                            >

                              {
                                getRoleLabel(
                                  conversation.participantRole
                                )
                              }

                            </Badge>


                            {conversation.course && (

                              <span className="truncate text-[11px] text-muted-foreground">

                                {
                                  conversation.course
                                }

                              </span>

                            )}

                          </div>


                          <div className="mt-1 flex items-center justify-between gap-2">

                            <p className="truncate text-xs text-muted-foreground">

                              {
                                conversation.lastMessage
                              }

                            </p>


                            {conversation.unreadCount >
                              0 && (

                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#006dcc] px-1.5 text-[10px] font-medium text-white">

                                {
                                  conversation.unreadCount
                                }

                              </span>

                            )}

                          </div>

                        </div>

                      </div>

                    </button>

                  )
                )

              )}

            </div>

          </div>


          {/* ================================================== */}
          {/* CHAT */}
          {/* ================================================== */}

          <div
            className={`
              flex flex-1 flex-col
              ${
                selectedConversation
                  ? "flex"
                  : "hidden md:flex"
              }
            `}
          >

            {!selectedConversation ? (

              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">

                  <MessageSquare className="h-8 w-8 text-muted-foreground" />

                </div>

                <h2 className="text-lg font-semibold">
                  Select a conversation
                </h2>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Select a conversation from the left or create a new message.
                </p>

                <Button
                  className="mt-4 bg-[#006dcc] hover:bg-[#005ca8]"
                  onClick={() =>
                    setShowNewMessage(
                      true
                    )
                  }
                >

                  <Plus className="mr-2 h-4 w-4" />

                  New Message

                </Button>

              </div>

            ) : (

              <>

                {/* ========================================== */}
                {/* CHAT HEADER */}
                {/* ========================================== */}

                <div className="flex items-center justify-between border-b p-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <Button
                      size="icon"
                      variant="ghost"
                      className="md:hidden"
                      onClick={() =>
                        setSelectedConversationId(
                          null
                        )
                      }
                    >

                      <ArrowLeft className="h-4 w-4" />

                    </Button>


                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#006dcc]/10 text-[#006dcc]">

                      {getRoleIcon(
                        selectedConversation.participantRole
                      )}

                    </div>


                    <div className="min-w-0">

                      <h2 className="truncate font-semibold">

                        {
                          selectedConversation.participantName
                        }

                      </h2>

                      <div className="flex items-center gap-2">

                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >

                          {
                            getRoleLabel(
                              selectedConversation.participantRole
                            )
                          }

                        </Badge>


                        {selectedConversation.course && (

                          <span className="truncate text-xs text-muted-foreground">

                            {
                              selectedConversation.course
                            }

                          </span>

                        )}

                      </div>

                    </div>

                  </div>


                  <DropdownMenu>

                    <DropdownMenuTrigger
                      asChild
                    >

                      <Button
                        size="icon"
                        variant="ghost"
                      >

                        <MoreVertical className="h-4 w-4" />

                      </Button>

                    </DropdownMenuTrigger>


                    <DropdownMenuContent align="end">

                      <DropdownMenuItem
                        onClick={() =>
                          markAsRead(
                            selectedConversation.id
                          )
                        }
                      >

                        <CheckCheck className="mr-2 h-4 w-4" />

                        Mark as read

                      </DropdownMenuItem>


                      <DropdownMenuItem>

                        <Archive className="mr-2 h-4 w-4" />

                        Archive

                      </DropdownMenuItem>


                      <DropdownMenuSeparator />


                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() =>
                          deleteConversation(
                            selectedConversation.id
                          )
                        }
                      >

                        <Trash2 className="mr-2 h-4 w-4" />

                        Delete Conversation

                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>

                </div>


                {/* ========================================== */}
                {/* MESSAGES */}
                {/* ========================================== */}

                <div className="flex-1 space-y-4 overflow-y-auto bg-muted/20 p-4">

                  {selectedConversation.messages.map(
                    (msg) => {

                      const isMine =
                        msg.senderId ===
                        CURRENT_STAFF_ID;


                      return (

                        <div
                          key={msg.id}
                          className={`flex ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`
                              max-w-[80%]
                              rounded-2xl
                              px-4 py-3
                              ${
                                isMine
                                  ? "rounded-br-md bg-[#006dcc] text-white"
                                  : "rounded-bl-md bg-background border"
                              }
                            `}
                          >

                            {!isMine && (

                              <p className="mb-1 text-xs font-semibold">

                                {
                                  msg.senderName
                                }

                              </p>

                            )}


                            <p className="whitespace-pre-wrap text-sm">

                              {
                                msg.text
                              }

                            </p>


                            <div
                              className={`
                                mt-1 flex items-center justify-end gap-1 text-[10px]
                                ${
                                  isMine
                                    ? "text-white/70"
                                    : "text-muted-foreground"
                                }
                              `}
                            >

                              {
                                msg.timestamp
                              }


                              {isMine && (

                                <CheckCheck className="h-3 w-3" />

                              )}

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>


                {/* ========================================== */}
                {/* MESSAGE INPUT */}
                {/* ========================================== */}

                <div className="border-t p-3">

                  <div className="flex items-end gap-2">

                    <Button
                      size="icon"
                      variant="ghost"
                      type="button"
                      title="Attach file"
                    >

                      <Paperclip className="h-4 w-4" />

                    </Button>


                    <div className="relative flex-1">

                      <Textarea
                        value={message}
                        onChange={(e) =>
                          setMessage(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {

                          if (
                            e.key ===
                              "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();

                            sendMessage();
                          }

                        }}
                        placeholder="Type your message..."
                        className="min-h-[44px] resize-none pr-10"
                      />


                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute bottom-1 right-1"
                        title="Emoji"
                      >

                        <Smile className="h-4 w-4" />

                      </Button>

                    </div>


                    <Button
                      size="icon"
                      className="bg-[#006dcc] hover:bg-[#005ca8]"
                      onClick={
                        sendMessage
                      }
                      disabled={
                        !message.trim()
                      }
                    >

                      <Send className="h-4 w-4" />

                    </Button>

                  </div>


                  <p className="mt-2 text-[11px] text-muted-foreground">

                    Press Enter to send • Shift + Enter for a new line

                  </p>

                </div>

              </>

            )}

          </div>

        </div>

      </Card>


      {/* ====================================================== */}
      {/* NEW MESSAGE DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={showNewMessage}
        onOpenChange={
          setShowNewMessage
        }
      >

        <DialogContent className="sm:max-w-[550px]">

          <DialogHeader>

            <DialogTitle>
              New Message
            </DialogTitle>

            <DialogDescription>
              Send an internal message to a student, staff member or administrator.
            </DialogDescription>

          </DialogHeader>


          <div className="space-y-5 py-3">

            {/* RECIPIENT */}

            <div className="space-y-2">

              <Label>
                Recipient
              </Label>

              <Select
                value={newRecipient}
                onValueChange={
                  setNewRecipient
                }
              >

                <SelectTrigger>

                  <SelectValue placeholder="Select recipient type" />

                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="student">

                    <div className="flex items-center gap-2">

                      <User className="h-4 w-4" />

                      Student

                    </div>

                  </SelectItem>


                  <SelectItem value="staff">

                    <div className="flex items-center gap-2">

                      <Users className="h-4 w-4" />

                      Staff / Lecturer

                    </div>

                  </SelectItem>


                  <SelectItem value="admin">

                    <div className="flex items-center gap-2">

                      <ShieldCheck className="h-4 w-4" />

                      Administrator

                    </div>

                  </SelectItem>

                </SelectContent>

              </Select>

            </div>


            {/* SUBJECT */}

            <div className="space-y-2">

              <Label>
                Subject
              </Label>

              <Input
                placeholder="e.g. Assignment clarification"
                value={newSubject}
                onChange={(e) =>
                  setNewSubject(
                    e.target.value
                  )
                }
              />

            </div>


            {/* MESSAGE */}

            <div className="space-y-2">

              <Label>
                Message
              </Label>

              <Textarea
                placeholder="Write your message..."
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(
                    e.target.value
                  )
                }
                className="min-h-[140px]"
              />

            </div>


            <div className="rounded-lg border bg-muted/40 p-3">

              <p className="text-xs text-muted-foreground">

                This is an internal message. The recipient will see it in their dashboard messaging area.

              </p>

            </div>

          </div>


          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setShowNewMessage(
                  false
                )
              }
            >
              Cancel
            </Button>


            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={
                startNewMessage
              }
            >

              <Send className="mr-2 h-4 w-4" />

              Send Message

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}