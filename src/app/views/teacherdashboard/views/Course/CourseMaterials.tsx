import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

const API_URL =
  import.meta.env.VITE_NODE_API_URL || "http://localhost:5001";

type Course = {
  _id: string;
  course?: {
    _id?: string;
    code?: string;
    title?: string;
    name?: string;
  };
  courseId?: string;
  courseCode?: string;
  courseTitle?: string;
  courseName?: string;
  level?: string;
  semester?: string;
  session?: string;
  academicSession?: string;
  department?: string;
  programme?: string;
};

type Material = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  fileName?: string;
  originalName?: string;
  fileUrl?: string;
  url?: string;
  fileType?: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
};

const getToken = () => {
  return (
    localStorage.getItem("jwtToken") ||
    localStorage.getItem("token") ||
    ""
  );
};

const getCourseTitle = (course: Course | null) => {
  if (!course) return "Course";

  return (
    course.course?.title ||
    course.course?.name ||
    course.courseTitle ||
    course.courseName ||
    "Course"
  );
};

const getCourseCode = (course: Course | null) => {
  if (!course) return "";

  return (
    course.course?.code ||
    course.courseCode ||
    ""
  );
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "-";

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getFileIcon = (material: Material) => {
  const type = (
    material.mimeType ||
    material.fileType ||
    material.originalName ||
    material.fileName ||
    ""
  ).toLowerCase();

  if (type.includes("pdf")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  }

  if (
    type.includes("image") ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(type)
  ) {
    return <FileImage className="h-5 w-5 text-blue-500" />;
  }

  if (
    type.includes("video") ||
    /\.(mp4|mov|avi|mkv|webm)$/i.test(type)
  ) {
    return <FileVideo className="h-5 w-5 text-purple-500" />;
  }

  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("archive") ||
    /\.(zip|rar|7z)$/i.test(type)
  ) {
    return <FileArchive className="h-5 w-5 text-yellow-600" />;
  }

  if (
    type.includes("word") ||
    /\.(doc|docx)$/i.test(type)
  ) {
    return <FileText className="h-5 w-5 text-blue-600" />;
  }

  return <File className="h-5 w-5 text-muted-foreground" />;
};

