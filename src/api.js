// Everything that talks to the backend lives here, so the screens never
// build URLs or parse errors themselves.
//
// The backend address comes from VITE_API_URL in a .env file (see .env.example).
// If it isn't set, we use the address the backend README gives.
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

// Turns FastAPI's error bodies into one readable sentence.
// 404: {"detail": "Book 99999 not found"}
// 422: {"detail": [{"loc": [...], "msg": "..."}, ...]}
function errorMessage(status, body) {
  const detail = body?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join('; ')
  return `Request failed (HTTP ${status})`
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error(`Can't reach the backend at ${API_URL}. Is it running?`)
  }
  if (response.status === 204) return null
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(errorMessage(response.status, body))
  return body
}

// GET /books — returns { total, limit, offset, items }.
// Empty filters are left out so the backend uses its defaults.
export function listBooks(params = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== '' && value !== null && value !== undefined) query.set(key, value)
  }
  return request(`/books?${query}`)
}

// GET /books/{id}
export function getBook(id) {
  return request(`/books/${id}`)
}
