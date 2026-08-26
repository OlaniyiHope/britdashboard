import AdminDataPage from "./AdminDataPage";

export default function StaffRegistration() {
  return <AdminDataPage title="Staff Registration" description="Register and onboard new staff members." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Applications", value: "—", hint: "Connect to your backend" }, { label: "Approved", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }, { label: "Departments", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search staff registration..." />;
}