export default function StaffCourseMaterials() {
  const { allocationId } = useParams<{ allocationId: string }>();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);

  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [openUpload, setOpenUpload] = useState(false);

  const [editingMaterial, setEditingMaterial] =
    useState<Material | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lecture Note");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  /*
   * ---------------------------------------------------------
   * FETCH COURSE ALLOCATION
   * ---------------------------------------------------------
   */

  const fetchCourse = async () => {
    if (!allocationId) return;

    try {
      setLoadingCourse(true);

      const token = getToken();

      const response = await axios.get(
        `${API_URL}/api/course-allocations/${allocationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourse(response.data);
    } catch (error: any) {
      console.error("Course allocation error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load course information."
      );
    } finally {
      setLoadingCourse(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * FETCH MATERIALS
   * ---------------------------------------------------------
   */

  const fetchMaterials = async () => {
    if (!allocationId) return;

    try {
      setLoadingMaterials(true);

      const token = getToken();

      const response = await axios.get(
        `${API_URL}/api/course-materials/allocation/${allocationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setMaterials(data);
      } else if (Array.isArray(data?.materials)) {
        setMaterials(data.materials);
      } else {
        setMaterials([]);
      }
    } catch (error: any) {
      console.error("Course materials error:", error);

      if (error?.response?.status === 404) {
        setMaterials([]);
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Unable to load course materials."
        );
      }
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    fetchMaterials();
  }, [allocationId]);

  /*
   * ---------------------------------------------------------
   * FILTER MATERIALS
   * ---------------------------------------------------------
   */

  const filteredMaterials = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return materials;

    return materials.filter((material) => {
      return `
        ${material.title}
        ${material.description || ""}
        ${material.category || ""}
        ${material.fileName || ""}
        ${material.originalName || ""}
      `
        .toLowerCase()
        .includes(value);
    });
  }, [materials, search]);

  /*
   * ---------------------------------------------------------
   * OPEN UPLOAD DIALOG
   * ---------------------------------------------------------
   */

  const openUploadDialog = () => {
    setEditingMaterial(null);
    setTitle("");
    setDescription("");
    setCategory("Lecture Note");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setOpenUpload(true);
  };

  /*
   * ---------------------------------------------------------
   * OPEN EDIT DIALOG
   * ---------------------------------------------------------
   */

  const openEditDialog = (material: Material) => {
    setEditingMaterial(material);

    setTitle(material.title || "");
    setDescription(material.description || "");
    setCategory(material.category || "Lecture Note");

    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setOpenUpload(true);
  };

  /*
   * ---------------------------------------------------------
   * FILE SELECT
   * ---------------------------------------------------------
   */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    if (!title.trim()) {
      setTitle(
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * UPLOAD / UPDATE MATERIAL
   * ---------------------------------------------------------
   */

  const handleSubmit = async () => {
    if (!allocationId) {
      toast.error("Course allocation was not found.");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a material title.");
      return;
    }

    if (!editingMaterial && !selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);

      const token = getToken();

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("allocationId", allocationId);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (editingMaterial) {
        await axios.put(
          `${API_URL}/api/course-materials/${editingMaterial._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Course material updated successfully.");
      } else {
        await axios.post(
          `${API_URL}/api/course-materials`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        toast.success("Course material uploaded successfully.");
      }

      setOpenUpload(false);

      setTitle("");
      setDescription("");
      setCategory("Lecture Note");
      setSelectedFile(null);

      await fetchMaterials();
    } catch (error: any) {
      console.error("Material upload error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to save course material."
      );
    } finally {
      setUploading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * DELETE MATERIAL
   * ---------------------------------------------------------
   */

  const handleDelete = async (material: Material) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${material.title}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(material._id);

      const token = getToken();

      await axios.delete(
        `${API_URL}/api/course-materials/${material._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMaterials((prev) =>
        prev.filter((item) => item._id !== material._id)
      );

      toast.success("Course material deleted.");
    } catch (error: any) {
      console.error("Delete material error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete material."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * ---------------------------------------------------------
   * DOWNLOAD / OPEN
   * ---------------------------------------------------------
   */

  const handleOpenMaterial = (material: Material) => {
    const url = material.fileUrl || material.url;

    if (!url) {
      toast.error("File URL is not available.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  /*
   * ---------------------------------------------------------
   * COURSE NOT FOUND
   * ---------------------------------------------------------
   */

  if (!allocationId) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-lg font-semibold">
              Course allocation not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              No course allocation ID was provided.
            </p>

            <Button
              className="mt-5"
              onClick={() =>
                navigate("/staff/dashboard/course-allocation")
              }
            >
              Back to My Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-start gap-3">

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                navigate(
                  `/staff/dashboard/course/${allocationId}`
                )
              }
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Course Materials
              </h1>

              <p className="text-sm text-muted-foreground">
                Upload and manage learning materials for your assigned
                course.
              </p>

            </div>

          </div>

          <div className="flex gap-2">

            <Button
              variant="outline"
              onClick={() => {
                fetchCourse();
                fetchMaterials();
              }}
              disabled={loadingMaterials}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  loadingMaterials ? "animate-spin" : ""
                }`}
              />

              Refresh
            </Button>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={openUploadDialog}
            >
              <Plus className="mr-2 h-4 w-4" />
              Upload Material
            </Button>

          </div>

        </div>

      </div>


      {/* =====================================================
          COURSE INFORMATION
      ====================================================== */}

      <Card>

        <CardContent className="p-5">

          {loadingCourse ? (

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading course information...
            </div>

          ) : (

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <BookOpen className="h-6 w-6 text-[#006dcc]" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold">
                    {getCourseTitle(course)}
                  </h2>

                  <div className="mt-1 flex flex-wrap gap-2">

                    {getCourseCode(course) && (
                      <Badge variant="secondary">
                        {getCourseCode(course)}
                      </Badge>
                    )}

                    {course?.level && (
                      <Badge variant="outline">
                        {course.level}
                      </Badge>
                    )}

                    {course?.semester && (
                      <Badge variant="outline">
                        {course.semester}
                      </Badge>
                    )}

                    {course?.session && (
                      <Badge variant="outline">
                        {course.session}
                      </Badge>
                    )}

                    {course?.academicSession && (
                      <Badge variant="outline">
                        {course.academicSession}
                      </Badge>
                    )}

                  </div>

                </div>

              </div>

              <div className="text-left md:text-right">

                <p className="text-sm text-muted-foreground">
                  Total Materials
                </p>

                <p className="text-2xl font-bold">
                  {materials.length}
                </p>

              </div>

            </div>

          )}

        </CardContent>

      </Card>


      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Total Materials
            </CardDescription>

            <CardTitle className="text-2xl">
              {materials.length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Lecture Notes
            </CardDescription>

            <CardTitle className="text-2xl">
              {
                materials.filter(
                  (m) => m.category === "Lecture Note"
                ).length
              }
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Assignments
            </CardDescription>

            <CardTitle className="text-2xl">
              {
                materials.filter(
                  (m) => m.category === "Assignment"
                ).length
              }
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Other Materials
            </CardDescription>

            <CardTitle className="text-2xl">
              {
                materials.filter(
                  (m) =>
                    m.category !== "Lecture Note" &&
                    m.category !== "Assignment"
                ).length
              }
            </CardTitle>
          </CardHeader>
        </Card>

      </div>


      {/* =====================================================
          MATERIALS
      ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <CardTitle>
                Learning Materials
              </CardTitle>

              <CardDescription>
                Materials uploaded for this course will be available
                to enrolled students.
              </CardDescription>
            </div>

          </div>

        </CardHeader>

        <CardContent>

          {/* SEARCH */}

          <div className="mb-5 flex flex-col gap-2 sm:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search materials..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {search && (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}

          </div>


          {/* TABLE */}

          <div className="rounded-md border overflow-x-auto">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Material
                  </TableHead>

                  <TableHead>
                    Category
                  </TableHead>

                  <TableHead>
                    File
                  </TableHead>

                  <TableHead>
                    Size
                  </TableHead>

                  <TableHead>
                    Uploaded
                  </TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {loadingMaterials ? (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      className="h-32 text-center"
                    >

                      <div className="flex items-center justify-center gap-2 text-muted-foreground">

                        <Loader2 className="h-5 w-5 animate-spin" />

                        Loading materials...

                      </div>

                    </TableCell>

                  </TableRow>

                ) : filteredMaterials.length === 0 ? (

                  <TableRow>

                    <TableCell
                      colSpan={6}
                      className="h-40 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />

                        <p className="font-medium">
                          No course materials found
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Upload lecture notes, slides, assignments,
                          videos or other learning resources.
                        </p>

                        <Button
                          className="mt-4"
                          onClick={openUploadDialog}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Material
                        </Button>

                      </div>

                    </TableCell>

                  </TableRow>

                ) : (

                  filteredMaterials.map((material) => (

                    <TableRow key={material._id}>

                      <TableCell>

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">

                            {getFileIcon(material)}

                          </div>

                          <div className="min-w-0">

                            <p className="font-medium truncate max-w-[260px]">

                              {material.title}

                            </p>

                            {material.description && (

                              <p className="text-xs text-muted-foreground truncate max-w-[300px]">

                                {material.description}

                              </p>

                            )}

                          </div>

                        </div>

                      </TableCell>

                      <TableCell>

                        <Badge variant="secondary">

                          {material.category || "Other"}

                        </Badge>

                      </TableCell>

                      <TableCell>

                        <span className="text-sm">

                          {material.originalName ||
                            material.fileName ||
                            "File"}

                        </span>

                      </TableCell>

                      <TableCell>

                        {formatFileSize(material.size)}

                      </TableCell>

                      <TableCell>

                        {formatDate(material.createdAt)}

                      </TableCell>

                      <TableCell>

                        <div className="flex justify-end gap-1">

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Open material"
                            onClick={() =>
                              handleOpenMaterial(material)
                            }
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit material"
                            onClick={() =>
                              openEditDialog(material)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Delete material"
                            disabled={
                              deletingId === material._id
                            }
                            onClick={() =>
                              handleDelete(material)
                            }
                          >
                            {deletingId === material._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </Button>

                        </div>

                      </TableCell>

                    </TableRow>

                  ))

                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>


      {/* =====================================================
          UPLOAD / EDIT DIALOG
      ====================================================== */}

      <Dialog
        open={openUpload}
        onOpenChange={(open) => {
          if (!uploading) {
            setOpenUpload(open);
          }
        }}
      >

        <DialogContent className="sm:max-w-[600px]">

          <DialogHeader>

            <DialogTitle>
              {editingMaterial
                ? "Edit Course Material"
                : "Upload Course Material"}
            </DialogTitle>

            <DialogDescription>
              {editingMaterial
                ? "Update the details of this course material."
                : "Upload a learning resource for this course."}
            </DialogDescription>

          </DialogHeader>


          <div className="space-y-5 py-3">

            {/* TITLE */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Material Title
              </label>

              <Input
                placeholder="e.g. Introduction to Digital Electronics"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
              />

            </div>


            {/* CATEGORY */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Material Type
              </label>

              <Select
                value={category}
                onValueChange={setCategory}
              >

                <SelectTrigger>
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="Lecture Note">
                    Lecture Note
                  </SelectItem>

                  <SelectItem value="Lecture Slides">
                    Lecture Slides
                  </SelectItem>

                  <SelectItem value="Assignment">
                    Assignment
                  </SelectItem>

                  <SelectItem value="Reading Material">
                    Reading Material
                  </SelectItem>

                  <SelectItem value="Video">
                    Video
                  </SelectItem>

                  <SelectItem value="Past Question">
                    Past Question
                  </SelectItem>

                  <SelectItem value="Reference Material">
                    Reference Material
                  </SelectItem>

                  <SelectItem value="Other">
                    Other
                  </SelectItem>

                </SelectContent>

              </Select>

            </div>


            {/* DESCRIPTION */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Description
              </label>

              <Textarea
                placeholder="Brief description of this material..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={4}
              />

            </div>


            {/* FILE */}

            <div className="space-y-2">

              <label className="text-sm font-medium">
                File
              </label>

              <div
                className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition hover:bg-muted/50"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >

                <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                {selectedFile ? (

                  <>

                    <p className="font-medium">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>

                  </>

                ) : editingMaterial ? (

                  <>

                    <p className="font-medium">
                      Current file will be kept
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Select a new file if you want to replace it.
                    </p>

                  </>

                ) : (

                  <>

                    <p className="font-medium">
                      Click to select a file
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF, Word, PowerPoint, Excel, images, videos,
                      ZIP and other supported files
                    </p>

                  </>

                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </div>

            </div>

          </div>


          <DialogFooter>

            <Button
              variant="outline"
              disabled={uploading}
              onClick={() =>
                setOpenUpload(false)
              }
            >
              Cancel
            </Button>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              disabled={uploading}
              onClick={handleSubmit}
            >

              {uploading ? (

                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                  {editingMaterial
                    ? "Updating..."
                    : "Uploading..."}
                </>

              ) : (

                <>
                  <Upload className="mr-2 h-4 w-4" />

                  {editingMaterial
                    ? "Update Material"
                    : "Upload Material"}
                </>

              )}

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}