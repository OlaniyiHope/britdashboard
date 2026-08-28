// import { useMemo, useState } from "react";
// import {
//   BookCopy,
//   Building2,
//   CheckCircle2,
//   ChevronRight,
//   Clock3,
//   GraduationCap,
//   Plus,
//   Search,
//   Users,
//   XCircle,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// type ProgrammeStatus = "Active" | "Inactive";

// type Programme = {
//   id: string;
//   code: string;
//   name: string;
//   department: string;
//   qualification: string;
//   duration: string;
//   students: number;
//   status: ProgrammeStatus;
//   updated: string;
// };

// const programmeData: Programme[] = [
//   {
//     id: "PRG-001",
//     code: "BSC-CS",
//     name: "Computer Science",
//     department: "Computing & Information Technology",
//     qualification: "B.Sc.",
//     duration: "4 Years",
//     students: 248,
//     status: "Active",
//     updated: "20 Aug 2026",
//   },
//   {
//     id: "PRG-002",
//     code: "BSC-IT",
//     name: "Information Technology",
//     department: "Computing & Information Technology",
//     qualification: "B.Sc.",
//     duration: "4 Years",
//     students: 193,
//     status: "Active",
//     updated: "19 Aug 2026",
//   },
//   {
//     id: "PRG-003",
//     code: "BSC-ACC",
//     name: "Accounting",
//     department: "Business & Management",
//     qualification: "B.Sc.",
//     duration: "4 Years",
//     students: 176,
//     status: "Active",
//     updated: "18 Aug 2026",
//   },
//   {
//     id: "PRG-004",
//     code: "BSC-BUS",
//     name: "Business Administration",
//     department: "Business & Management",
//     qualification: "B.Sc.",
//     duration: "4 Years",
//     students: 221,
//     status: "Active",
//     updated: "18 Aug 2026",
//   },
//   {
//     id: "PRG-005",
//     code: "BSC-PAM",
//     name: "Public Administration",
//     department: "Social & Administrative Sciences",
//     qualification: "B.Sc.",
//     duration: "4 Years",
//     students: 154,
//     status: "Active",
//     updated: "16 Aug 2026",
//   },
//   {
//     id: "PRG-006",
//     code: "ND-COM",
//     name: "Computer Engineering",
//     department: "Engineering",
//     qualification: "ND",
//     duration: "2 Years",
//     students: 87,
//     status: "Inactive",
//     updated: "10 Aug 2026",
//   },
// ];

// const statusStyles: Record<ProgrammeStatus, string> = {
//   Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
//   Inactive: "border-slate-200 bg-slate-100 text-slate-600",
// };

// export default function Programmes() {
//   const [search, setSearch] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("All");
//   const [statusFilter, setStatusFilter] = useState<
//     "All" | ProgrammeStatus
//   >("All");

//   const departments = useMemo(() => {
//     return Array.from(
//       new Set(programmeData.map((programme) => programme.department))
//     );
//   }, []);

//   const filteredProgrammes = useMemo(() => {
//     return programmeData.filter((programme) => {
//       const searchValue = search.toLowerCase();

//       const matchesSearch =
//         programme.name.toLowerCase().includes(searchValue) ||
//         programme.code.toLowerCase().includes(searchValue) ||
//         programme.department.toLowerCase().includes(searchValue);

//       const matchesDepartment =
//         departmentFilter === "All" ||
//         programme.department === departmentFilter;

//       const matchesStatus =
//         statusFilter === "All" ||
//         programme.status === statusFilter;

//       return (
//         matchesSearch &&
//         matchesDepartment &&
//         matchesStatus
//       );
//     });
//   }, [search, departmentFilter, statusFilter]);

//   const activeProgrammes = programmeData.filter(
//     (programme) => programme.status === "Active"
//   ).length;

//   const inactiveProgrammes = programmeData.filter(
//     (programme) => programme.status === "Inactive"
//   ).length;

//   const totalStudents = programmeData.reduce(
//     (total, programme) => total + programme.students,
//     0
//   );

//   return (
//     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

//       {/* ============================================================
//           HEADER
//       ============================================================ */}

//       <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

//         <div>

//           <div className="flex items-center gap-2 text-[#006dcc]">

