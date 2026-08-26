import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, BookOpen, ClipboardCheck, FileText, Video, Wallet } from "lucide-react";

const stats = [
  ["Assigned Students","248",Users],["My Courses","8",BookOpen],["Pending Submissions","17",FileText],
  ["Quiz Results","42",ClipboardCheck],["Live Sessions","3",Video],["Payroll Status","Current",Wallet],
];

export default function StaffDashboard() {
 return <div className="space-y-6 p-4 md:p-6">
   <div><h1 className="text-2xl font-bold">Staff Dashboard</h1><p className="text-sm text-muted-foreground">Your academic, teaching and staff management overview.</p></div>
   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {stats.map(([label,value,Icon]) => <Card key={String(label)}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{label}</CardTitle><Icon className="h-4 w-4 text-muted-foreground"/></CardHeader><CardContent><div className="text-2xl font-bold">{value}</div><p className="text-xs text-muted-foreground mt-1">Updated for current session</p></CardContent></Card>)}
   </div>
   <div className="grid gap-4 lg:grid-cols-2">
    <Card><CardHeader><CardTitle>Today's Tasks</CardTitle><CardDescription>Staff activities requiring attention.</CardDescription></CardHeader><CardContent className="space-y-3">{["Review student applications","Grade assignment submissions","Enter continuous assessment marks","Prepare next course material"].map((x,i)=><div key={x} className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm">{x}</span><span className="text-xs text-muted-foreground">{i+1}</span></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Academic Activity</CardTitle><CardDescription>Quick overview of recent work.</CardDescription></CardHeader><CardContent className="space-y-3">{["Course material updated","Quiz created","Student submission received","Meeting scheduled"].map(x=><div key={x} className="flex items-center gap-3 rounded-lg border p-3"><div className="h-2 w-2 rounded-full bg-primary"/><span className="text-sm">{x}</span></div>)}</CardContent></Card>
   </div>
 </div>
}
