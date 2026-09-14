export type ParticipantType = "internal" | "external";

export type GenderType = "male" | "female" | "other";

export type RoleType = "participant" | "admin" | "superadmin";

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: GenderType;
  role: RoleType;
  participantType: ParticipantType;
  registrationNumber?: string;
  hostelDetails?: string;
  collegeName?: string;
  departmentName?: string;
  team?: string | Team | null;
  createdAt?: string;
  updatedAt?: string;
}

export type TeamStatus = "active" | "qualified_day2" | "eliminated";

export interface Team {
  id?: string;
  _id?: string;
  teamName: string;
  teamCode: string;
  participantType: ParticipantType;
  leader: string | User;
  members: (string | User)[];
  projectDescription: string;
  status?: TeamStatus;
  day1Marks?: number | null;
  day2Marks?: number | null;
  marks?: number | null;
  evaluationNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryItem {
  _id: string;
  name: string;
  email: string;
  teamName: string;
  message: string;
  reply?: string;
  repliedBy?: string;
  status: "pending" | "answered";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface TeamResponse {
  message?: string;
  team: Team;
}

export interface AdminTeamsResponse {
  teams: Team[];
}

export interface AdminUsersResponse {
  users: User[];
}

export interface QueriesResponse {
  queries: QueryItem[];
}