//             <BookCopy className="h-5 w-5" />

//             <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
//               Academic Structure
//             </span>

//           </div>

//           <h1 className="mt-2 text-2xl font-bold text-[#081022] md:text-3xl">
//             Programmes by Department
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm text-slate-500">
//             Manage academic departments, programmes, qualifications,
//             programme status, and student enrolment.
//           </p>

//         </div>

//         <Button
//           className="bg-[#081022] hover:bg-[#111c32]"
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Add Programme
//         </Button>

//       </div>

//       {/* ============================================================
//           STATISTICS
//       ============================================================ */}

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardContent className="p-5">

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-xs font-semibold text-slate-500">
//                   Programmes
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-[#081022]">
//                   {programmeData.length}
//                 </p>
//               </div>

//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                 <BookCopy className="h-5 w-5" />
//               </div>

//             </div>

//             <p className="mt-3 text-xs text-slate-400">
//               Academic programmes
//             </p>

//           </CardContent>
//         </Card>

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardContent className="p-5">

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-xs font-semibold text-slate-500">
//                   Departments
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-[#081022]">
//                   {departments.length}
//                 </p>
//               </div>

//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
//                 <Building2 className="h-5 w-5" />
//               </div>

//             </div>

//             <p className="mt-3 text-xs text-slate-400">
//               Academic departments
//             </p>

//           </CardContent>
//         </Card>

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardContent className="p-5">

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-xs font-semibold text-slate-500">
//                   Active Programmes
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-[#081022]">
//                   {activeProgrammes}
//                 </p>
//               </div>

//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>

//             </div>

//             <p className="mt-3 text-xs text-slate-400">
//               Currently accepting students
//             </p>

//           </CardContent>
//         </Card>

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardContent className="p-5">

//             <div className="flex items-center justify-between">

//               <div>
//                 <p className="text-xs font-semibold text-slate-500">
//                   Students
//                 </p>

//                 <p className="mt-2 text-3xl font-black text-[#081022]">
//                   {totalStudents.toLocaleString()}
//                 </p>
//               </div>

//               <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
//                 <Users className="h-5 w-5" />
//               </div>

//             </div>

//             <p className="mt-3 text-xs text-slate-400">
//               Students across programmes
//             </p>

//           </CardContent>
//         </Card>

//       </div>

//       {/* ============================================================
//           DEPARTMENT OVERVIEW
//       ============================================================ */}

//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//         <div className="border-b border-slate-200 p-5">

//           <div className="flex items-center gap-2">

//             <Building2 className="h-5 w-5 text-[#081022]" />

//             <div>

//               <h2 className="text-base font-bold text-[#081022]">
//                 Departments
//               </h2>

//               <p className="mt-1 text-xs text-slate-500">
//                 Academic programmes grouped by department.
//               </p>

//             </div>

//           </div>

//         </div>

//         <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">

//           {departments.map((department) => {

//             const departmentProgrammes = programmeData.filter(
//               (programme) =>
//                 programme.department === department
//             );

//             const departmentStudents =
//               departmentProgrammes.reduce(
//                 (total, programme) =>
//                   total + programme.students,
//                 0
//               );

//             return (
//               <button
//                 key={department}
//                 type="button"
//                 onClick={() => setDepartmentFilter(department)}
//                 className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//               >

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#081022]">
//                     <Building2 className="h-5 w-5" />
//                   </div>

//                   <div>

//                     <p className="text-sm font-bold text-[#081022]">
//                       {department}
//                     </p>

//                     <p className="mt-1 text-xs text-slate-500">
//                       {departmentProgrammes.length}{" "}
//                       {departmentProgrammes.length === 1
//                         ? "programme"
//                         : "programmes"}{" "}
//                       · {departmentStudents} students
//                     </p>

//                   </div>

//                 </div>

//                 <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />

//               </button>
//             );

//           })}

//         </div>

//       </Card>

//       {/* ============================================================
//           PROGRAMME LIST
//       ============================================================ */}

//       <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

//         {/* TOOLBAR */}

//         <div className="border-b border-slate-200 p-4">

//           <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

//             <div>

//               <h2 className="text-base font-bold text-[#081022]">
//                 Academic Programmes
//               </h2>

//               <p className="mt-1 text-xs text-slate-500">
//                 View and manage programmes offered by the institution.
//               </p>

//             </div>

//             <div className="flex flex-col gap-2 md:flex-row">

//               <div className="relative">

//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

//                 <Input
//                   value={search}
//                   onChange={(event) =>
//                     setSearch(event.target.value)
//                   }
//                   placeholder="Search programmes..."
//                   className="w-full pl-9 md:w-[250px]"
//                 />

//               </div>

//               <select
//                 value={departmentFilter}
//                 onChange={(event) =>
//                   setDepartmentFilter(event.target.value)
//                 }
//                 className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
//               >
//                 <option value="All">
//                   All Departments
//                 </option>

//                 {departments.map((department) => (
//                   <option
//                     key={department}
//                     value={department}
//                   >
//                     {department}
//                   </option>
//                 ))}

//               </select>

//               <select
//                 value={statusFilter}
//                 onChange={(event) =>
//                   setStatusFilter(
//                     event.target.value as
//                       | "All"
//                       | ProgrammeStatus
//                   )
//                 }
//                 className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
//               >
//                 <option value="All">
//                   All Status
//                 </option>

//                 <option value="Active">
//                   Active
//                 </option>

//                 <option value="Inactive">
//                   Inactive
//                 </option>

//               </select>

//             </div>

//           </div>

//         </div>

//         {/* TABLE */}

//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[1100px]">

//             <thead className="bg-slate-50">

//               <tr className="border-b border-slate-200 text-left">

//                 <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Programme
//                 </th>

//                 <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Department
//                 </th>

//                 <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Qualification
//                 </th>

//                 <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Duration
//                 </th>

//                 <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Students
//                 </th>

//                 <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Status
//                 </th>

//                 <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
//                   Action
//                 </th>

//               </tr>

//             </thead>

//             <tbody className="divide-y divide-slate-100">

//               {filteredProgrammes.map((programme) => (

//                 <tr
//                   key={programme.id}
//                   className="transition hover:bg-slate-50"
//                 >

//                   {/* PROGRAMME */}

//                   <td className="px-5 py-4">

//                     <div>

//                       <div className="flex items-center gap-2">

//                         <p className="font-bold text-[#081022]">
//                           {programme.name}
//                         </p>

//                       </div>

//                       <p className="mt-1 text-xs font-medium text-[#006dcc]">
//                         {programme.code}
//                       </p>

//                     </div>

//                   </td>

//                   {/* DEPARTMENT */}

//                   <td className="px-5 py-4">

//                     <div className="flex items-center gap-2">

//                       <Building2 className="h-4 w-4 text-slate-400" />

//                       <span className="max-w-[220px] text-sm text-slate-600">
//                         {programme.department}
//                       </span>

//                     </div>

//                   </td>

//                   {/* QUALIFICATION */}

//                   <td className="px-5 py-4">

//                     <div className="flex items-center gap-2">

//                       <GraduationCap className="h-4 w-4 text-slate-400" />

//                       <span className="text-sm font-medium text-slate-700">
//                         {programme.qualification}
//                       </span>

//                     </div>

//                   </td>

//                   {/* DURATION */}

//                   <td className="px-5 py-4">

//                     <div className="flex items-center gap-2 text-sm text-slate-600">

//                       <Clock3 className="h-4 w-4 text-slate-400" />

//                       {programme.duration}

//                     </div>

//                   </td>

//                   {/* STUDENTS */}

//                   <td className="px-5 py-4">

//                     <div className="flex items-center gap-2">

//                       <Users className="h-4 w-4 text-slate-400" />

//                       <span className="font-bold text-[#081022]">
//                         {programme.students}
//                       </span>

//                     </div>

//                   </td>

//                   {/* STATUS */}

//                   <td className="px-5 py-4">

//                     <span
//                       className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[programme.status]}`}
//                     >

//                       {programme.status === "Active" ? (
//                         <CheckCircle2 className="h-3.5 w-3.5" />
//                       ) : (
//                         <XCircle className="h-3.5 w-3.5" />
//                       )}

//                       {programme.status}

//                     </span>

//                   </td>

//                   {/* ACTION */}

//                   <td className="px-5 py-4">

//                     <div className="flex justify-end gap-2">

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="h-8"
//                       >
//                         View
//                       </Button>

//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="h-8"
//                       >
//                         Manage
//                       </Button>

//                     </div>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//         {/* EMPTY */}

//         {filteredProgrammes.length === 0 && (

//           <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

//             <BookCopy className="h-10 w-10 text-slate-300" />

//             <p className="mt-3 text-sm font-bold text-slate-600">
//               No programmes found
//             </p>

//             <p className="mt-1 text-xs text-slate-400">
//               Try changing your search or filters.
//             </p>

//           </div>

//         )}

//       </Card>

//       {/* ============================================================
//           FOOTER
//       ============================================================ */}

//       <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">

//         <div className="flex items-center gap-2">

//           <BookCopy className="h-4 w-4" />

//           <span>
//             Showing{" "}
//             <strong className="text-[#081022]">
//               {filteredProgrammes.length}
//             </strong>{" "}
//             of{" "}
//             <strong className="text-[#081022]">
//               {programmeData.length}
//             </strong>{" "}
//             programmes
//           </span>

//         </div>

//         <span>
//           Inactive programmes:{" "}
//           <strong className="text-[#081022]">
//             {inactiveProgrammes}
//           </strong>
//         </span>

//       </div>

//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";

import {
  BookCopy,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

type ProgrammeStatus = "Active" | "Inactive";

type Programme = {
  _id: string;
  code: string;
  name: string;

  department:
    | string
    | {
        _id: string;
        name: string;
        code: string;
      };

  qualification:
    | "ND"
    | "HND"
    | "NCE"
    | "Certificate"
    | "Diploma"
    | "Other";

  duration: string;

  description?: string;

  admissionOpen: boolean;

  students: number;

  status: ProgrammeStatus;

  createdAt?: string;

  updatedAt?: string;
};

type Department = {
  _id: string;
  name: string;
  code: string;
};

const statusStyles: Record<ProgrammeStatus, string> = {
  Active:
    "border-emerald-200 bg-emerald-50 text-emerald-700",

  Inactive:
    "border-slate-200 bg-slate-100 text-slate-600",
};

export default function Programmes() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);

  const [departments, setDepartments] = useState<Department[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] = useState<
    "All" | ProgrammeStatus
  >("All");

  const [showProgrammeModal, setShowProgrammeModal] =
    useState(false);

  const [editingProgramme, setEditingProgramme] =
    useState<Programme | null>(null);

  /*
  ============================================================
  FETCH PROGRAMMES
  ============================================================
  */

  const fetchProgrammes = async () => {
    try {
      setLoading(true);

 const response = await fetch(
  `${API_BASE_URL}/api/programmes`
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load programmes"
        );
      }

      setProgrammes(data.programmes || data);
    } catch (error) {
      console.error("Fetch programmes error:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  ============================================================
  FETCH DEPARTMENTS
  ============================================================
  */

  const fetchDepartments = async () => {
    try {
 const response = await fetch(
  `${API_BASE_URL}/api/departments`
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load departments"
        );
      }

      setDepartments(data.departments || data);
    } catch (error) {
      console.error("Fetch departments error:", error);
    }
  };

  useEffect(() => {
    fetchProgrammes();
    fetchDepartments();
  }, []);

  /*
  ============================================================
  DEPARTMENT NAME
  ============================================================
  */

  const getDepartmentName = (
    department: Programme["department"]
  ) => {
    if (typeof department === "string") {
      return department;
    }

    return department?.name || "Unknown Department";
  };

  /*
  ============================================================
  FILTERING
  ============================================================
  */

  const filteredProgrammes = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return programmes.filter((programme) => {
      const departmentName =
        getDepartmentName(programme.department);

      const matchesSearch =
        programme.name
          .toLowerCase()
          .includes(searchValue) ||
        programme.code
          .toLowerCase()
          .includes(searchValue) ||
        departmentName
          .toLowerCase()
          .includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" ||
        departmentName === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        programme.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    programmes,
    search,
    departmentFilter,
    statusFilter,
  ]);

  /*
  ============================================================
  STATISTICS
  ============================================================
  */

  const activeProgrammes = programmes.filter(
    (programme) => programme.status === "Active"
  ).length;

  const inactiveProgrammes = programmes.filter(
    (programme) => programme.status === "Inactive"
  ).length;

  const totalStudents = programmes.reduce(
    (total, programme) =>
      total + (programme.students || 0),
    0
  );

  /*
  ============================================================
  ADD / EDIT
  ============================================================
  */

  const saveProgramme = async (
    form: ProgrammeForm
  ) => {
    try {
      setSaving(true);

      const isEditing = Boolean(editingProgramme);

    const url = isEditing
  ? `${API_BASE_URL}/api/programmes/${editingProgramme?._id}`
  : `${API_BASE_URL}/api/programmes`;
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save programme"
        );
      }

      await fetchProgrammes();

      setShowProgrammeModal(false);

      setEditingProgramme(null);
    } catch (error) {
      console.error("Save programme error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save programme"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  ============================================================
  DELETE
  ============================================================
  */

  const deleteProgramme = async (
    programme: Programme
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${programme.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
    const response = await fetch(
  `${API_BASE_URL}/api/programmes/${programme._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete programme"
        );
      }

      await fetchProgrammes();
    } catch (error) {
      console.error(
        "Delete programme error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete programme"
      );
    }
  };

  /*
  ============================================================
  TOGGLE STATUS
  ============================================================
  */

  const toggleStatus = async (
    programme: Programme
  ) => {
    try {
      const newStatus =
        programme.status === "Active"
          ? "Inactive"
          : "Active";

      const response = await fetch(
        `${API_BASE_URL}/api/programmes/${programme._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update programme"
        );
      }

      await fetchProgrammes();
    } catch (error) {
      console.error(
        "Toggle programme error:",
        error
      );
    }
  };

  /*
  ============================================================
  LOADING
  ============================================================
  */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />

          <p className="text-sm text-slate-500">
            Loading programmes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="flex items-center gap-2 text-[#006dcc]">

            <BookCopy className="h-5 w-5" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Polytechnic Academic Structure
            </span>

          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#081022] md:text-3xl">
            Programmes by Department
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage departments, ND and HND programmes,
            admission status, qualifications and student
            enrolment.
          </p>

        </div>

        <Button
          onClick={() => {
            setEditingProgramme(null);
            setShowProgrammeModal(true);
          }}
          className="bg-[#081022] hover:bg-[#111c32]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Programme
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Programmes"
          value={programmes.length}
          description="Academic programmes"
          icon={BookCopy}
        />

        <StatCard
          label="Departments"
          value={departments.length}
          description="Academic departments"
          icon={Building2}
        />

        <StatCard
          label="Active Programmes"
          value={activeProgrammes}
          description="Currently active"
          icon={CheckCircle2}
        />

        <StatCard
          label="Students"
          value={totalStudents}
          description="Students across programmes"
          icon={Users}
        />

      </div>

      {/* ============================================================
          DEPARTMENT OVERVIEW
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 p-5">

          <div className="flex items-center gap-2">

            <Building2 className="h-5 w-5 text-[#081022]" />

            <div>

              <h2 className="text-base font-bold text-[#081022]">
                Departments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Academic programmes grouped by department.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">

          {departments.map((department) => {

            const departmentProgrammes =
              programmes.filter(
                (programme) =>
                  getDepartmentName(
                    programme.department
                  ) === department.name
              );

            const departmentStudents =
              departmentProgrammes.reduce(
                (total, programme) =>
                  total +
                  (programme.students || 0),
                0
              );

            return (
              <button
                key={department._id}
                type="button"
                onClick={() =>
                  setDepartmentFilter(
                    department.name
                  )
                }
                className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#081022]">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {department.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {departmentProgrammes.length}{" "}
                      {departmentProgrammes.length ===
                      1
                        ? "programme"
                        : "programmes"}{" "}
                      · {departmentStudents} students
                    </p>

                  </div>

                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />

              </button>
            );
          })}

        </div>

      </Card>

      {/* ============================================================
          PROGRAMME LIST
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        {/* TOOLBAR */}

        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="text-base font-bold text-[#081022]">
                Academic Programmes
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                View and manage programmes offered by the
                polytechnic.
              </p>

            </div>

            <div className="flex flex-col gap-2 md:flex-row">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search programmes..."
                  className="w-full pl-9 md:w-[250px]"
                />

              </div>

              <select
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(
                    event.target.value
                  )
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >

                <option value="All">
                  All Departments
                </option>

                {departments.map((department) => (
                  <option
                    key={department._id}
                    value={department.name}
                  >
                    {department.name}
                  </option>
                ))}

              </select>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "All"
                      | ProgrammeStatus
                  )
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200 text-left">

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Qualification
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Duration
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredProgrammes.map(
                (programme) => (

                  <tr
                    key={programme._id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* PROGRAMME */}

                    <td className="px-5 py-4">

                      <div>

                        <p className="font-bold text-[#081022]">
                          {programme.name}
                        </p>

                        <p className="mt-1 text-xs font-medium text-[#006dcc]">
                          {programme.code}
                        </p>

                      </div>

                    </td>

                    {/* DEPARTMENT */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Building2 className="h-4 w-4 text-slate-400" />

                        <span className="max-w-[220px] text-sm text-slate-600">
                          {getDepartmentName(
                            programme.department
                          )}
                        </span>

                      </div>

                    </td>

                    {/* QUALIFICATION */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <GraduationCap className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium text-slate-700">
                          {programme.qualification}
                        </span>

                      </div>

                    </td>

                    {/* DURATION */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-sm text-slate-600">

                        <Clock3 className="h-4 w-4 text-slate-400" />

                        {programme.duration}

                      </div>

                    </td>

                    {/* STUDENTS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Users className="h-4 w-4 text-slate-400" />

                        <span className="font-bold text-[#081022]">
                          {(
                            programme.students || 0
                          ).toLocaleString()}
                        </span>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[programme.status]}`}
                      >

                        {programme.status ===
                        "Active" ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5" />
                        )}

                        {programme.status}

                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            setEditingProgramme(
                              programme
                            );

                            setShowProgrammeModal(
                              true
                            );
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() =>
                            toggleStatus(
                              programme
                            )
                          }
                        >
                          {programme.status ===
                          "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-red-600 hover:bg-red-50"
                          onClick={() =>
                            deleteProgramme(
                              programme
                            )
                          }
                        >
                          Delete
                        </Button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {filteredProgrammes.length === 0 && (

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <BookCopy className="h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No programmes found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add a programme or change your filters.
            </p>

          </div>

        )}

      </Card>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">

          <BookCopy className="h-4 w-4" />

          <span>
            Showing{" "}
            <strong className="text-[#081022]">
              {filteredProgrammes.length}
            </strong>{" "}
            of{" "}
            <strong className="text-[#081022]">
              {programmes.length}
            </strong>{" "}
            programmes
          </span>

        </div>

        <span>
          Inactive programmes:{" "}
          <strong className="text-[#081022]">
            {inactiveProgrammes}
          </strong>
        </span>

      </div>

      {/* ============================================================
          PROGRAMME MODAL
      ============================================================ */}

      {showProgrammeModal && (
        <ProgrammeModal
          programme={editingProgramme}
          departments={departments}
          saving={saving}
          onClose={() => {
            setShowProgrammeModal(false);
            setEditingProgramme(null);
          }}
          onSave={saveProgramme}
        />
      )}

    </div>
  );
}

/* ================================================================
   FORM TYPE
================================================================ */

type ProgrammeForm = {
  code: string;
  name: string;
  department: string;
  qualification:
    | "ND"
    | "HND"
    | "NCE"
    | "Certificate"
    | "Diploma"
    | "Other";
  duration: string;
  description: string;
  status: ProgrammeStatus;
  admissionOpen: boolean;
};

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

      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold text-slate-500">
              {label}
            </p>

            <p className="mt-2 text-3xl font-black text-[#081022]">
              {value.toLocaleString()}
            </p>

          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">

            <Icon className="h-5 w-5" />

          </div>

        </div>

        <p className="mt-3 text-xs text-slate-400">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}

/* ================================================================
   PROGRAMME MODAL
================================================================ */

function ProgrammeModal({
  programme,
  departments,
  saving,
  onClose,
  onSave,
}: {
  programme: Programme | null;
  departments: Department[];
  saving: boolean;
  onClose: () => void;
  onSave: (form: ProgrammeForm) => void;
}) {
  const [form, setForm] = useState<ProgrammeForm>({
    code: programme?.code || "",
    name: programme?.name || "",

    department:
      typeof programme?.department === "object"
        ? programme.department._id
        : "",

    qualification:
      programme?.qualification || "ND",

    duration:
      programme?.duration || "2 Years",

    description:
      programme?.description || "",

    status:
      programme?.status || "Active",

    admissionOpen:
      programme?.admissionOpen ?? true,
  });

  const update = <K extends keyof ProgrammeForm>(
    key: K,
    value: ProgrammeForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (
      !form.code.trim() ||
      !form.name.trim() ||
      !form.department ||
      !form.duration.trim()
    ) {
      alert(
        "Please complete all required fields."
      );

      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-[#081022]">
              {programme
                ? "Edit Programme"
                : "Add Programme"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure a polytechnic academic programme.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* CODE */}

            <FormField label="Programme Code *">

              <input
                value={form.code}
                onChange={(event) =>
                  update(
                    "code",
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. ND-COM"
                className="form-input"
              />

            </FormField>

            {/* NAME */}

            <FormField label="Programme Name *">

              <input
                value={form.name}
                onChange={(event) =>
                  update(
                    "name",
                    event.target.value
                  )
                }
                placeholder="e.g. Computer Science"
                className="form-input"
              />

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
              >

                <option value="">
                  Select Department
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={department._id}
                      value={department._id}
                    >
                      {department.name}
                    </option>
                  )
                )}

              </select>

            </FormField>

            {/* QUALIFICATION */}

            <FormField label="Qualification *">

              <select
                value={form.qualification}
                onChange={(event) =>
                  update(
                    "qualification",
                    event.target
                      .value as ProgrammeForm["qualification"]
                  )
                }
                className="form-input"
              >

                <option value="ND">
                  National Diploma (ND)
                </option>

                <option value="HND">
                  Higher National Diploma (HND)
                </option>

                <option value="NCE">
                  NCE
                </option>

                <option value="Certificate">
                  Certificate
                </option>

                <option value="Diploma">
                  Diploma
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </FormField>

            {/* DURATION */}

            <FormField label="Duration *">

              <input
                value={form.duration}
                onChange={(event) =>
                  update(
                    "duration",
                    event.target.value
                  )
                }
                placeholder="e.g. 2 Years"
                className="form-input"
              />

            </FormField>

            {/* STATUS */}

            <FormField label="Status">

              <select
                value={form.status}
                onChange={(event) =>
                  update(
                    "status",
                    event.target
                      .value as ProgrammeStatus
                  )
                }
                className="form-input"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </FormField>

          </div>

          {/* DESCRIPTION */}

          <FormField label="Description">

            <textarea
              value={form.description}
              onChange={(event) =>
                update(
                  "description",
                  event.target.value
                )
              }
              placeholder="Describe the programme..."
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />

          </FormField>

          {/* ADMISSION */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">

            <input
              type="checkbox"
              checked={form.admissionOpen}
              onChange={(event) =>
                update(
                  "admissionOpen",
                  event.target.checked
                )
              }
              className="h-4 w-4"
            />

            <div>

              <p className="text-sm font-bold text-[#081022]">
                Open for Admission
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Students can select this programme
                during application.
              </p>

            </div>

          </label>

          {/* INFO */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
                <GraduationCap className="h-4 w-4" />
              </div>

              <div>

                <p className="text-sm font-bold text-blue-900">
                  Polytechnic programme
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  After creating this programme,
                  you can add its curriculum and
                  courses from the Curriculum section.
                  Staff members should be assigned
                  individual courses rather than the
                  entire programme.
                </p>

              </div>

            </div>

          </div>

          {/* BUTTONS */}

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
              disabled={saving}
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >

              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {programme
                ? "Save Changes"
                : "Create Programme"}

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

      <span className="text-xs font-bold text-slate-700">
        {label}
      </span>

      {children}

    </label>
  );
}