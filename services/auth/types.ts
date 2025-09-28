export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  gender: "male" | "female";
  role: "user" | "doctor";
  sessions: string[];
  createdAt: string;
  updatedAt: string;
}
export interface LoginResponse {
  // doc: User;
  exp: number;
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  doc: User;
  message: string;
}
export interface AuthResponse {
  collection: string;
  exp: number;
  message: string;
  strategy: string;
  token: string;
  user: User & {
    _strategy: string;
    collection: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surname: string;
  gender: "male" | "female";
}
