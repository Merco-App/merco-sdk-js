/**
 * Auth admin service — users, roles (secret key only)
 */

import { request } from "../client"
import type { AuthContext } from "../config"
import type { ApiResponseEnvelope, UserData, UserProfileData } from "../types"
import { buildPath } from "../utils/path"

const BASE = "/services/auth"

export interface ListUsersParams {
  page?: number
  per_page?: number
}

export interface RoleData {
  id: string
  name: string
  description?: string
}

export async function listUsers(
  baseUrl: string,
  auth: AuthContext,
  params?: ListUsersParams
): Promise<ApiResponseEnvelope<UserProfileData[]>> {
  const path = buildPath(`${BASE}/users`, {
    page: params?.page,
    per_page: params?.per_page,
  })
  return request(baseUrl, { method: "GET", path, auth })
}

export async function getUser(
  baseUrl: string,
  auth: AuthContext,
  userId: string
): Promise<ApiResponseEnvelope<UserData>> {
  return request(baseUrl, { method: "GET", path: `${BASE}/users/${userId}`, auth })
}

export async function listRoles(
  baseUrl: string,
  auth: AuthContext
): Promise<ApiResponseEnvelope<RoleData[]>> {
  return request(baseUrl, { method: "GET", path: `${BASE}/roles`, auth })
}

export async function createRole(
  baseUrl: string,
  auth: AuthContext,
  body: { name: string; description?: string; permission_ids?: string[] }
): Promise<ApiResponseEnvelope<RoleData>> {
  return request(baseUrl, { method: "POST", path: `${BASE}/roles`, body, auth })
}
