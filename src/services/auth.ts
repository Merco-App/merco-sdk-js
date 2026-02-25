/**
 * Auth service — register, login, refresh, logout, users/me, sessions
 * Requires project key (pk_* or sk_*)
 */

import { request } from "../client"
import type { AuthContext, RequestAuth } from "../config"
import type {
  AuthResponse,
  RegisterParams,
  LoginParams,
  RefreshParams,
  UserData,
  ApiResponseEnvelope,
  SessionData,
} from "../types"

const BASE = "/services/auth"

export async function register(baseUrl: string, auth: AuthContext, params: RegisterParams): Promise<AuthResponse> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/register`,
    body: params,
    auth,
  })
}

export async function login(baseUrl: string, auth: AuthContext, params: LoginParams): Promise<AuthResponse> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/login`,
    body: params,
    auth,
  })
}

export async function refresh(baseUrl: string, params: RefreshParams): Promise<AuthResponse> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/refresh`,
    body: params,
  })
}

export async function logout(baseUrl: string, auth: RequestAuth, accessToken: string): Promise<void> {
  await request(baseUrl, {
    method: "POST",
    path: `${BASE}/logout`,
    auth: { ...auth, accessToken } as AuthContext,
  })
}

export async function getMe(baseUrl: string, auth: RequestAuth, accessToken: string): Promise<ApiResponseEnvelope<UserData>> {
  return request(baseUrl, {
    method: "GET",
    path: `${BASE}/users/me`,
    auth: { ...auth, accessToken } as AuthContext,
  })
}

export async function updateMe(
  baseUrl: string,
  auth: RequestAuth,
  accessToken: string,
  body: Partial<Pick<UserData, "display_name" | "avatar_url">>
): Promise<ApiResponseEnvelope<UserData>> {
  return request(baseUrl, {
    method: "PUT",
    path: `${BASE}/users/me`,
    body,
    auth: { ...auth, accessToken } as AuthContext,
  })
}

export async function listSessions(
  baseUrl: string,
  auth: RequestAuth,
  accessToken: string
): Promise<ApiResponseEnvelope<SessionData[]>> {
  return request(baseUrl, {
    method: "GET",
    path: `${BASE}/sessions`,
    auth: { ...auth, accessToken } as AuthContext,
  })
}

export async function revokeSession(
  baseUrl: string,
  auth: RequestAuth,
  accessToken: string,
  sessionId: string
): Promise<void> {
  await request(baseUrl, {
    method: "DELETE",
    path: `${BASE}/sessions/${sessionId}`,
    auth: { ...auth, accessToken } as AuthContext,
  })
}
