import AdminDataPage from "./AdminDataPage";

export default function Graduation() {
  return <AdminDataPage title="Graduation Management" description="Manage graduation candidates, clearance, and ceremony readiness." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Candidates", value: "—", hint: "Connect to your backend" }, { label: "Cleared", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }, { label: "Graduated", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search graduation management..." />;
}
