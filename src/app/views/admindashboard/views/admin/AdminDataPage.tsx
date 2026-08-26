import React, { useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Download, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface AdminPageConfig {
  title: string; description?: string;
  columns: { key: string; label: string }[];
  stats?: { label: string; value: string; hint?: string }[];
  addLabel?: string; searchPlaceholder?: string;
}
const seed = (config: AdminPageConfig) => [
  { id: "ADM-001", name: "Sample Record", status: "Active", updated: "Today" },
  { id: "ADM-002", name: "Another Record", status: "Pending", updated: "Yesterday" },
  { id: "ADM-003", name: "New Record", status: "Active", updated: "2 days ago" },
];
export default function AdminDataPage(config: AdminPageConfig) {
  const [rows, setRows] = useState<any[]>(seed(config));
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter(r => Object.values(r).some(v => String(v ?? "").toLowerCase().includes(q))) : rows;
  }, [rows, query]);
  const addRow = () => setRows(p => [{ id:`ADM-${String(p.length+1).padStart(3,"0")}`, name:"New record", status:"Pending", updated:"Just now" }, ...p]);
  const removeRow = (row:any) => setRows(p => p.filter(x => x !== row));
  return <div className="p-6 space-y-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div><h1 className="text-2xl font-bold tracking-tight text-primary">{config.title}</h1>{config.description && <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>}</div>
      <div className="flex gap-2"><Button variant="outline" onClick={()=>setQuery("")}><RefreshCw className="mr-2 h-4 w-4"/>Reset</Button><Button onClick={addRow}><Plus className="mr-2 h-4 w-4"/>{config.addLabel ?? "Add New"}</Button></div>
    </div>
    {config.stats && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{config.stats.map(s=><Card key={s.label}><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.value}</div>{s.hint&&<p className="text-xs text-muted-foreground mt-1">{s.hint}</p>}</CardContent></Card>)}</div>}
    <Card><CardContent className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" value={query} onChange={e=>setQuery(e.target.value)} placeholder={config.searchPlaceholder ?? "Search records..."}/></div><Button variant="outline"><Download className="mr-2 h-4 w-4"/>Export</Button></div>
      <div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow>{config.columns.map(c=><TableHead key={c.key}>{c.label}</TableHead>)}<TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {filtered.map((r,i)=><TableRow key={r.id??i}>{config.columns.map(c=><TableCell key={c.key}>{c.key==="status"?<Badge variant={String(r[c.key]).toLowerCase()==="active"?"default":"secondary"}>{r[c.key]??"—"}</Badge>:String(r[c.key]??"—")}</TableCell>)}<TableCell className="text-right"><div className="flex justify-end gap-1"><Button size="icon" variant="ghost" onClick={()=>setSelected(r)}><Eye className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>setSelected(r)}><Pencil className="h-4 w-4"/></Button><Button size="icon" variant="ghost" onClick={()=>removeRow(r)}><Trash2 className="h-4 w-4"/></Button></div></TableCell></TableRow>)}
      {!filtered.length&&<TableRow><TableCell colSpan={config.columns.length+1} className="py-10 text-center text-muted-foreground">No records found.</TableCell></TableRow>}
      </TableBody></Table></div>
    </CardContent></Card>
    {selected&&<Card><CardHeader><CardTitle className="text-base">Selected Record</CardTitle></CardHeader><CardContent><pre className="rounded-md bg-muted p-4 text-xs overflow-auto">{JSON.stringify(selected,null,2)}</pre><Button className="mt-3" variant="outline" onClick={()=>setSelected(null)}>Close</Button></CardContent></Card>}
  </div>;
}
