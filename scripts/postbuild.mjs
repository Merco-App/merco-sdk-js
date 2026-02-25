#!/usr/bin/env node
/**
 * Post-build: ensure dist/esm is treated as ESM by Node
 */
import { writeFileSync, mkdirSync, existsSync } from "fs"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const esmDir = join(__dirname, "..", "dist", "esm")
const pkgPath = join(esmDir, "package.json")

if (existsSync(esmDir)) {
  mkdirSync(esmDir, { recursive: true })
  writeFileSync(pkgPath, JSON.stringify({ type: "module" }, null, 2))
}
