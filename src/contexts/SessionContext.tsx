// import React, { createContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// export interface Session {
//   _id: string;
//   name: string;
//   startDate: string;
//   endDate: string;
//   [key: string]: any;
// }

// interface SessionContextType {
//   sessions: Session[];
//   currentSession: Session | null;
//   setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
//   setCurrentSession: React.Dispatch<React.SetStateAction<Session | null>>;
// }

// export const SessionContext = createContext<SessionContextType>({
//   sessions: [],
//   currentSession: null,
//   setSessions: () => {},
//   setCurrentSession: () => {},
// });

// export const SessionProvider = ({ children }: { children: ReactNode }) => {
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [currentSession, setCurrentSession] = useState<Session | null>(null);
//   const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

//   useEffect(() => {
//     axios
//       .get(`${apiUrl}/api/sessions`)
//       .then((response) => {
//         const list: Session[] = Array.isArray(response.data)
//           ? response.data
//           : Array.isArray(response.data?.data)
//           ? response.data.data
//           : [];

//         if (list.length > 0) {
//           setSessions(list);

//           const now = new Date();
//           const active = list.find((s) => {
//             const start = new Date(s.startDate);
//             const end = new Date(s.endDate);
//             return now >= start && now <= end;
//           });

//           setCurrentSession(active ?? list[list.length - 1]);
//         } else {
//           console.error("Unexpected response structure", response);
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching sessions:", error);
//       });
//   }, [apiUrl]);

//   return (
//     <SessionContext.Provider
//       value={{ sessions, currentSession, setSessions, setCurrentSession }}
//     >
//       {children}
//     </SessionContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

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
}

export const SessionContext = createContext<SessionContextType>({
  sessions: [],
  currentSession: null,
  currentSemester: "First",
  setSessions: () => {},
  setCurrentSession: () => {},
  setCurrentSemester: () => {},
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

  return (
    <SessionContext.Provider
      value={{ 
        sessions, 
        currentSession, 
        currentSemester,
        setSessions, 
        setCurrentSession,
        setCurrentSemester,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};