/**
 * Example: Auth service (Node.js)
 * Run: node examples/node-auth.mjs
 */
import { Merco } from "../dist/esm/index.js"

const merco = new Merco({ projectKey: process.env.MERCO_PROJECT_KEY || "pk_xxx" })

async function main() {
  const res = await merco.auth.register({
    email: "user@example.com",
    password: "SecurePass123!",
  })
  console.log("User:", res.user?.id)
  if (res.tokens?.access_token) {
    const { data } = await merco.auth.users.me(res.tokens.access_token)
    console.log("Me:", data?.email)
  }
}

main().catch(console.error)
