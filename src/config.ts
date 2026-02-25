/**
 * Merco SDK configuration
 */

export const DEFAULT_BASE_URL = "https://api.merco.app"

export interface MercoConfig {
  /** Project key (pk_* or sk_*) for auth service */
  projectKey: string
  /** Base URL of Merco API */
  baseUrl?: string
}

export interface RequestAuth {
  type: "project"
  projectKey: string
  accessToken?: string
}

export type AuthContext = RequestAuth
