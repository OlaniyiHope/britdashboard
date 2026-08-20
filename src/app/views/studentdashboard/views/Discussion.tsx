import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  User,
  ChevronRight,
  Pin,
  MoreVertical,
  BookOpen,
  Users,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Discussion {
  id: number;
  title: string;
  description: string;
  course: string;
  courseCode: string;
  author: string;
  replies: number;
  views: number;
  lastReply: string;
  lastReplyBy: string;
  isPinned?: boolean;
}

const discussions: Discussion[] = [
  {
    id: 1,
    title: "Understanding Sets and Number System",
    description:
      "Can someone explain the difference between a subset and a proper subset with examples?",
    course: "Sets and Number System",
    courseCode: "MATH 101",
    author: "Gabriel Samaila",
    replies: 12,
    views: 48,
    lastReply: "2 hours ago",
    lastReplyBy: "Abdulsalam Abdulwasiu",
    isPinned: true,
  },
  {
    id: 2,
    title: "Questions on Differential Calculus",
    description:
      "I need help understanding how to differentiate composite functions.",
    course: "Differential and Integral Calculus",
    courseCode: "MATH 105",
    author: "Sarah Ibrahim",
    replies: 8,
    views: 35,
    lastReply: "5 hours ago",
    lastReplyBy: "Danjuma Dauda",
  },
  {
    id: 3,
    title: "Newton's Laws of Motion",
    description:
      "Let's discuss practical examples of Newton's three laws of motion.",
    course: "Mechanics",
    courseCode: "PHYS 111",
    author: "Danjuma Dauda",
    replies: 15,
    views: 67,
    lastReply: "Yesterday",
    lastReplyBy: "Safiya Umar",
  },
  {
    id: 4,
    title: "Microsoft Excel Assignment",
    description:
      "Has anyone started the Excel practical assignment? I have a question about formulas.",
    course: "Microsoft Excel",
    courseCode: "ICT 102",
    author: "Safiya Umar",
    replies: 6,
    views: 29,
    lastReply: "Yesterday",
    lastReplyBy: "Gabriel Samaila",
  },
  {
    id: 5,
    title: "Introduction to Mechanics",
    description:
      "Share your understanding of the basic concepts we covered in today's lecture.",
    course: "Mechanics",
    courseCode: "PHYS 111",
    author: "Abdulrahman Musa",
    replies: 4,
    views: 22,
    lastReply: "2 days ago",
    lastReplyBy: "Sarah Ibrahim",
  },
];

const courses = [
  "All Courses",
  "MATH 101",
  "MATH 105",
  "PHYS 111",
  "ICT 102",
];

