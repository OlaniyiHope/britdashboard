// import { useEffect, useMemo, useState } from "react";

// import {
//   BookOpen,
//   Check,
//   ChevronDown,
//   ChevronRight,
//   ClipboardCheck,
//   Edit3,
//   FileText,
//   Layers3,
//   Loader2,
//   Plus,
//   Search,
//   Settings2,
//   Trash2,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// /* ================================================================
//    API BASE URL
// ================================================================ */

// const API_BASE_URL =
//   import.meta.env.VITE_BASE_URL ||
//   "http://localhost:5001/api";

// /* ================================================================
//    TYPES
// ================================================================ */

// type CourseStatus =
//   | "Approved"
//   | "Draft"
//   | "Inactive";

// type CourseType =
//   | "Compulsory"
//   | "Elective";

// type CourseLevel =
//   | "ND 1"
//   | "ND 2"
//   | "HND 1"
//   | "HND 2";

// type CourseSemester =
//   | "First Semester"
//   | "Second Semester";

// type Department = {
//   _id: string;
//   name: string;
//   code?: string;
// };

// type Programme = {
//   _id: string;
//   code: string;
//   name: string;

//   department:
//     | string
//     | Department;
// };

// type Course = {
//   _id: string;

//   code: string;

//   title: string;

//   programme:
//     | string
//     | Programme;

//   department:
//     | string
//     | Department;

//   level: CourseLevel;

//   semester: CourseSemester;

//   credits: number;

//   type: CourseType;

//   status: CourseStatus;

//   createdAt?: string;

//   updatedAt?: string;
// };

// type CourseForm = {
//   code: string;

//   title: string;

//   programme: string;

//   department: string;

//   level: CourseLevel;

//   semester: CourseSemester;

//   credits: number;

//   type: CourseType;

//   status: CourseStatus;
// };

// /* ================================================================
//    CONSTANTS
// ================================================================ */

// const LEVELS: CourseLevel[] = [
//   "ND 1",
//   "ND 2",
//   "HND 1",
//   "HND 2",
// ];

// const SEMESTERS: CourseSemester[] = [
//   "First Semester",
//   "Second Semester",
// ];

// const COURSE_TYPES: CourseType[] = [
//   "Compulsory",
//   "Elective",
// ];

// const COURSE_STATUSES: CourseStatus[] = [
//   "Draft",
//   "Approved",
//   "Inactive",
// ];

// /* ================================================================
//    CURRICULUM
// ================================================================ */

// export default function Curriculum() {
//   const [courses, setCourses] =
//     useState<Course[]>([]);

//   const [programmes, setProgrammes] =
//     useState<Programme[]>([]);

//   const [departments, setDepartments] =
//     useState<Department[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [saving, setSaving] =
//     useState(false);

//   const [search, setSearch] =
//     useState("");

//   const [programmeFilter, setProgrammeFilter] =
//     useState("All");

//   const [levelFilter, setLevelFilter] =
//     useState("All");

//   const [semesterFilter, setSemesterFilter] =
//     useState("All");

//   const [showAddModal, setShowAddModal] =
//     useState(false);

//   const [editingCourse, setEditingCourse] =
//     useState<Course | null>(null);

//   const [expandedProgramme, setExpandedProgramme] =
//     useState<string | null>(null);

//   /* ================================================================
//      GET PROGRAMME ID
//   ================================================================ */

//   const getProgrammeId = (
//     programme: Course["programme"]
//   ): string => {
//     if (!programme) {
//       return "";
//     }

//     if (typeof programme === "string") {
//       return programme;
//     }

//     return programme._id || "";
//   };

//   /* ================================================================
//      GET PROGRAMME NAME
//   ================================================================ */

//   const getProgrammeName = (
//     programme: Course["programme"]
//   ): string => {
//     if (!programme) {
//       return "Unknown Programme";
//     }

//     if (typeof programme === "string") {
//       const found = programmes.find(
//         (item) => item._id === programme
//       );

//       return (
//         found?.name ||
//         "Unknown Programme"
//       );
//     }

//     return (
//       programme.name ||
//       "Unknown Programme"
//     );
//   };

//   /* ================================================================
//      GET DEPARTMENT ID
//   ================================================================ */

//   const getDepartmentId = (
//     department:
//       | Course["department"]
//       | undefined
//   ): string => {
//     if (!department) {
//       return "";
//     }

//     if (typeof department === "string") {
//       return department;
//     }

//     return department._id || "";
//   };

//   /* ================================================================
//      GET DEPARTMENT NAME
//   ================================================================ */

//   const getDepartmentName = (
//     course: Course
//   ): string => {
//     if (!course.department) {
//       return "Unknown Department";
//     }

//     if (
//       typeof course.department === "string"
//     ) {
//       const found = departments.find(
//         (department) =>
//           department._id ===
//           course.department
//       );

//       if (found) {
//         return found.name;
//       }

//       /*
//         Fallback:
//         Try getting department through programme
//       */

//       const programmeId =
//         getProgrammeId(
//           course.programme
//         );

//       const programme =
//         programmes.find(
//           (item) =>
//             item._id === programmeId
//         );

//       if (programme) {
//         if (
//           typeof programme.department ===
//           "object"
//         ) {
//           return (
//             programme.department.name ||
//             "Unknown Department"
//           );
//         }

//         const programmeDepartment =
//           departments.find(
//             (department) =>
//               department._id ===
//               programme.department
//           );

//         return (
//           programmeDepartment?.name ||
//           "Unknown Department"
//         );
//       }

//       return "Unknown Department";
//     }

//     return (
//       course.department.name ||
//       "Unknown Department"
//     );
//   };

//   /* ================================================================
//      FETCH PROGRAMMES
//   ================================================================ */

//   const fetchProgrammes = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/programmes`
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to load programmes"
//         );
//       }

//       if (Array.isArray(data)) {
//         setProgrammes(data);
//       } else if (
//         Array.isArray(data.programmes)
//       ) {
//         setProgrammes(
//           data.programmes
//         );
//       } else if (
//         Array.isArray(data.data)
//       ) {
//         setProgrammes(data.data);
//       } else {
//         setProgrammes([]);
//       }
//     } catch (error) {
//       console.error(
//         "Fetch programmes error:",
//         error
//       );

//       setProgrammes([]);
//     }
//   };

//   /* ================================================================
//      FETCH DEPARTMENTS
//   ================================================================ */

//   const fetchDepartments = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/departments`
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to load departments"
//         );
//       }

//       if (Array.isArray(data)) {
//         setDepartments(data);
//       } else if (
//         Array.isArray(data.departments)
//       ) {
//         setDepartments(
//           data.departments
//         );
//       } else if (
//         Array.isArray(data.data)
//       ) {
//         setDepartments(data.data);
//       } else {
//         setDepartments([]);
//       }
//     } catch (error) {
//       console.error(
//         "Fetch departments error:",
//         error
//       );

//       setDepartments([]);
//     }
//   };

//   /* ================================================================
//      FETCH COURSES
//   ================================================================ */

//   const fetchCourses = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/courses`
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to load courses"
//         );
//       }

//       if (Array.isArray(data)) {
//         setCourses(data);
//       } else if (
//         Array.isArray(data.courses)
//       ) {
//         setCourses(data.courses);
//       } else if (
//         Array.isArray(data.data)
//       ) {
//         setCourses(data.data);
//       } else {
//         setCourses([]);
//       }
//     } catch (error) {
//       console.error(
//         "Fetch courses error:",
//         error
//       );

//       setCourses([]);
//     }
//   };

//   /* ================================================================
//      LOAD DATA
//   ================================================================ */

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);

//         await Promise.all([
//           fetchDepartments(),
//           fetchProgrammes(),
//           fetchCourses(),
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   /* ================================================================
//      FILTER COURSES
//   ================================================================ */

