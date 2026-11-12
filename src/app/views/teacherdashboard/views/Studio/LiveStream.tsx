
// import { useCallback, useContext, useEffect, useMemo, useState } from "react";

// import {
//   Video,
//   VideoIcon,
//   Plus,
//   Search,
//   RefreshCw,
//   Play,
//   Square,
//   Clock,
//   CalendarDays,
//   ExternalLink,
//   MoreVertical,
//   Trash2,
//   Radio,
//   CheckCircle2,
//   BookOpen,
//   Loader2,
// } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { toast } from "sonner";

// import { SessionContext } from "@/contexts/SessionContext";
// import { normalizeSemester } from "@/lib/semester";
// import { API_BASE_URL, getToken } from "@/lib/api";

// /* ------------------------------------------------------------------ */
// /* TYPES                                                               */
// /* ------------------------------------------------------------------ */

// type Allocation = {
//   _id: string;
//   status: string;
//   semester: string;
//   level?: string;
//   staff?: string;
//   course?: { _id?: string; code?: string; title?: string; credits?: number };
//   academicSession?: string | { _id?: string; name?: string };
// };

// type LiveClass = {
//   _id: string;
//   title: string;
//   description?: string;
//   status: "scheduled" | "live" | "ended";
//   scheduledAt?: string;
//   startedAt?: string;
//   endedAt?: string;
//   course?: { _id?: string; code?: string; title?: string };
//   academicSession?: { _id?: string; name?: string } | string;
//   level?: string;
//   semester?: string;
//   hasRecording?: boolean;
// };

// /* ------------------------------------------------------------------ */
// /* HELPERS                                                             */
// /* ------------------------------------------------------------------ */

// // const idOf = (ref: unknown): string =>
// //   typeof ref === "string" ? ref : (ref as { _id?: string } | null)?._id ?? "";

// // Adjust this to the field buildJoinInfo actually returns
// // const joinUrlOf = (join: unknown): string =>
// //   (join as { url?: string } | null)?.url ?? "";

// // async function request<T>(path: string, init?: RequestInit): Promise<T> {
// //   const res = await fetch(`${API_BASE_URL}${path}`, {
// //     ...init,
// //     headers: {
// //       "Content-Type": "application/json",
// //       Authorization: `Bearer ${getToken()}`,
// //       ...(init?.headers || {}),
// //     },
// //   });
// //   const data = await res.json().catch(() => ({}));
// //   if (!res.ok) {
// //     throw new Error(data?.message || "Request failed.");
// //   }
// //   return data as T;
// // }
// const idOf = (ref: unknown): string =>
//   typeof ref === "string" ? ref : (ref as { _id?: string } | null)?._id ?? "";

// const joinUrlOf = (join: unknown): string => {
//   const j = join as {
//     domain?: string;
//     roomName?: string;
//     jwt?: string | null;
//     url?: string;
//   } | null;

//   if (!j) return "";
//   if (j.url) return j.url;
//   if (!j.domain || !j.roomName) return "";

//   const base = `https://${j.domain}/${j.roomName}`;
//   return j.jwt ? `${base}?jwt=${encodeURIComponent(j.jwt)}` : base;
// };

