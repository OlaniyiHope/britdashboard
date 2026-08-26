import AdminDataPage from "./AdminDataPage";

export default function AdminProfile() {
  return <AdminDataPage title="Admin Profile" description="View and manage the administrator profile." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Profile", value: "—", hint: "Connect to your backend" }, { label: "Role", value: "—", hint: "Connect to your backend" }, { label: "Session", value: "—", hint: "Connect to your backend" }, { label: "Security", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search admin profile..." />;
}
