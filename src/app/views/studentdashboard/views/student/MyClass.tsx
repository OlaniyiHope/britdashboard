import { useContext, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { SessionContext } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowBigDown,
  ArrowBigUp,
  Eye,
  Lock,
  MessageSquare,
  Search,
  ThumbsUp,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type ForumThread = {
  _id?: string;
  threadCode: string; // e.g. "FRM3"
  courseCode: string; // e.g. "PHYS 111"
  question: string;
  postedBy: string;
  postedAgo: string;
  graded: boolean;
  marksObtainable: number;
  views: number;
  upvotes: number;
  downvotes: number;
  status: "open" | "closed";
  closedAgo?: string;
};

type ForumComment = {
  _id?: string;
  author: string;
  postedAgo: string;
  body: string;
  likes: number;
};

// ─────────────────────────────────────────────────────────────────────────
// Fallback/mock data — swap out once the real forum endpoints exist.
// Names below are placeholders, not real students.
// ─────────────────────────────────────────────────────────────────────────

const fallbackThread: ForumThread = {
  threadCode: "FRM3",
  courseCode: "PHYS 111",
  question: "What's an impulse?",
  postedBy: "Course Tutor",
  postedAgo: "4 days ago",
  graded: false,
  marksObtainable: 1.0,
  views: 87,
  upvotes: 46,
  downvotes: 2,
  status: "closed",
  closedAgo: "4 days ago",
};

const fallbackComments: ForumComment[] = [
  {
    id: "c1",
    author: "Chidinma Okafor",
    postedAgo: "5 days ago",
    body: "Impulse can be defined as the product of a force and the time interval over which it acts.",
    likes: 2,
  } as ForumComment,
  {
    id: "c2",
    author: "Ibrahim Sule",
    postedAgo: "5 days ago",
    body: "Impulse is the product of force and time for which the force acts on an object.",
    likes: 1,
  } as ForumComment,
  {
    id: "c3",
    author: "Grace Adeyemi",
    postedAgo: "5 days ago",
    body: "It's also equal to the change in momentum of the object, since F = ma and a = Δv/Δt.",
    likes: 3,
  } as ForumComment,
];

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function CourseForumThread() {
  const { threadId } = useParams();
  const { currentSession } = useContext(SessionContext);
  const { user } = useAuth();
  const [commentSearch, setCommentSearch] = useState("");

  const userInfo = useMemo(() => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...parsed, ...user } as Record<string, any>;
  }, [user]);

  const displayName = String(userInfo?.studentName || userInfo?.name || "Student");

  const { data: threadData, loading: loadingThread } = useFetch(
    currentSession && threadId
      ? `/forum/thread/${currentSession._id}/${threadId}`
      : null
  );
  const thread: ForumThread =
    threadData && typeof threadData === "object"
      ? (threadData as ForumThread)
      : fallbackThread;

  const { data: commentsData, loading: loadingComments } = useFetch(
    currentSession && threadId
      ? `/forum/thread/${currentSession._id}/${threadId}/comments`
      : null
  );
  const comments: ForumComment[] =
    Array.isArray(commentsData) && commentsData.length > 0
      ? (commentsData as ForumComment[])
      : fallbackComments;

  const filteredComments = commentSearch.trim()
    ? comments.filter((c) =>
        `${c.author} ${c.body}`.toLowerCase().includes(commentSearch.toLowerCase())
      )
    : comments;

  const isClosed = thread.status === "closed";

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Course Forum <span className="mx-1">/</span>
        <span className="font-semibold text-[#081022]">{thread.threadCode}</span>
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {/* Main post */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="space-y-4 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500">
                    {thread.postedBy.slice(0, 1)}
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">{thread.postedAgo}</span>
                    <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-600">
                      {thread.postedBy}
                    </span>
                  </div>
                </div>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                    thread.graded ? "bg-emerald-600" : "bg-[#081022]"
                  }`}
                >
                  {loadingThread ? "…" : thread.graded ? "Graded" : "Not yet graded"}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-800">
                {thread.threadCode} - {thread.courseCode}
              </h2>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  <ArrowBigUp className="h-4 w-4" /> Upvote
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <ArrowBigDown className="h-4 w-4" /> Downvote
                </Button>
              </div>

              <blockquote className="border-l-4 border-slate-300 pl-4 text-slate-700">
                {thread.question}
              </blockquote>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs">
                <span className="rounded-md border border-rose-200 px-2 py-1 font-semibold text-rose-600">
                  Mark Obtainable: {thread.marksObtainable.toFixed(2)}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Eye className="h-3.5 w-3.5" /> {thread.views}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MessageSquare className="h-3.5 w-3.5" /> {comments.length}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <ArrowBigDown className="h-3.5 w-3.5" /> {thread.downvotes}
                </span>
                {isClosed && (
                  <span className="flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 font-semibold text-rose-600">
                    <Lock className="h-3 w-3" /> Closed {thread.closedAgo}
                  </span>
                )}
              </div>

              {isClosed && (
                <p className="text-sm font-medium text-rose-500">
                  This forum is closed for further discussions
                </p>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardContent className="space-y-4 p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageSquare className="h-4 w-4" />
                  Comments
                </div>
                <div className="relative w-full max-w-[220px]">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={commentSearch}
                    onChange={(e) => setCommentSearch(e.target.value)}
                    placeholder="Search comment"
                    className="h-8 pl-8 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {loadingComments ? (
                  <p className="py-6 text-center text-sm text-slate-500">
                    Loading comments…
                  </p>
                ) : filteredComments.length === 0 ? (
                  <p className="py-6 text-center text-sm text-slate-500">
                    No comments found.
                  </p>
                ) : (
                  filteredComments.map((c, i) => (
                    <div key={c._id || i} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500">
                        {c.author.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {c.author}
                          </span>
                          <span className="text-xs text-slate-400">{c.postedAgo}</span>
                        </div>
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-sm text-slate-600">
                          {c.body}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <button className="font-semibold hover:text-slate-600">
                            Reply
                          </button>
                          <button className="font-semibold hover:text-slate-600">
                            Like
                          </button>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" /> {c.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side greeting panel */}
        <Card className="h-fit border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-4 text-sm text-slate-600">
            Hi, <span className="font-semibold text-[#081022]">{displayName}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