// async function request<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     ...init,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//       ...(init?.headers || {}),
//     },
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) {
//     throw new Error(data?.message || "Request failed.");
//   }
//   return data as T;
// }
// function formatDate(date?: string): string {
//   if (!date) return "Not scheduled";
//   const d = new Date(date);
//   if (Number.isNaN(d.getTime())) return "Invalid date";
//   return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
// }

// function StatusBadge({ status }: { status: LiveClass["status"] }) {
//   if (status === "live") {
//     return (
//       <Badge className="gap-1 bg-red-600 hover:bg-red-600">
//         <Radio className="h-3 w-3 animate-pulse" />
//         LIVE
//       </Badge>
//     );
//   }
//   if (status === "scheduled") {
//     return (
//       <Badge variant="secondary" className="gap-1">
//         <Clock className="h-3 w-3" />
//         Scheduled
//       </Badge>
//     );
//   }
//   return (
//     <Badge variant="outline" className="gap-1">
//       <CheckCircle2 className="h-3 w-3" />
//       Ended
//     </Badge>
//   );
// }

// /* ------------------------------------------------------------------ */
// /* PAGE                                                                */
// /* ------------------------------------------------------------------ */

// export default function LiveStream() {
//   const { currentSession, currentSemester } = useContext(SessionContext);

//   const [allocations, setAllocations] = useState<Allocation[]>([]);
//   const [classes, setClasses] = useState<LiveClass[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [search, setSearch] = useState("");

//   const [showCreate, setShowCreate] = useState(false);
//   const [showRoom, setShowRoom] = useState(false);
//   const [roomClass, setRoomClass] = useState<LiveClass | null>(null);
//   const [joinUrl, setJoinUrl] = useState("");
//   const [joining, setJoining] = useState(false);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     allocationId: "",
//     scheduledAt: "",
//   });

//   // Only this session's active courses for the current semester.
//   // Same rule as the mark sheet.
//   const courses = useMemo(
//     () =>
//       allocations.filter(
//         (a) =>
//           a.status === "Active" &&
//           normalizeSemester(a.semester) === currentSemester &&
//           idOf(a.academicSession) === currentSession?._id
//       ),
//     [allocations, currentSemester, currentSession]
//   );

//   /* ----------------------------- LOAD ----------------------------- */

//   const loadAll = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await request<{ liveClasses: LiveClass[]; allocations: Allocation[] }>(
//         "/live/mine"
//       );
//       setAllocations(data.allocations || []);
//       setClasses(data.liveClasses || []);
//     } catch (err) {
//       toast.error((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadAll();
//   }, [loadAll]);

//   /* ----------------------------- CREATE --------------------------- */

//   const createLiveClass = async () => {
//     if (!form.title.trim()) return toast.error("Enter a lecture title");
//     if (!form.allocationId) return toast.error("Select a course");

//     setSaving(true);
//     try {
//       const res = await request<{ message: string; liveClass: LiveClass }>("/live", {
//         method: "POST",
//         body: JSON.stringify({
//           allocationId: form.allocationId,
//           title: form.title.trim(),
//           description: form.description.trim(),
//           scheduledAt: form.scheduledAt
//             ? new Date(form.scheduledAt).toISOString()
//             : undefined,
//         }),
//       });

//       setClasses((prev) => [res.liveClass, ...prev]);
//       setForm({ title: "", description: "", allocationId: "", scheduledAt: "" });
//       setShowCreate(false);
//       toast.success(res.message);
//     } catch (err) {
//       toast.error((err as Error).message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ----------------------------- CLASSROOM ------------------------ */

//   const openRoom = async (liveClass: LiveClass) => {
//     setRoomClass(liveClass);
//     setJoinUrl("");
//     setShowRoom(true);
//     setJoining(true);
//     try {
//       const res = await request<{ join: unknown }>(`/live/${liveClass._id}/join`, {
//         method: "POST",
//       });
//       const url = joinUrlOf(res.join);
//       if (!url) throw new Error("No classroom link was returned.");
//       setJoinUrl(url);
//     } catch (err) {
//       toast.error((err as Error).message);
//       setShowRoom(false);
//     } finally {
//       setJoining(false);
//     }
//   };

//   const startClass = async (liveClass: LiveClass) => {
//     try {
//       const res = await request<{ message: string; liveClass: LiveClass }>(
//         `/live/${liveClass._id}/start`,
//         { method: "POST" }
//       );
//       setClasses((prev) => prev.map((c) => (c._id === liveClass._id ? res.liveClass : c)));
//       toast.success(res.message);
//       openRoom(res.liveClass);
//     } catch (err) {
//       toast.error((err as Error).message);
//     }
//   };

//   const endClass = async (liveClass: LiveClass) => {
//     if (!window.confirm("End this live class? Students will no longer be able to join.")) return;
//     try {
//       const res = await request<{ message: string; liveClass: LiveClass }>(
//         `/live/${liveClass._id}/end`,
//         { method: "POST" }
//       );
//       setClasses((prev) => prev.map((c) => (c._id === liveClass._id ? res.liveClass : c)));
//       if (roomClass?._id === liveClass._id) setShowRoom(false);
//       toast.success(res.message);
//     } catch (err) {
//       toast.error((err as Error).message);
//     }
//   };

//   const deleteClass = async (id: string) => {
//     if (!window.confirm("Delete this live class?")) return;
//     try {
//       const res = await request<{ message: string }>(`/live/${id}`, { method: "DELETE" });
//       setClasses((prev) => prev.filter((c) => c._id !== id));
//       if (roomClass?._id === id) setShowRoom(false);
//       toast.success(res.message);
//     } catch (err) {
//       toast.error((err as Error).message);
//     }
//   };

//   /* ----------------------------- SEARCH / COUNTS ------------------ */

//   const filtered = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     if (!q) return classes;
//     return classes.filter((c) =>
//       [c.title, c.course?.title, c.course?.code, c.status]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase()
//         .includes(q)
//     );
//   }, [classes, search]);

//   const liveCount = classes.filter((c) => c.status === "live").length;
//   const scheduledCount = classes.filter((c) => c.status === "scheduled").length;
//   const endedCount = classes.filter((c) => c.status === "ended").length;

//   /* ----------------------------- RENDER --------------------------- */

//   return (
//     <div className="min-h-full space-y-6 p-4 md:p-6">
//       {/* HEADER */}
//       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//         <div className="flex items-center gap-3">
//           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">
//             <Video className="h-5 w-5 text-[#006dcc]" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight">Live Stream</h1>
//             <p className="text-sm text-muted-foreground">
//               Create and manage live online lectures for your students.
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <Button variant="outline" onClick={loadAll} disabled={loading}>
//             {loading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <RefreshCw className="mr-2 h-4 w-4" />
//             )}
//             Refresh
//           </Button>
//           <Button
//             className="bg-[#006dcc] hover:bg-[#005ca8]"
//             onClick={() => setShowCreate(true)}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Create Live Class
//           </Button>
//         </div>
//       </div>

//       {/* INFO */}
//       <Card className="border-[#006dcc]/20 bg-[#006dcc]/5">
//         <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
//           <div className="flex gap-4">
//             <div className="hidden rounded-lg bg-[#006dcc] p-3 text-white sm:flex">
//               <VideoIcon className="h-6 w-6" />
//             </div>
//             <div>
//               <h2 className="font-semibold">Online Lecture Classroom</h2>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 Create a live classroom and allow your students to join your lecture from their student dashboard.
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* STATISTICS */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Total Classes</CardDescription>
//             <CardTitle className="text-2xl">{classes.length}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//               <Video className="h-4 w-4" />
//               All live classes
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Live Now</CardDescription>
//             <CardTitle className="text-2xl text-red-600">{liveCount}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2 text-xs text-red-600">
//               <Radio className="h-4 w-4 animate-pulse" />
//               Currently streaming
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Scheduled</CardDescription>
//             <CardTitle className="text-2xl">{scheduledCount}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//               <CalendarDays className="h-4 w-4" />
//               Upcoming lectures
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardDescription>Completed</CardDescription>
//             <CardTitle className="text-2xl">{endedCount}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//               <CheckCircle2 className="h-4 w-4" />
//               Finished classes
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* LIVE CLASSES */}
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//             <div>
//               <CardTitle>My Live Classes</CardTitle>
//               <CardDescription>Manage your online lectures and live classrooms.</CardDescription>
//             </div>
//             <div className="relative w-full md:w-80">
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 className="pl-9"
//                 placeholder="Search live classes..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent>
//           {loading && classes.length === 0 ? (
//             <div className="flex min-h-[300px] items-center justify-center">
//               <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
//               <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
//                 <Video className="h-7 w-7 text-muted-foreground" />
//               </div>
//               <h3 className="font-semibold">No live classes yet</h3>
//               <p className="mt-1 max-w-md text-sm text-muted-foreground">
//                 Create your first online lecture. Your students will be able to join from their student dashboard.
//               </p>
//               <Button
//                 className="mt-4 bg-[#006dcc] hover:bg-[#005ca8]"
//                 onClick={() => setShowCreate(true)}
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Create Live Class
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {filtered.map((c) => (
//                 <div
//                   key={c._id}
//                   className="group rounded-xl border p-4 transition hover:bg-muted/40"
//                 >
//                   <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                     {/* LEFT */}
//                     <div className="flex min-w-0 gap-4">
//                       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">
//                         <Video className="h-6 w-6 text-[#006dcc]" />
//                       </div>
//                       <div className="min-w-0">
//                         <div className="mb-1 flex flex-wrap items-center gap-2">
//                           <h3 className="font-semibold">{c.title}</h3>
//                           <StatusBadge status={c.status} />
//                         </div>
//                         <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
//                           <span className="flex items-center gap-1">
//                             <BookOpen className="h-3.5 w-3.5" />
//                             {c.course?.code ? `${c.course.code} — ` : ""}
//                             {c.course?.title || "Course"}
//                           </span>
//                           <span className="flex items-center gap-1">
//                             <CalendarDays className="h-3.5 w-3.5" />
//                             {formatDate(c.scheduledAt)}
//                           </span>
//                         </div>
//                         {c.description && (
//                           <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
//                             {c.description}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* ACTIONS */}
//                     <div className="flex flex-wrap items-center gap-2">
//                       {c.status === "scheduled" && (
//                         <Button
//                           className="bg-[#006dcc] hover:bg-[#005ca8]"
//                           onClick={() => startClass(c)}
//                         >
//                           <Play className="mr-2 h-4 w-4" />
//                           Start Live
//                         </Button>
//                       )}

//                       {c.status === "live" && (
//                         <>
//                           <Button className="bg-red-600 hover:bg-red-700" onClick={() => openRoom(c)}>
//                             <Radio className="mr-2 h-4 w-4" />
//                             Open Live Room
//                           </Button>
//                           <Button variant="outline" onClick={() => endClass(c)}>
//                             <Square className="mr-2 h-4 w-4" />
//                             End
//                           </Button>
//                         </>
//                       )}

//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button size="icon" variant="outline">
//                             <MoreVertical className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           {c.status !== "ended" && (
//                             <DropdownMenuItem onClick={() => openRoom(c)}>
//                               <ExternalLink className="mr-2 h-4 w-4" />
//                               Open Classroom
//                             </DropdownMenuItem>
//                           )}
//                           <DropdownMenuSeparator />
//                           {c.status === "scheduled" && (
//                             <DropdownMenuItem className="text-red-600" onClick={() => deleteClass(c._id)}>
//                               <Trash2 className="mr-2 h-4 w-4" />
//                               Delete
//                             </DropdownMenuItem>
//                           )}
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* CREATE DIALOG */}
//       <Dialog open={showCreate} onOpenChange={setShowCreate}>
//         <DialogContent className="sm:max-w-[550px]">
//           <DialogHeader>
//             <DialogTitle>Create Live Class</DialogTitle>
//             <DialogDescription>
//               Create an online classroom for one of your courses this semester.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-5 py-3">
//             <div className="space-y-2">
//               <Label>Lecture Title</Label>
//               <Input
//                 placeholder="e.g. Introduction to Digital Electronics"
//                 value={form.title}
//                 onChange={(e) => setForm({ ...form, title: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Course</Label>
//               <Select
//                 value={form.allocationId}
//                 onValueChange={(value) => setForm({ ...form, allocationId: value })}
//               >
//                 <SelectTrigger>
//                   <SelectValue
//                     placeholder={loading ? "Loading courses..." : "Select your course"}
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {courses.length === 0 ? (
//                     <SelectItem value="none" disabled>
//                       {loading ? "Loading courses..." : `No courses for ${currentSemester} Semester`}
//                     </SelectItem>
//                   ) : (
//                     courses.map((a) => (
//                       <SelectItem key={a._id} value={a._id}>
//                         {a.course?.code ? `${a.course.code} — ` : ""}
//                         {a.course?.title || "Untitled Course"}
//                         {a.level ? ` (${a.level})` : ""}
//                       </SelectItem>
//                     ))
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Lecture Description</Label>
//               <textarea
//                 className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
//                 placeholder="What will students learn in this lecture?"
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Start Date & Time</Label>
//               <Input
//                 type="datetime-local"
//                 value={form.scheduledAt}
//                 onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
//               />
//               <p className="text-xs text-muted-foreground">
//                 Leave this empty to create the class now and start it when you are ready.
//               </p>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowCreate(false)}>
//               Cancel
//             </Button>
//             <Button
//               className="bg-[#006dcc] hover:bg-[#005ca8]"
//               onClick={createLiveClass}
//               disabled={saving}
//             >
//               {saving ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 <Video className="mr-2 h-4 w-4" />
//               )}
//               Create Live Class
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* CLASSROOM DIALOG */}
//     <Dialog open={showRoom} onOpenChange={setShowRoom}>
//   <DialogContent className="max-w-6xl p-0">
//     <div className="flex flex-col">
//       <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <DialogTitle className="font-semibold">
//             {roomClass?.title || "Live classroom"}
//           </DialogTitle>
//           <DialogDescription className="text-xs text-muted-foreground">
//             {roomClass?.course?.code ? `${roomClass.course.code} — ` : ""}
//             {roomClass?.course?.title}
//           </DialogDescription>
//         </div>
//         {roomClass && <StatusBadge status={roomClass.status} />}
//       </div>


//             <div className="aspect-video w-full bg-black">
//               {joining ? (
//                 <div className="flex h-full items-center justify-center">
//                   <Loader2 className="h-7 w-7 animate-spin text-white" />
//                 </div>
//               ) : joinUrl ? (
//                 <iframe
//                   src={joinUrl}
//                   title="Live Classroom"
//                   className="h-full w-full border-0"
//                   allow="camera; microphone; fullscreen; display-capture; autoplay"
//                 />
//               ) : null}
//             </div>

//             <div className="flex flex-col gap-3 border-t p-4 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <p className="text-sm font-medium">Live Classroom</p>
//                 <p className="text-xs text-muted-foreground">
//                   Students join this same classroom from their student dashboard.
//                 </p>
//               </div>
//               {joinUrl && (
//                 <Button
//                   variant="outline"
//                   onClick={() => window.open(joinUrl, "_blank", "noopener,noreferrer")}
//                 >
//                   <ExternalLink className="mr-2 h-4 w-4" />
//                   Open Full Screen
//                 </Button>
//               )}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import {
  Video,
  VideoIcon,
  Plus,
  Search,
  RefreshCw,
  Play,
  Square,
  Clock,
  CalendarDays,
  ExternalLink,
  MoreVertical,
  Trash2,
  Radio,
  CheckCircle2,
  BookOpen,
  Loader2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";

import { SessionContext } from "@/contexts/SessionContext";
import { normalizeSemester } from "@/lib/semester";
import { API_BASE_URL, getToken } from "@/lib/api";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

type Allocation = {
  _id: string;
  status: string;
  semester: string;
  level?: string;
  staff?: string;
  course?: { _id?: string; code?: string; title?: string; credits?: number };
  academicSession?: string | { _id?: string; name?: string };
};

type LiveClass = {
  _id: string;
  title: string;
  description?: string;
  status: "scheduled" | "live" | "ended";
  scheduledAt?: string;
  startedAt?: string;
  endedAt?: string;
  course?: { _id?: string; code?: string; title?: string };
  academicSession?: { _id?: string; name?: string } | string;
  level?: string;
  semester?: string;
  hasRecording?: boolean;
};

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

const idOf = (ref: unknown): string =>
  typeof ref === "string" ? ref : (ref as { _id?: string } | null)?._id ?? "";

const joinUrlOf = (join: unknown): string => {
  const j = join as {
    domain?: string;
    roomName?: string;
    jwt?: string | null;
    url?: string;
  } | null;

  if (!j) return "";
  if (j.url) return j.url;
  if (!j.domain || !j.roomName) return "";

  const base = `https://${j.domain}/${j.roomName}`;
  return j.jwt ? `${base}?jwt=${encodeURIComponent(j.jwt)}` : base;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "Request failed.");
  }
  return data as T;
}

function formatDate(date?: string): string {
  if (!date) return "Not scheduled";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "Invalid date";
  return d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function StatusBadge({ status }: { status: LiveClass["status"] }) {
  if (status === "live") {
    return (
      <Badge className="gap-1 bg-red-600 hover:bg-red-600">
        <Radio className="h-3 w-3 animate-pulse" />
        LIVE
      </Badge>
    );
  }
  if (status === "scheduled") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Scheduled
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1">
      <CheckCircle2 className="h-3 w-3" />
      Ended
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function LiveStream() {
  const { currentSession, currentSemester } = useContext(SessionContext);

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    allocationId: "",
    scheduledAt: "",
  });

  // Only this session's active courses for the current semester.
  // Same rule as the mark sheet.
  const courses = useMemo(
    () =>
      allocations.filter(
        (a) =>
          a.status === "Active" &&
          normalizeSemester(a.semester) === currentSemester &&
          idOf(a.academicSession) === currentSession?._id
      ),
    [allocations, currentSemester, currentSession]
  );

  /* ----------------------------- LOAD ----------------------------- */

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await request<{ liveClasses: LiveClass[]; allocations: Allocation[] }>(
        "/live/mine"
      );
      setAllocations(data.allocations || []);
      setClasses(data.liveClasses || []);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ----------------------------- CLASSROOM TAB ------------------- */

  // Open the tab synchronously inside the click handler.
  // Browsers block pop-ups opened after an await, so we open first and point it later.
  const openBlankTab = (): Window | null => {
    const win = window.open("", "_blank");
    if (win) {
      win.document.title = "Opening classroom...";
      win.document.body.innerHTML =
        '<p style="font-family:sans-serif;padding:24px">Opening classroom…</p>';
    } else {
      toast.error("Your browser blocked the new tab. Allow pop-ups for this site and try again.");
    }
    return win;
  };

  // Fetches the join details and sends the pre-opened tab to the room.
  const goToClassroom = async (win: Window | null, liveClass: LiveClass) => {
    if (!win) return;
    try {
      const res = await request<{ join: unknown }>(`/live/${liveClass._id}/join`, {
        method: "POST",
      });
      const url = joinUrlOf(res.join);
      if (!url) throw new Error("No classroom link was returned.");
      win.location.href = url;
    } catch (err) {
      win.close();
      toast.error((err as Error).message);
    }
  };

  /* ----------------------------- CREATE --------------------------- */

  const createLiveClass = async () => {
    if (!form.title.trim()) return toast.error("Enter a lecture title");
    if (!form.allocationId) return toast.error("Select a course");

    setSaving(true);
    try {
      const res = await request<{ message: string; liveClass: LiveClass }>("/live", {
        method: "POST",
        body: JSON.stringify({
          allocationId: form.allocationId,
          title: form.title.trim(),
          description: form.description.trim(),
          scheduledAt: form.scheduledAt
            ? new Date(form.scheduledAt).toISOString()
            : undefined,
        }),
      });

      setClasses((prev) => [res.liveClass, ...prev]);
      setForm({ title: "", description: "", allocationId: "", scheduledAt: "" });
      setShowCreate(false);
      toast.success(res.message);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  /* ----------------------------- START / OPEN / END -------------- */

  const startClass = async (liveClass: LiveClass) => {
    const win = openBlankTab();
    try {
      const res = await request<{ message: string; liveClass: LiveClass }>(
        `/live/${liveClass._id}/start`,
        { method: "POST" }
      );
      setClasses((prev) => prev.map((c) => (c._id === liveClass._id ? res.liveClass : c)));
      toast.success(res.message);
      await goToClassroom(win, res.liveClass);
    } catch (err) {
      win?.close();
      toast.error((err as Error).message);
    }
  };

  const openClass = async (liveClass: LiveClass) => {
    const win = openBlankTab();
    await goToClassroom(win, liveClass);
  };

  const endClass = async (liveClass: LiveClass) => {
    if (!window.confirm("End this live class? Students will no longer be able to join.")) return;
    try {
      const res = await request<{ message: string; liveClass: LiveClass }>(
        `/live/${liveClass._id}/end`,
        { method: "POST" }
      );
      setClasses((prev) => prev.map((c) => (c._id === liveClass._id ? res.liveClass : c)));
      toast.success(res.message);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const deleteClass = async (id: string) => {
    if (!window.confirm("Delete this live class?")) return;
    try {
      const res = await request<{ message: string }>(`/live/${id}`, { method: "DELETE" });
      setClasses((prev) => prev.filter((c) => c._id !== id));
      toast.success(res.message);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  /* ----------------------------- SEARCH / COUNTS ------------------ */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) =>
      [c.title, c.course?.title, c.course?.code, c.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [classes, search]);

  const liveCount = classes.filter((c) => c.status === "live").length;
  const scheduledCount = classes.filter((c) => c.status === "scheduled").length;
  const endedCount = classes.filter((c) => c.status === "ended").length;

  /* ----------------------------- RENDER --------------------------- */

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">
            <Video className="h-5 w-5 text-[#006dcc]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Stream</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage live online lectures for your students.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={loadAll} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Live Class
          </Button>
        </div>
      </div>

      {/* INFO */}
      <Card className="border-[#006dcc]/20 bg-[#006dcc]/5">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-4">
            <div className="hidden rounded-lg bg-[#006dcc] p-3 text-white sm:flex">
              <VideoIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-semibold">Online Lecture Classroom</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a live classroom and allow your students to join your lecture from their student dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Classes</CardDescription>
            <CardTitle className="text-2xl">{classes.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Video className="h-4 w-4" />
              All live classes
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Live Now</CardDescription>
            <CardTitle className="text-2xl text-red-600">{liveCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-red-600">
              <Radio className="h-4 w-4 animate-pulse" />
              Currently streaming
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Scheduled</CardDescription>
            <CardTitle className="text-2xl">{scheduledCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              Upcoming lectures
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{endedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Finished classes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LIVE CLASSES */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>My Live Classes</CardTitle>
              <CardDescription>Manage your online lectures and live classrooms.</CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search live classes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && classes.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <Video className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No live classes yet</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Create your first online lecture. Your students will be able to join from their student dashboard.
              </p>
              <Button
                className="mt-4 bg-[#006dcc] hover:bg-[#005ca8]"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Live Class
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => (
                <div
                  key={c._id}
                  className="group rounded-xl border p-4 transition hover:bg-muted/40"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* LEFT */}
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">
                        <Video className="h-6 w-6 text-[#006dcc]" />
                      </div>
                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{c.title}</h3>
                          <StatusBadge status={c.status} />
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            {c.course?.code ? `${c.course.code} — ` : ""}
                            {c.course?.title || "Course"}
                          </span>
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDate(c.scheduledAt)}
                          </span>
                        </div>
                        {c.description && (
                          <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap items-center gap-2">
                      {c.status === "scheduled" && (
                        <Button
                          className="bg-[#006dcc] hover:bg-[#005ca8]"
                          onClick={() => startClass(c)}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start Live
                        </Button>
                      )}

                      {c.status === "live" && (
                        <>
                          <Button className="bg-red-600 hover:bg-red-700" onClick={() => openClass(c)}>
                            <Radio className="mr-2 h-4 w-4" />
                            Open Live Room
                          </Button>
                          <Button variant="outline" onClick={() => endClass(c)}>
                            <Square className="mr-2 h-4 w-4" />
                            End
                          </Button>
                        </>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="outline">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {c.status !== "ended" && (
                            <DropdownMenuItem onClick={() => openClass(c)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open Classroom
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {c.status === "scheduled" && (
                            <DropdownMenuItem className="text-red-600" onClick={() => deleteClass(c._id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE DIALOG */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create Live Class</DialogTitle>
            <DialogDescription>
              Create an online classroom for one of your courses this semester.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-3">
            <div className="space-y-2">
              <Label>Lecture Title</Label>
              <Input
                placeholder="e.g. Introduction to Digital Electronics"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Course</Label>
              <Select
                value={form.allocationId}
                onValueChange={(value) => setForm({ ...form, allocationId: value })}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={loading ? "Loading courses..." : "Select your course"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {courses.length === 0 ? (
                    <SelectItem value="none" disabled>
                      {loading ? "Loading courses..." : `No courses for ${currentSemester} Semester`}
                    </SelectItem>
                  ) : (
                    courses.map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.course?.code ? `${a.course.code} — ` : ""}
                        {a.course?.title || "Untitled Course"}
                        {a.level ? ` (${a.level})` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lecture Description</Label>
              <textarea
                className="min-h-[90px] w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="What will students learn in this lecture?"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date & Time</Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Leave this empty to create the class now and start it when you are ready.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={createLiveClass}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Video className="mr-2 h-4 w-4" />
              )}
              Create Live Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}