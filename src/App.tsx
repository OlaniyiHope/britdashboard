import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SessionProvider } from "@/contexts/SessionContext";
import { AppLayout } from "@/components/layout/AppLayout";

import Login from "./app/views/Login";
import NotFound from "./app/views/NotFound";
import ForgotPassword from "./app/views/ForgotPassword";

// ============================================================
// ADMIN
// ============================================================
import Dashboard from "./app/views/admindashboard/Analytics";
import Admin from "./app/views/admindashboard/views/Admin";
import Inbox from "./app/views/admindashboard/views/Inbox";
import AdmitStudent from "./app/views/admindashboard/views/student/Admit-Student";
import StudentInformation from "./app/views/admindashboard/views/student/Student-Information";
import StudentPromotion from "./app/views/admindashboard/views/student/Student-Promo";
import Category from "./app/views/admindashboard/views/psycho/Category";
import PsychoStudentReport from "./app/views/admindashboard/views/psycho/PsychoStudentReport";
import Teacher from "./app/views/admindashboard/views/Teacher";
import Subject from "./app/views/admindashboard/views/Subject";
import Noticeboard from "./app/views/admindashboard/views/Noticeboard";
import Parents from "./app/views/admindashboard/views/Parents";
import { AcademicSyllabus } from "./app/views/admindashboard/views/class/AcademicSyllabus";
import ManageClasses from "./app/views/admindashboard/views/class/Manageclass";
import ExamList from "./app/views/admindashboard/views/exam/ExamList";
import ExamGrades from "./app/views/admindashboard/views/exam/ExamGrade";
import ManageMarks from "./app/views/admindashboard/views/exam/ManageMarks";
import TabulationSheet from "./app/views/admindashboard/views/exam/TabulationSheet";
import OnScreenMarkingHub from "./app/views/admindashboard/views/exam/OnScreenMarkingHub";
import MarkingWorkspace from "./app/views/admindashboard/views/exam/MarkingWorkSpace";
import OnScreenMarkingLayout from "./app/views/admindashboard/views/exam/OnScreenMarkingLayout";
import CreateOnlineExam from "./app/views/admindashboard/views/onlineexam/Create";
import ManageOnlineExams from "./app/views/admindashboard/views/onlineexam/Manage";
import CurriculumGenerator from "./app/views/admindashboard/views/CurriculumGen";
import QuestionsGenerator from "./app/views/admindashboard/views/GenQuestions";
import BulkStudentUpload from "./app/views/admindashboard/views/student/BulkUpload";
import StudentIdCard from "./app/views/admindashboard/views/student/StudentIdCard";
import StudentReceiptForm from "./app/views/admindashboard/views/accounting/StuReceipt";
import PaymentHistory from "./app/views/admindashboard/views/accounting/StuPayments";
import ManageStudyMaterial from "./app/views/admindashboard/views/StudyMaterial";
import DailyAttendance from "./app/views/admindashboard/views/DailyAttendance";
import Settings from "./app/views/admindashboard/views/Settings";
import Profile from "./app/views/admindashboard/views/system/Profile";
import Account from "./app/views/admindashboard/views/system/Account";
import MarkSheet from "./app/views/admindashboard/views/MarkSheet";
import ReportCard from "./app/views/admindashboard/views/ReportCard";
import BulkPrintReports from "./app/views/admindashboard/views/student/BulkPrintReports";

