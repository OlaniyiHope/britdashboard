import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Building2,
  BedDouble,
  Users,
  CheckCircle2,
  Eye,
  Plus,
  MoreHorizontal,
  X,
  UserRound,
  MapPin,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type HostelStatus = "Open" | "Full" | "Maintenance" | "Closed";

interface Hostel {
  id: string;
  name: string;
  location: string;
  gender: "Male" | "Female" | "Mixed";
  blocks: number;
  rooms: number;
  beds: number;
  occupied: number;
  available: number;
  status: HostelStatus;
  updated: string;
}

const hostels: Hostel[] = [
  {
    id: "1",
    name: "Unity Hall",
    location: "North Campus",
    gender: "Male",
    blocks: 2,
    rooms: 80,
    beds: 320,
    occupied: 286,
    available: 34,
    status: "Open",
    updated: "25 Aug 2026",
  },
  {
    id: "2",
    name: "Peace Hall",
    location: "North Campus",
    gender: "Female",
    blocks: 2,
    rooms: 72,
    beds: 288,
    occupied: 261,
    available: 27,
    status: "Open",
    updated: "25 Aug 2026",
  },
  {
    id: "3",
    name: "Excellence Hall",
    location: "South Campus",
    gender: "Male",
    blocks: 1,
    rooms: 60,
    beds: 240,
    occupied: 240,
    available: 0,
    status: "Full",
    updated: "24 Aug 2026",
  },
  {
    id: "4",
    name: "Grace Hall",
    location: "South Campus",
    gender: "Female",
    blocks: 1,
    rooms: 56,
    beds: 224,
    occupied: 198,
    available: 26,
    status: "Open",
    updated: "23 Aug 2026",
  },
  {
    id: "5",
    name: "Innovation Hostel",
    location: "East Campus",
    gender: "Mixed",
    blocks: 1,
    rooms: 40,
    beds: 160,
    occupied: 112,
    available: 48,
    status: "Maintenance",
    updated: "21 Aug 2026",
  },
];

function StatusBadge({ status }: { status: HostelStatus }) {
  const styles: Record<HostelStatus, string> = {
    Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Full: "bg-red-50 text-red-700 border-red-200",
    Maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    Closed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function Hostel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const totalHostels = hostels.length;

  const totalBeds = hostels.reduce(
    (total, hostel) => total + hostel.beds,
    0
  );

  const totalOccupied = hostels.reduce(
    (total, hostel) => total + hostel.occupied,
    0
  );

  const totalAvailable = hostels.reduce(
    (total, hostel) => total + hostel.available,
    0
  );

  const filteredHostels = useMemo(() => {
    const query = search.trim().toLowerCase();

    return hostels.filter((hostel) => {
      const matchesSearch =
        !query ||
        hostel.name.toLowerCase().includes(query) ||
        hostel.location.toLowerCase().includes(query) ||
        hostel.gender.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        hostel.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Hostel & Accommodation
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage hostel capacity, rooms, bed allocation, and student
              accommodation.
            </p>
          </div>

        </div>

        <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
          <Plus className="h-4 w-4" />
          Add Hostel
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Hostels
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalHostels}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Registered accommodation facilities
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Building2 className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Beds
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalBeds}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Total accommodation capacity
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <BedDouble className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Occupied
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalOccupied}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Beds currently allocated
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Available Beds
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalAvailable}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Beds available for allocation
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          SEARCH / FILTER
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search hostel, location or category..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Closed">Closed</option>
              </select>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          HOSTEL TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-sm font-bold text-[#081022]">
            Accommodation Facilities
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Manage hostel facilities and monitor current occupancy.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Hostel
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Rooms
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Capacity
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Occupied
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Available
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredHostels.length === 0 ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >
                    <Building2 className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No hostels found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredHostels.map((hostel) => {

                  const occupancy =
                    hostel.beds > 0
                      ? Math.round(
                          (hostel.occupied / hostel.beds) * 100
                        )
                      : 0;

                  return (
                    <tr
                      key={hostel.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Hostel */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#081022] text-white">
                            <Building2 className="h-4 w-4" />
                          </div>

                          <div>

                            <p className="text-sm font-bold text-[#081022]">
                              {hostel.name}
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="h-3 w-3" />
                              {hostel.location}
                            </div>

                          </div>

                        </div>

                      </td>

                      {/* Gender */}

                      <td className="px-5 py-4">

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {hostel.gender}
                        </span>

                      </td>

                      {/* Rooms */}

                      <td className="px-5 py-4">

                        <span className="text-xs font-semibold text-slate-700">
                          {hostel.rooms}
                        </span>

                      </td>

                      {/* Capacity */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <BedDouble className="h-4 w-4 text-slate-400" />

                          <span className="text-xs font-semibold text-slate-700">
                            {hostel.beds}
                          </span>

                        </div>

                      </td>

                      {/* Occupied */}

                      <td className="px-5 py-4">

                        <div className="min-w-[110px]">

                          <div className="flex items-center justify-between">

                            <span className="text-xs font-bold text-slate-700">
                              {hostel.occupied}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {occupancy}%
                            </span>

                          </div>

                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-[#006dcc]"
                              style={{
                                width: `${occupancy}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* Available */}

                      <td className="px-5 py-4">

                        <span
                          className={`text-xs font-bold ${
                            hostel.available === 0
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {hostel.available}
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <StatusBadge status={hostel.status} />
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedHostel(hostel)
                            }
                            className="h-8 gap-1.5 border-slate-200 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>

                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

        <div className="border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredHostels.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalHostels}
            </strong>{" "}
            hostels
          </p>

        </div>

      </Card>

      {/* ============================================================
          HOSTEL DETAILS
      ============================================================ */}

      {selectedHostel && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                  <Building2 className="h-6 w-6" />
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedHostel.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedHostel.location}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedHostel(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Hostel Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedHostel.status}
                    />
                  </div>
                </div>

                <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                  <UserRound className="h-4 w-4" />
                  View Allocated Students
                </Button>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Gender Category
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedHostel.gender}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Blocks
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedHostel.blocks}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Rooms
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedHostel.rooms}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Beds
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedHostel.beds}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    Occupied Beds
                  </p>

                  <p className="mt-2 text-sm font-bold text-emerald-800">
                    {selectedHostel.occupied}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Available Beds
                  </p>

                  <p className="mt-2 text-sm font-bold text-blue-800">
                    {selectedHostel.available}
                  </p>
                </div>

              </div>

              <div className="rounded-xl border border-slate-200 p-4">

                <div className="flex items-center justify-between">

                  <p className="text-xs font-bold text-slate-600">
                    Occupancy
                  </p>

                  <p className="text-xs font-bold text-[#081022]">
                    {Math.round(
                      (selectedHostel.occupied /
                        selectedHostel.beds) *
                        100
                    )}
                    %
                  </p>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-[#006dcc]"
                    style={{
                      width: `${
                        (selectedHostel.occupied /
                          selectedHostel.beds) *
                        100
                      }%`,
                    }}
                  />

                </div>

              </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedHostel(null)}
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}