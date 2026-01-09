export interface User {
  id: string;
  email: string;
  username: string | null;
  wallet_address: string | null;
  created_at: Date;
  updated_at: Date;
  email_verified: boolean;
  is_active: boolean;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface Session {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: Date;
  created_at: Date;
  user_agent: string | null;
  ip_address: string | null;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
  [key: string]: unknown;
}
