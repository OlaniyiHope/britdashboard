

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import axios from "axios";

// =====================================================
// TYPES
// =====================================================

export type UserRole = "admin" | "staff" | "student";

export type StudentLevel = "ND1" | "ND2";

export type StudyMode = "full-time" | "part-time";

export interface User {
  _id?: string;
  id?: string;

  role: UserRole;

  username: string;
  email?: string;

  address?: string;
  phone?: number | string;
  gender?: "male" | "female";
  birthday?: string | Date;

  // ================= STAFF =================
  staffRole?: string;
  department?: string;
  subjectTaught?: string;

  // ================= STUDENT =================
  studentName?: string;
  matricNo?: string;
  programme?: string;
  level?: StudentLevel;
  studyMode?: StudyMode;

  session?: string[] | any[];

  createdAt?: string;
  updatedAt?: string;
}

// =====================================================
// NOTIFICATIONS
// =====================================================

export interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

// =====================================================
// MESSAGES
// =====================================================

export interface Message {
  id: string;
  from: string;
  fromRole: string;
  to: string;
  subject: string;
  body: string;
  time: string;
  read: boolean;
  type: "inbox" | "sent";
}

// =====================================================
// AUTH STATE
// =====================================================

interface AuthState {
  isAuthenticated: boolean;
  isInitialised: boolean;
  user: User | null;
}

// =====================================================
// AUTH CONTEXT TYPE
// =====================================================

interface AuthContextType extends AuthState {
  login: (
    identifier: string,
    password: string
  ) => Promise<any>;

  logout: () => void;

  register: (userData: any) => Promise<any>;

  notifications: Notification[];

  markNotificationRead: (id: string) => void;

  clearNotifications: () => void;

  messages: Message[];

  sendMessage: (
    to: string,
    subject: string,
    body: string
  ) => void;

  markMessageRead: (id: string) => void;
}

// =====================================================
// API
// =====================================================

const apiUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// TOKEN VALIDATION
// =====================================================

