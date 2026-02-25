/**
 * Shared types
 */

export interface ApiResponseEnvelope<T> {
  data?: T
  meta?: ResponseMeta
}

export interface ResponseMeta {
  page?: number
  per_page?: number
  total?: number
}

export interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
  }
}

export * from "./auth"
export * from "./users"
