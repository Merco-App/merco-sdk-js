# Merco SDK for JavaScript/TypeScript

Official SDK for the [Merco Auth Service](https://merco.app) — `/services/auth/*`. Works in **browser** and **Node.js** with full TypeScript support.

## Install

```bash
npm install @merco/sdk
```

## Quick Start

```typescript
import { Merco } from "@merco/sdk"

const merco = new Merco({ projectKey: "pk_your_project_key" })

// Register
const { user, tokens } = await merco.auth.register({
  email: "user@example.com",
  password: "SecurePass123!",
})

// Login
const { user, tokens } = await merco.auth.login({
  email: "user@example.com",
  password: "SecurePass123!",
})

// Get current user (with access token)
const { data } = await merco.auth.users.me(tokens!.access_token)
```

## Auth Service API

| Method | Description |
|--------|-------------|
| `auth.register(params)` | Register user |
| `auth.login(params)` | Login |
| `auth.refresh(params)` | Refresh access token |
| `auth.logout(accessToken)` | Logout |
| `auth.users.me(accessToken)` | Get current user |
| `auth.users.updateMe(accessToken, body)` | Update current user |
| `auth.sessions.list(accessToken)` | List sessions |
| `auth.sessions.revoke(accessToken, sessionId)` | Revoke session |

## Auth Admin (secret key only)

| Method | Description |
|--------|-------------|
| `authAdmin.users.list(params?)` | List users |
| `authAdmin.users.get(userId)` | Get user |
| `authAdmin.roles.list()` | List roles |
| `authAdmin.roles.create(body)` | Create role |

## Error Handling

The SDK throws typed errors with clear messages and API error codes:

```typescript
import { Merco, isMercoError, getErrorMessage, MercoAuthError, MercoValidationError } from "@merco/sdk"

try {
  await merco.auth.login({ email, password })
} catch (err) {
  if (isMercoError(err)) {
    console.error(err.message)           // Human-readable message
    console.error(err.code)             // API code (e.g. invalid_credentials)
    console.error(err.status)           // HTTP status (401, 403, etc.)
    console.error(err.body.raw)         // Raw API response

    if (err.isAuthError) {
      // 401: redirect to login
    } else if (err instanceof MercoValidationError) {
      // 400/422: show field errors
    }
  }
  // Safe fallback for any error
  showToast(getErrorMessage(err))
}
```

**Error types:** `MercoError`, `MercoAuthError` (401), `MercoForbiddenError` (403), `MercoNotFoundError` (404), `MercoValidationError` (400/422), `MercoRateLimitError` (429), `MercoServerError` (5xx), `MercoNetworkError` (no response)

## Custom Base URL

```typescript
const merco = new Merco({
  projectKey: "pk_xxx",
  baseUrl: "https://api.staging.merco.app",
})
```

## License

MIT
