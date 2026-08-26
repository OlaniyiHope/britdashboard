import AdminDataPage from "./AdminDataPage";

export default function UserRecords() {
  return <AdminDataPage title="User Records Management" description="Review and manage platform user records." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Records", value: "—", hint: "Connect to your backend" }, { label: "Students", value: "—", hint: "Connect to your backend" }, { label: "Staff", value: "—", hint: "Connect to your backend" }, { label: "Parents", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search user records management..." />;
}
