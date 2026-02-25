/**
 * Merco SDK error types and error handling
 *
 * API error shapes supported:
 * - { success: false, error: string, message: string }  (error = code)
 * - { error: { code?: string, message?: string } }
 */

/** Parsed API error payload */
export interface MercoErrorBody {
  /** Machine-readable error code from API */
  code?: string
  /** Human-readable message from API */
  message: string
  /** Raw response body for debugging */
  raw?: unknown
}

/** Extract message and code from various API error shapes */
export function parseErrorBody(body: unknown): MercoErrorBody {
  if (body == null) {
    return { message: "An unexpected error occurred" }
  }

  const obj = body as Record<string, unknown>

  // Shape: { success: false, error: string, message: string }
  if (typeof obj.error === "string" && typeof obj.message === "string") {
    return {
      code: obj.error,
      message: obj.message,
      raw: body,
    }
  }

  // Shape: { error: { code?: string, message?: string } }
  const nested = obj.error as Record<string, unknown> | undefined
  if (nested && typeof nested === "object") {
    const msg = typeof nested.message === "string" ? nested.message : undefined
    const code = typeof nested.code === "string" ? nested.code : undefined
    if (msg || code) {
      return {
        code,
        message: msg ?? (code ? `Error: ${code}` : "An error occurred"),
        raw: body,
      }
  }
  }

  // Shape: { message: string }
  if (typeof obj.message === "string") {
    return {
      code: typeof obj.code === "string" ? obj.code : undefined,
      message: obj.message,
      raw: body,
    }
  }

  return {
    message: typeof obj === "string" ? obj : "An unexpected error occurred",
    raw: body,
  }
}

/** Human-readable messages for common HTTP status codes */
const STATUS_MESSAGES: Record<number, string> = {
  400: "Invalid request. Please check your input and try again.",
  401: "Authentication failed. Please check your credentials or sign in again.",
  403: "Access denied. You don't have permission to perform this action.",
  404: "The requested resource was not found.",
  409: "A conflict occurred. The resource may already exist.",
  422: "The request was well-formed but could not be processed due to validation errors.",
  429: "Too many requests. Please wait a moment before trying again.",
  500: "A server error occurred. Please try again later.",
  502: "The server is temporarily unavailable. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
}

function getStatusMessage(status: number, apiMessage: string): string {
  const fallback = STATUS_MESSAGES[status] ?? `Request failed with status ${status}`
  return apiMessage || fallback
}

/**
 * Base error for all Merco SDK errors.
 * Use `isMercoError(err)` to check if an error is from the SDK.
 */
export class MercoError extends Error {
  /** HTTP status code (0 if network error) */
  readonly status: number
  /** HTTP status text */
  readonly statusText: string
  /** Parsed API error body */
  readonly body: MercoErrorBody
  /** Raw response body */
  readonly rawBody: unknown

  constructor(
    message: string,
    status = 0,
    statusText = "",
    rawBody?: unknown
  ) {
    const body = parseErrorBody(rawBody)
    const displayMessage = message || body.message || getStatusMessage(status, body.message)
    super(displayMessage)
    this.name = "MercoError"
    this.status = status
    this.statusText = statusText
    this.body = body
    this.rawBody = rawBody
    Object.setPrototypeOf(this, MercoError.prototype)
  }

  /** API error code (e.g. invalid_credentials, user_exists) */
  get code(): string | undefined {
    return this.body.code
  }

  /** Whether this is an authentication error (401) */
  get isAuthError(): boolean {
    return this.status === 401
  }

  /** Whether this is a permission error (403) */
  get isForbidden(): boolean {
    return this.status === 403
  }

  /** Whether this is a validation/client error (4xx) */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  /** Whether this is a server error (5xx) */
  get isServerError(): boolean {
    return this.status >= 500
  }

  /** Whether this is a network error (no response) */
  get isNetworkError(): boolean {
    return this.status === 0
  }

  /** String representation for logging */
  toString(): string {
    const parts = [`MercoError: ${this.message}`]
    if (this.status) parts.push(`status=${this.status}`)
    if (this.body.code) parts.push(`code=${this.body.code}`)
    return parts.join(" ")
  }
}

/** Authentication failed (401) — invalid credentials, expired token, etc. */
export class MercoAuthError extends MercoError {
  constructor(message: string, rawBody?: unknown) {
    super(message, 401, "Unauthorized", rawBody)
    this.name = "MercoAuthError"
    Object.setPrototypeOf(this, MercoAuthError.prototype)
  }
}

/** Access denied (403) — insufficient permissions */
export class MercoForbiddenError extends MercoError {
  constructor(message: string, rawBody?: unknown) {
    super(message, 403, "Forbidden", rawBody)
    this.name = "MercoForbiddenError"
    Object.setPrototypeOf(this, MercoForbiddenError.prototype)
  }
}

/** Resource not found (404) */
export class MercoNotFoundError extends MercoError {
  constructor(message: string, rawBody?: unknown) {
    super(message, 404, "Not Found", rawBody)
    this.name = "MercoNotFoundError"
    Object.setPrototypeOf(this, MercoNotFoundError.prototype)
  }
}

/** Invalid input or validation failed (400, 422) */
export class MercoValidationError extends MercoError {
  constructor(message: string, status = 400, rawBody?: unknown) {
    super(message, status, status === 422 ? "Unprocessable Entity" : "Bad Request", rawBody)
    this.name = "MercoValidationError"
    Object.setPrototypeOf(this, MercoValidationError.prototype)
  }
}

/** Rate limit exceeded (429) */
export class MercoRateLimitError extends MercoError {
  constructor(message: string, rawBody?: unknown) {
    super(message, 429, "Too Many Requests", rawBody)
    this.name = "MercoRateLimitError"
    Object.setPrototypeOf(this, MercoRateLimitError.prototype)
  }
}

/** Server error (5xx) */
export class MercoServerError extends MercoError {
  constructor(message: string, status: number, rawBody?: unknown) {
    super(message, status, "Server Error", rawBody)
    this.name = "MercoServerError"
    Object.setPrototypeOf(this, MercoServerError.prototype)
  }
}

/** Network error — request failed before receiving a response */
export class MercoNetworkError extends MercoError {
  constructor(message: string) {
    super(message, 0, "", undefined)
    this.name = "MercoNetworkError"
    Object.setPrototypeOf(this, MercoNetworkError.prototype)
  }
}

/**
 * Create the appropriate MercoError subclass from an HTTP response.
 */
export function createMercoError(
  status: number,
  statusText: string,
  rawBody?: unknown
): MercoError {
  const body = parseErrorBody(rawBody)
  const message = getStatusMessage(status, body.message)

  switch (status) {
    case 401:
      return new MercoAuthError(message, rawBody)
    case 403:
      return new MercoForbiddenError(message, rawBody)
    case 404:
      return new MercoNotFoundError(message, rawBody)
    case 400:
    case 422:
      return new MercoValidationError(message, status, rawBody)
    case 429:
      return new MercoRateLimitError(message, rawBody)
    default:
      if (status >= 500) {
        return new MercoServerError(message, status, rawBody)
      }
      return new MercoError(message, status, statusText, rawBody)
  }
}

/**
 * Type guard: check if an error is a Merco SDK error.
 */
export function isMercoError(err: unknown): err is MercoError {
  return err instanceof MercoError
}

/**
 * Safely extract a user-friendly message from any error.
 */
export function getErrorMessage(err: unknown, fallback = "An unexpected error occurred"): string {
  if (err instanceof MercoError) return err.message
  if (err instanceof Error) return err.message
  if (typeof err === "string") return err
  return fallback
}