//   const filteredCourses =
//     useMemo(() => {
//       const searchValue =
//         search
//           .toLowerCase()
//           .trim();

//       return courses.filter(
//         (course) => {
//           const programmeName =
//             getProgrammeName(
//               course.programme
//             );

//           const departmentName =
//             getDepartmentName(
//               course
//             );

//           const searchMatch =
//             !searchValue ||
//             course.code
//               ?.toLowerCase()
//               .includes(
//                 searchValue
//               ) ||
//             course.title
//               ?.toLowerCase()
//               .includes(
//                 searchValue
//               ) ||
//             programmeName
//               .toLowerCase()
//               .includes(
//                 searchValue
//               ) ||
//             departmentName
//               .toLowerCase()
//               .includes(
//                 searchValue
//               );

//           const programmeMatch =
//             programmeFilter ===
//               "All" ||
//             getProgrammeId(
//               course.programme
//             ) ===
//               programmeFilter;

//           const levelMatch =
//             levelFilter ===
//               "All" ||
//             course.level ===
//               levelFilter;

//           const semesterMatch =
//             semesterFilter ===
//               "All" ||
//             course.semester ===
//               semesterFilter;

//           return (
//             searchMatch &&
//             programmeMatch &&
//             levelMatch &&
//             semesterMatch
//           );
//         }
//       );
//     }, [
//       courses,
//       programmes,
//       departments,
//       search,
//       programmeFilter,
//       levelFilter,
//       semesterFilter,
//     ]);

//   /* ================================================================
//      STATISTICS
//   ================================================================ */

//   const programmeCount =
//     programmes.length;

//   const courseCount =
//     courses.length;

//   const draftCount =
//     courses.filter(
//       (course) =>
//         course.status ===
//         "Draft"
//     ).length;

//   const approvedCount =
//     courses.filter(
//       (course) =>
//         course.status ===
//         "Approved"
//     ).length;

//   const totalCredits =
//     courses.reduce(
//       (total, course) =>
//         total +
//         (Number(
//           course.credits
//         ) || 0),
//       0
//     );

//   /* ================================================================
//      SAVE COURSE
//   ================================================================ */

//   const saveCourse = async (
//     form: CourseForm
//   ) => {
//     try {
//       setSaving(true);

//       const isEditing =
//         Boolean(editingCourse);

//       const url = isEditing
//         ? `${API_BASE_URL}/courses/${editingCourse?._id}`
//         : `${API_BASE_URL}/courses`;

//       /*
//         Send exactly the fields required
//         by the Course mongoose model.
//       */

//       const payload = {
//         code: form.code
//           .trim()
//           .toUpperCase(),

//         title: form.title.trim(),

//         programme:
//           form.programme,

//         department:
//           form.department,

//         level:
//           form.level,

//         semester:
//           form.semester,

//         credits:
//           Number(form.credits),

//         type:
//           form.type,

//         status:
//           form.status,
//       };

//       const response = await fetch(
//         url,
//         {
//           method: isEditing
//             ? "PUT"
//             : "POST",

//           headers: {
//             "Content-Type":
//               "application/json",
//           },

//           body: JSON.stringify(
//             payload
//           ),
//         }
//       );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to save course"
//         );
//       }

//       await fetchCourses();

//       setShowAddModal(false);

//       setEditingCourse(null);
//     } catch (error) {
//       console.error(
//         "Save course error:",
//         error
//       );

//       alert(
//         error instanceof Error
//           ? error.message
//           : "Failed to save course"
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ================================================================
//      DELETE COURSE
//   ================================================================ */

//   const deleteCourse = async (
//     course: Course
//   ) => {
//     const confirmed =
//       window.confirm(
//         `Are you sure you want to delete "${course.code} - ${course.title}"?`
//       );

//     if (!confirmed) {
//       return;
//     }

//     try {
//       const response =
//         await fetch(
//           `${API_BASE_URL}/courses/${course._id}`,
//           {
//             method: "DELETE",
//           }
//         );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to delete course"
//         );
//       }

//       await fetchCourses();
//     } catch (error) {
//       console.error(
//         "Delete course error:",
//         error
//       );

//       alert(
//         error instanceof Error
//           ? error.message
//           : "Failed to delete course"
//       );
//     }
//   };

//   /* ================================================================
//      APPROVE COURSE
//   ================================================================ */

//   const approveCourse = async (
//     course: Course
//   ) => {
//     try {
//       const response =
//         await fetch(
//           `${API_BASE_URL}/courses/${course._id}`,
//           {
//             method: "PUT",

//             headers: {
//               "Content-Type":
//                 "application/json",
//             },

//             body: JSON.stringify({
//               status:
//                 "Approved",
//             }),
//           }
//         );

//       const data =
//         await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Failed to approve course"
//         );
//       }

//       await fetchCourses();
//     } catch (error) {
//       console.error(
//         "Approve course error:",
//         error
//       );

//       alert(
//         error instanceof Error
//           ? error.message
//           : "Failed to approve course"
//       );
//     }
//   };

//   /* ================================================================
//      LOADING
//   ================================================================ */

//   if (loading) {
//     return (
//       <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
//         <div className="flex flex-col items-center gap-3">
//           <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />

//           <p className="text-sm text-slate-500">
//             Loading curriculum...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ================================================================
//      UI
//   ================================================================ */

//   return (
//     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

//       {/* ============================================================
//           HEADER
//       ============================================================ */}

//       <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

//           <div>

//             <div className="flex items-center gap-2 text-blue-200">

//               <BookOpen className="h-5 w-5" />

//               <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
//                 Programmes & Curriculum
//               </span>

//             </div>

//             <h1 className="mt-2 text-2xl font-bold md:text-3xl">
//               Curriculum
//             </h1>

//             <p className="mt-2 max-w-2xl text-sm text-slate-300">
//               Manage courses, academic levels,
//               semesters and credit units.
//             </p>

//           </div>

//           <Button
//             onClick={() => {
//               setEditingCourse(null);
//               setShowAddModal(true);
//             }}
//             className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
//           >
//             <Plus className="mr-2 h-4 w-4" />

//             Add Course
//           </Button>

//         </div>

//       </div>

//       {/* ============================================================
//           STATISTICS
//       ============================================================ */}

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

//         <StatCard
//           icon={Layers3}
//           label="Programmes"
//           value={programmeCount}
//           description="Academic programmes"
//         />

//         <StatCard
//           icon={BookOpen}
//           label="Courses"
//           value={courseCount}
//           description="Curriculum courses"
//         />

//         <StatCard
//           icon={ClipboardCheck}
//           label="Approved"
//           value={approvedCount}
//           description="Approved courses"
//         />

//         <StatCard
//           icon={FileText}
//           label="Drafts"
//           value={draftCount}
//           description="Awaiting approval"
//         />

//         <StatCard
//           icon={Settings2}
//           label="Credit Units"
//           value={totalCredits}
//           description="Total configured credits"
//         />

//       </div>

//       {/* ============================================================
//           CONTROLS
//       ============================================================ */}

//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//         <CardHeader className="border-b border-slate-200">

//           <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

//             <div>

//               <CardTitle className="text-base font-bold text-[#081022]">
//                 Curriculum Structure
//               </CardTitle>

//               <p className="mt-1 text-xs text-slate-500">
//                 Browse and manage courses within each programme.
//               </p>

//             </div>

//             <button
//               onClick={() => {
//                 setEditingCourse(null);
//                 setShowAddModal(true);
//               }}
//               className="inline-flex items-center rounded-lg bg-[#081022] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
//             >
//               <Plus className="mr-1.5 h-4 w-4" />

//               Add Course
//             </button>

//           </div>

//         </CardHeader>

//         <CardContent className="space-y-4 p-4">