// New admin pages
import ApplicationPortal from "./app/views/admindashboard/views/admin/ApplicationPortal";
import ApplicationReview from "./app/views/admindashboard/views/admin/ApplicationReview";
import AdmissionBatches from "./app/views/admindashboard/views/admin/AdmissionBatches";
import AcademicsCredentials from "./app/views/admindashboard/views/admin/AcademicsCredentials";
import Programmes from "./app/views/admindashboard/views/admin/Programmes";
import Curriculum from "./app/views/admindashboard/views/admin/Curriculum";
import CourseForumOversight from "./app/views/admindashboard/views/admin/CourseForumOversight";
import DiscussionModeration from "./app/views/admindashboard/views/admin/DiscussionModeration";
import StudentRegistry from "./app/views/admindashboard/views/admin/StudentRegistry";
import StudentRegistration from "./app/views/admindashboard/views/admin/StudentRegistration";
import CourseRegistrationPrintout from "./app/views/admindashboard/views/admin/CourseRegistrationPrintout";
import RegistrationPrintout from "./app/views/admindashboard/views/admin/RegistrationPrintout";
import ResultApproval from "./app/views/admindashboard/views/admin/ResultApproval";
import SiwesTracker from "./app/views/admindashboard/views/admin/SiwesTracker";
import AllQuizzes from "./app/views/admindashboard/views/admin/AllQuizzes";
import QuizResults from "./app/views/admindashboard/views/admin/QuizResults";
import Notifications from "./app/views/admindashboard/views/admin/Notifications";
import LiveStreamMonitoring from "./app/views/admindashboard/views/admin/LiveStreamMonitoring";
import ActivityStream from "./app/views/admindashboard/views/admin/ActivityStream";
import Meetings from "./app/views/admindashboard/views/admin/Meetings";
import Messaging from "./app/views/admindashboard/views/admin/Messaging";
import GradeBook from "./app/views/admindashboard/views/admin/GradeBook";
import Assignments from "./app/views/admindashboard/views/admin/Assignments";
import StaffManagement from "./app/views/admindashboard/views/admin/StaffManagement";
import StaffRegistration from "./app/views/admindashboard/views/admin/StaffRegistration";
import BursaryFinance from "./app/views/admindashboard/views/admin/BursaryFinance";
import StudentPayments from "./app/views/admindashboard/views/admin/StudentPayments";
import Scholarships from "./app/views/admindashboard/views/admin/Scholarships";
import Hostel from "./app/views/admindashboard/views/admin/Hostel";
import Graduation from "./app/views/admindashboard/views/admin/Graduation";
import Alumni from "./app/views/admindashboard/views/admin/Alumni";
import SystemSettings from "./app/views/admindashboard/views/admin/SystemSettings";
import AccessControl from "./app/views/admindashboard/views/admin/AccessControl";
import UserRecords from "./app/views/admindashboard/views/admin/UserRecords";
import SystemAccount from "./app/views/admindashboard/views/admin/SystemAccount";
import AdminProfile from "./app/views/admindashboard/views/admin/AdminProfile";

// ============================================================
// STAFF
// ============================================================
import StaffDashboard from "./app/views/teacherdashboard/views/Dashboard";
import StaffHome from "./app/views/teacherdashboard/views/Home";
import StaffApplicationsToReview from "./app/views/teacherdashboard/views/Application/ToReview";
import StaffAllApplications from "./app/views/teacherdashboard/views/Application/AllApplications";
import StaffMyCourses from "./app/views/teacherdashboard/views/Course/MyCourses";
import StaffAssignedCourse from "./app/views/teacherdashboard/views/Course/AssignedCourse";
import StaffCourseMaterials from "./app/views/teacherdashboard/views/Course/CourseMaterials";
import StaffCourseForum from "./app/views/teacherdashboard/views/Course/CourseForum";
import StaffDiscussion from "./app/views/teacherdashboard/views/Course/Discussion";
import StaffCreateQuiz from "./app/views/teacherdashboard/views/Quiz/CreateQuiz";
import StaffManageQuiz from "./app/views/teacherdashboard/views/Quiz/ManageQuiz";
import StaffQuizResults from "./app/views/teacherdashboard/views/Quiz/Results";
import StaffSendNotification from "./app/views/teacherdashboard/views/Notification/SendNotification";
import StaffNotificationHistory from "./app/views/teacherdashboard/views/Notification/History";
import StaffLiveStream from "./app/views/teacherdashboard/views/Studio/LiveStream";
import StaffActivityStream from "./app/views/teacherdashboard/views/Studio/ActivityStream";
import StaffMeeting from "./app/views/teacherdashboard/views/Studio/Meeting";
import StaffMessaging from "./app/views/teacherdashboard/views/Studio/Messaging";
import StaffContinuousAssessment from "./app/views/teacherdashboard/views/GradeBook/ContinuousAssessment";
import StaffExamMarkEntry from "./app/views/teacherdashboard/views/GradeBook/ExamMarkEntry";
import StaffTabulation from "./app/views/teacherdashboard/views/GradeBook/Tabulation";
import StaffCreateAssignment from "./app/views/teacherdashboard/views/Assignment/CreateAssignment";
import StaffAllAssignments from "./app/views/teacherdashboard/views/Assignment/AllAssignments";
import StaffGradeSubmissions from "./app/views/teacherdashboard/views/Assignment/GradeSubmissions";
import StaffPaySlip from "./app/views/teacherdashboard/views/Payroll/PaySlip";
import StaffPaymentHistory from "./app/views/teacherdashboard/views/Payroll/History";
import StaffProfileSystem from "./app/views/teacherdashboard/views/Profile/ProfileSystem";
import StaffBiodata from "./app/views/teacherdashboard/views/Profile/Biodata";
import StaffHostel from "./app/views/teacherdashboard/views/Hostel/Hostel";
import StaffSIWESSupervisor from "./app/views/teacherdashboard/views/SIWES/Supervisor";
import StaffPersonalHR from "./app/views/teacherdashboard/views/HR/PersonalHR";
import StaffPromotionTracker from "./app/views/teacherdashboard/views/HR/PromotionTracker";
import StaffLeaveRequest from "./app/views/teacherdashboard/views/HR/LeaveRequest";