const Discussion = () => {
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All Courses");

  const filteredDiscussions = useMemo(() => {
    return discussions.filter((discussion) => {
      const matchesSearch =
        discussion.title.toLowerCase().includes(search.toLowerCase()) ||
        discussion.description.toLowerCase().includes(search.toLowerCase()) ||
        discussion.course.toLowerCase().includes(search.toLowerCase());

      const matchesCourse =
        selectedCourse === "All Courses" ||
        discussion.courseCode === selectedCourse;

      return matchesSearch && matchesCourse;
    });
  }, [search, selectedCourse]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 md:px-6 lg:px-8 py-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-[#222]">
            Discussion
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Join course discussions, ask questions and share ideas with other students.
          </p>
        </div>

        <button
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            bg-[#081022]
            hover:bg-[#003b88]
            text-white
            px-5
            py-2.5
            rounded-md
            text-sm
            font-medium
            transition
          "
        >
          <Plus size={17} />
          Start Discussion
        </button>

      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border border-slate-200 rounded-md px-4 py-3 mb-6">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Link
            to="/student/dashboard"
            className="hover:text-[#081022] transition"
          >
            Dashboard
          </Link>

          <ChevronRight size={14} />

          <span>Course</span>

          <ChevronRight size={14} />

          <span className="text-[#081022] font-medium">
            Discussion
          </span>

        </div>

      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Discussions
              </p>

              <h3 className="text-2xl font-bold text-[#222] mt-1">
                24
              </h3>
            </div>

            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#081022]">
              <MessageSquare size={20} />
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                My Discussions
              </p>

              <h3 className="text-2xl font-bold text-[#222] mt-1">
                5
              </h3>
            </div>

            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <User size={20} />
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                My Replies
              </p>

              <h3 className="text-2xl font-bold text-[#222] mt-1">
                18
              </h3>
            </div>

            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <MessageCircle size={20} />
            </div>

          </div>
        </div>

      </div>

      {/* DISCUSSION AREA */}
      <div className="bg-white border border-slate-200 rounded-md">

        {/* TOP BAR */}
        <div className="p-4 border-b border-slate-200">

          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search discussions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  h-10
                  pl-10
                  pr-4
                  border
                  border-slate-200
                  rounded-md
                  text-sm
                  outline-none
                  focus:border-[#081022]
                  focus:ring-1
                  focus:ring-[#081022]
                "
              />

            </div>

            {/* COURSE FILTER */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="
                h-10
                border
                border-slate-200
                rounded-md
                px-3
                text-sm
                text-slate-600
                outline-none
                focus:border-[#081022]
                bg-white
              "
            >
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>

          </div>

        </div>

        {/* DISCUSSION HEADER */}
        <div className="hidden md:grid grid-cols-[1fr_120px_150px] px-5 py-3 bg-[#f8f9fb] border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
          <span>Discussion</span>
          <span>Replies</span>
          <span>Last Activity</span>
        </div>

        {/* DISCUSSIONS */}
        <div>

          {filteredDiscussions.length === 0 ? (
            <div className="py-16 text-center">

              <MessageSquare
                size={40}
                className="mx-auto text-slate-300 mb-3"
              />

              <h3 className="font-semibold text-slate-700">
                No discussions found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Try changing your search or course filter.
              </p>

            </div>
          ) : (
            filteredDiscussions.map((discussion) => (

              <Link
                key={discussion.id}
                to={`/student/dashboard/discussion/${discussion.id}`}
                className="
                  block
                  border-b
                  border-slate-100
                  last:border-b-0
                  hover:bg-[#fafcff]
                  transition
                "
              >

                <div className="grid grid-cols-1 md:grid-cols-[1fr_120px_150px] gap-3 md:gap-0 px-5 py-5">

                  {/* DISCUSSION INFORMATION */}
                  <div className="flex gap-4">

                    {/* ICON */}
                    <div className="
                      hidden
                      sm:flex
                      flex-shrink-0
                      w-11
                      h-11
                      rounded-full
                      bg-blue-50
                      text-[#081022]
                      items-center
                      justify-center
                    ">
                      <MessageSquare size={19} />
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        {discussion.isPinned && (
                          <Pin
                            size={14}
                            className="text-[#081022] flex-shrink-0"
                          />
                        )}

                        <h3 className="
                          font-semibold
                          text-[#333]
                          text-sm
                          hover:text-[#081022]
                          transition
                        ">
                          {discussion.title}
                        </h3>

                      </div>

                      <p className="
                        text-xs
                        text-slate-500
                        mt-1
                        line-clamp-2
                      ">
                        {discussion.description}
                      </p>

                      {/* COURSE */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">

                        <span className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-[11px]
                          text-[#081022]
                          bg-blue-50
                          px-2.5
                          py-1
                          rounded
                        ">
                          <BookOpen size={12} />
                          {discussion.courseCode}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          Started by {discussion.author}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* REPLIES */}
                  <div className="flex md:flex-col items-center md:items-start gap-2 md:justify-center">

                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MessageCircle
                        size={15}
                        className="text-slate-400"
                      />
                      {discussion.replies}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Users size={13} />
                      {discussion.views} views
                    </div>

                  </div>

                  {/* LAST ACTIVITY */}
                  <div className="flex md:flex-col md:justify-center gap-1">

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock size={13} className="text-slate-400" />
                      {discussion.lastReply}
                    </div>

                    <span className="text-[11px] text-slate-400">
                      by {discussion.lastReplyBy}
                    </span>

                  </div>

                </div>

              </Link>

            ))
          )}

        </div>

      </div>

      {/* BOTTOM INFORMATION */}
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
        <MessageSquare size={14} />
        <span>
          Participate in discussions with your classmates and instructors.
        </span>
      </div>

    </div>
  );
};

export default Discussion;