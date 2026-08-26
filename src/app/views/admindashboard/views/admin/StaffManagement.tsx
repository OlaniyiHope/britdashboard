import AdminDataPage from "./AdminDataPage";

export default function StaffManagement() {
  return <AdminDataPage title="Staff Management" description="Manage staff profiles, roles, and employment status." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Staff", value: "—", hint: "Connect to your backend" }, { label: "Active", value: "—", hint: "Connect to your backend" }, { label: "On Leave", value: "—", hint: "Connect to your backend" }, { label: "Inactive", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search staff management..." />;
}
