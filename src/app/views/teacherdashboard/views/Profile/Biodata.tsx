import { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Download, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = { id: number; name: string; code: string; status: string; detail: string };

const seed: Row[] = [
  { id: 1, name: "Current Academic Session", code: "2026/2027", status: "Active", detail: "Academic management" },
  { id: 2, name: "Pending Activity", code: "ACT-002", status: "Pending", detail: "Requires staff attention" },
  { id: 3, name: "Completed Activity", code: "ACT-003", status: "Completed", detail: "Recently completed" },
  { id: 4, name: "Assigned Course", code: "CRS-004", status: "Active", detail: "Assigned to current staff" },
];

export default function ProfileBiodata() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(seed);
  const filtered = useMemo(
    () => rows.filter(r => `${r.name} ${r.code} ${r.status} ${r.detail}`.toLowerCase().includes(search.toLowerCase())),
    [rows, search]
  );
  const remove = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile & Biodata</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor this staff module.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          <Button><Plus className="mr-2 h-4 w-4" />Add New</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardDescription>Total</CardDescription><CardTitle>{rows.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Active</CardDescription><CardTitle>{rows.filter(r=>r.status==="Active").length}</CardTitle></CardHeader></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Pending</CardDescription><CardTitle>{rows.filter(r=>r.status==="Pending").length}</CardTitle></CardHeader></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Records</CardTitle>
          <CardDescription>Use the actions to review or manage records.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Status</TableHead><TableHead>Details</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell><Badge variant={row.status==="Active" ? "default" : row.status==="Pending" ? "secondary" : "outline"}>{row.status}</Badge></TableCell>
                    <TableCell>{row.detail}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={()=>remove(row.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filtered.length && <TableRow><TableCell colSpan={5} className="h-24 text-center">No records found.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
