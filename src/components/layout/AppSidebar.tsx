import { useContext, useMemo, useEffect, useState } from "react";
import {
  LayoutDashboard, User2, User, NotebookPen, BookCopy, ListChecks, ListCheck,
  BookOpen, Info, GraduationCap, FileEdit, TableProperties, CheckCheck,
  Laptop, Laptop2, Disc3, ReceiptText, AlarmClock, Pencil, Settings, LogOut,
  ChevronRight,
  ChevronDown,
  Upload,
  MessageSquareText,
  ClipboardList,
  ClipboardCheck,
  BellRing,
  Video,
  Users,
  Wallet,
  Building2,
  ShieldCheck,
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

/**
 * ADMIN NAV
 * Full institution-wide oversight. Mirrors every student-facing module but at
 * a management/approval level, plus admin-only modules (system, staff, finance).
 */
function buildAdminNav(classes: any[]) {
  return [
    {
      label: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      key: "admin-dashboard",
    },

    // ── Admissions (correlates with student "Application") ────────────────
    {
      label: "Admissions",
      items: [
        { title: "Application Portal", url: "/admin/admissions/portal", icon: NotebookPen, key: "application-portal" },
        { title: "Application Review", url: "/admin/admissions/review", icon: ClipboardCheck, key: "application-review" },
        { title: "Admission Batches", url: "/admin/admissions/batches", icon: ListChecks, key: "admission-batches" },
        { title: "Academics & Credentials", url: "/admin/admissions/credentials", icon: GraduationCap, key: "academics-credentials" },
      ],
    },

    // ── Programmes & Curriculum (correlates with student "Course") ─────────
    {
      label: "Programmes & Departments",
      items: [
         { title: "Departments", url: "/admin/departments", icon: BookCopy, key: "departments" },
        { title: "Programmes by Department", url: "/admin/programmes", icon: BookCopy, key: "programmes-by-department" },
       
        { title: "Curriculum", url: "/admin/curriculum", icon: BookCopy, key: "curriculum" },
        { title: "Course Allocation", url: "/admin/course-allocation", icon: BookCopy, key: "course-allocation" },
        { title: "Course Forum Oversight", url: "/admin/course-forum", icon: NotebookPen, key: "course-forum-oversight" },
        { title: "Discussion Moderation", url: "/admin/discussion", icon: TableProperties, key: "discussion-moderation" },
      ],
    },

    // ── Students ─────────────────────────────────────────────────────────
    {
      label: "Students",
      items: [
        { title: "Student Registry", url: "/admin/students/registry", icon: LayoutDashboard, key: "student-registry" },
        { title: "Student Registration", url: "/admin/students/registration", icon: User2, key: "student-registration" },
        { title: "Course Registration Printout", url: "/admin/students/course-reg-printout", icon: TableProperties, key: "course-reg-printout" },
        { title: "Registration Printout", url: "/admin/students/registration-printout", icon: TableProperties, key: "registration-printout" },
        { title: "Result Approval Panel", url: "/admin/students/result-approval", icon: ClipboardCheck, key: "result-approval" },
        { title: "SIWES & IT Tracker", url: "/admin/students/siwes-tracker", icon: TableProperties, key: "siwes-tracker" },
      ],
    },

    // ── Quiz oversight (correlates with student "Quiz List") ───────────────
    {
      label: "Quiz Oversight",
      items: [
        { title: "All Quizzes", url: "/admin/quiz/all", icon: ListChecks, key: "all-quizzes" },
        { title: "Quiz Results", url: "/admin/quiz/results", icon: ClipboardCheck, key: "quiz-results" },
      ],
    },

    // ── Notifications (correlates with student "Notifications") ────────────
    {
      label: "Notifications",
      url: "/admin/notifications",
      icon: BellRing,
      key: "admin-notifications",
    },

    // ── Studio oversight (correlates with student "Studio") ────────────────
    {
      label: "Studio",
      items: [
        { title: "Live Stream Monitoring", url: "/admin/studio/live-stream", icon: Video, key: "studio-live-stream" },
        { title: "Activity Stream", url: "/admin/studio/activity-stream", icon: ListChecks, key: "studio-activity-stream" },
        { title: "Lectures", url: "/admin/studio/meetings", icon: TableProperties, key: "studio-meetings" },
        { title: "Messaging", url: "/admin/studio/messaging", icon: FileEdit, key: "studio-messaging" },
      ],
    },

    // ── Grade Book (correlates with student "Grade Book") ──────────────────
    {
      label: "Grade Book",
      url: "/admin/grade-book",
      icon: ClipboardCheck,
      key: "admin-grade-book",
    },

    // ── Assignment oversight (correlates with student "Assignment") ────────
    {
      label: "Assignment Oversight",
      url: "/admin/assignments",
      icon: ClipboardList,
      key: "admin-assignments",
    },

    // ── Staff ────────────────────────────────────────────────────────────
    {
      label: "Staff",
      items: [
        { title: "Staff Management", url: "/admin/staff/management", icon: Users, key: "staff-management" },
        { title: "Staff Registration", url: "/admin/staff/registration", icon: User2, key: "staff-registration" },
      ],
    },

    // ── Finance (correlates with student "Payment") ─────────────────────────
    {
      label: "Finance",
      items: [
        { title: "Bursary & Finance Control", url: "/admin/finance/bursary", icon: Wallet, key: "bursary-finance" },
        { title: "Student Payment Records", url: "/admin/finance/student-payments", icon: ReceiptText, key: "student-payment-records" },
        { title: "Scholarship Opportunities", url: "/admin/finance/scholarships", icon: GraduationCap, key: "scholarships" },
      ],
    },

    // ── Hostel & Accommodation (correlates with student module) ────────────
    {
      label: "Hostel & Accommodation",
      url: "/admin/hostel",
      icon: Building2,
      key: "admin-hostel",
    },

    // ── Graduation & Alumni ──────────────────────────────────────────────
    {
      label: "Graduation & Alumni",
      items: [
        { title: "Graduation Management", url: "/admin/graduation", icon: GraduationCap, key: "graduation-management" },
        { title: "Alumni Directory", url: "/admin/alumni", icon: Users, key: "alumni-directory" },
      ],
    },

    // ── System ───────────────────────────────────────────────────────────
    {
      label: "System",
      items: [
        { title: "System Settings", url: "/admin/system/settings", icon: Settings, key: "system-settings" },
        { title: "User Access Control", url: "/admin/system/access-control", icon: ShieldCheck, key: "user-access-control" },
        { title: "User Records Management", url: "/admin/system/records", icon: TableProperties, key: "user-records" },
        { title: "Account", url: "/admin/system/account", icon: Pencil, key: "system-account" },
      ],
    },

    // ── Profile ──────────────────────────────────────────────────────────
    {
      label: "Profile",
      url: "/admin/profile",
      icon: User2,
      key: "admin-profile",
    },
  ];
}

/**
 * STAFF / LECTURER NAV
 * Mirrors the student nav one-to-one: wherever a student consumes something,
 * staff create/manage it. e.g. student "Assignment" -> staff "Create Assignment".
 */

const getJwtToken = () => {
  return localStorage.getItem("jwtToken") || "";
};
function buildTeacherNav(courses: any[]) {
  const courseSubItems =
    courses.length > 0
      ? courses.map((allocation) => ({
          title:
            allocation.course?.code
              ? `${allocation.course.code} - ${
                  allocation.course?.title || "Untitled Course"
                }`
              : allocation.course?.title || "Untitled Course",

          url: `/staff/dashboard/course/${allocation._id}`,
        }))
      : [
          {
            title: "No courses assigned yet",
           url: "/staff/dashboard/course-allocation",
          },
        ];

  return [
    {
      label: "Dashboard",
      url: "/staff/dashboard",
      icon: LayoutDashboard,
      key: "staff-dashboard",
    },

    // ── Course ───────────────────────────────────────────────────────────
    {
      label: "Course",
      items: [
        {
          title: "My Courses",
          icon: NotebookPen,
          key: "staff-my-courses",
          subItems: courseSubItems,
        },


        {
          title: "Course Forum",
          url: "/staff/dashboard/course-forum",
          icon: NotebookPen,
          key: "staff-course-forum",
        },

        {
          title: "Discussion",
          url: "/staff/dashboard/discussion",
          icon: TableProperties,
          key: "staff-discussion",
        },
      ],
    },

    // ── Quiz ─────────────────────────────────────────────────────────────
    {
      label: "Quiz",
      items: [
        {
          title: "Create Quiz",
          url: "/staff/dashboard/quiz/create",
          icon: FileEdit,
          key: "create-quiz",
        },
        {
          title: "Manage Quiz",
          url: "/staff/dashboard/quiz/manage",
          icon: ListChecks,
          key: "manage-quiz",
        },
        {
          title: "Quiz Results",
          url: "/staff/dashboard/quiz/results",
          icon: ClipboardCheck,
          key: "staff-quiz-results",
        },
      ],
    },

    // ── Notifications ────────────────────────────────────────────────────
    {
      label: "Notifications",
      items: [
        {
          title: "Send Notification",
          url: "/staff/dashboard/notification/send",
          icon: BellRing,
          key: "send-notification",
        },
        {
          title: "Notification History",
          url: "/staff/dashboard/notification/history",
          icon: TableProperties,
          key: "notification-history",
        },
      ],
    },

    // ── Studio ───────────────────────────────────────────────────────────
    {
      label: "Studio",
      items: [
        {
          title: "Live Stream",
          url: "/staff/dashboard/studio/live-stream",
          icon: Video,
          key: "staff-live-stream",
        },
        {
          title: "Activity Stream",
          url: "/staff/dashboard/studio/activity-stream",
          icon: ListChecks,
          key: "staff-activity-stream",
        },
        {
          title: "Lectures",
          url: "/staff/dashboard/studio/meeting",
          icon: TableProperties,
          key: "staff-meeting",
        },
        {
          title: "Messaging",
          url: "/staff/dashboard/studio/messaging",
          icon: FileEdit,
          key: "staff-messaging",
        },
      ],
    },

    // ── Grade Book ───────────────────────────────────────────────────────
    {
      label: "Grade Book",
      items: [
        {
          title: "Continuous Assessment",
          url: "/staff/dashboard/grade-book/continuous-assessment",
          icon: FileEdit,
          key: "continuous-assessment",
        },
        {
          title: "Exam Mark Entry Sheet",
          url: "/staff/dashboard/grade-book/exam-mark-entry",
          icon: TableProperties,
          key: "exam-mark-entry",
        },
        {
          title: "Tabulation Sheet",
          url: "/staff/dashboard/grade-book/tabulation",
          icon: TableProperties,
          key: "staff-tabulation",
        },
      ],
    },

    // ── Assignment ───────────────────────────────────────────────────────
    {
      label: "Assignment",
      items: [
        {
          title: "Create Assignment",
          url: "/staff/dashboard/assignment/create",
          icon: FileEdit,
          key: "create-assignment",
        },
        {
          title: "All Assignments",
          url: "/staff/dashboard/assignment/all",
          icon: ListChecks,
          key: "staff-all-assignments",
        },
        {
          title: "Grade Submissions",
          url: "/staff/dashboard/assignment/grade-submissions",
          icon: ClipboardCheck,
          key: "grade-submissions",
        },
      ],
    },

    // ── Payroll ──────────────────────────────────────────────────────────
    {
      label: "Payroll",
      items: [
        {
          title: "Pay Slip",
          url: "/staff/dashboard/payroll/pay-slip",
          icon: ReceiptText,
          key: "pay-slip",
        },
        {
          title: "Payment History",
          url: "/staff/dashboard/payroll/history",
          icon: TableProperties,
          key: "staff-payment-history",
        },
      ],
    },

    // ── Profile ──────────────────────────────────────────────────────────
    {
      label: "Profile",
      items: [
        {
          title: "Profile System",
          url: "/staff/dashboard/profile",
          icon: User2,
          key: "profile-system",
        },
        {
          title: "Profile & Biodata",
          url: "/staff/dashboard/biodata",
          icon: User2,
          key: "profile-biodata",
        },
      ],
    },

    // ── Hostel ───────────────────────────────────────────────────────────
    {
      label: "Hostel & Accommodation",
      url: "/staff/dashboard/hostel",
      icon: Building2,
      key: "staff-hostel",
    },

    // ── SIWES ─────────────────────────────────────────────────────────────
    {
      label: "SIWES",
      items: [
        {
          title: "IT Supervisor Dashboard",
          url: "/staff/dashboard/siwes",
          icon: TableProperties,
          key: "siwes-supervisor",
        },
      ],
    },

    // ── HR ────────────────────────────────────────────────────────────────
    {
      label: "HR",
      items: [
        {
          title: "Personal HR",
          url: "/staff/dashboard/hr",
          icon: User,
          key: "personal-hr",
        },
        {
          title: "Approval & Promotion Tracker",
          url: "/staff/dashboard/hr/promotion-tracker",
          icon: TableProperties,
          key: "promotion-tracker",
        },
        {
          title: "Leave & Absence Request",
          url: "/staff/dashboard/hr/leave-request",
          icon: AlarmClock,
          key: "leave-request",
        },
      ],
    },
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
        { title: "Lectures", url: "/student/dashboard/studio/meeting", icon: TableProperties, key: "meeting" },
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
        { title: "Hostel & Accommodation", url: "/student/dashboard/hostel", key: "hostel-accommodation" },
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
  () =>
    Array.isArray(rawClasses)
      ? [...rawClasses].sort((a, b) =>
          String(a.name || "").localeCompare(
            String(b.name || "")
          )
        )
      : [],
  [rawClasses]
);

// ============================================================
// STAFF COURSE ALLOCATIONS
// ============================================================

const [staffCourses, setStaffCourses] = useState<any[]>([]);
const [coursesLoading, setCoursesLoading] = useState(false);

useEffect(() => {
  if (user?.role !== "staff") return;

  const fetchStaffCourses = async () => {
    try {
      setCoursesLoading(true);

      const token = localStorage.getItem("jwtToken");

      if (!token) {
        console.error("jwtToken not found");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_NODE_API_URL || "http://localhost:5001/api"}/course-allocations/my`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load staff courses"
        );
      }

      setStaffCourses(
        Array.isArray(data?.allocations)
          ? data.allocations.filter(
              (allocation: any) =>
                allocation.status === "Active"
            )
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load staff course allocations:",
        error
      );

      setStaffCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  fetchStaffCourses();
}, [user?.role]);

const nav = useMemo(() => {
  switch (user?.role) {
    case "staff":
      return buildTeacherNav(staffCourses);

    case "student":
      return buildStudentNav(classes);

    default:
      return buildAdminNav(classes);
  }
}, [user?.role, staffCourses, classes]);

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
                                    {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
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
                                  {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
                                  {!collapsed && <span>{item.title}</span>}
                                </a>
                              ) : (
                                <NavLink
                                  to={url}
                                  end
                                  activeClassName="bg-white text-[#081022] font-semibold"
                                  className="rounded-md px-2 py-2 hover:bg-white/12"
                                >
                                  {item.icon && <item.icon className="mr-2 h-4 w-4 shrink-0" />}
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
