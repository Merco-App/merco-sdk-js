/**
 * HTTP client for Merco API
 */

import type { AuthContext } from "./config"
import { createMercoError, MercoNetworkError } from "./errors"

export interface RequestConfig {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  body?: unknown
  headers?: Record<string, string>
  auth?: AuthContext
}

function buildHeaders(auth: AuthContext | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (!auth) return headers

  headers["X-Merco-Project-Key"] = auth.projectKey
  if (auth.accessToken) {
    headers["Authorization"] = `Bearer ${auth.accessToken}`
  }
  return headers
}

export async function request<T>(baseUrl: string, config: RequestConfig): Promise<T> {
  const url = baseUrl.replace(/\/$/, "") + (config.path.startsWith("/") ? config.path : "/" + config.path)

  const init: RequestInit = {
    method: config.method,
    headers: { ...buildHeaders(config.auth), ...config.headers },
  }

  if (config.body !== undefined && config.body !== null && config.method !== "GET") {
    init.body = typeof config.body === "string" ? config.body : JSON.stringify(config.body)
  }

  let res: Response
  let text: string

  try {
    res = await fetch(url, init)
    text = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network request failed"
    throw new MercoNetworkError(
      `Unable to connect to Merco API: ${message}. Please check your network connection and try again.`
    )
  }

  let data: unknown
  try {
    data = text ? JSON.parse(text) : undefined
  } catch {
    data = text
  }

  if (!res.ok) {
    throw createMercoError(res.status, res.statusText, data)
  }

  return data as T
}