// ============================================================
// STUDENT
// ============================================================
import StudentDashboard from "./app/views/studentdashboard/Analytics";
import CourseForumThread from "./app/views/studentdashboard/views/student/MyClass";
import LearnersList from "./app/views/studentdashboard/views/Teacher";
import MyCourses from "./app/views/studentdashboard/views/Subject";
import QuizList from "./app/views/studentdashboard/views/exam/ExamList";
import ActivityStreamStudent from "./app/views/studentdashboard/views/onlineexam/Manage";
import GradeBookStudent from "./app/views/studentdashboard/JambPastQuestions";
import MessagingStudent from "./app/views/studentdashboard/views/StudyMaterial";
import AssignmentsStudent from "./app/views/studentdashboard/views/Homework";
import StudentHome from "./app/views/admindashboard/views/system/Profile";
import StudentProfile from "./app/views/studentdashboard/views/Noticeboard";
import StudentNotification from "./app/views/admindashboard/views/MarkSheet";
import Discussion from "./app/views/studentdashboard/views/Discussion";
import AllApplications from "./app/views/studentdashboard/views/AllApplication";
import MyApplications from "./app/views/studentdashboard/views/MyApplication";
import MakePayment from "./app/views/studentdashboard/views/payment/MakePayment";
import AdditionalPayment from "./app/views/studentdashboard/views/payment/AdditionalPayment";
import StudentPaymentHistorys from "./app/views/studentdashboard/views/payment/PaymentHistory";
import CourseRegistration from "./app/views/studentdashboard/views/CourseRegistration";
import StudentPaymentHistory from "./app/views/studentdashboard/views/accounting/PaymentHistory";

// ============================================================
// PARENT
// ============================================================
import ParentDashboard from "./app/views/parentdashboard/Analytics";
import ParentResults from "./app/views/parentdashboard/views/Results";
import ParentMaterials from "./app/views/parentdashboard/views/Materials";
import ParentHomework from "./app/views/parentdashboard/views/Homework";
import Departments from "./app/views/admindashboard/views/admin/Department";
import CourseAllocation from "./app/views/admindashboard/views/admin/CourseAllocation";
import Signup from "./app/views/Signup";

// ============================================================
// Dashboard redirect by role
// ============================================================
const DashboardWrapper = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "admin":
      return <Dashboard />;
    case "staff":
      return <StaffDashboard />;
    case "student":
      return <StudentDashboard />;
 
    default:
      return <Dashboard />;
  }
};

