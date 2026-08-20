import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

interface Assignment {
  id: number;
  title: string;
  creator: string;
  course: string;
  type: "Individual" | "Group";
  mark: string;
  status: "Available" | "Submitted";
  start: string;
  end: string;
  created: string;
  file?: boolean;
}

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Individual assignment",
    creator: "SAMINU Garba",
    course: "Trigonometry and Co-ordinate Geometry (MATH 103)",
    type: "Individual",
    mark: "5.00",
    status: "Available",
    start: "17/08/26 00:00",
    end: "01/09/26 23:00",
    created: "1 day ago",
    file: true,
  },
  {
    id: 2,
    title: "Group Assignment",
    creator: "GABRIEL Samaila",
    course: "Sets and Number System (MATH 101)",
    type: "Group",
    mark: "5.00",
    status: "Available",
    start: "11/08/26 00:00",
    end: "31/08/26 23:00",
    created: "1 week ago",
    file: true,
  },
  {
    id: 3,
    title: "Group Assignment",
    creator: "SAMINU Garba",
    course: "Trigonometry and Co-ordinate Geometry (MATH 103)",
    type: "Group",
    mark: "5.00",
    status: "Submitted",
    start: "17/08/26 00:00",
    end: "24/08/26 23:00",
    created: "1 day ago",
    file: true,
  },
  {
    id: 4,
    title: "Individual Assignment",
    creator: "MOHAMMAD Umar",
    course: "ENGLISH AND COMMUNICATION SKILLS (GENS 103)",
    type: "Individual",
    mark: "5.00",
    status: "Submitted",
    start: "31/07/26 13:00",
    end: "08/08/26 22:00",
    created: "3 weeks ago",
    file: true,
  },
  {
    id: 5,
    title: "Group Assignment",
    creator: "MOHAMMAD Umar",
    course: "ENGLISH AND COMMUNICATION SKILLS (GENS 103)",
    type: "Group",
    mark: "5.00",
    status: "Submitted",
    start: "25/07/26 13:00",
    end: "31/07/26 22:00",
    created: "3 weeks ago",
    file: false,
  },
  {
    id: 6,
    title: "Tracing the history of Prominent Nigerian Nationalist",
    creator: "DAHIRU Ayuba",
    course: "Nationalism (GENS 101)",
    type: "Individual",
    mark: "5.00",
    status: "Submitted",
    start: "No deadline",
    end: "No deadline",
    created: "2 weeks ago",
    file: false,
  },
];

export default function Assignments() {
  const [entries, setEntries] = useState("10");
  const [search, setSearch] = useState("");

  const filteredAssignments = useMemo(() => {
    let result = assignments;

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(query) ||
          assignment.creator.toLowerCase().includes(query) ||
          assignment.course.toLowerCase().includes(query) ||
          assignment.type.toLowerCase().includes(query) ||
          assignment.status.toLowerCase().includes(query)
      );
    }

    if (entries !== "all") {
      result = result.slice(0, Number(entries));
    }

    return result;
  }, [search, entries]);

  return (
    <div className="w-full">
      {/* Page Title */}
      <div className="mb-0">
        <h2 className="text-2xl font-semibold text-slate-800">
          All Assignments
        </h2>
      </div>

      {/* Breadcrumb */}
      <div className="mt-5 border-y border-slate-200 bg-slate-50 px-4 py-4">
        <div className="text-sm text-slate-700">
          <span>Home</span>
          <span className="mx-3 text-slate-400">/</span>
          <span>Assignments</span>
        </div>
      </div>

      {/* Assignment Content */}
      <div className="w-full px-1 pt-16">
        {/* Center Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-slate-800">
            Assignment List
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            See the list of all your assignment(s)
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex items-center justify-between gap-5">
          {/* Show Entries */}
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <span>Show</span>

            <select
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
              className="h-9 w-[65px] rounded border border-slate-300 bg-white px-2 text-sm outline-none focus:border-[#081022]"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">All</option>
            </select>

            <span>entries</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-700">
              Search:
            </label>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-[220px] border-b border-slate-400 bg-transparent px-2 pr-8 text-sm outline-none focus:border-[#081022]"
              />

              <Search className="absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[1450px] border-t border-slate-300">
            {/* Table Header */}
            <div
              className="
                grid
                grid-cols-[280px_145px_300px_110px_70px_95px_170px_170px_130px_70px]
                border-b
                border-slate-300
                bg-white
              "
            >
              <TableHeader title="Title" sortable />
              <TableHeader title="Creator" />
              <TableHeader title="Course" />
              <TableHeader title="Type" />
              <TableHeader title="Mark" />
              <TableHeader title="Status" />
              <TableHeader title="Start" sortable />
              <TableHeader title="End" sortable />
              <TableHeader title="Created" />
              <TableHeader title="File" />
            </div>

            {/* Table Rows */}
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="
                  grid
                  grid-cols-[280px_145px_300px_110px_70px_95px_170px_170px_130px_70px]
                  min-h-[66px]
                  border-b
                  border-slate-200
                  bg-white
                  text-sm
                  hover:bg-slate-50
                "
              >
                {/* Title */}
                <div className="flex items-center px-4 text-slate-700">
                  {assignment.title}
                </div>

                {/* Creator */}
                <div className="flex items-center px-3 text-slate-600">
                  {assignment.creator}
                </div>

                {/* Course */}
                <div className="flex items-center px-3 text-slate-600">
                  {assignment.course}
                </div>

                {/* Type */}
                <div className="flex items-center px-3 text-slate-700">
                  {assignment.type}
                </div>

                {/* Mark */}
                <div className="flex items-center px-3 text-slate-700">
                  {assignment.mark}
                </div>

                {/* Status */}
                <div className="flex items-center px-2">
                  <span
                    className={`
                      rounded-sm
                      border
                      px-2
                      py-1
                      text-[10px]
                      font-medium
                      ${
                        assignment.status === "Submitted"
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-green-300 bg-green-50 text-green-700"
                      }
                    `}
                  >
                    {assignment.status}
                  </span>
                </div>

                {/* Start */}
                <div className="flex items-center px-3 text-slate-600">
                  {assignment.start}
                </div>

                {/* End */}
                <div className="flex items-center px-3 text-slate-600">
                  {assignment.end}
                </div>

                {/* Created */}
                <div className="flex items-center px-3 text-slate-600">
                  {assignment.created}
                </div>

                {/* File */}
                <div className="flex items-center justify-center">
                  {assignment.file ? (
                    <button
                      type="button"
                      title="Download assignment file"
                      className="text-slate-500 hover:text-[#081022]"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredAssignments.length === 0 && (
              <div className="border-b border-slate-200 py-12 text-center text-sm text-slate-500">
                No assignments found.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing 1 to {filteredAssignments.length} of{" "}
            {assignments.length} entries
          </span>

          <div className="flex gap-1">
            <button
              type="button"
              disabled
              className="border border-slate-200 px-3 py-2 text-slate-400"
            >
              Previous
            </button>

            <button
              type="button"
              className="border border-[#081022] bg-[#081022] px-3 py-2 text-white"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="border border-slate-200 px-3 py-2 text-slate-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Table Header Component */
function TableHeader({
  title,
  sortable = false,
}: {
  title: string;
  sortable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-r border-slate-200 px-3 py-4 last:border-r-0">
      <span className="text-xs font-bold text-slate-800">
        {title}
      </span>

      {sortable && (
        <span className="text-xs text-slate-400">
          ↑↓
        </span>
      )}
    </div>
  );
}