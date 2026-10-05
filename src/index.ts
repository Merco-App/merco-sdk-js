/**
 * Merco SDK for JavaScript/TypeScript
 * Auth service only — /services/auth/*
 *
 * @packageDocumentation
 */

import { DEFAULT_BASE_URL } from "./config"
import type { MercoConfig, RequestAuth } from "./config"
import type {
  RegisterParams,
  LoginParams,
  RefreshParams,
  UserData,
  CheckoutSessionParams,
  AgentBudget,
  WalletMoveParams,
} from "./types"
import * as authService from "./services/auth"
import * as authAdminService from "./services/auth-admin"
import * as paymentsService from "./services/payments"

// Re-export types
export * from "./types"
export * from "./errors"
export { DEFAULT_BASE_URL } from "./config"

/**
 * Merco SDK client. Auth service only — requires project key (pk_* or sk_*).
 */
export class Merco {
  private baseUrl: string
  private projectAuth?: RequestAuth

  constructor(config: MercoConfig) {
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL
    this.projectAuth = { type: "project", projectKey: config.projectKey }
  }

  private getAuth(): RequestAuth {
    return this.projectAuth!
  }

  // --- Auth service (project key) ---

  auth = {
    register: (params: RegisterParams) =>
      authService.register(this.baseUrl, this.getAuth(), params),

    login: (params: LoginParams) =>
      authService.login(this.baseUrl, this.getAuth(), params),

    refresh: (params: RefreshParams) =>
      authService.refresh(this.baseUrl, params),

    logout: (accessToken: string) =>
      authService.logout(this.baseUrl, this.getAuth(), accessToken),

    users: {
      me: (accessToken: string) =>
        authService.getMe(this.baseUrl, this.getAuth(), accessToken),
      updateMe: (accessToken: string, body: Partial<Pick<UserData, "display_name" | "avatar_url">>) =>
        authService.updateMe(this.baseUrl, this.getAuth(), accessToken, body),
    },

    sessions: {
      list: (accessToken: string) =>
        authService.listSessions(this.baseUrl, this.getAuth(), accessToken),
      revoke: (accessToken: string, sessionId: string) =>
        authService.revokeSession(this.baseUrl, this.getAuth(), accessToken, sessionId),
    },
  }

  // --- Auth admin (secret key only) ---

  authAdmin = {
    users: {
      list: (params?: authAdminService.ListUsersParams) =>
        authAdminService.listUsers(this.baseUrl, this.getAuth(), params),
      get: (userId: string) =>
        authAdminService.getUser(this.baseUrl, this.getAuth(), userId),
    },
    roles: {
      list: () => authAdminService.listRoles(this.baseUrl, this.getAuth()),
      create: (body: { name: string; description?: string; permission_ids?: string[] }) =>
        authAdminService.createRole(this.baseUrl, this.getAuth(), body),
    },
  }

  // --- Payments (project key; admin ops need secret key) ---

  payments = {
    checkout: {
      create: (params: CheckoutSessionParams) =>
        paymentsService.createCheckoutSession(this.baseUrl, this.getAuth(), params),
    },
    list: () => paymentsService.listPayments(this.baseUrl, this.getAuth()),
    refund: (params: { payment_id: string; amount?: number }) =>
      paymentsService.refundPayment(this.baseUrl, this.getAuth(), params),
    wallet: {
      get: () => paymentsService.getWallet(this.baseUrl, this.getAuth()),
      setBudget: (params: AgentBudget) =>
        paymentsService.setBudget(this.baseUrl, this.getAuth(), params),
      pay: (params: WalletMoveParams) =>
        paymentsService.pay(this.baseUrl, this.getAuth(), params),
      receive: (params: WalletMoveParams) =>
        paymentsService.receive(this.baseUrl, this.getAuth(), params),
      approve: (approvalId: string) =>
        paymentsService.approvePayment(this.baseUrl, this.getAuth(), approvalId),
      ledger: () => paymentsService.getLedger(this.baseUrl, this.getAuth()),
    },
  }
}
