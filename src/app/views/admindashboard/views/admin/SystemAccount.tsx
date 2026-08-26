import AdminDataPage from "./AdminDataPage";

export default function SystemAccount() {
  return <AdminDataPage title="Account" description="Manage the administrator account and security preferences." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Profile", value: "—", hint: "Connect to your backend" }, { label: "Sessions", value: "—", hint: "Connect to your backend" }, { label: "Security", value: "—", hint: "Connect to your backend" }, { label: "Alerts", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search account..." />;
}
