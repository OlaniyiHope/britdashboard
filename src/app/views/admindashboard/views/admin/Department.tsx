import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Edit3,
  Plus,
  Search,
  Users,
  X,
  XCircle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type DepartmentStatus = "Active" | "Inactive";

type Department = {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: DepartmentStatus;
  createdAt?: string;
  updatedAt?: string;

  // These can come from backend later
  programmeCount?: number;
  studentCount?: number;
};

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "All" | DepartmentStatus
  >("All");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingDepartment, setEditingDepartment] =
    useState<Department | null>(null);

  // ============================================================
  // FETCH DEPARTMENTS
  // ============================================================
const API_BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "http://localhost:5001/api";
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/departments`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch departments"
        );
      }

      setDepartments(data.departments || []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredDepartments = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return departments.filter((department) => {
      const matchesSearch =
        department.name.toLowerCase().includes(searchValue) ||
        department.code.toLowerCase().includes(searchValue) ||
        department.description
          ?.toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const activeDepartments = departments.filter(
    (department) => department.status === "Active"
  ).length;

  const inactiveDepartments = departments.filter(
    (department) => department.status === "Inactive"
  ).length;

  const totalProgrammes = departments.reduce(
    (total, department) =>
      total + (department.programmeCount || 0),
    0
  );

  const totalStudents = departments.reduce(
    (total, department) =>
      total + (department.studentCount || 0),
    0
  );

  // ============================================================
  // DELETE
  // ============================================================

  const deleteDepartment = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
       `${API_BASE_URL}/departments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete department"
        );
      }

      setDepartments((current) =>
        current.filter(
          (department) => department._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete department"
      );
    }
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = async (department: {
    name: string;
    code: string;
    description: string;
    status: DepartmentStatus;
  }) => {
    try {
   const url = editingDepartment
  ? `${API_BASE_URL}/departments/${editingDepartment._id}`
  : `${API_BASE_URL}/departments`;

      const method = editingDepartment
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(department),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save department"
        );
      }

      if (editingDepartment) {
        setDepartments((current) =>
          current.map((item) =>
            item._id === editingDepartment._id
              ? data.department
              : item
          )
        );
      } else {
        setDepartments((current) => [
          ...current,
          data.department,
        ]);
      }

      setShowModal(false);
      setEditingDepartment(null);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save department"
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="flex items-center gap-2 text-[#006dcc]">

            <Building2 className="h-5 w-5" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Academic Structure
            </span>

          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#081022] md:text-3xl">
            Departments
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Create and manage academic departments within
            the polytechnic.
          </p>

        </div>

        <Button
          onClick={() => {
            setEditingDepartment(null);
            setShowModal(true);
          }}
          className="bg-[#081022] hover:bg-[#111c32]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>

      </div>

      {/* ========================================================
          STATISTICS
      ======================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Departments"
          value={departments.length}
          description="Academic departments"
          icon={Building2}
          iconClass="bg-blue-50 text-blue-700"
        />

        <StatCard
          label="Active"
          value={activeDepartments}
          description="Currently active"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          label="Programmes"
          value={totalProgrammes}
          description="Programmes across departments"
          icon={Building2}
          iconClass="bg-purple-50 text-purple-700"
        />

        <StatCard
          label="Students"
          value={totalStudents.toLocaleString()}
          description="Students across departments"
          icon={Users}
          iconClass="bg-orange-50 text-orange-700"
        />

      </div>

      {/* ========================================================
          FILTER CARD
      ======================================================== */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-base font-bold text-[#081022]">
                Academic Departments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Manage departments that contain the
                polytechnic's programmes.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* SEARCH */}

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search departments..."
                  className="w-full pl-9 sm:w-[260px]"
                />

              </div>

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "All"
                      | DepartmentStatus
                  )
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>

      </Card>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

      )}

      {/* ========================================================
          TABLE
      ======================================================== */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200 text-left">

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Code
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Programmes
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >

                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-[#006dcc]" />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading departments...
                    </p>

                  </td>

                </tr>

              ) : filteredDepartments.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >

                    <Building2 className="mx-auto h-10 w-10 text-slate-300" />

                    <p className="mt-3 text-sm font-bold text-slate-600">
                      No departments found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add a department or change your search.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredDepartments.map(
                  (department) => (

                    <tr
                      key={department._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* DEPARTMENT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#081022]">

                            <Building2 className="h-5 w-5" />

                          </div>

                          <div>

                            <p className="font-bold text-[#081022]">
                              {department.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Academic Department
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CODE */}

                      <td className="px-5 py-4">

                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                          {department.code}
                        </span>

                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-5 py-4">

                        <p className="max-w-[300px] text-sm text-slate-600">
                          {department.description ||
                            "No description provided"}
                        </p>

                      </td>

                      {/* PROGRAMMES */}

                      <td className="px-5 py-4">

                        <span className="font-bold text-[#081022]">
                          {department.programmeCount || 0}
                        </span>

                      </td>

                      {/* STUDENTS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Users className="h-4 w-4 text-slate-400" />

                          <span className="font-bold text-[#081022]">
                            {department.studentCount || 0}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            department.status === "Active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-100 text-slate-600"
                          }`}
                        >

                          {department.status ===
                          "Active" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}

                          {department.status}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          <button
                            title="Edit Department"
                            onClick={() => {
                              setEditingDepartment(
                                department
                              );
                              setShowModal(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            title="Delete Department"
                            onClick={() =>
                              deleteDepartment(
                                department._id
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </Card>

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <span>
          Showing{" "}
          <strong className="text-[#081022]">
            {filteredDepartments.length}
          </strong>{" "}
          of{" "}
          <strong className="text-[#081022]">
            {departments.length}
          </strong>{" "}
          departments
        </span>

        <span>
          Inactive departments:{" "}
          <strong className="text-[#081022]">
            {inactiveDepartments}
          </strong>
        </span>

      </div>

      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {showModal && (

        <DepartmentModal
          department={editingDepartment}
          onClose={() => {
            setShowModal(false);
            setEditingDepartment(null);
          }}
          onSave={handleSave}
        />

      )}

    </div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  iconClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
  iconClass: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold text-slate-500">
              {label}
            </p>

            <p className="mt-2 text-3xl font-black text-[#081022]">
              {value}
            </p>

          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
          >
            <Icon className="h-5 w-5" />
          </div>

        </div>

        <p className="mt-3 text-xs text-slate-400">
          {description}
        </p>

      </CardContent>

    </Card>
  );
}

/* ================================================================
   DEPARTMENT MODAL
================================================================ */

function DepartmentModal({
  department,
  onClose,
  onSave,
}: {
  department: Department | null;
  onClose: () => void;
  onSave: (department: {
    name: string;
    code: string;
    description: string;
    status: DepartmentStatus;
  }) => void;
}) {
  const [name, setName] = useState(
    department?.name || ""
  );

  const [code, setCode] = useState(
    department?.code || ""
  );

  const [description, setDescription] =
    useState(department?.description || "");

  const [status, setStatus] =
    useState<DepartmentStatus>(
      department?.status || "Active"
    );

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!name.trim() || !code.trim()) {
      return;
    }

    setSaving(true);

    try {
      await onSave({
        name: name.trim(),
        code: code.trim().toUpperCase(),
        description: description.trim(),
        status,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-[#081022]">
              {department
                ? "Edit Department"
                : "Add Department"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure an academic department for the
              polytechnic.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* NAME */}

            <FormField label="Department Name">

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="e.g. Computer Engineering"
                className="form-input"
                required
              />

            </FormField>

            {/* CODE */}

            <FormField label="Department Code">

              <input
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="e.g. CPE"
                className="form-input"
                required
              />

            </FormField>

          </div>

          {/* DESCRIPTION */}

          <FormField label="Description">

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Brief description of the department..."
              rows={4}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />

          </FormField>

          {/* STATUS */}

          <FormField label="Status">

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as DepartmentStatus
                )
              }
              className="form-input"
            >

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </FormField>

          {/* INFORMATION */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">

                <Building2 className="h-4 w-4" />

              </div>

              <div>

                <p className="text-sm font-bold text-blue-900">
                  Academic structure
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Programmes will be linked to this
                  department. Courses will then belong
                  to programmes through the curriculum.
                </p>

              </div>

            </div>

          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >
              {saving
                ? "Saving..."
                : department
                ? "Save Changes"
                : "Add Department"}
            </Button>

          </div>

        </form>

      </div>

    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">

      <span className="text-xs font-bold text-slate-700">
        {label}
      </span>

      {children}

    </label>
  );
}