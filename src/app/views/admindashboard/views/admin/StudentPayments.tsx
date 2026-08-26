import AdminDataPage from "./AdminDataPage";

export default function StudentPayments() {
  return <AdminDataPage title="Student Payment Records" description="Review student payments, balances, and outstanding fees." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Payments", value: "—", hint: "Connect to your backend" }, { label: "Outstanding", value: "—", hint: "Connect to your backend" }, { label: "Students", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search student payment records..." />;
}