const isValidToken = (
  jwtToken: string | null
): boolean => {
  if (!jwtToken) return false;

  try {
    const parts = jwtToken.split(".");

    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(
      atob(parts[1])
    );

    if (!payload.exp) {
      return true;
    }

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// =====================================================
// SESSION
// =====================================================

const setSession = (
  jwtToken: string | null
) => {
  if (jwtToken) {
    localStorage.setItem(
      "jwtToken",
      jwtToken
    );

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${jwtToken}`;
  } else {
    localStorage.removeItem("jwtToken");

    delete axios.defaults.headers.common[
      "Authorization"
    ];
  }
};

// =====================================================
// REDUCER
// =====================================================

type AuthAction =
  | {
      type: "INIT";
      payload: {
        isAuthenticated: boolean;
        user: User | null;
      };
    }
  | {
      type: "LOGIN";
      payload: {
        user: User;
      };
    }
  | {
      type: "REGISTER";
      payload: {
        user: User;
      };
    }
  | {
      type: "LOGOUT";
    };

// =====================================================
// INITIAL STATE
// =====================================================

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
};

// =====================================================
// REDUCER
// =====================================================

const reducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        isAuthenticated:
          action.payload.isAuthenticated,
        isInitialised: true,
        user: action.payload.user,
      };

    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case "REGISTER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      return state;
  }
};

// =====================================================
// DEFAULT DATA
// =====================================================

const defaultNotifications: Notification[] = [];

const defaultMessages: Message[] = [];

// =====================================================
// CONTEXT
// =====================================================

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const useAuth = () =>
  useContext(AuthContext);

// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [notifications, setNotifications] =
    React.useState<Notification[]>(
      defaultNotifications
    );

  const [messages, setMessages] =
    React.useState<Message[]>(
      defaultMessages
    );

  // ===================================================
  // INITIALIZE AUTH
  // ===================================================

  useEffect(() => {
    const initAuth = () => {
      const jwtToken =
        localStorage.getItem("jwtToken");

      const storedUser =
        localStorage.getItem("user");

      if (
        jwtToken &&
        isValidToken(jwtToken) &&
        storedUser
      ) {
        try {
          setSession(jwtToken);

          const user: User =
            JSON.parse(storedUser);

          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } catch (error) {
          console.error(
            "Failed to restore user:",
            error
          );

          setSession(null);

          localStorage.removeItem("user");

          dispatch({
            type: "INIT",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } else {
        setSession(null);

        dispatch({
          type: "INIT",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initAuth();
  }, []);

  // ===================================================
  // LOGIN
  // ===================================================

  const login = async (
    identifier: string,
    password: string
  ) => {
    try {
      /*
       * identifier can be:
       *
       * Admin/staff:
       *    username or email
       *
       * Student:
       *    username, email or matricNo
       *
       * Your backend should decide how identifier
       * is searched.
       */

      const response = await axios.post(
        `${apiUrl}/api/login`,
        {
          identifier,
          password,
        }
      );

      const {
        token,
        user,
        session,
      } = response.data;

      if (!token) {
        throw new Error(
          "Login successful but no token was returned."
        );
      }

      if (!user) {
        throw new Error(
          "Login successful but no user data was returned."
        );
      }

      // Save JWT
      setSession(token);

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "userCred",
        JSON.stringify(user)
      );

      // Save session if backend returns one
      if (session?._id) {
        localStorage.setItem(
          "sessionId",
          session._id
        );
      }

      // Update React state
      dispatch({
        type: "LOGIN",
        payload: {
          user,
        },
      });

      return response;
    } catch (error: any) {
      console.error(
        "Login error:",
        error?.response?.data || error
      );

      throw error;
    }
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const register = async (
    userData: any
  ) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/register`,
        userData
      );

      if (
        response.status === 200 ||
        response.status === 201
      ) {
        const {
          token,
          user,
        } = response.data;

        if (user) {
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );

          localStorage.setItem(
            "userCred",
            JSON.stringify(user)
          );

          dispatch({
            type: "REGISTER",
            payload: {
              user,
            },
          });
        }

        if (token) {
          setSession(token);
        }

        return response;
      }

      return response;
    } catch (error: any) {
      console.error(
        "Registration error:",
        error?.response?.data || error
      );

      throw error;
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {
    setSession(null);

    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userCred");
    localStorage.removeItem("sessionId");

    dispatch({
      type: "LOGOUT",
    });
  };

  // ===================================================
  // NOTIFICATIONS
  // ===================================================

  const markNotificationRead = (
    id: string
  ) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  // ===================================================
  // MESSAGES
  // ===================================================

  const sendMessage = (
    to: string,
    subject: string,
    body: string
  ) => {
    const newMessage: Message = {
      id: `MSG${Date.now()}`,

      from:
        state.user?.username ||
        state.user?.studentName ||
        "Unknown",

      fromRole:
        state.user?.role || "",

      to,

      subject,

      body,

      time: new Date()
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),

      read: true,

      type: "sent",
    };

    setMessages((prev) => [
      newMessage,
      ...prev,
    ]);
  };

  const markMessageRead = (
    id: string
  ) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? {
              ...message,
              read: true,
            }
          : message
      )
    );
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (!state.isInitialised) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <AuthContext.Provider
      value={{
        ...state,

        login,
        logout,
        register,

        notifications,
        markNotificationRead,
        clearNotifications,

        messages,
        sendMessage,
        markMessageRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// ROLE LABELS
// =====================================================

export const roleLabels: Record<
  UserRole,
  string
> = {
  admin: "Administrator",
  staff: "Staff",
  student: "Student",
};

// =====================================================
// ROLE ACCESS
// =====================================================

export const roleAccess: Record<
  UserRole,
  string[]
> = {
  admin: [
    "dashboard",
    "admin-dashboard",

    "staff",
    "students",
    "student-admission",

    "departments",
    "programmes",
    "courses",

    "sessions",
    "semesters",

    "course-registration",
    "results",
    "marks",
    "transcripts",

    "fees",
    "payments",

    "notices",
    "messages",

    "settings",
  ],

  staff: [
    "dashboard",
    "staff-dashboard",

    "students",
    "student-info",

    "courses",
    "my-courses",

    "course-registration",

    "marks",
    "results",

    "materials",
    "notices",
    "messages",
  ],

  student: [
    "dashboard",
    "student-dashboard",

    "profile",

    "courses",
    "my-courses",
    "course-registration",

    "results",
    "transcript",

    "fees",
    "payments",

    "materials",
    "notices",
    "messages",
  ],
};

export default AuthContext;