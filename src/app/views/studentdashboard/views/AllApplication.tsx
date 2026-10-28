// // import { useState } from "react";
// // import {
// //   Search,
// //   ChevronRight,
// //   FileText,
// //   X,
// // } from "lucide-react";
// // import { Link, useNavigate } from "react-router-dom";

// // interface Application {
// //   id: number;
// //   name: string;
// //   programs: string[];
// //   startDate: string;
// //   endDate: string;
// //   fee: number;
// //   status: "Open" | "Closed";
// // }

// // const applications: Application[] = [
// //   {
// //     id: 1,
// //     name: "2025/2026 Batch C Application",
// //     programs: [
// //       "BSc. Accounting",
// //       "BSc. Computer Science",
// //       "BSc. Economics",
// //       "BSc. International Studies",
// //       "BSc. Political Science",
// //       "BSc. Public Administration",
// //       "BSc. Sociology",
// //       "BSc. Business Administration",
// //       "BNSc. Nursing Science",
// //       "Master in Business Administration",
// //       "Master in Information Management",
// //       "Master in Law Enforcement and Criminal Justice",
// //       "Master in Public Health",
// //       "Master in International Affairs and Diplomacy",
// //       "Master in Public Administration",
// //       "Postgraduate Diploma in Education",
// //       "Postgraduate Diploma in Management",
// //       "BSc. Mass Communication",
// //       "BSc. Library and Information Science",
// //       "Master in Accounting",
// //       "Master in Disaster Risk Management",
// //     ],
// //     startDate: "Jul 12, 2026",
// //     endDate: "Aug 31, 2026",
// //     fee: 10000,
// //     status: "Open",
// //   },
// //   {
// //     id: 2,
// //     name: "Application for Transfer Program (2026 C)",
// //     programs: [
// //       "BSc. Accounting",
// //       "BSc. Computer Science",
// //       "BSc. Economics",
// //       "BSc. International Studies",
// //       "BSc. Political Science",
// //       "BSc. Public Administration",
// //       "BSc. Sociology",
// //       "BSc. Business Administration",
// //       "BNSc. Nursing Science",
// //       "BSc. Mass Communication",
// //       "BSc. Library and Information Science",
// //     ],
// //     startDate: "Jul 12, 2026",
// //     endDate: "Aug 31, 2026",
// //     fee: 10000,
// //     status: "Open",
// //   },
// // ];

// // const AllApplications = () => {
// //   const navigate = useNavigate();

// //   const [search, setSearch] = useState("");

// //   const filteredApplications = applications.filter((application) => {
// //     const searchText = search.toLowerCase();

// //     return (
// //       application.name.toLowerCase().includes(searchText) ||
// //       application.programs.some((program) =>
// //         program.toLowerCase().includes(searchText)
// //       )
// //     );
// //   });

// //   const handleApply = (application: Application) => {
// //     navigate(`/student/dashboard/application/${application.id}`);
// //   };

// //   return (
// //     <div className="min-h-screen bg-white text-[#333]">

// //       {/* PAGE HEADER */}
// //       <div className="border-b border-[#ddd] px-7 py-5">
// //         <h1 className="text-[18px] font-medium text-[#333]">
// //           All Applications
// //         </h1>
// //       </div>

// //       {/* CONTENT */}
// //       <div className="px-7 md:px-8 py-10">

// //         {/* BREADCRUMB */}
// //         <div className="flex items-center gap-2 text-[12px] text-[#999] mb-8">
// //           <Link
// //             to="/student/dashboard"
// //             className="hover:text-[#006b5d]"
// //           >
// //             Dashboard
// //           </Link>

// //           <ChevronRight size={13} />

// //           <span>Application</span>

// //           <ChevronRight size={13} />

// //           <span className="text-[#555]">
// //             All Applications
// //           </span>
// //         </div>

// //         {/* INFORMATION BOX */}
// //         <div className="inline-flex items-center gap-2 bg-white border border-[#ddd] shadow-sm rounded-[3px] px-4 py-3 mb-8">

// //           <FileText
// //             size={17}
// //             className="text-[#1786d1]"
// //           />

// //           <span className="text-[16px] text-[#1786d1]">
// //             Here is the list of all available{" "}
// //             <span className="font-mono text-red-500">
// //               applications
// //             </span>
// //             .
// //           </span>

// //         </div>

// //         {/* SEARCH */}
// //         <div className="flex justify-end mb-4">

