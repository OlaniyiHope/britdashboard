import AdminDataPage from "./AdminDataPage";

export default function Scholarships() {
  return <AdminDataPage title="Scholarship Opportunities" description="Manage scholarship opportunities and student applications." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Opportunities", value: "—", hint: "Connect to your backend" }, { label: "Applications", value: "—", hint: "Connect to your backend" }, { label: "Awarded", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search scholarship opportunities..." />;
}
