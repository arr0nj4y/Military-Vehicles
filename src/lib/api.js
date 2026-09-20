// Mock data service for ArmoredHub.
//
// This mirrors the shape of the original Base44 Vehicle entity API
// (list / get / create / update / delete) but is backed by localStorage so the
// app is fully functional offline inside the APK. To move to a real backend
// later, replace the bodies of these functions with fetch() calls — the rest of
// the app only depends on this module's function signatures.

import { MOCK_VEHICLES } from '../data/mockVehicles.js'

const STORAGE_KEY = 'armoredhub_vehicles_v1'

// Simulate network latency so loading states are exercised like the real app.
const delay = (ms = 220) => new Promise((res) => setTimeout(res, ms))

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt/blocked storage and fall back to seed data
  }
  // First run (or storage unavailable): seed from mock data.
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_VEHICLES))
  } catch {
    /* storage may be blocked in a private window; still return seed */
  }
  return [...MOCK_VEHICLES]
}

function writeStore(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* best effort — in-memory only if storage is blocked */
  }
}

function makeId() {
  return 'v-' + Math.random().toString(36).slice(2, 9)
}

export async function listVehicles() {
  await delay()
  return readStore()
}

export async function getVehicle(id) {
  await delay()
  return readStore().find((v) => v.id === id) || null
}

export async function createVehicle(data) {
  await delay()
  const list = readStore()
  const vehicle = {
    id: makeId(),
    is_active: true,
    created_at: new Date().toISOString(),
    ...data,
  }
  list.push(vehicle)
  writeStore(list)
  return vehicle
}

export async function updateVehicle(id, data) {
  await delay()
  const list = readStore()
  const idx = list.findIndex((v) => v.id === id)
  if (idx === -1) throw new Error('Vehicle not found')
  list[idx] = { ...list[idx], ...data, id }
  writeStore(list)
  return list[idx]
}

export async function deleteVehicle(id) {
  await delay()
  const list = readStore().filter((v) => v.id !== id)
  writeStore(list)
  return true
}

// Reset the catalog back to the seed data (used by the Profile screen).
export async function resetVehicles() {
  await delay(120)
  writeStore([...MOCK_VEHICLES])
  return true
}