//           {/* SEARCH */}

//           <div className="relative">

//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//             <input
//               value={search}
//               onChange={(event) =>
//                 setSearch(
//                   event.target.value
//                 )
//               }
//               placeholder="Search course code, title, programme or department..."
//               className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
//             />

//           </div>

//           {/* FILTERS */}

//           <div className="grid gap-3 sm:grid-cols-3">

//             {/* PROGRAMME */}

//             <select
//               value={programmeFilter}
//               onChange={(event) =>
//                 setProgrammeFilter(
//                   event.target.value
//                 )
//               }
//               className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
//             >

//               <option value="All">
//                 All Programmes
//               </option>

//               {programmes.map(
//                 (programme) => (
//                   <option
//                     key={
//                       programme._id
//                     }
//                     value={
//                       programme._id
//                     }
//                   >
//                     {programme.code} -{" "}
//                     {programme.name}
//                   </option>
//                 )
//               )}

//             </select>

//             {/* LEVEL */}

//             <select
//               value={levelFilter}
//               onChange={(event) =>
//                 setLevelFilter(
//                   event.target.value
//                 )
//               }
//               className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
//             >

//               <option value="All">
//                 All Levels
//               </option>

//               {LEVELS.map(
//                 (level) => (
//                   <option
//                     key={level}
//                     value={level}
//                   >
//                     {level}
//                   </option>
//                 )
//               )}

//             </select>

//             {/* SEMESTER */}

//             <select
//               value={semesterFilter}
//               onChange={(event) =>
//                 setSemesterFilter(
//                   event.target.value
//                 )
//               }
//               className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
//             >

//               <option value="All">
//                 All Semesters
//               </option>

//               {SEMESTERS.map(
//                 (semester) => (
//                   <option
//                     key={semester}
//                     value={semester}
//                   >
//                     {semester}
//                   </option>
//                 )
//               )}

//             </select>

//           </div>

//         </CardContent>

//       </Card>

//       {/* ============================================================
//           PROGRAMMES
//       ============================================================ */}

//       <div className="space-y-4">

//         {programmes.map(
//           (programme) => {

//             const programmeCourses =
//               filteredCourses.filter(
//                 (course) =>
//                   getProgrammeId(
//                     course.programme
//                   ) ===
//                   programme._id
//               );

//             const isExpanded =
//               expandedProgramme ===
//               programme._id;

//             const programmeCredits =
//               programmeCourses.reduce(
//                 (
//                   total,
//                   course
//                 ) =>
//                   total +
//                   (Number(
//                     course.credits
//                   ) || 0),
//                 0
//               );

//             return (
//               <Card
//                 key={
//                   programme._id
//                 }
//                 className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200"
//               >

