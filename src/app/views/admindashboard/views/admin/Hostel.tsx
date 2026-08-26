import AdminDataPage from "./AdminDataPage";

export default function Hostel() {
  return <AdminDataPage title="Hostel & Accommodation" description="Manage accommodation capacity, allocation, and occupancy." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Hostels", value: "—", hint: "Connect to your backend" }, { label: "Beds", value: "—", hint: "Connect to your backend" }, { label: "Occupied", value: "—", hint: "Connect to your backend" }, { label: "Available", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search hostel & accommodation..." />;
}
