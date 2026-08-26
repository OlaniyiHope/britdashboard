import AdminDataPage from "./AdminDataPage";

export default function GradeBook() {
  return <AdminDataPage title="Grade Book" description="Institution-wide academic grade book oversight." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Courses", value: "—", hint: "Connect to your backend" }, { label: "Students", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }, { label: "Approved", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search grade book..." />;
}
