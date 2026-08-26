import AdminDataPage from "./AdminDataPage";

export default function BursaryFinance() {
  return <AdminDataPage title="Bursary & Finance Control" description="Institution-wide finance operations and financial oversight." columns={[{ key: "id", label: "ID" }, { key: "name", label: "Name" }, { key: "status", label: "Status" }, { key: "updated", label: "Updated" }]} stats={[{ label: "Revenue", value: "—", hint: "Connect to your backend" }, { label: "Expenses", value: "—", hint: "Connect to your backend" }, { label: "Pending", value: "—", hint: "Connect to your backend" }, { label: "Balance", value: "—", hint: "Connect to your backend" }]} addLabel="Add New" searchPlaceholder="Search bursary & finance control..." />;
}
