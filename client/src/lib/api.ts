import axios from "axios";
import type {
  User,
  Team,
  AuthResponse,
  TeamResponse,
  AdminTeamsResponse,
  AdminUsersResponse,
  QueriesResponse,
  QueryItem
} from "../types";

const getApiBaseUrl = () => {
  let url = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
  // Remove trailing slashes
  url = url.replace(/\/+$/, "");
  // Automatically append /api if missing (e.g. if set to Render root URL)
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: On 401 Unauthorized, clear session and redirect to /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if not already on /login or /register or /
      const currentPath = window.location.pathname;
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ===============================
// AUTH API
// ===============================
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  gender: "male" | "female" | "other";
  registrationNumber?: string;
  hostelDetails?: string;
  collegeName?: string;
  departmentName?: string;
}

export const registerApi = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: { email: string; password: string }): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

export const getProfileApi = async (): Promise<{ user: User }> => {
  const res = await api.get<{ user: User }>("/user/profile");
  return res.data;
};

// ===============================
// TEAM API
// ===============================
export const getMyTeamApi = async (): Promise<TeamResponse> => {
  const res = await api.get<TeamResponse>("/teams/my-team");
  return res.data;
};

export const createTeamApi = async (teamName: string): Promise<TeamResponse> => {
  const res = await api.post<TeamResponse>("/teams/create", { teamName });
  return res.data;
};

export const joinTeamApi = async (teamCode: string): Promise<TeamResponse> => {
  const res = await api.post<TeamResponse>("/teams/join", { teamCode });
  return res.data;
};

export const updateProjectDescriptionApi = async (
  projectDescription: string
): Promise<TeamResponse> => {
  const res = await api.patch<TeamResponse>("/teams/description", { projectDescription });
  return res.data;
};

// ===============================
// ADMIN API
// ===============================
export const getAllTeamsAdmin = async (): Promise<AdminTeamsResponse> => {
  const res = await api.get<AdminTeamsResponse>("/admin/teams");
  return res.data;
};

export const getAllUsersAdmin = async (): Promise<AdminUsersResponse> => {
  const res = await api.get<AdminUsersResponse>("/admin/users");
  return res.data;
};

export interface UpdateTeamMarksPayload {
  marks?: number;
  day1Marks?: number;
  day2Marks?: number;
  status?: "active" | "qualified_day2" | "eliminated";
  evaluationNotes?: string;
}

export const updateTeamMarksAdmin = async (
  teamId: string,
  payload: number | UpdateTeamMarksPayload
): Promise<{ message: string; team: Team }> => {
  const body = typeof payload === "number" ? { marks: payload } : payload;
  const res = await api.patch<{ message: string; team: Team }>(`/admin/teams/${teamId}/marks`, body);
  return res.data;
};

export const updateTeamStatusAdmin = async (
  teamId: string,
  status: "active" | "qualified_day2" | "eliminated"
): Promise<{ message: string; team: Team }> => {
  const res = await api.patch<{ message: string; team: Team }>(`/admin/teams/${teamId}/status`, {
    status,
  });
  return res.data;
};

// ===============================
// QUERIES API
// ===============================
export interface SubmitQueryPayload {
  name: string;
  email: string;
  teamName: string;
  message: string;
}

export const submitQueryApi = async (
  data: SubmitQueryPayload
): Promise<{ message: string; query: QueryItem }> => {
  const res = await api.post<{ message: string; query: QueryItem }>("/queries", data);
  return res.data;
};

export const getQueriesApi = async (): Promise<QueriesResponse> => {
  const res = await api.get<QueriesResponse>("/queries");
  return res.data;
};

export const replyToQueryAdminApi = async (
  id: string,
  reply: string
): Promise<{ message: string; query: QueryItem }> => {
  const res = await api.patch<{ message: string; query: QueryItem }>(`/queries/${id}/reply`, {
    reply,
  });
  return res.data;
};

export default api;