// //           <div className="relative w-full md:w-[280px]">

// //             <Search
// //               size={15}
// //               className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
// //             />

// //             <input
// //               type="text"
// //               placeholder="Search applications..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //               className="
// //                 w-full
// //                 h-[36px]
// //                 border
// //                 border-[#ccc]
// //                 rounded-[2px]
// //                 pl-9
// //                 pr-3
// //                 text-[12px]
// //                 outline-none
// //                 focus:border-[#006b5d]
// //               "
// //             />

// //           </div>

// //         </div>

// //         {/* TABLE */}
// //         <div className="w-full overflow-x-auto">

// //           <table className="w-full min-w-[1000px] border-collapse border border-[#d5dbe2]">

// //             <thead>
// //               <tr className="bg-[#e9edf3]">

// //                 <th className="w-[48px] border border-[#d5dbe2] px-3 py-4 text-left text-[12px] font-bold text-[#444]">
// //                   #
// //                 </th>

// //                 <th className="w-[160px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
// //                   APPLICATION
// //                   <br />
// //                   NAME
// //                 </th>

// //                 <th className="border border-[#d5dbe2] px-5 py-4 text-left text-[12px] font-bold text-[#444]">
// //                   PROGRAM
// //                 </th>

// //                 <th className="w-[125px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
// //                   DURATION
// //                 </th>

// //                 <th className="w-[85px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
// //                   FEE
// //                 </th>

// //                 <th className="w-[135px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
// //                   STATUS/APPLY
// //                 </th>

// //               </tr>
// //             </thead>

// //             <tbody>

// //               {filteredApplications.map((application, index) => (

// //                 <tr
// //                   key={application.id}
// //                   className="hover:bg-[#fafafa]"
// //                 >

// //                   {/* NUMBER */}
// //                   <td className="border border-[#d5dbe2] px-4 py-4 align-top text-[12px] text-[#777]">
// //                     {index + 1}
// //                   </td>

// //                   {/* APPLICATION NAME */}
// //                   <td className="border border-[#d5dbe2] px-5 py-4 align-top">

// //                     <div className="text-[13px] font-medium text-[#777] leading-[19px]">
// //                       {application.name}
// //                     </div>

// //                   </td>

// //                   {/* PROGRAM */}
// //                   <td className="border border-[#d5dbe2] px-5 py-4 align-top">

// //                     <div className="text-[12px] leading-[19px] text-[#777]">
// //                       {application.programs.join(", ")}
// //                     </div>

// //                   </td>

// //                   {/* DURATION */}
// //                   <td className="border border-[#d5dbe2] px-4 py-4 align-top">

// //                     <div className="text-[12px] leading-[19px] text-[#777]">
// //                       {application.startDate}
// //                       <br />
// //                       -
// //                       <br />
// //                       {application.endDate}
// //                     </div>

// //                   </td>

// //                   {/* FEE */}
// //                   <td className="border border-[#d5dbe2] px-4 py-4 align-top">

// //                     <div className="text-[12px] text-[#777]">
// //                       NGN
// //                     </div>

// //                     <div className="text-[12px] text-[#777]">
// //                       {application.fee.toLocaleString()}
// //                     </div>

// //                   </td>

// //                   {/* STATUS */}
// //                   <td className="border border-[#d5dbe2] px-4 py-4 align-top">

// //                     {application.status === "Open" ? (
// //                       <button
// //                         onClick={() => handleApply(application)}
// //                         className="
// //                           bg-[#4caf50]
// //                           hover:bg-[#43a047]
// //                           text-white
// //                           text-[11px]
// //                           font-medium
// //                           px-3
// //                           py-[5px]
// //                           rounded-[2px]
// //                           transition
// //                         "
// //                       >
// //                         APPLY NOW
// //                       </button>
// //                     ) : (
// //                       <span className="text-[11px] text-red-500">
// //                         CLOSED
// //                       </span>
// //                     )}

// //                   </td>

// //                 </tr>

// //               ))}

// //             </tbody>

// //           </table>

// //         </div>

// //         {/* EMPTY STATE */}
// //         {filteredApplications.length === 0 && (
// //           <div className="border border-[#ddd] border-t-0 py-12 text-center">

// //             <FileText
// //               size={35}
// //               className="mx-auto text-[#bbb] mb-3"
// //             />

