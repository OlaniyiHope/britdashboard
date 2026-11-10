
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { normalizeSemester } from "@/lib/semester";
export interface Session {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  currentSemester?: "First" | "Second";
  isActive?: boolean;
  [key: string]: any;
}

interface SessionContextType {
  sessions: Session[];
  currentSession: Session | null;
  currentSemester: "First" | "Second";
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  setCurrentSession: React.Dispatch<React.SetStateAction<Session | null>>;
  setCurrentSemester: React.Dispatch<React.SetStateAction<"First" | "Second">>;
    changeSemester: (semester: "First" | "Second") => Promise<void>;  
}

// export const SessionContext = createContext<SessionContextType>({
//   sessions: [],
//   currentSession: null,
//   currentSemester: "First",
//   setSessions: () => {},
//   setCurrentSession: () => {},
//   setCurrentSemester: () => {},
// });
export const SessionContext = createContext<SessionContextType>({
  sessions: [],
  currentSession: null,
  currentSemester: "First",
  setSessions: () => {},
  setCurrentSession: () => {},
  setCurrentSemester: () => {},
  changeSemester: async () => {},
});
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [currentSemester, setCurrentSemester] = useState<"First" | "Second">("First");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/sessions`)
      .then((response) => {
        const list: Session[] = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        if (list.length > 0) {
          setSessions(list);

          const now = new Date();
          const active = list.find((s) => {
            const start = new Date(s.startDate);
            const end = new Date(s.endDate);
            return now >= start && now <= end;
          });

          const activeSession = active ?? list[list.length - 1];
          setCurrentSession(activeSession);
          
          // ✅ NEW: Set current semester from session
          if (activeSession?.currentSemester) {
            setCurrentSemester(activeSession.currentSemester);
          }
        } else {
          console.error("Unexpected response structure", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, [apiUrl]);
const changeSemester = async (semester: "First" | "Second") => {
  if (!currentSession) return;

  const token = localStorage.getItem("jwtToken") || "";

  const response = await axios.put(
    `${apiUrl}/api/sessions/${currentSession._id}/semester`,
    { semester },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const saved = response.data.session;
  setCurrentSession(saved);
  setCurrentSemester(normalizeSemester(saved.currentSemester) ?? semester);
};
  return (
<SessionContext.Provider
  value={{
    sessions,
    currentSession,
    currentSemester,
    setSessions,
    setCurrentSession,
    setCurrentSemester,
    changeSemester,
  }}
>
      {children}
    </SessionContext.Provider>
  );
};