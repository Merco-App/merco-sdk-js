/**
 * Payment service types — /services/payment/*
 */

export interface Payment {
  id: string
  project_id: string
  customer_id?: string | null
  provider_payment_id?: string | null
  amount: number
  currency: string
  status: string
  fee_bps: number
  merco_fee_amount: number
  net_amount: number
  idempotency_key?: string | null
  created_at: string
  updated_at: string
}

export interface CheckoutSessionParams {
  email: string
  price_id: string
  success_url: string
  cancel_url: string
  mode?: "payment" | "subscription"
  idempotency_key?: string
}

export interface CheckoutSessionResult {
  checkout_url: string
  session_id: string
}

export interface AgentBudget {
  max_single_amount?: number | null
  max_daily_amount?: number | null
  max_monthly_amount?: number | null
  requires_approval_above?: number | null
}

export interface AgentWallet {
  wallet_id: string
  currency: string
  available: number
  pending: number
  budget?: AgentBudget | null
}

export interface LedgerEntry {
  id: string
  wallet_id: string
  entry_type: "credit" | "debit"
  amount: number
  currency: string
  counterparty?: string | null
  reference?: string | null
  idempotency_key?: string | null
  created_at: string
}

export interface WalletMoveParams {
  amount: number
  currency?: string
  counterparty?: string
  reference?: string
  idempotency_key: string
}

export interface PayResult {
  status: "completed" | "awaiting_approval"
  ledger_entry_id?: string
  approval_id?: string
  available?: number
}

export interface RefundResult {
  refund_id: string
  amount: number
  status: string
}