// //             <p className="text-sm text-[#777]">
// //               No applications found.
// //             </p>

// //           </div>
// //         )}

// //       </div>

// //     </div>
// //   );
// // };

// // export default AllApplications;
// import { useState } from "react";
// import {
//   Search,
//   ChevronRight,
//   FileText,
// } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// interface Application {
//   id: number;
//   name: string;
//   departments: string[];
//   startDate: string;
//   endDate: string;
//   fee: number;
//   status: "Open" | "Closed";
// }

// const applications: Application[] = [
//   {
//     id: 1,
//     name: "2026/2027 General Admission",
//     departments: [
//       "Accountancy",
//       "Computer Science",
//       "Electrical/Electronic Engineering",
//       "Computer Engineering",
//       "Business Administration and Management",
//       "Public Administration",
//       "Mass Communication",
//       "Science Laboratory Technology",
//       "Statistics",
//       "Mechanical Engineering",
//       "Civil Engineering",
//       "Estate Management",
//       "Quantity Surveying",
//       "Office Technology and Management",
//     ],
//     startDate: "Oct 1, 2026",
//     endDate: "Dec 31, 2026",
//     fee: 10000,
//     status: "Open",
//   },
//   {
//     id: 2,
//     name: "2026/2027 Transfer Admission",
//     departments: [
//       "Accountancy",
//       "Computer Science",
//       "Electrical/Electronic Engineering",
//       "Computer Engineering",
//       "Business Administration and Management",
//       "Science Laboratory Technology",
//       "Mass Communication",
//       "Mechanical Engineering",
//     ],
//     startDate: "Oct 1, 2026",
//     endDate: "Dec 31, 2026",
//     fee: 10000,
//     status: "Open",
//   },
// ];

// const AllApplications = () => {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");

//   const filteredApplications = applications.filter((application) => {
//     const searchText = search.toLowerCase();

//     return (
//       application.name.toLowerCase().includes(searchText) ||
//       application.departments.some((department) =>
//         department.toLowerCase().includes(searchText)
//       )
//     );
//   });

//   const handleApply = (application: Application) => {
//     navigate(`/student/dashboard/application/${application.id}`);
//   };

//   return (
//     <div className="min-h-screen bg-white text-[#333]">
//       {/* PAGE HEADER */}
//       <div className="border-b border-[#ddd] px-7 py-5">
//         <h1 className="text-[18px] font-medium text-[#333]">
//           All Applications
//         </h1>
//       </div>

//       {/* CONTENT */}
//       <div className="px-7 md:px-8 py-10">
//         {/* BREADCRUMB */}
//         <div className="flex items-center gap-2 text-[12px] text-[#999] mb-8">
//           <Link
//             to="/student/dashboard"
//             className="hover:text-[#006b5d]"
//           >
//             Dashboard
//           </Link>

//           <ChevronRight size={13} />

//           <span>Application</span>

//           <ChevronRight size={13} />

//           <span className="text-[#555]">
//             All Applications
//           </span>
//         </div>

//         {/* INFORMATION BOX */}
//         <div className="inline-flex items-center gap-2 bg-white border border-[#ddd] shadow-sm rounded-[3px] px-4 py-3 mb-8">
//           <FileText
//             size={17}
//             className="text-[#1786d1]"
//           />

//           <span className="text-[16px] text-[#1786d1]">
//             Here is the list of all available{" "}
//             <span className="font-mono text-red-500">
//               applications
//             </span>
//             .
//           </span>
//         </div>

//         {/* SEARCH */}
//         <div className="flex justify-end mb-4">
//           <div className="relative w-full md:w-[280px]">
//             <Search
//               size={15}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
//             />

//             <input
//               type="text"
//               placeholder="Search applications or departments..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="
//                 w-full
//                 h-[36px]
//                 border
//                 border-[#ccc]
//                 rounded-[2px]
//                 pl-9
//                 pr-3
//                 text-[12px]
//                 outline-none
//                 focus:border-[#006b5d]
//               "
//             />
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="w-full overflow-x-auto">
//           <table className="w-full min-w-[1000px] border-collapse border border-[#d5dbe2]">
//             <thead>
//               <tr className="bg-[#e9edf3]">
//                 <th className="w-[48px] border border-[#d5dbe2] px-3 py-4 text-left text-[12px] font-bold text-[#444]">
//                   #
//                 </th>

//                 <th className="w-[160px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
//                   APPLICATION
//                   <br />
//                   NAME
//                 </th>

