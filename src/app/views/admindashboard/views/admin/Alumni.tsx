import AdminDataPage from "./AdminDataPage";

export default function Alumni() {
  return <AdminDataPage title="Alumni Directory" description="Maintain alumni records and engagement information." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Alumni", value: "—", hint: "Connect to your backend" }, { label: "Active", value: "—", hint: "Connect to your backend" }, { label: "New", value: "—", hint: "Connect to your backend" }, { label: "Events", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search alumni directory..." />;
}
