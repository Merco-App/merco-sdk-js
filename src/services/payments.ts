/**
 * Payment service — checkout, payments, refunds, and agent wallets.
 * Requires a project key; admin operations require a secret key (sk_*).
 */

import { request } from "../client"
import type { AuthContext } from "../config"
import type { ApiResponseEnvelope } from "../types"
import type {
  AgentBudget,
  AgentWallet,
  CheckoutSessionParams,
  CheckoutSessionResult,
  LedgerEntry,
  PayResult,
  Payment,
  RefundResult,
  WalletMoveParams,
} from "../types"

const BASE = "/services/payment"

export async function createCheckoutSession(
  baseUrl: string,
  auth: AuthContext,
  params: CheckoutSessionParams
): Promise<ApiResponseEnvelope<CheckoutSessionResult>> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/checkout-sessions`,
    body: params,
    auth,
  })
}

export async function listPayments(
  baseUrl: string,
  auth: AuthContext
): Promise<ApiResponseEnvelope<Payment[]>> {
  return request(baseUrl, {
    method: "GET",
    path: `${BASE}/payments`,
    auth,
  })
}

export async function refundPayment(
  baseUrl: string,
  auth: AuthContext,
  params: { payment_id: string; amount?: number }
): Promise<ApiResponseEnvelope<RefundResult>> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/refunds`,
    body: params,
    auth,
  })
}

export async function getWallet(
  baseUrl: string,
  auth: AuthContext
): Promise<ApiResponseEnvelope<AgentWallet>> {
  return request(baseUrl, {
    method: "GET",
    path: `${BASE}/wallet`,
    auth,
  })
}

export async function setBudget(
  baseUrl: string,
  auth: AuthContext,
  params: AgentBudget
): Promise<ApiResponseEnvelope<AgentBudget>> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/wallet/budget`,
    body: params,
    auth,
  })
}

export async function pay(
  baseUrl: string,
  auth: AuthContext,
  params: WalletMoveParams
): Promise<ApiResponseEnvelope<PayResult>> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/wallet/pay`,
    body: params,
    auth,
  })
}

export async function receive(
  baseUrl: string,
  auth: AuthContext,
  params: WalletMoveParams
): Promise<ApiResponseEnvelope<{ ledger_entry_id: string; amount: number; entry_type: string }>> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/wallet/credit`,
    body: params,
    auth,
  })
}

export async function approvePayment(
  baseUrl: string,
  auth: AuthContext,
  approvalId: string
): Promise<ApiResponseEnvelope<{ ledger_entry_id: string; amount: number }>> {
  return request(baseUrl, {
    method: "POST",
    path: `${BASE}/wallet/approvals/${approvalId}/approve`,
    auth,
  })
}

export async function getLedger(
  baseUrl: string,
  auth: AuthContext
): Promise<ApiResponseEnvelope<LedgerEntry[]>> {
  return request(baseUrl, {
    method: "GET",
    path: `${BASE}/wallet/ledger`,
    auth,
  })
}
