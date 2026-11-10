// src/lib/semester.ts
export type SemesterKey = "First" | "Second";

export const normalizeSemester = (value?: string | null): SemesterKey | null => {
  const v = String(value || "").toLowerCase();
  if (v.startsWith("first")) return "First";
  if (v.startsWith("second")) return "Second";
  return null;
};