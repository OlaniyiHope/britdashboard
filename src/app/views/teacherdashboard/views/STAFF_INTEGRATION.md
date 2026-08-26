// STAFF PAGE IMPORTS
import StaffDashboard from "./app/views/staffdashboard/Dashboard";
import StaffHome from "./app/views/staffdashboard/Home";
import StaffApplicationsToReview from "./app/views/staffdashboard/Application/ToReview";
import StaffAllApplications from "./app/views/staffdashboard/Application/AllApplications";
import StaffCourseMaterials from "./app/views/staffdashboard/Course/CourseMaterials";
import StaffCourseForum from "./app/views/staffdashboard/Course/CourseForum";
import StaffDiscussion from "./app/views/staffdashboard/Course/Discussion";
import StaffCreateQuiz from "./app/views/staffdashboard/Quiz/CreateQuiz";
import StaffManageQuiz from "./app/views/staffdashboard/Quiz/ManageQuiz";
import StaffQuizResults from "./app/views/staffdashboard/Quiz/Results";
import StaffSendNotification from "./app/views/staffdashboard/Notification/SendNotification";
import StaffNotificationHistory from "./app/views/staffdashboard/Notification/History";
import StaffLiveStream from "./app/views/staffdashboard/Studio/LiveStream";
import StaffActivityStream from "./app/views/staffdashboard/Studio/ActivityStream";
import StaffMeeting from "./app/views/staffdashboard/Studio/Meeting";
import StaffMessaging from "./app/views/staffdashboard/Studio/Messaging";
import StaffContinuousAssessment from "./app/views/staffdashboard/GradeBook/ContinuousAssessment";
import StaffExamMarkEntry from "./app/views/staffdashboard/GradeBook/ExamMarkEntry";
import StaffTabulation from "./app/views/staffdashboard/GradeBook/Tabulation";
import StaffCreateAssignment from "./app/views/staffdashboard/Assignment/CreateAssignment";
import StaffAllAssignments from "./app/views/staffdashboard/Assignment/AllAssignments";
import StaffGradeSubmissions from "./app/views/staffdashboard/Assignment/GradeSubmissions";
import StaffPaySlip from "./app/views/staffdashboard/Payroll/PaySlip";
import StaffPaymentHistory from "./app/views/staffdashboard/Payroll/History";
import StaffProfileSystem from "./app/views/staffdashboard/Profile/ProfileSystem";
import StaffBiodata from "./app/views/staffdashboard/Profile/Biodata";
import StaffHostel from "./app/views/staffdashboard/Hostel/Hostel";
import StaffSIWESSupervisor from "./app/views/staffdashboard/SIWES/Supervisor";
import StaffPersonalHR from "./app/views/staffdashboard/HR/PersonalHR";
import StaffPromotionTracker from "./app/views/staffdashboard/HR/PromotionTracker";
import StaffLeaveRequest from "./app/views/staffdashboard/HR/LeaveRequest";
import StaffMyCourses from "./app/views/staffdashboard/Course/MyCourses";

// ADD THESE INSIDE <Route element={<AppLayout />}> ... </Routes>
<Route path="/staff/dashboard" element={<StaffDashboard />} />
<Route path="/staff/dashboard/home" element={<StaffHome />} />
<Route path="/staff/dashboard/application/to-review" element={<StaffApplicationsToReview />} />
<Route path="/staff/dashboard/application/all" element={<StaffAllApplications />} />
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
<Route path="/staff/dashboard/course-allocation" element={<StaffMyCourses />} />
