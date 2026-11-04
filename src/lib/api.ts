// src/lib/api.ts
const rawOrigin = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Accept either "https://host" or "https://host/api" and normalise to the origin.
const ORIGIN = rawOrigin.replace(/\/+$/, "").replace(/\/api$/, "");

export const API_BASE_URL = `${ORIGIN}/api`;

export function getToken(): string {
  return localStorage.getItem("jwtToken") || "";
}