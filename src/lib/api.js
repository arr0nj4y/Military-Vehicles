// Data service for ArmoredHub, backed by the live PHP REST API
// (server/military_vehicles.php on Freehostia, MySQL table military_vehicles).
//
// The rest of the app only depends on these function signatures
// (list / get / create / update / delete).

const API_URL =
  import.meta.env.VITE_API_URL || 'http://bunsdomain.duckdns.org/military_vehicles'

// The API uses numeric ids; the app (routes, saved list) treats ids as strings.
const normalize = (v) => ({ ...v, id: String(v.id) })

async function request(path = '', options = {}) {
  // Only send the JSON header with a body; plain GETs then skip the CORS preflight.
  const headers = options.body ? { 'Content-Type': 'application/json' } : {}
  const res = await fetch(API_URL + path, { ...options, headers })
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(body?.status_message || `Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return body
}

export async function listVehicles() {
  const list = await request()
  return list.map(normalize)
}

export async function getVehicle(id) {
  try {
    return normalize(await request('/' + encodeURIComponent(id)))
  } catch (err) {
    if (err.status === 404) return null
    throw err
  }
}

export async function createVehicle(data) {
  const { id } = await request('', { method: 'POST', body: JSON.stringify(data) })
  return getVehicle(id)
}

export async function updateVehicle(id, data) {
  // PUT replaces every column, so merge onto the current record first.
  const current = await getVehicle(id)
  if (!current) throw new Error('Vehicle not found')
  const { id: _id, created_at: _created, ...fields } = { ...current, ...data }
  await request('/' + encodeURIComponent(id), {
    method: 'PUT',
    body: JSON.stringify(fields),
  })
  return getVehicle(id)
}

export async function deleteVehicle(id) {
  await request('/' + encodeURIComponent(id), { method: 'DELETE' })
  return true
}
