/**
 * Auth service types
 */

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

export interface UserData {
  id: string
  email?: string
  username?: string
  display_name?: string
  avatar_url?: string
  email_verified?: boolean
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  user?: UserData
  tokens?: TokenResponse
}

export interface RegisterParams {
  email: string
  password: string
  username?: string
  display_name?: string
  metadata?: Record<string, unknown>
  verify_email?: boolean
}

export interface LoginParams {
  email: string
  password: string
}

export interface RefreshParams {
  refresh_token: string
}