//                 <th className="border border-[#d5dbe2] px-5 py-4 text-left text-[12px] font-bold text-[#444]">
//                   DEPARTMENT
//                 </th>

//                 <th className="w-[125px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
//                   DURATION
//                 </th>

//                 <th className="w-[85px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
//                   FEE
//                 </th>

//                 <th className="w-[135px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
//                   STATUS/APPLY
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredApplications.map((application, index) => (
//                 <tr
//                   key={application.id}
//                   className="hover:bg-[#fafafa]"
//                 >
//                   {/* NUMBER */}
//                   <td className="border border-[#d5dbe2] px-4 py-4 align-top text-[12px] text-[#777]">
//                     {index + 1}
//                   </td>

//                   {/* APPLICATION NAME */}
//                   <td className="border border-[#d5dbe2] px-5 py-4 align-top">
//                     <div className="text-[13px] font-medium text-[#777] leading-[19px]">
//                       {application.name}
//                     </div>
//                   </td>

//                   {/* DEPARTMENTS */}
//                   <td className="border border-[#d5dbe2] px-5 py-4 align-top">
//                     <div className="text-[12px] leading-[22px] text-[#777]">
//                       {application.departments.map(
//                         (department, departmentIndex) => (
//                           <div key={`${application.id}-${departmentIndex}`}>
//                             {department}
//                           </div>
//                         )
//                       )}
//                     </div>
//                   </td>

//                   {/* DURATION */}
//                   <td className="border border-[#d5dbe2] px-4 py-4 align-top">
//                     <div className="text-[12px] leading-[19px] text-[#777]">
//                       {application.startDate}
//                       <br />
//                       -
//                       <br />
//                       {application.endDate}
//                     </div>
//                   </td>

//                   {/* FEE */}
//                   <td className="border border-[#d5dbe2] px-4 py-4 align-top">
//                     <div className="text-[12px] text-[#777]">
//                       NGN
//                     </div>

//                     <div className="text-[12px] text-[#777]">
//                       {application.fee.toLocaleString()}
//                     </div>
//                   </td>

//                   {/* STATUS */}
//                   <td className="border border-[#d5dbe2] px-4 py-4 align-top">
//                     {application.status === "Open" ? (
//                       <button
//                         onClick={() => handleApply(application)}
//                         className="
//                           bg-[#4caf50]
//                           hover:bg-[#43a047]
//                           text-white
//                           text-[11px]
//                           font-medium
//                           px-3
//                           py-[5px]
//                           rounded-[2px]
//                           transition
//                         "
//                       >
//                         APPLY NOW
//                       </button>
//                     ) : (
//                       <span className="text-[11px] text-red-500">
//                         CLOSED
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* EMPTY STATE */}
//         {filteredApplications.length === 0 && (
//           <div className="border border-[#ddd] border-t-0 py-12 text-center">
//             <FileText
//               size={35}
//               className="mx-auto text-[#bbb] mb-3"
//             />

//             <p className="text-sm text-[#777]">
//               No applications found.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllApplications;

import { useMemo, useState } from "react";
import {
  Search,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Replace this interface with your existing backend response types if available.
interface Application {
  _id: string;
  applicationName: string;
  department: {
    name?: string;
    code?: string;
  } | null;
  applicationNumber?: string;
  session?: {
    name?: string;
  };
  startDate?: string;
  endDate?: string;
  fee?: number;
  status?: string;
}

interface AllApplicationsProps {
  data?: {
    applications?: Application[];
  } | null;
}

const AllApplications = ({ data }: AllApplicationsProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Read applications from the existing database-backed data source.
  const applications = useMemo(() => {
    return ((data as { applications?: any[] } | null)?.applications || [])
      .map((app: any) => ({
        id: app._id,
        name:
          app.applicationName ||
          `${app.session?.name || "Current Session"} Application`,
        department:
          app.department?.name ||
          app.department?.code ||
          "—",
        startDate: app.startDate
          ? new Date(app.startDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
        endDate: app.endDate
          ? new Date(app.endDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
        fee: Number(app.fee ?? app.applicationFee ?? 0),
        status: app.status || "Open",
      }));
  }, [data]);

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    return (
      application.name.toLowerCase().includes(searchText) ||
      application.department.toLowerCase().includes(searchText)
    );
  });

  const handleApply = (application: (typeof applications)[number]) => {
    navigate(`/student/dashboard/application/${application.id}`);
  };

  return (
    <div className="min-h-screen bg-white text-[#333]">
      {/* PAGE HEADER */}
      <div className="border-b border-[#ddd] px-7 py-5">
        <h1 className="text-[18px] font-medium text-[#333]">
          All Applications
        </h1>
      </div>

      {/* CONTENT */}
      <div className="px-7 md:px-8 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-[12px] text-[#999] mb-8">
          <Link
            to="/student/dashboard"
            className="hover:text-[#006b5d]"
          >
            Dashboard
          </Link>

          <ChevronRight size={13} />

          <span>Application</span>

          <ChevronRight size={13} />

          <span className="text-[#555]">
            All Applications
          </span>
        </div>

        {/* INFORMATION BOX */}
        <div className="inline-flex items-center gap-2 bg-white border border-[#ddd] shadow-sm rounded-[3px] px-4 py-3 mb-8">
          <FileText
            size={17}
            className="text-[#1786d1]"
          />

          <span className="text-[16px] text-[#1786d1]">
            Here is the list of all available{" "}
            <span className="font-mono text-red-500">
              applications
            </span>
            .
          </span>
        </div>

        {/* SEARCH */}
        <div className="flex justify-end mb-4">
          <div className="relative w-full md:w-[320px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
            />

            <input
              type="text"
              placeholder="Search applications or departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-[36px]
                border
                border-[#ccc]
                rounded-[2px]
                pl-9
                pr-3
                text-[12px]
                outline-none
                focus:border-[#006b5d]
              "
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse border border-[#d5dbe2]">
            <thead>
              <tr className="bg-[#e9edf3]">
                <th className="w-[48px] border border-[#d5dbe2] px-3 py-4 text-left text-[12px] font-bold text-[#444]">
                  #
                </th>

                <th className="w-[200px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
                  APPLICATION NAME
                </th>

                <th className="border border-[#d5dbe2] px-5 py-4 text-left text-[12px] font-bold text-[#444]">
                  DEPARTMENT
                </th>

                <th className="w-[150px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
                  DURATION
                </th>

                <th className="w-[100px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
                  FEE
                </th>

                <th className="w-[135px] border border-[#d5dbe2] px-4 py-4 text-left text-[12px] font-bold text-[#444]">
                  STATUS/APPLY
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((application, index) => (
                <tr
                  key={application.id}
                  className="hover:bg-[#fafafa]"
                >
                  <td className="border border-[#d5dbe2] px-4 py-4 align-top text-[12px] text-[#777]">
                    {index + 1}
                  </td>

                  <td className="border border-[#d5dbe2] px-5 py-4 align-top">
                    <div className="text-[13px] font-medium text-[#777] leading-[19px]">
                      {application.name}
                    </div>
                  </td>

                  <td className="border border-[#d5dbe2] px-5 py-4 align-top">
                    <div className="text-[12px] leading-[19px] text-[#777]">
                      {application.department}
                    </div>
                  </td>

                  <td className="border border-[#d5dbe2] px-4 py-4 align-top">
                    <div className="text-[12px] leading-[19px] text-[#777]">
                      {application.startDate}
                      <br />
                      -
                      <br />
                      {application.endDate}
                    </div>
                  </td>

                  <td className="border border-[#d5dbe2] px-4 py-4 align-top">
                    <div className="text-[12px] text-[#777]">
                      NGN {application.fee.toLocaleString()}
                    </div>
                  </td>

                  <td className="border border-[#d5dbe2] px-4 py-4 align-top">
                    {application.status.toLowerCase() === "open" ? (
                      <button
                        onClick={() => handleApply(application)}
                        className="
                          bg-[#4caf50]
                          hover:bg-[#43a047]
                          text-white
                          text-[11px]
                          font-medium
                          px-3
                          py-[5px]
                          rounded-[2px]
                          transition
                        "
                      >
                        APPLY NOW
                      </button>
                    ) : (
                      <span className="text-[11px] text-red-500">
                        CLOSED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filteredApplications.length === 0 && (
          <div className="border border-[#ddd] border-t-0 py-12 text-center">
            <FileText
              size={35}
              className="mx-auto text-[#bbb] mb-3"
            />

            <p className="text-sm text-[#777]">
              {applications.length === 0
                ? "No applications are currently available."
                : "No applications found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllApplications;