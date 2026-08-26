import AdminDataPage from "./AdminDataPage";

export default function SystemSettings() {
  return <AdminDataPage title="System Settings" description="Configure institution-wide platform settings." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Settings", value: "—", hint: "Connect to your backend" }, { label: "Sessions", value: "—", hint: "Connect to your backend" }, { label: "Integrations", value: "—", hint: "Connect to your backend" }, { label: "Alerts", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search system settings..." />;
}
