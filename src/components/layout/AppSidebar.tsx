import { useContext, useMemo, useState } from "react";
import {
  LayoutDashboard, User2, User, NotebookPen, BookCopy, ListChecks, ListCheck,
  BookOpen, Info, GraduationCap, FileEdit, TableProperties, CheckCheck,
  Laptop, Laptop2, Disc3, ReceiptText, AlarmClock, Pencil, Settings, LogOut,
  ChevronRight,
  ChevronDown,
  Upload,
  MessageSquareText,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";
import logo from "@/assets/logo.png";
import { toClassRouteParam } from "@/lib/class-utils";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// ── helpers ──────────────────────────────────────────────────────────────────
const className = (c: any) => String(c?.name || c?.className || "");
// Use name string (not _id) — backend routes expect class name, e.g. "JS1"
const classId   = (c: any) => toClassRouteParam(c?.name || c?.className || "");

// ── nav builders ─────────────────────────────────────────────────────────────
function buildAdminNav(classes: any[]) {
  const classSubItems =
    classes.length > 0
      ? classes.map((c) => ({
          title: className(c),
          url: `/student/information/${classId(c)}`,
        }))
      : [{ title: "No classes yet. Add a class", url: "/class/manage" }];

  const subjectSubItems =
    classes.length > 0
      ? classes.map((c) => ({
          title: className(c),
          url: `/subject/${classId(c)}`,
        }))
      : [{ title: "No classes yet. Add a class", url: "/class/manage" }];

  return [
    {
  label: "Dashboard",
  url: "/curriculum",
  icon: BookOpen,
  key: "curriculum",
},


  {
      label: "Admission",
      items: [
        {
          title: "Application Portal",
          url: "/dashboard",
          icon: LayoutDashboard,
          key: "dashboard",
        },
        { title: "Application Review", url: "/admin", icon: User2, key: "admin" },
        { title: "Admission Batches", url: "/admin", icon: User2, key: "admin" },
        { title: "Academics & Credentials", url: "/admin", icon: User2, key: "admin" },
      ],
    },
      {
      label: "Programmes",
      items: [
        {
          title: "Programmes by Department",
          icon: BookOpen,
          key: "programmes",
          // subItems: programmeSubItems,
        },
        { title: "Curriculum", url: "/admin/curriculum", icon: BookCopy, key: "curriculum" },
      ],
    },
 {
      label: "Student",
      items: [
        {
          title: "Student Registry",
          url: "/dashboard",
          icon: LayoutDashboard,
          key: "dashboard",
        },
        { title: "Student Registration", url: "/admin", icon: User2, key: "admin" },
        { title: "Course Registration Printout", url: "/admin", icon: User2, key: "admin" },
        { title: "Registration Printout", url: "/admin", icon: User2, key: "admin" },
        { title: "Result Approval Panel", url: "/admin", icon: User2, key: "admin" },
        { title: "SIWES & Industrial Training Tracker", url: "/admin", icon: User2, key: "admin" },
      ],
    },
 {
      label: "Staff",
      items: [
        {
          title: "Staff Management",
          url: "/dashboard",
          icon: LayoutDashboard,
          key: "dashboard",
        },
        { title: "Staff Registration", url: "/admin", icon: User2, key: "admin" },
   
      ],
    },
 {
      label: "Graduation & Alumni",
      items: [
        {
          title: "Graduation Management",
          url: "/dashboard",
          icon: LayoutDashboard,
          key: "dashboard",
        },
        { title: "Alumni Directory", url: "/admin", icon: User2, key: "admin" },
   
      ],
    },
 {
      label: "Finance",
      items: [
        {
          title: "Bursary & Finance Control",
          url: "/dashboard",
          icon: LayoutDashboard,
          key: "dashboard",
        },
        { title: "Scholarship Opportunities", url: "/admin", icon: User2, key: "admin" },
   
      ],
    },
 {
      label: "System",
      items: [
        {
          title: "System Settings",
          url: "/dashboard",
          icon: LayoutDashboard,
          key: "dashboard",
        },
        { title: "User Access Control", url: "/admin", icon: User2, key: "admin" },
        { title: "User Records Management", url: "/admin", icon: User2, key: "admin" },
        { title: "Account", url: "/admin", icon: User2, key: "admin" },
   
      ],
    },
        {
  label: "Profile",
  url: "/curriculum",
  icon: BookOpen,
  key: "curriculum",
},

    // {
    //   label: "Marksheet",
    //   items: [
    //     { title: "Teachers", url: "/teacher", icon: User, key: "teacher" },
    //   ],
    // },
    // {
    //   label: "Parents",
    //   items: [
    //     { title: "Parents", url: "/parents", icon: User, key: "parents" },
    //   ],
    // },
    // {
    //   label: "Notice Board",
    //   items: [
    //     { title: "Noticeboard", url: "/notices", icon: Info, key: "notice" },
    //   ],
    // },
    // {
    //   label: "Class",
    //   items: [
    //     {
    //       title: "Manage Class",
    //       url: "/class/manage",
    //       icon: GraduationCap,
    //       key: "class",
    //     },
    //     {
    //       title: "Academic Syllabus",
    //       url: "/class/syllabus",
    //       icon: GraduationCap,
    //       key: "class",
    //     },
    //   ],
    // },
    // {
    //   label: "Subjects",
    //   items: [
    //     {
    //       title: "Subject by Class",
    //       icon: BookOpen,
    //       key: "subject",
    //       subItems: subjectSubItems,
    //     },
    //   ],
    // },
    // {
    //   label: "Exam",
    //   items: [
    //     {
    //       title: "Exam List",
    //       url: "/exam/list",
    //       icon: ListChecks,
    //       key: "exam-list",
    //     },
    //     {
    //       title: "Exam Grades",
    //       url: "/exam/grades",
    //       icon: GraduationCap,
    //       key: "exam-grades",
    //     },
    //     {
    //       title: "Manage Marks",
    //       url: "/exam/manage-marks",
    //       icon: FileEdit,
    //       key: "manage-marks",
    //     },
    //     {
    //       title: "Tabulation Sheet",
    //       url: "/exam/tabulation",
    //       icon: TableProperties,
    //       key: "tabulation",
    //     },
    //     {
    //       title: "On Screen Marking",
    //       url: "/exam/onscreenmarking",
    //       icon: CheckCheck,
    //       key: "onscreen-marking",
    //     },
    //   ],
    // },
    // {
    //   label: "Online Exam",
    //   items: [
    //     {
    //       title: "Create Online Exam",
    //       url: "/onlineexam/create",
    //       icon: Laptop,
    //       key: "onlinexam",
    //     },
    //     {
    //       title: "Manage Online Exam",
    //       url: "/onlineexam/manage",
    //       icon: Laptop2,
    //       key: "onlinexam",
    //     },
    //   ],
    // },
    // {
    //   label: "AI Tools",
    //   items: [
    //     {
    //       title: "Curriculum Generator",
    //       url: "/curriculum",
    //       icon: Disc3,
    //       key: "curriculum",
    //     },
    //     {
    //       title: "Generate Questions",
    //       url: "/gen-questions",
    //       icon: Disc3,
    //       key: "gen-questions",
    //     },
    //   ],
    // },
    // {
    //   label: "Past Questions",
    //   items: [
    //     {
    //       title: "UTME",
    //       url: "https://cbt.edupro.com.ng/login",
    //       icon: Disc3,
    //       key: "past-questions",
    //     },
    //     {
    //       title: "WAEC",
    //       url: "https://cbt.edupro.com.ng/login",
    //       icon: Disc3,
    //       key: "past-questions",
    //     },
    //   ],
    // },
    // {
    //   label: "Accounting",
    //   items: [
    //     {
    //       title: "Student Receipt",
    //       url: "/stu-receipt",
    //       icon: ReceiptText,
    //       key: "studentAccounting",
    //     },
    //     {
    //       title: "Student Payments",
    //       url: "/stu-payments",
    //       icon: ReceiptText,
    //       key: "studentAccounting",
    //     },
    //   ],
    // },
    // {
    //   label: "Study Material",
    //   items: [
    //     {
    //       title: "Study Material",
    //       url: "/studymaterial",
    //       icon: Disc3,
    //       key: "studymaterial",
    //     },
    //   ],
    // },
    // {
    //   label: "Daily Attendance",
    //   items: [
    //     {
    //       title: "Daily Attendance",
    //       url: "/dailyattend",
    //       icon: AlarmClock,
    //       key: "dailyattend",
    //     },
    //   ],
    // },
    // {
    //   label: "System",
    //   items: [
    //     { title: "Profile", url: "/profile", icon: User2, key: "settings" },
    //     {
    //       title: "Settings",
    //       url: "/settings",
    //       icon: Settings,
    //       key: "settings",
    //     },
    //     { title: "Account", url: "/account", icon: Pencil, key: "settings" },
    //   ],
    // },
  ];
}

// function buildTeacherNav(classes: any[]) {
//   const classSubItems = classes.length > 0
//     ? classes.map((c) => ({ title: className(c), url: `/teacher/dashboard/student-information/${classId(c)}` }))
//     : [
//         { title: "Class J.S.1", url: "/teacher/dashboard/student-information/js1" },
//         { title: "Class J.S.2", url: "/teacher/dashboard/student-information/js2" },
//         { title: "Class J.S.3", url: "/teacher/dashboard/student-information/js3" },
//         { title: "Class S.S.1", url: "/teacher/dashboard/student-information/ss1" },
//         { title: "Class S.S.2", url: "/teacher/dashboard/student-information/ss2" },
//         { title: "Class S.S.3", url: "/teacher/dashboard/student-information/ss3" },
//       ];

//   const subjectSubItems = classes.length > 0
//     ? classes.map((c) => ({ title: className(c), url: `/teacher/dashboard/subject/${classId(c)}` }))
//     : [
//         { title: "Class J.S.1", url: "/teacher/dashboard/subject/js1" },
//         { title: "Class J.S.2", url: "/teacher/dashboard/subject/js2" },
//         { title: "Class J.S.3", url: "/teacher/dashboard/subject/js3" },
//         { title: "Class S.S.1", url: "/teacher/dashboard/subject/ss1" },
//         { title: "Class S.S.2", url: "/teacher/dashboard/subject/ss2" },
//         { title: "Class S.S.3", url: "/teacher/dashboard/subject/ss3" },
//       ];

//   return [
//     {
//       label: "Teacher Menu",
//       items: [
//         { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboard, key: "teacher-dashboard" },
//       ],
//     },
//     {
//       label: "Students",
//       items: [
//         { title: "Student Information", icon: NotebookPen, key: "teacher-student-info", subItems: classSubItems },
//       ],
//     },
//     {
//       label: "Subjects",
//       items: [
//         { title: "Subject by Class", icon: BookOpen, key: "teacher-subjects", subItems: subjectSubItems },
//       ],
//     },
//     {
//       label: "Affective Psychomotor",
//       items: [
//         { title: "Student Report", url: "/psycho/stu-report", icon: ListCheck, key: "psycho-report" },
//       ],
//     },
//     {
//       label: "Exam",
//       items: [
//         { title: "Manage Marks", url: "/teacher/dashboard/manage-mark-view", icon: FileEdit, key: "manage-marks" },
//         { title: "Tabulation Sheet", url: "/dashboard/tabulation-sheet", icon: TableProperties, key: "tabulation" },
//         { title: "On Screen Marking", url: "/exam/onscreenmarking", icon: CheckCheck, key: "onscreen-marking" },
//       ],
//     },
//     {
//       label: "Online Exam",
//       items: [
//         { title: "Create Online Exam", url: "/dashboard/online-exam", icon: Laptop, key: "onlinexam" },
//         { title: "Manage Online Exam", url: "/dashboard/manage-online-exam", icon: Laptop2, key: "onlinexam" },
//       ],
//     },
//     {
//       label: "AI Tools",
//       items: [
//         { title: "Homework Review", url: "/teacher/dashboard/homework", icon: MessageSquareText, key: "homework" },
//           { title: "Curriculum Generator", url: "/curriculum", icon: Disc3, key: "curriculum" },
//         { title: "Generate Questions", url: "/gen-questions", icon: Disc3, key: "gen-questions" },
//       ],
//     },
//     {
//       label: "Notice Board",
//       items: [{ title: "Noticeboard", url: "/notices", icon: Info, key: "notice" }],
//     },
//     {
//       label: "Material & Attendance",
//       items: [
//         { title: "Study Material", url: "/studymaterial", icon: Disc3, key: "studymaterial" },
//         { title: "Daily Attendance", url: "/dailyattend", icon: AlarmClock, key: "dailyattend" },
//       ],
//     },
//     {
//       label: "System",
//       items: [
//         { title: "Profile", url: "/dashboard/profile", icon: User2, key: "settings" },
//       ],
//     },
//   ];
// }


function buildTeacherNav(classes: any[]) {
  // "classes" = courses/programmes assigned to this staff member
  const courseSubItems =
    classes.length > 0
      ? classes.map((c) => ({
          title: className(c),
          url: `/staff/dashboard/course-allocation/${classId(c)}`,
        }))
      : [{ title: "No courses assigned yet", url: "/staff/dashboard/course-allocation" }];

  return [
       {
  label: "Dashboard",
  url: "/curriculum",
  icon: BookOpen,
  key: "curriculum",
},


    // ── Courses ──────────────────────────────────────────────────────────
    {
      label: "Home",
      items: [
        { title: "Course Forum", icon: BookOpen, key: "staff-course-allocation", subItems: courseSubItems },
        { title: "Learning List", url: "/staff/dashboard/homework-curriculum", icon: MessageSquareText, key: "homework-curriculum" },
        { title: "Discussion", url: "/staff/dashboard/homework-curriculum", icon: MessageSquareText, key: "homework-curriculum" },
        { title: "Profile", url: "/staff/dashboard/homework-curriculum", icon: MessageSquareText, key: "homework-curriculum" },
      ],
    },
       {
  label: "My Course",
  url: "/curriculum",
  icon: BookOpen,
  key: "curriculum",
},

    // ── Students ─────────────────────────────────────────────────────────
    {
      label: "Quiz List",
      items: [
        { title: "Manage Quiz", url: "/staff/dashboard/advisory-mentorship", key: "advisory-mentorship" },
        { title: "Create Quiz", url: "/staff/dashboard/roster-attendance", icon: ListChecks, key: "roster-attendance" },
      ],
    },
     {
  label: "Notifcation",
  url: "/curriculum",
  icon: BookOpen,
  key: "curriculum",
},

    // ── Assessment & Exams ───────────────────────────────────────────────
    {
      label: "Grading",
      items: [
        { title: "Grade Book", url: "/staff/dashboard/continuous-assessment", icon: FileEdit, key: "continuous-assessment" },
        { title: "Exam Mark Entry Sheet", url: "/staff/dashboard/exam-mark-entry", icon: TableProperties, key: "exam-mark-entry" },
    
      ],
    },

    // ── E-Learning & Live Classes ────────────────────────────────────────
    {
      label: "Studio",
      items: [
        { title: "LiveStream", url: "/staff/dashboard/e-learning", icon: Laptop, key: "e-learning" },
        { title: "Activity Stream", url: "/staff/dashboard/live",  key: "live-classes" },
        { title: "Meetings", url: "/staff/dashboard/live",  key: "live-classes" },
        { title: "Messaging", url: "/staff/dashboard/live",  key: "live-classes" },
      ],
    },
    {
      label: "Assignment",
      items: [
        { title: "Create Assignment", url: "/staff/dashboard/e-learning", icon: Laptop, key: "e-learning" },
        { title: "All Assignment", url: "/staff/dashboard/live",  key: "live-classes" },
     
      ],
    },
     {
  label: "Student Application",
  url: "/curriculum",
  icon: BookOpen,
  key: "curriculum",
},
    // ── SIWES ────────────────────────────────────────────────────────────
    {
      label: "SIWES",
      items: [
        { title: "IT Supervisor SIWES Dashboard", url: "/staff/dashboard/siwes", icon: TableProperties, key: "siwes-supervisor" },
      ],
    },

    // ── HR & Payroll ─────────────────────────────────────────────────────
    {
      label: "HR & Payroll",
      items: [
        { title: "Personal HR", url: "/staff/dashboard/hr", icon: User, key: "personal-hr" },
        { title: "Pay Slip", url: "/staff/dashboard/payslip",  key: "pay-slip" },
        { title: "Approval & Promotion Tracker", url: "/staff/dashboard/promotion-tracker", key: "promotion-tracker" },
        { title: "Leave & Absence Request", url: "/staff/dashboard/leave-request",  key: "leave-request" },
      ],
    },

    // ── Profile ──────────────────────────────────────────────────────────
    {
      label: "Profile",
      items: [
        { title: "Profile System", url: "/staff/dashboard/profile", icon: User2, key: "profile-system" },
        { title: "Profile & Biodata", url: "/staff/dashboard/biodata", key: "profile-biodata" },
      ],
    },

    // ── Communication ────────────────────────────────────────────────────
  
  ];
}

function buildStudentNav(_classes: any[]) {
  return [
      {
  label: "Dashboard",
  url: "/student-dashboard",
  icon: BookOpen,
  key: "student-dashboard",
},

       {
  label: "Home",
  url: "/student/dashboard/home",
  icon: BookOpen,
  key: "my-courses",
},
   {
      label: "Application",
      items: [
        { title: "My Application", url: "/student/dashboard/application/my-application", icon: NotebookPen, key: "my-application" },
        { title: "All Application", url: "/student/dashboard/application/all-application", icon: ListChecks, key: "all-application" },
       
      
      ],
    },

    // ── Academics ────────────────────────────────────────────────────────
    {
      label: "Course",
      items: [
        { title: "Course Registration", url: "/student/dashboard/course/course-registration", icon: NotebookPen, key: "course-registration" },
        { title: "My Course", url: "/student/dashboard/my-courses", icon: NotebookPen, key: "my-courses" },
        { title: "Course Forum", url: "/student/dashboard/course-forum", icon: NotebookPen, key: "course-forum" },
        { title: "Learning List", url: "/student/dashboard/learning-list", icon: ListChecks, key: "learning-list" },
        { title: "Discussion", url: "/student/dashboard/discussion", icon: TableProperties, key: "discussion" },
   
      
      ],
    },

  

        {
  label: "Quiz List",
  url: "/student/dashboard/quiz-list",
  icon: BookOpen,
  key: "quiz-list",
},


    // ── Library ──────────────────────────────────────────────────────────
      {
  label: "Notifications",
  url: "/student/dashboard/notification",
  icon: BookOpen,
  key: "notification",
},




      {
      label: "Studio",
      items: [
        { title: "Live Stream", url: "/student/dashboard/course-forum", icon: NotebookPen, key: "course-forum" },
        { title: "Activity Stream", url: "/student/dashboard/studio/activity-stream", icon: ListChecks, key: "activity-stream" },
        { title: "Meetings", url: "/student/dashboard/studio/meeting", icon: TableProperties, key: "meeting" },
        { title: "Messaging", url: "/student/dashboard/studio/messaging", icon: FileEdit, key: "messaging" },
      
      ],
    },
          {
  label: "Grade Book",
  url: "/student/dashboard/grade-book",
  icon: BookOpen,
  key: "grade-book",
},
      {
  label: "Assignement",
  url: "/student/dashboard/assignment",
  icon: BookOpen,
  key: "assignment",
},


 

   






       {
      label: "Payment",
      items: [
        { title: "Make Payment", url: "/student/dashboard/payment/make-payment", icon: NotebookPen, key: "make-payment" },
        { title: "Additional Payment", url: "/student/dashboard/payment/additional-payment", icon: ListChecks, key: "additional-payment" },
        { title: "Payment History", url: "/student/dashboard/payment/payment-history", icon: ListChecks, key: "payment-history" },
       
      
      ],
    },
    {
  label: "Profile",
  url: "/student/dashboard/profile",
  icon: BookOpen,
  key: "profile",
},
    {
      label: "Hostel & Accommodation",
      items: [
        { title: "Hostel & Accommodation", url: "/student/dashboard/hostel",  key: "hostel-accommodation" },
      ],
    },

    // ── ID & Profile ─────────────────────────────────────────────────────
    // {
    //   label: "ID & Profile",
    //   items: [
    //     { title: "Digital ID Card", url: "/student/dashboard/digital-id", key: "digital-id" },
    //     { title: "Profile & Biodata", url: "/student/dashboard/biodata", icon: User2, key: "profile-biodata" },
    //     { title: "System Profile", url: "/student/dashboard/profile", icon: User2, key: "system-profile" },
    //   ],
    // },

    // ── Finance ──────────────────────────────────────────────────────────
 
  ];
}

function buildParentNav() {
  return [
    {
      label: "Parent Menu",
      items: [
        { title: "Dashboard", url: "/parent/dashboard", icon: LayoutDashboard, key: "dashboard" },
        { title: "Ward Results", url: "/parent/dashboard/results", icon: GraduationCap, key: "parent-results" },
        { title: "Ward Materials", url: "/parent/dashboard/materials", icon: BookCopy, key: "parent-materials" },
        { title: "Ward Homework", url: "/parent/dashboard/homework", icon: MessageSquareText, key: "parent-homework" },
      ],
    },
  ];
}

// ── component ─────────────────────────────────────────────────────────────────
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();
  const { currentSession } = useContext(SessionContext);

  const { data: rawClasses } = useFetch(
    currentSession?._id ? `/class/${currentSession._id}` : null
  );
  const classes = useMemo(
    () => Array.isArray(rawClasses)
      ? [...rawClasses].sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
      : [],
    [rawClasses]
  );

  const nav = useMemo(() => {
    switch (user?.role) {
      case "staff": return buildTeacherNav(classes);
      case "student": return buildStudentNav(classes);
      // case "parent": return buildParentNav();
      default:        return buildAdminNav(classes);
    }
  }, [user?.role, classes]);

  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isGroupOpen = (label: string) => openGroups[label] ?? false;
  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !(prev[label] ?? true),
    }));
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border bg-[#081022] p-4">
        <div className="flex items-center gap-3">
          
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground leading-tight">
              British Transatlantic Poly
              </span>
              <span className="text-[10px] text-white">
             info@britcampus.com
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#081022] py-2 text-white [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/40 hover:[&::-webkit-scrollbar-thumb]:bg-white/60">
    {nav.map((group) => {
  // Standalone navigation item such as Curriculum
  if ("url" in group && group.url) {
    const isExternal = group.url.startsWith("http");

    return (
      <SidebarGroup key={group.label}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={currentPath === group.url}
              className="text-white hover:bg-white/12 hover:text-white data-[active=true]:bg-white data-[active=true]:text-[#081022]"
            >
              {isExternal ? (
                <a
                  href={group.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center rounded-md px-2 py-2 hover:bg-white/12"
                >
                  <group.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>{group.label}</span>}
                </a>
              ) : (
                <NavLink
                  to={group.url}
                  end
                  activeClassName="bg-white text-[#081022] font-semibold"
                  className="rounded-md px-2 py-2 hover:bg-white/12"
                >
                  <group.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>{group.label}</span>}
                </NavLink>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  // Normal collapsible groups
  return (
    <SidebarGroup key={group.label}>
      <Collapsible
        open={collapsed ? false : isGroupOpen(group.label)}
        onOpenChange={() => toggleGroup(group.label)}
      >
        <SidebarGroupLabel asChild className="px-2">
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-2 text-[10px] uppercase tracking-wider text-white/70 hover:bg-white/12 hover:text-white">
            <span>{group.label}</span>
            <ChevronDown className="h-3.5 w-3.5 transition-transform data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                if ("subItems" in item && item.subItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="text-white hover:bg-white/12 hover:text-white data-[active=true]:bg-white data-[active=true]:text-[#081022]"
                          >
                            <item.icon className="mr-2 h-4 w-4 shrink-0" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((sub) => (
                              <SidebarMenuSubItem key={sub.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPath === sub.url}
                                  className="text-white/80 hover:bg-white/10 hover:text-white data-[active=true]:bg-white data-[active=true]:text-[#081022]"
                                >
                                  <NavLink to={sub.url}>
                                    {sub.title}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                const url = (item as any).url as string;
                const isExternal = url?.startsWith("http");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={currentPath === url}
                      className="text-white hover:bg-white/12 hover:text-white data-[active=true]:bg-white data-[active=true]:text-[#081022]"
                    >
                      {isExternal ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center rounded-md px-2 py-2 hover:bg-white/12"
                        >
                          <item.icon className="mr-2 h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </a>
                      ) : (
                        <NavLink
                          to={url}
                          end
                          activeClassName="bg-white text-[#081022] font-semibold"
                          className="rounded-md px-2 py-2 hover:bg-white/12"
                        >
                          <item.icon className="mr-2 h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
})}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-[#081022] p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/12 hover:text-white"
          onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