const StudentMarkSheetRedirect = () => {
  const { user } = useAuth();
  return (
    <Navigate
      to={`/student_mark_sheet/${user?._id ?? user?.id ?? "unknown"}`}
      replace
    />
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SessionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              {/* ========================================================
                  PUBLIC
              ======================================================== */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/session/forgot-password" element={<ForgotPassword />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route element={<AppLayout />}>
                {/* ======================================================
                    SHARED / ROLE DASHBOARDS
                ====================================================== */}
                <Route path="/dashboard" element={<DashboardWrapper />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/teacher-dashboard" element={<StaffDashboard />} />
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/parent/dashboard" element={<ParentDashboard />} />

                {/* ======================================================
                    ADMIN - NEW MODULES
                ====================================================== */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/admissions/portal" element={<ApplicationPortal />} />
                <Route path="/admin/admissions/review" element={<ApplicationReview />} />
                <Route path="/admin/admissions/batches" element={<AdmissionBatches />} />
                <Route path="/admin/admissions/credentials" element={<AcademicsCredentials />} />

                <Route path="/admin/programmes" element={<Programmes />} />
                <Route path="/admin/departments" element={<Departments />} />
                <Route path="/admin/curriculum" element={<Curriculum />} />
                <Route path="/admin/course-allocation" element={<CourseAllocation />} />
                <Route path="/admin/course-forum" element={<CourseForumOversight />} />
                <Route path="/admin/discussion" element={<DiscussionModeration />} />

                <Route path="/admin/students/registry" element={<StudentRegistry />} />
                <Route path="/admin/students/registration" element={<StudentRegistration />} />
                <Route path="/admin/students/course-reg-printout" element={<CourseRegistrationPrintout />} />
                <Route path="/admin/students/registration-printout" element={<RegistrationPrintout />} />
                <Route path="/admin/students/result-approval" element={<ResultApproval />} />
                <Route path="/admin/students/siwes-tracker" element={<SiwesTracker />} />

                <Route path="/admin/quiz/all" element={<AllQuizzes />} />
                <Route path="/admin/quiz/results" element={<QuizResults />} />
                <Route path="/admin/notifications" element={<Notifications />} />

                <Route path="/admin/studio/live-stream" element={<LiveStreamMonitoring />} />
                <Route path="/admin/studio/activity-stream" element={<ActivityStream />} />
                <Route path="/admin/studio/meetings" element={<Meetings />} />
                <Route path="/admin/studio/messaging" element={<Messaging />} />

                <Route path="/admin/grade-book" element={<GradeBook />} />
                <Route path="/admin/assignments" element={<Assignments />} />

                <Route path="/admin/staff/management" element={<StaffManagement />} />
                <Route path="/admin/staff/registration" element={<StaffRegistration />} />

                <Route path="/admin/finance/bursary" element={<BursaryFinance />} />
                <Route path="/admin/finance/student-payments" element={<StudentPayments />} />
                <Route path="/admin/finance/scholarships" element={<Scholarships />} />

                <Route path="/admin/hostel" element={<Hostel />} />
                <Route path="/admin/graduation" element={<Graduation />} />
                <Route path="/admin/alumni" element={<Alumni />} />

                <Route path="/admin/system/settings" element={<SystemSettings />} />
                <Route path="/admin/system/access-control" element={<AccessControl />} />
                <Route path="/admin/system/records" element={<UserRecords />} />
                <Route path="/admin/system/account" element={<SystemAccount />} />
                <Route path="/admin/profile" element={<AdminProfile />} />

                {/* ======================================================
                    ADMIN - EXISTING / LEGACY MODULES
                ====================================================== */}
                <Route path="/bulk-print/:classId/:term" element={<BulkPrintReports />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/student/admit" element={<AdmitStudent />} />
                <Route path="/student/bulk-upload" element={<BulkStudentUpload />} />
                <Route path="/student/information/:classId" element={<StudentInformation />} />
                <Route path="/student/id-card/:id" element={<StudentIdCard />} />
                <Route path="/student/promotion" element={<StudentPromotion />} />
                <Route path="/psycho/category" element={<Category />} />
                <Route path="/psycho/stu-report" element={<PsychoStudentReport />} />
                <Route path="/teacher" element={<Teacher />} />
                <Route path="/subject/:classId" element={<Subject />} />
                <Route path="/notices" element={<Noticeboard />} />
                <Route path="/parents" element={<Parents />} />
                <Route path="/class/manage" element={<ManageClasses />} />
                <Route path="/class/syllabus" element={<AcademicSyllabus />} />
                <Route path="/exam/list" element={<ExamList />} />
                <Route path="/exam/grades" element={<ExamGrades />} />
                <Route path="/exam/manage-marks" element={<ManageMarks />} />
                <Route path="/exam/tabulation" element={<TabulationSheet />} />
                <Route path="/exam/onscreenmarking" element={<OnScreenMarkingLayout />}>
                  <Route index element={<OnScreenMarkingHub />} />
                  <Route path="online" element={<MarkingWorkspace mode="online" />} />
                  <Route path="offline" element={<MarkingWorkspace mode="offline" />} />
                </Route>
                <Route path="/onlineexam/create" element={<CreateOnlineExam />} />
                <Route path="/onlineexam/manage" element={<ManageOnlineExams />} />
                <Route path="/curriculum" element={<CurriculumGenerator />} />
                <Route path="/gen-questions" element={<QuestionsGenerator />} />
                <Route path="/stu-receipt" element={<StudentReceiptForm />} />
                <Route path="/stu-payments" element={<PaymentHistory />} />
                <Route path="/studymaterial" element={<ManageStudyMaterial />} />
                <Route path="/dailyattend" element={<DailyAttendance />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/account" element={<Account />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/student_mark_sheet/:id" element={<MarkSheet />} />
                <Route path="/student_profile/:id" element={<StudentProfile />} />
                <Route path="/dashboard/first_term_report_card/:id" element={<ReportCard termLabel="First Term" />} />
                <Route path="/dashboard/term_report_card/:id" element={<ReportCard termLabel="Second Term" />} />
                <Route path="/dashboard/third_term_report_card/:id" element={<ReportCard termLabel="Third Term" />} />
                <Route path="/dashboard/cumulative/:id" element={<ReportCard termLabel="Cumulative" />} />

                {/* ======================================================
                    STAFF
                ====================================================== */}
          
                <Route path="/staff/dashboard/application/to-review" element={<StaffApplicationsToReview />} />
                <Route path="/staff/dashboard/application/all" element={<StaffAllApplications />} />

                <Route path="/staff/dashboard/course-allocation" element={<StaffMyCourses />} />
                <Route path="/staff/dashboard/course/:classId" element={<StaffAssignedCourse />} />
                <Route path="/staff/dashboard/course/materials" element={<StaffCourseMaterials />} />
                <Route path="/staff/dashboard/course-forum" element={<StaffCourseForum />} />
                <Route path="/staff/dashboard/discussion" element={<StaffDiscussion />} />

                <Route path="/staff/dashboard/quiz/create" element={<StaffCreateQuiz />} />
                <Route path="/staff/dashboard/quiz/manage" element={<StaffManageQuiz />} />
                <Route path="/staff/dashboard/quiz/results" element={<StaffQuizResults />} />

                <Route path="/staff/dashboard/notification/send" element={<StaffSendNotification />} />
                <Route path="/staff/dashboard/notification/history" element={<StaffNotificationHistory />} />

                <Route path="/staff/dashboard/studio/live-stream" element={<StaffLiveStream />} />
                <Route path="/staff/dashboard/studio/activity-stream" element={<StaffActivityStream />} />
                <Route path="/staff/dashboard/studio/meeting" element={<StaffMeeting />} />
                <Route path="/staff/dashboard/studio/messaging" element={<StaffMessaging />} />

                <Route path="/staff/dashboard/grade-book/continuous-assessment" element={<StaffContinuousAssessment />} />
                <Route path="/staff/dashboard/grade-book/exam-mark-entry" element={<StaffExamMarkEntry />} />
                <Route path="/staff/dashboard/grade-book/tabulation" element={<StaffTabulation />} />

                <Route path="/staff/dashboard/assignment/create" element={<StaffCreateAssignment />} />
                <Route path="/staff/dashboard/assignment/all" element={<StaffAllAssignments />} />
                <Route path="/staff/dashboard/assignment/grade-submissions" element={<StaffGradeSubmissions />} />

                <Route path="/staff/dashboard/payroll/pay-slip" element={<StaffPaySlip />} />
                <Route path="/staff/dashboard/payroll/history" element={<StaffPaymentHistory />} />

                <Route path="/staff/dashboard/profile" element={<StaffProfileSystem />} />
                <Route path="/staff/dashboard/biodata" element={<StaffBiodata />} />
                <Route path="/staff/dashboard/hostel" element={<StaffHostel />} />
                <Route path="/staff/dashboard/siwes" element={<StaffSIWESSupervisor />} />
                <Route path="/staff/dashboard/hr" element={<StaffPersonalHR />} />
                <Route path="/staff/dashboard/hr/promotion-tracker" element={<StaffPromotionTracker />} />
                <Route path="/staff/dashboard/hr/leave-request" element={<StaffLeaveRequest />} />

                {/* Legacy teacher URLs -> new staff dashboard */}
                <Route path="/teacher/dashboard" element={<Navigate to="/staff/dashboard" replace />} />
                <Route path="/teacher/dashboard/home" element={<Navigate to="/staff/dashboard/home" replace />} />
                <Route path="/teacher/dashboard/course-forum" element={<Navigate to="/staff/dashboard/course-forum" replace />} />
                <Route path="/teacher/dashboard/examlist" element={<Navigate to="/staff/dashboard/quiz/manage" replace />} />
                <Route path="/teacher/dashboard/manage-mark-view" element={<Navigate to="/staff/dashboard/grade-book/exam-mark-entry" replace />} />
                <Route path="/teacher/dashboard/homework" element={<Navigate to="/staff/dashboard/assignment/all" replace />} />

                {/* ======================================================
                    STUDENT
                ====================================================== */}
                <Route path="/student/dashboard/default" element={<StudentDashboard />} />
                <Route path="/student/dashboard/home" element={<StudentHome />} />
                <Route path="/student/dashboard/course-forum" element={<CourseForumThread />} />
                <Route path="/student/dashboard/learning-list" element={<LearnersList />} />
                <Route path="/student/dashboard/my-courses" element={<MyCourses />} />
                <Route path="/student/dashboard/quiz-list" element={<QuizList />} />
                <Route path="/student/dashboard/studio/activity-stream" element={<ActivityStreamStudent />} />
                <Route path="/student/dashboard/studio/meeting" element={<StudentPaymentHistory />} />
                <Route path="/student/dashboard/studio/messaging" element={<MessagingStudent />} />
                <Route path="/student/dashboard/grade-book" element={<GradeBookStudent />} />
                <Route path="/student/dashboard/assignment" element={<AssignmentsStudent />} />
                <Route path="/student/dashboard/profile" element={<StudentProfile />} />
                <Route path="/student/dashboard/discussion" element={<Discussion />} />
                <Route path="/student/dashboard/notification" element={<StudentNotification />} />
                <Route path="/student/dashboard/application/all-application" element={<AllApplications />} />
                <Route path="/student/dashboard/application/my-application" element={<MyApplications />} />
                <Route path="/student/dashboard/payment/make-payment" element={<MakePayment />} />
                <Route path="/student/dashboard/payment/additional-payment" element={<AdditionalPayment />} />
                <Route path="/student/dashboard/payment/payment-history" element={<StudentPaymentHistorys />} />
                <Route path="/student/dashboard/course/course-registration" element={<CourseRegistration />} />

                {/* Student mark sheet shortcut */}
                <Route path="/student/dashboard/marksheet" element={<StudentMarkSheetRedirect />} />

                {/* ======================================================
                    PARENT
                ====================================================== */}
                <Route path="/parent/dashboard/results" element={<ParentResults />} />
                <Route path="/parent/dashboard/materials" element={<ParentMaterials />} />
                <Route path="/parent/dashboard/homework" element={<ParentHomework />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