//                 {/* PROGRAMME HEADER */}

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setExpandedProgramme(
//                       isExpanded
//                         ? null
//                         : programme._id
//                     )
//                   }
//                   className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50"
//                 >

//                   <div className="flex min-w-0 items-center gap-4">

//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">

//                       <Layers3 className="h-5 w-5" />

//                     </div>

//                     <div className="min-w-0">

//                       <p className="truncate text-sm font-bold text-[#081022]">
//                         {programme.name}
//                       </p>

//                       <p className="mt-1 text-xs text-slate-500">
//                         {programme.code}
//                       </p>

//                       <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">

//                         <span>
//                           {
//                             programmeCourses.length
//                           }{" "}
//                           courses
//                         </span>

//                         <span>
//                           {
//                             programmeCredits
//                           }{" "}
//                           credit units
//                         </span>

//                       </div>

//                     </div>

//                   </div>

//                   {isExpanded ? (
//                     <ChevronDown className="h-5 w-5 text-slate-400" />
//                   ) : (
//                     <ChevronRight className="h-5 w-5 text-slate-400" />
//                   )}

//                 </button>

//                 {/* COURSES */}

//                 {isExpanded && (
//                   <div className="border-t border-slate-200">

//                     {programmeCourses.length ===
//                     0 ? (

//                       <div className="px-5 py-10 text-center">

//                         <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

//                         <p className="mt-3 text-sm font-semibold text-slate-500">
//                           No courses found
//                         </p>

//                       </div>

//                     ) : (

//                       <div className="overflow-x-auto">

//                         <table className="w-full min-w-[1050px]">

//                           <thead className="bg-slate-50">

//                             <tr className="border-b border-slate-200">

//                               <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Course
//                               </th>

//                               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Department
//                               </th>

//                               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Level
//                               </th>

//                               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Semester
//                               </th>

//                               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Credits
//                               </th>

//                               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Type
//                               </th>

//                               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Status
//                               </th>

//                               <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                                 Actions
//                               </th>

//                             </tr>

//                           </thead>

//                           <tbody className="divide-y divide-slate-100">

//                             {programmeCourses.map(
//                               (
//                                 course
//                               ) => (

//                                 <tr
//                                   key={
//                                     course._id
//                                   }
//                                   className="hover:bg-slate-50"
//                                 >

//                                   {/* COURSE */}

//                                   <td className="px-5 py-4">

//                                     <p className="text-sm font-bold text-[#081022]">
//                                       {
//                                         course.code
//                                       }
//                                     </p>

//                                     <p className="mt-1 text-xs text-slate-500">
//                                       {
//                                         course.title
//                                       }
//                                     </p>

//                                   </td>

//                                   {/* DEPARTMENT */}

//                                   <td className="px-4 py-4 text-sm text-slate-600">

//                                     {
//                                       getDepartmentName(
//                                         course
//                                       )
//                                     }

//                                   </td>

//                                   {/* LEVEL */}

//                                   <td className="px-4 py-4">

//                                     <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
//                                       {
//                                         course.level
//                                       }
//                                     </span>

//                                   </td>

//                                   {/* SEMESTER */}

//                                   <td className="px-4 py-4 text-sm text-slate-600">

//                                     {
//                                       course.semester
//                                     }

//                                   </td>

//                                   {/* CREDITS */}

//                                   <td className="px-4 py-4">

//                                     <span className="font-bold text-[#081022]">
//                                       {
//                                         course.credits
//                                       }
//                                     </span>

//                                   </td>

//                                   {/* TYPE */}

//                                   <td className="px-4 py-4">

//                                     <span
//                                       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                                         course.type ===
//                                         "Compulsory"
//                                           ? "bg-blue-50 text-blue-700"
//                                           : "bg-purple-50 text-purple-700"
//                                       }`}
//                                     >
//                                       {
//                                         course.type
//                                       }
//                                     </span>

//                                   </td>

//                                   {/* STATUS */}

//                                   <td className="px-4 py-4">

//                                     <span
//                                       className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
//                                         course.status ===
//                                         "Approved"
//                                           ? "bg-emerald-50 text-emerald-700"
//                                           : course.status ===
//                                             "Inactive"
//                                           ? "bg-slate-100 text-slate-600"
//                                           : "bg-amber-50 text-amber-700"
//                                       }`}
//                                     >
//                                       {
//                                         course.status
//                                       }
//                                     </span>

//                                   </td>

//                                   {/* ACTIONS */}

//                                   <td className="px-5 py-4">

//                                     <div className="flex justify-end gap-1">

//                                       {course.status ===
//                                         "Draft" && (

//                                         <button
//                                           title="Approve"
//                                           onClick={() =>
//                                             approveCourse(
//                                               course
//                                             )
//                                           }
//                                           className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
//                                         >
//                                           <Check className="h-4 w-4" />
//                                         </button>

//                                       )}

//                                       <button
//                                         title="Edit"
//                                         onClick={() => {
//                                           setEditingCourse(
//                                             course
//                                           );

//                                           setShowAddModal(
//                                             false
//                                           );
//                                         }}
//                                         className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
//                                       >
//                                         <Edit3 className="h-4 w-4" />
//                                       </button>

//                                       <button
//                                         title="Delete"
//                                         onClick={() =>
//                                           deleteCourse(
//                                             course
//                                           )
//                                         }
//                                         className="rounded-lg p-2 text-red-500 hover:bg-red-50"
//                                       >
//                                         <Trash2 className="h-4 w-4" />
//                                       </button>

//                                     </div>

//                                   </td>

//                                 </tr>

//                               )
//                             )}

//                           </tbody>

//                         </table>

//                       </div>

//                     )}

//                   </div>
//                 )}

//               </Card>
//             );
//           }
//         )}

//       </div>

//       {/* ============================================================
//           EMPTY PROGRAMME STATE
//       ============================================================ */}

//       {programmes.length === 0 && (

//         <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">

//           <Layers3 className="mx-auto h-10 w-10 text-slate-300" />

//           <p className="mt-4 font-bold text-slate-700">
//             No programmes available
//           </p>

//           <p className="mt-1 text-sm text-slate-500">
//             Create a programme before adding courses.
//           </p>

//         </div>

//       )}

//       {/* ============================================================
//           COURSE MODAL
//       ============================================================ */}

//       {(showAddModal ||
//         editingCourse) && (

//         <CourseModal
//           course={editingCourse}
//           programmes={programmes}
//           departments={departments}
//           saving={saving}
//           onClose={() => {
//             setShowAddModal(false);
//             setEditingCourse(null);
//           }}
//           onSave={saveCourse}
//         />

//       )}

//     </div>
//   );
// }

// /* ================================================================
//    STAT CARD
// ================================================================ */

// function StatCard({
//   icon: Icon,
//   label,
//   value,
//   description,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: number;
//   description: string;
// }) {
//   return (
//     <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//       <CardContent className="p-4">

//         <div className="flex items-center justify-between">

//           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081022] text-white">

//             <Icon className="h-5 w-5" />

//           </div>

//           <span className="text-2xl font-black text-[#081022]">
//             {value}
//           </span>

//         </div>

//         <p className="mt-4 text-sm font-bold text-[#081022]">
//           {label}
//         </p>

//         <p className="mt-1 text-xs text-slate-500">
//           {description}
//         </p>

//       </CardContent>

//     </Card>
//   );
// }

// /* ================================================================
//    COURSE MODAL
// ================================================================ */

// function CourseModal({
//   course,
//   programmes,
//   departments,
//   saving,
//   onClose,
//   onSave,
// }: {
//   course: Course | null;

//   programmes: Programme[];

//   departments: Department[];

//   saving: boolean;

//   onClose: () => void;

//   onSave: (
//     form: CourseForm
//   ) => void;
// }) {
//   /* ================================================================
//      GET PROGRAMME ID
//   ================================================================ */

//   const getProgrammeId = (
//     programme:
//       | Course["programme"]
//       | undefined
//   ): string => {
//     if (!programme) {
//       return "";
//     }

//     if (typeof programme === "string") {
//       return programme;
//     }

//     return programme._id;
//   };

//   /* ================================================================
//      GET DEPARTMENT ID
//   ================================================================ */

//   const getDepartmentId = (
//     department:
//       | Course["department"]
//       | undefined
//   ): string => {
//     if (!department) {
//       return "";
//     }

//     if (typeof department === "string") {
//       return department;
//     }

//     return department._id;
//   };

//   /* ================================================================
//      INITIAL FORM
//   ================================================================ */

//   const [form, setForm] =
//     useState<CourseForm>({
//       code:
//         course?.code || "",

//       title:
//         course?.title || "",

//       programme:
//         getProgrammeId(
//           course?.programme
//         ) ||
//         programmes[0]?._id ||
//         "",

//       department:
//         getDepartmentId(
//           course?.department
//         ) || "",

//       level:
//         course?.level ||
//         "ND 1",

//       semester:
//         course?.semester ||
//         "First Semester",

//       credits:
//         course?.credits ||
//         3,

//       type:
//         course?.type ||
//         "Compulsory",

//       status:
//         course?.status ||
//         "Draft",
//     });

//   /* ================================================================
//      UPDATE FORM
//   ================================================================ */

//   const update = <
//     K extends keyof CourseForm
//   >(
//     key: K,
//     value: CourseForm[K]
//   ) => {
//     setForm(
//       (current) => ({
//         ...current,
//         [key]: value,
//       })
//     );
//   };

//   /* ================================================================
//      SELECTED PROGRAMME
//   ================================================================ */

//   const selectedProgramme =
//     programmes.find(
//       (programme) =>
//         programme._id ===
//         form.programme
//     );

//   /* ================================================================
//      PROGRAMME DEPARTMENT
//   ================================================================ */

//   const programmeDepartmentId =
//     selectedProgramme
//       ? typeof selectedProgramme.department ===
//         "object"
//         ? selectedProgramme.department
//             ._id
//         : selectedProgramme.department
//       : "";

//   /*
//     If there is no department yet,
//     automatically use the department
//     belonging to the selected programme.
//   */

//   useEffect(() => {
//     if (
//       !form.department &&
//       programmeDepartmentId
//     ) {
//       update(
//         "department",
//         programmeDepartmentId
//       );
//     }
//   }, [
//     form.programme,
//     programmeDepartmentId,
//   ]);

//   /* ================================================================
//      SELECTED DEPARTMENT
//   ================================================================ */

//   const selectedDepartment =
//     departments.find(
//       (department) =>
//         department._id ===
//         form.department
//     );

//   /* ================================================================
//      WHEN PROGRAMME CHANGES
//   ================================================================ */

//   const handleProgrammeChange = (
//     programmeId: string
//   ) => {
//     update(
//       "programme",
//       programmeId
//     );

//     const programme =
//       programmes.find(
//         (item) =>
//           item._id ===
//           programmeId
//       );

//     if (programme) {
//       const departmentId =
//         typeof programme.department ===
//         "object"
//           ? programme.department
//               ._id
//           : programme.department;

//       if (departmentId) {
//         update(
//           "department",
//           departmentId
//         );
//       }
//     }
//   };

//   /* ================================================================
//      SUBMIT
//   ================================================================ */

//   const handleSubmit = (
//     event: React.FormEvent
//   ) => {
//     event.preventDefault();

//     if (
//       !form.code.trim() ||
//       !form.title.trim() ||
//       !form.programme ||
//       !form.department ||
//       !form.level ||
//       !form.semester ||
//       !form.credits
//     ) {
//       alert(
//         "Please complete all required fields."
//       );

//       return;
//     }

//     if (
//       form.credits < 1 ||
//       form.credits > 12
//     ) {
//       alert(
//         "Credit units must be between 1 and 12."
//       );

//       return;
//     }

//     onSave(form);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

//       <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

//         {/* ==========================================================
//             MODAL HEADER
//         ========================================================== */}

//         <div className="flex items-center justify-between border-b border-slate-200 p-5">

//           <div>

//             <h2 className="text-lg font-bold text-[#081022]">

//               {course
//                 ? "Edit Course"
//                 : "Add Course"}

//             </h2>

//             <p className="mt-1 text-xs text-slate-500">
//               Configure the course within the programme curriculum.
//             </p>

//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
//           >
//             <X className="h-5 w-5" />
//           </button>

//         </div>

//         {/* ==========================================================
//             FORM
//         ========================================================== */}

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5 p-5"
//         >

//           <div className="grid gap-4 sm:grid-cols-2">

//             {/* COURSE CODE */}

//             <FormField label="Course Code *">

//               <input
//                 value={form.code}
//                 onChange={(event) =>
//                   update(
//                     "code",
//                     event.target.value.toUpperCase()
//                   )
//                 }
//                 placeholder="e.g. CSC101"
//                 className="form-input"
//               />

//             </FormField>

//             {/* COURSE TITLE */}

//             <FormField label="Course Title *">

//               <input
//                 value={form.title}
//                 onChange={(event) =>
//                   update(
//                     "title",
//                     event.target.value
//                   )
//                 }
//                 placeholder="e.g. Introduction to Computer Science"
//                 className="form-input"
//               />

//             </FormField>

//             {/* PROGRAMME */}

//             <FormField label="Programme *">

//               <select
//                 value={form.programme}
//                 onChange={(event) =>
//                   handleProgrammeChange(
//                     event.target.value
//                   )
//                 }
//                 className="form-input"
//               >

//                 <option value="">
//                   Select Programme
//                 </option>

//                 {programmes.map(
//                   (programme) => (

//                     <option
//                       key={
//                         programme._id
//                       }
//                       value={
//                         programme._id
//                       }
//                     >
//                       {programme.code} -{" "}
//                       {programme.name}
//                     </option>

//                   )
//                 )}

//               </select>

//             </FormField>

//             {/* DEPARTMENT */}

//             <FormField label="Department *">

//               <select
//                 value={form.department}
//                 onChange={(event) =>
//                   update(
//                     "department",
//                     event.target.value
//                   )
//                 }
//                 className="form-input"
//               >

//                 <option value="">
//                   Select Department
//                 </option>

//                 {departments.map(
//                   (department) => (

//                     <option
//                       key={
//                         department._id
//                       }
//                       value={
//                         department._id
//                       }
//                     >
//                       {department.code
//                         ? `${department.code} - `
//                         : ""}
//                       {
//                         department.name
//                       }
//                     </option>

//                   )
//                 )}

//               </select>

//               {selectedDepartment && (
//                 <p className="text-[11px] text-slate-500">
//                   Selected:{" "}
//                   {
//                     selectedDepartment.name
//                   }
//                 </p>
//               )}

//             </FormField>

//             {/* LEVEL */}

//             <FormField label="Level *">

//               <select
//                 value={form.level}
//                 onChange={(event) =>
//                   update(
//                     "level",
//                     event.target
//                       .value as CourseLevel
//                   )
//                 }
//                 className="form-input"
//               >

//                 {LEVELS.map(
//                   (level) => (

//                     <option
//                       key={level}
//                       value={level}
//                     >
//                       {level}
//                     </option>

//                   )
//                 )}

//               </select>

//             </FormField>

//             {/* SEMESTER */}

//             <FormField label="Semester *">

//               <select
//                 value={form.semester}
//                 onChange={(event) =>
//                   update(
//                     "semester",
//                     event.target
//                       .value as CourseSemester
//                   )
//                 }
//                 className="form-input"
//               >

//                 {SEMESTERS.map(
//                   (semester) => (

//                     <option
//                       key={semester}
//                       value={semester}
//                     >
//                       {semester}
//                     </option>

//                   )
//                 )}

//               </select>

//             </FormField>

//             {/* CREDIT UNITS */}

//             <FormField label="Credit Units *">

//               <input
//                 type="number"
//                 min="1"
//                 max="12"
//                 value={form.credits}
//                 onChange={(event) =>
//                   update(
//                     "credits",
//                     Number(
//                       event.target.value
//                     )
//                   )
//                 }
//                 className="form-input"
//               />

//             </FormField>

//             {/* TYPE */}

//             <FormField label="Course Type">

//               <select
//                 value={form.type}
//                 onChange={(event) =>
//                   update(
//                     "type",
//                     event.target
//                       .value as CourseType
//                   )
//                 }
//                 className="form-input"
//               >

//                 {COURSE_TYPES.map(
//                   (type) => (

//                     <option
//                       key={type}
//                       value={type}
//                     >
//                       {type}
//                     </option>

//                   )
//                 )}

//               </select>

//             </FormField>

//             {/* STATUS */}

//             <FormField label="Status">

//               <select
//                 value={form.status}
//                 onChange={(event) =>
//                   update(
//                     "status",
//                     event.target
//                       .value as CourseStatus
//                   )
//                 }
//                 className="form-input"
//               >

//                 {COURSE_STATUSES.map(
//                   (status) => (

//                     <option
//                       key={status}
//                       value={status}
//                     >
//                       {status}
//                     </option>

//                   )
//                 )}

//               </select>

//             </FormField>

//           </div>

//           {/* ========================================================
//               CURRICULUM INFORMATION
//           ======================================================== */}

//           <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

//             <div className="flex gap-3">

//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">

//                 <BookOpen className="h-4 w-4" />

//               </div>

//               <div>

//                 <p className="text-sm font-bold text-blue-900">
//                   Curriculum placement
//                 </p>

//                 <p className="mt-1 text-xs leading-5 text-blue-700">

//                   The course will belong to the selected
//                   programme and department and will be placed
//                   under the selected level and semester.

//                 </p>

//               </div>

//             </div>

//           </div>

//           {/* ========================================================
//               DUPLICATE WARNING
//           ======================================================== */}

//           <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

//             <p className="text-xs font-semibold text-amber-800">
//               Course code rule
//             </p>

//             <p className="mt-1 text-xs leading-5 text-amber-700">
//               The same course code can be used in different
//               programmes, but it cannot be duplicated within
//               the same programme, level and semester.
//             </p>

//           </div>

//           {/* ========================================================
//               FOOTER
//           ======================================================== */}

//           <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               disabled={saving}
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               disabled={
//                 saving ||
//                 programmes.length ===
//                   0 ||
//                 departments.length ===
//                   0
//               }
//               className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
//             >

//               {saving && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}

//               {course
//                 ? "Save Changes"
//                 : "Add Course"}

//             </Button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// }

// /* ================================================================
//    FORM FIELD
// ================================================================ */

// function FormField({
//   label,
//   children,
// }: {
//   label: string;

//   children: React.ReactNode;
// }) {
//   return (
//     <label className="space-y-1.5">

//       <span className="text-xs font-bold text-slate-700">
//         {label}
//       </span>

//       {children}

//     </label>
//   );
// }
import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Edit3,
  FileText,
  Layers3,
  Loader2,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ================================================================
   API BASE URL
================================================================ */

const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5001/api";

/* ================================================================
   TYPES
================================================================ */

type CourseStatus = "Approved" | "Draft" | "Inactive";

type CourseType = "Compulsory" | "Elective";

type CourseLevel = "ND 1" | "ND 2" | "HND 1" | "HND 2";

type CourseSemester = "First Semester" | "Second Semester";

type Department = {
  _id: string;
  name: string;
  code?: string;
};

type Programme = {
  _id: string;
  code: string;
  name: string;
  department: string | Department;
};

type Course = {
  _id: string;
  code: string;
  title: string;
  programme: string | Programme;
  department: string | Department;
  level: CourseLevel;
  semester: CourseSemester;
  credits: number;
  type: CourseType;
  status: CourseStatus;
  createdAt?: string;
  updatedAt?: string;
};

type CourseForm = {
  code: string;
  title: string;
  programme: string;
  department: string;
  level: CourseLevel;
  semester: CourseSemester;
  credits: number;
  type: CourseType;
  status: CourseStatus;
};

/* ================================================================
   CONSTANTS
================================================================ */

const LEVELS: CourseLevel[] = [
  "ND 1",
  "ND 2",
  "HND 1",
  "HND 2",
];

const SEMESTERS: CourseSemester[] = [
  "First Semester",
  "Second Semester",
];

const COURSE_TYPES: CourseType[] = [
  "Compulsory",
  "Elective",
];

const COURSE_STATUSES: CourseStatus[] = [
  "Draft",
  "Approved",
  "Inactive",
];

/* ================================================================
   HELPER - GET API DATA
================================================================ */

const extractArray = <T,>(data: unknown, key: string): T[] => {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    typeof data === "object" &&
    data !== null &&
    key in data
  ) {
    const value = (data as Record<string, unknown>)[key];

    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "data" in data
  ) {
    const value = (data as Record<string, unknown>).data;

    if (Array.isArray(value)) {
      return value as T[];
    }
  }

  return [];
};

/* ================================================================
   CURRICULUM
================================================================ */

export default function Curriculum() {
  const [courses, setCourses] = useState<Course[]>([]);

  const [programmes, setProgrammes] = useState<Programme[]>([]);

  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [programmeFilter, setProgrammeFilter] = useState("All");

  const [levelFilter, setLevelFilter] = useState("All");

  const [semesterFilter, setSemesterFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);

  const [editingCourse, setEditingCourse] =
    useState<Course | null>(null);

  const [expandedProgramme, setExpandedProgramme] =
    useState<string | null>(null);

  /* ================================================================
     GET PROGRAMME ID
  ================================================================ */

  const getProgrammeId = (
    programme: Course["programme"] | undefined
  ): string => {
    if (!programme) {
      return "";
    }

    if (typeof programme === "string") {
      return programme;
    }

    return programme._id || "";
  };

  /* ================================================================
     GET PROGRAMME NAME
  ================================================================ */

  const getProgrammeName = (
    programme: Course["programme"] | undefined
  ): string => {
    if (!programme) {
      return "Unknown Programme";
    }

    if (typeof programme === "string") {
      const found = programmes.find(
        (item) => item._id === programme
      );

      return found?.name || "Unknown Programme";
    }

    return programme.name || "Unknown Programme";
  };

  /* ================================================================
     GET DEPARTMENT ID
  ================================================================ */

  const getDepartmentId = (
    department: Course["department"] | undefined
  ): string => {
    if (!department) {
      return "";
    }

    if (typeof department === "string") {
      return department;
    }

    return department._id || "";
  };

  /* ================================================================
     GET DEPARTMENT NAME
  ================================================================ */

  const getDepartmentName = (course: Course): string => {
    if (!course.department) {
      return "Unknown Department";
    }

    if (typeof course.department !== "string") {
      return course.department.name || "Unknown Department";
    }

    const department = departments.find(
      (item) => item._id === course.department
    );

    if (department) {
      return department.name;
    }

    /*
     * Fallback:
     * Get department from programme.
     */

    const programmeId = getProgrammeId(course.programme);

    const programme = programmes.find(
      (item) => item._id === programmeId
    );

    if (!programme) {
      return "Unknown Department";
    }

    if (typeof programme.department !== "string") {
      return (
        programme.department.name ||
        "Unknown Department"
      );
    }

    const programmeDepartment = departments.find(
      (item) => item._id === programme.department
    );

    return (
      programmeDepartment?.name ||
      "Unknown Department"
    );
  };

  /* ================================================================
     FETCH PROGRAMMES
  ================================================================ */

  const fetchProgrammes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/programmes`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load programmes"
        );
      }

      const programmeData = extractArray<Programme>(
        data,
        "programmes"
      );

      setProgrammes(programmeData);
    } catch (error) {
      console.error(
        "Fetch programmes error:",
        error
      );

      setProgrammes([]);
    }
  };

  /* ================================================================
     FETCH DEPARTMENTS
  ================================================================ */

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/departments`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load departments"
        );
      }

      const departmentData =
        extractArray<Department>(
          data,
          "departments"
        );

      setDepartments(departmentData);
    } catch (error) {
      console.error(
        "Fetch departments error:",
        error
      );

      setDepartments([]);
    }
  };

  /* ================================================================
     FETCH COURSES
  ================================================================ */

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/courses`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load courses"
        );
      }

      const courseData = extractArray<Course>(
        data,
        "courses"
      );

      setCourses(courseData);
    } catch (error) {
      console.error(
        "Fetch courses error:",
        error
      );

      setCourses([]);
    }
  };

  /* ================================================================
     LOAD DATA
  ================================================================ */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchDepartments(),
          fetchProgrammes(),
          fetchCourses(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================================================================
     FILTER COURSES
  ================================================================ */

  const filteredCourses = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    return courses.filter((course) => {
      const programmeName =
        getProgrammeName(course.programme);

      const departmentName =
        getDepartmentName(course);

      const searchMatch =
        !searchValue ||
        course.code
          ?.toLowerCase()
          .includes(searchValue) ||
        course.title
          ?.toLowerCase()
          .includes(searchValue) ||
        programmeName
          .toLowerCase()
          .includes(searchValue) ||
        departmentName
          .toLowerCase()
          .includes(searchValue);

      const programmeMatch =
        programmeFilter === "All" ||
        getProgrammeId(course.programme) ===
          programmeFilter;

      const levelMatch =
        levelFilter === "All" ||
        course.level === levelFilter;

      const semesterMatch =
        semesterFilter === "All" ||
        course.semester === semesterFilter;

      return (
        searchMatch &&
        programmeMatch &&
        levelMatch &&
        semesterMatch
      );
    });
  }, [
    courses,
    programmes,
    departments,
    search,
    programmeFilter,
    levelFilter,
    semesterFilter,
  ]);

  /* ================================================================
     STATISTICS
  ================================================================ */

  const programmeCount = programmes.length;

  const courseCount = courses.length;

  const draftCount = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  const approvedCount = courses.filter(
    (course) => course.status === "Approved"
  ).length;

  const totalCredits = courses.reduce(
    (total, course) =>
      total + (Number(course.credits) || 0),
    0
  );

  /* ================================================================
     OPEN ADD MODAL
  ================================================================ */

  const openAddModal = () => {
    setEditingCourse(null);
    setShowAddModal(true);
  };

  /* ================================================================
     OPEN EDIT MODAL
  ================================================================ */

  const openEditModal = (course: Course) => {
    setShowAddModal(false);
    setEditingCourse(course);
  };

  /* ================================================================
     CLOSE MODAL
  ================================================================ */

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCourse(null);
  };

  /* ================================================================
     SAVE COURSE
  ================================================================ */

  const saveCourse = async (form: CourseForm) => {
    try {
      setSaving(true);

      const isEditing = Boolean(editingCourse);

      const url = isEditing
        ? `${API_BASE_URL}/courses/${editingCourse?._id}`
        : `${API_BASE_URL}/courses`;

      const payload = {
        code: form.code.trim().toUpperCase(),

        title: form.title.trim(),

        programme: form.programme,

        department: form.department,

        level: form.level,

        semester: form.semester,

        credits: Number(form.credits),

        type: form.type,

        status: form.status,
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save course"
        );
      }

      await fetchCourses();

      closeModal();
    } catch (error) {
      console.error(
        "Save course error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save course"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================================================================
     DELETE COURSE
  ================================================================ */

  const deleteCourse = async (course: Course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.code} - ${course.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/${course._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to delete course"
        );
      }

      await fetchCourses();
    } catch (error) {
      console.error(
        "Delete course error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete course"
      );
    }
  };

  /* ================================================================
     APPROVE COURSE
  ================================================================ */

  const approveCourse = async (course: Course) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/courses/${course._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Approved",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to approve course"
        );
      }

      await fetchCourses();
    } catch (error) {
      console.error(
        "Approve course error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to approve course"
      );
    }
  };

  /* ================================================================
     LOADING
  ================================================================ */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />

          <p className="text-sm text-slate-500">
            Loading curriculum...
          </p>
        </div>
      </div>
    );
  }

  /* ================================================================
     UI
  ================================================================ */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2 text-blue-200">
              <BookOpen className="h-5 w-5" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Programmes & Curriculum
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Curriculum
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage courses, academic levels,
              semesters and credit units.
            </p>
          </div>

          <Button
            onClick={openAddModal}
            className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>

        </div>
      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <StatCard
          icon={Layers3}
          label="Programmes"
          value={programmeCount}
          description="Academic programmes"
        />

        <StatCard
          icon={BookOpen}
          label="Courses"
          value={courseCount}
          description="Curriculum courses"
        />

        <StatCard
          icon={ClipboardCheck}
          label="Approved"
          value={approvedCount}
          description="Approved courses"
        />

        <StatCard
          icon={FileText}
          label="Drafts"
          value={draftCount}
          description="Awaiting approval"
        />

        <StatCard
          icon={Settings2}
          label="Credit Units"
          value={totalCredits}
          description="Total configured credits"
        />

      </div>

      {/* ============================================================
          CONTROLS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader className="border-b border-slate-200">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <CardTitle className="text-base font-bold text-[#081022]">
                Curriculum Structure
              </CardTitle>

              <p className="mt-1 text-xs text-slate-500">
                Browse and manage courses within each programme.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center rounded-lg bg-[#081022] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Course
            </button>

          </div>

        </CardHeader>

        <CardContent className="space-y-4 p-4">

          {/* SEARCH */}

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search course code, title, programme or department..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* FILTERS */}

          <div className="grid gap-3 sm:grid-cols-3">

            {/* PROGRAMME */}

            <select
              value={programmeFilter}
              onChange={(event) =>
                setProgrammeFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">
                All Programmes
              </option>

              {programmes.map((programme) => (
                <option
                  key={programme._id}
                  value={programme._id}
                >
                  {programme.code} -{" "}
                  {programme.name}
                </option>
              ))}
            </select>

            {/* LEVEL */}

            <select
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">
                All Levels
              </option>

              {LEVELS.map((level) => (
                <option
                  key={level}
                  value={level}
                >
                  {level}
                </option>
              ))}
            </select>

            {/* SEMESTER */}

            <select
              value={semesterFilter}
              onChange={(event) =>
                setSemesterFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">
                All Semesters
              </option>

              {SEMESTERS.map((semester) => (
                <option
                  key={semester}
                  value={semester}
                >
                  {semester}
                </option>
              ))}
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          PROGRAMMES
      ============================================================ */}

      <div className="space-y-4">

        {programmes.map((programme) => {

          const programmeCourses =
            filteredCourses.filter(
              (course) =>
                getProgrammeId(
                  course.programme
                ) === programme._id
            );

          const isExpanded =
            expandedProgramme ===
            programme._id;

          const programmeCredits =
            programmeCourses.reduce(
              (total, course) =>
                total +
                (Number(course.credits) || 0),
              0
            );

          return (
            <Card
              key={programme._id}
              className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200"
            >

              {/* PROGRAMME HEADER */}

              <button
                type="button"
                onClick={() =>
                  setExpandedProgramme(
                    isExpanded
                      ? null
                      : programme._id
                  )
                }
                className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50"
              >

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Layers3 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-[#081022]">
                      {programme.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {programme.code}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>
                        {programmeCourses.length}{" "}
                        courses
                      </span>

                      <span>
                        {programmeCredits}{" "}
                        credit units
                      </span>
                    </div>

                  </div>

                </div>

                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                )}

              </button>

              {/* COURSES */}

              {isExpanded && (
                <div className="border-t border-slate-200">

                  {programmeCourses.length === 0 ? (

                    <div className="px-5 py-10 text-center">

                      <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        No courses found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filters.
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[1050px]">

                        <thead className="bg-slate-50">

                          <tr className="border-b border-slate-200">

                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Course
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Department
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Level
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Semester
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Credits
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Type
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Status
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Actions
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {programmeCourses.map(
                            (course) => (

                              <tr
                                key={course._id}
                                className="hover:bg-slate-50"
                              >

                                {/* COURSE */}

                                <td className="px-5 py-4">

                                  <p className="text-sm font-bold text-[#081022]">
                                    {course.code}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {course.title}
                                  </p>

                                </td>

                                {/* DEPARTMENT */}

                                <td className="px-4 py-4 text-sm text-slate-600">
                                  {getDepartmentName(course)}
                                </td>

                                {/* LEVEL */}

                                <td className="px-4 py-4">

                                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                    {course.level}
                                  </span>

                                </td>

                                {/* SEMESTER */}

                                <td className="px-4 py-4 text-sm text-slate-600">
                                  {course.semester}
                                </td>

                                {/* CREDITS */}

                                <td className="px-4 py-4">

                                  <span className="font-bold text-[#081022]">
                                    {course.credits}
                                  </span>

                                </td>

                                {/* TYPE */}

                                <td className="px-4 py-4">

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                      course.type ===
                                      "Compulsory"
                                        ? "bg-blue-50 text-blue-700"
                                        : "bg-purple-50 text-purple-700"
                                    }`}
                                  >
                                    {course.type}
                                  </span>

                                </td>

                                {/* STATUS */}

                                <td className="px-4 py-4">

                                  <span
                                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                      course.status ===
                                      "Approved"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : course.status ===
                                          "Inactive"
                                        ? "bg-slate-100 text-slate-600"
                                        : "bg-amber-50 text-amber-700"
                                    }`}
                                  >
                                    {course.status}
                                  </span>

                                </td>

                                {/* ACTIONS */}

                                <td className="px-5 py-4">

                                  <div className="flex justify-end gap-1">

                                    {course.status ===
                                      "Draft" && (
                                      <button
                                        type="button"
                                        title="Approve"
                                        onClick={() =>
                                          approveCourse(
                                            course
                                          )
                                        }
                                        className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                      >
                                        <Check className="h-4 w-4" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      title="Edit"
                                      onClick={() =>
                                        openEditModal(
                                          course
                                        )
                                      }
                                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </button>

                                    <button
                                      type="button"
                                      title="Delete"
                                      onClick={() =>
                                        deleteCourse(
                                          course
                                        )
                                      }
                                      className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>

                                  </div>

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>
              )}

            </Card>
          );
        })}

      </div>

      {/* ============================================================
          EMPTY PROGRAMME STATE
      ============================================================ */}

      {programmes.length === 0 && (

        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <Layers3 className="mx-auto h-10 w-10 text-slate-300" />

          <p className="mt-4 font-bold text-slate-700">
            No programmes available
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Create a programme before adding courses.
          </p>

        </div>

      )}

      {/* ============================================================
          COURSE MODAL
      ============================================================ */}

      {(showAddModal || editingCourse) && (

        <CourseModal
          course={editingCourse}
          programmes={programmes}
          departments={departments}
          saving={saving}
          onClose={closeModal}
          onSave={saveCourse}
        />

      )}

    </div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

      <CardContent className="p-4">

        <div className="flex items-center justify-between">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081022] text-white">

            <Icon className="h-5 w-5" />

          </div>

          <span className="text-2xl font-black text-[#081022]">
            {value}
          </span>

        </div>

        <p className="mt-4 text-sm font-bold text-[#081022]">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}

/* ================================================================
   COURSE MODAL
================================================================ */

function CourseModal({
  course,
  programmes,
  departments,
  saving,
  onClose,
  onSave,
}: {
  course: Course | null;
  programmes: Programme[];
  departments: Department[];
  saving: boolean;
  onClose: () => void;
  onSave: (form: CourseForm) => void;
}) {
  /* ================================================================
     GET PROGRAMME ID
  ================================================================ */

  const getProgrammeId = (
    programme:
      | Course["programme"]
      | undefined
  ): string => {
    if (!programme) {
      return "";
    }

    if (typeof programme === "string") {
      return programme;
    }

    return programme._id || "";
  };

  /* ================================================================
     GET DEPARTMENT ID
  ================================================================ */

  const getDepartmentId = (
    department:
      | Course["department"]
      | undefined
  ): string => {
    if (!department) {
      return "";
    }

    if (typeof department === "string") {
      return department;
    }

    return department._id || "";
  };

  /* ================================================================
     INITIAL FORM
  ================================================================ */

  const [form, setForm] =
    useState<CourseForm>(() => ({
      code: course?.code || "",

      title: course?.title || "",

      programme:
        getProgrammeId(course?.programme) ||
        programmes[0]?._id ||
        "",

      department:
        getDepartmentId(course?.department) || "",

      level:
        course?.level || "ND 1",

      semester:
        course?.semester || "First Semester",

      credits:
        course?.credits || 3,

      type:
        course?.type || "Compulsory",

      status:
        course?.status || "Draft",
    }));

  /* ================================================================
     UPDATE FORM
  ================================================================ */

  const update = <K extends keyof CourseForm>(
    key: K,
    value: CourseForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ================================================================
     SELECTED PROGRAMME
  ================================================================ */

  const selectedProgramme =
    programmes.find(
      (programme) =>
        programme._id === form.programme
    );

  /* ================================================================
     PROGRAMME DEPARTMENT
  ================================================================ */

  const programmeDepartmentId =
    selectedProgramme
      ? typeof selectedProgramme.department ===
        "object"
        ? selectedProgramme.department._id
        : selectedProgramme.department
      : "";

  /* ================================================================
     AUTOMATICALLY SELECT PROGRAMME DEPARTMENT
  ================================================================ */

  useEffect(() => {
    if (
      selectedProgramme &&
      programmeDepartmentId &&
      !form.department
    ) {
      setForm((current) => ({
        ...current,
        department:
          programmeDepartmentId,
      }));
    }
  }, [
    selectedProgramme,
    programmeDepartmentId,
    form.department,
  ]);

  /* ================================================================
     SELECTED DEPARTMENT
  ================================================================ */

  const selectedDepartment =
    departments.find(
      (department) =>
        department._id === form.department
    );

  /* ================================================================
     PROGRAMME CHANGE
  ================================================================ */

  const handleProgrammeChange = (
    programmeId: string
  ) => {
    const programme =
      programmes.find(
        (item) =>
          item._id === programmeId
      );

    let departmentId = "";

    if (programme) {
      departmentId =
        typeof programme.department ===
        "object"
          ? programme.department._id
          : programme.department;
    }

    setForm((current) => ({
      ...current,
      programme: programmeId,
      department: departmentId,
    }));
  };

  /* ================================================================
     SUBMIT
  ================================================================ */

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.code.trim() ||
      !form.title.trim() ||
      !form.programme ||
      !form.department ||
      !form.level ||
      !form.semester ||
      !form.credits
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    if (
      Number(form.credits) < 1 ||
      Number(form.credits) > 12
    ) {
      alert(
        "Credit units must be between 1 and 12."
      );

      return;
    }

    onSave({
      ...form,
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      credits: Number(form.credits),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ==========================================================
            MODAL HEADER
        ========================================================== */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-[#081022]">
              {course
                ? "Edit Course"
                : "Add Course"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure the course within the programme curriculum.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* ==========================================================
            FORM
        ========================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* COURSE CODE */}

            <FormField label="Course Code *">

              <input
                value={form.code}
                onChange={(event) =>
                  update(
                    "code",
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. CSC101"
                className="form-input"
                required
              />

            </FormField>

            {/* COURSE TITLE */}

            <FormField label="Course Title *">

              <input
                value={form.title}
                onChange={(event) =>
                  update(
                    "title",
                    event.target.value
                  )
                }
                placeholder="e.g. Introduction to Computer Science"
                className="form-input"
                required
              />

            </FormField>

            {/* PROGRAMME */}

            <FormField label="Programme *">

              <select
                value={form.programme}
                onChange={(event) =>
                  handleProgrammeChange(
                    event.target.value
                  )
                }
                className="form-input"
                required
              >

                <option value="">
                  Select Programme
                </option>

                {programmes.map(
                  (programme) => (

                    <option
                      key={
                        programme._id
                      }
                      value={
                        programme._id
                      }
                    >
                      {programme.code} -{" "}
                      {programme.name}
                    </option>

                  )
                )}

              </select>

            </FormField>

            {/* DEPARTMENT */}

            <FormField label="Department *">

              <select
                value={form.department}
                onChange={(event) =>
                  update(
                    "department",
                    event.target.value
                  )
                }
                className="form-input"
                required
              >

                <option value="">
                  Select Department
                </option>

                {departments.map(
                  (department) => (

                    <option
                      key={
                        department._id
                      }
                      value={
                        department._id
                      }
                    >
                      {department.code
                        ? `${department.code} - `
                        : ""}
                      {department.name}
                    </option>

                  )
                )}

              </select>

              {selectedDepartment && (
                <p className="text-[11px] text-slate-500">
                  Selected:{" "}
                  {selectedDepartment.name}
                </p>
              )}

            </FormField>

            {/* LEVEL */}

            <FormField label="Level *">

              <select
                value={form.level}
                onChange={(event) =>
                  update(
                    "level",
                    event.target
                      .value as CourseLevel
                  )
                }
                className="form-input"
                required
              >

                {LEVELS.map(
                  (level) => (

                    <option
                      key={level}
                      value={level}
                    >
                      {level}
                    </option>

                  )
                )}

              </select>

            </FormField>

            {/* SEMESTER */}

            <FormField label="Semester *">

              <select
                value={form.semester}
                onChange={(event) =>
                  update(
                    "semester",
                    event.target
                      .value as CourseSemester
                  )
                }
                className="form-input"
                required
              >

                {SEMESTERS.map(
                  (semester) => (

                    <option
                      key={semester}
                      value={semester}
                    >
                      {semester}
                    </option>

                  )
                )}

              </select>

            </FormField>

            {/* CREDIT UNITS */}

            <FormField label="Credit Units *">

              <input
                type="number"
                min="1"
                max="12"
                value={form.credits}
                onChange={(event) =>
                  update(
                    "credits",
                    Number(
                      event.target.value
                    )
                  )
                }
                className="form-input"
                required
              />

            </FormField>

            {/* TYPE */}

            <FormField label="Course Type">

              <select
                value={form.type}
                onChange={(event) =>
                  update(
                    "type",
                    event.target
                      .value as CourseType
                  )
                }
                className="form-input"
              >

                {COURSE_TYPES.map(
                  (type) => (

                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>

                  )
                )}

              </select>

            </FormField>

            {/* STATUS */}

            <FormField label="Status">

              <select
                value={form.status}
                onChange={(event) =>
                  update(
                    "status",
                    event.target
                      .value as CourseStatus
                  )
                }
                className="form-input"
              >

                {COURSE_STATUSES.map(
                  (status) => (

                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </FormField>

          </div>

          {/* ========================================================
              CURRICULUM INFORMATION
          ======================================================== */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">

                <BookOpen className="h-4 w-4" />

              </div>

              <div>

                <p className="text-sm font-bold text-blue-900">
                  Curriculum placement
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">

                  The course will belong to the selected
                  programme and department and will be placed
                  under the selected level and semester.

                </p>

              </div>

            </div>

          </div>

          {/* ========================================================
              DUPLICATE WARNING
          ======================================================== */}

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

            <p className="text-xs font-semibold text-amber-800">
              Course code rule
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              The same course code can be used in different
              programmes, but it cannot be duplicated within
              the same programme, level and semester.
            </p>

          </div>

          {/* ========================================================
              FOOTER
          ======================================================== */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                saving ||
                programmes.length === 0 ||
                departments.length === 0
              }
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >

              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {course
                ? "Save Changes"
                : "Add Course"}

            </Button>

          </div>

        </form>

      </div>

    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">

      <span className="block text-xs font-bold text-slate-700">
        {label}
      </span>

      {children}

    </label>
  );
}