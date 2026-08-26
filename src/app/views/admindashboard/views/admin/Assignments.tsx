import AdminDataPage from "./AdminDataPage";

export default function Assignments() {
  return <AdminDataPage title="Assignment Oversight" description="Monitor assignments, submissions, and grading progress." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Assignments", value: "—", hint: "Connect to your backend" }, { label: "Submitted", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }, { label: "Late", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search assignment oversight..." />;
}
