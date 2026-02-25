/**
 * Path and query string utilities
 */

export function buildPath(base: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return base
  const search = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") search.set(k, String(v))
  }
  const qs = search.toString()
  return qs ? `${base}?${qs}` : base
}
