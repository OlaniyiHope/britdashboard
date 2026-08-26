import AdminDataPage from "./AdminDataPage";

export default function AccessControl() {
  return <AdminDataPage title="User Access Control" description="Manage roles, permissions, and account access." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Users", value: "—", hint: "Connect to your backend" }, { label: "Admins", value: "—", hint: "Connect to your backend" }, { label: "Staff", value: "—", hint: "Connect to your backend" }, { label: "Locked", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search user access control..." />;
}
