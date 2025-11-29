export type UserRole = "L1_MASTER_ADMIN" | "L2_EXEC_ADMIN" | "L3_CITIZEN";

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  district?: string;
  isActive: boolean;
  isVerified: boolean;
  preferences?: {
    language: "en" | "te" | "hi";
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  lastLogin?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  department?: string;
  designation?: string;
  district?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface AuthError {
  success: false;
  error: string;
  message?: string;
}

// Role display mappings
export const ROLE_LABELS: Record<UserRole, string> = {
  L1_MASTER_ADMIN: "Master Admin",
  L2_EXEC_ADMIN: "Executive Admin",
  L3_CITIZEN: "Citizen",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  L1_MASTER_ADMIN: "Minister/MLA/MP - Strategic oversight and policy decisions",
  L2_EXEC_ADMIN: "PA/PS/OSD - Operations management and case assignments",
  L3_CITIZEN: "Public Access - Submit requests and track status",
};
