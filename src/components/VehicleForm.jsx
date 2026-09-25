import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES, ERAS } from '../data/options.js'

const EMPTY = {
  name: '',
  category: CATEGORIES[0],
  country: '',
  era: ERAS[ERAS.length - 1],
  image_url: '',
  top_speed: '',
  range: '',
  crew: '',
  weight: '',
  armament: '',
  description: '',
  admin_note: '',
}

// Slide-up sheet used for both "Add Vehicle" and "Edit Vehicle".
export default function VehicleForm({ open, initial, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const isEdit = Boolean(initial && initial.id)

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, ...(initial || {}) })
      setSaving(false)
      setError('')
    }
  }, [open, initial])

  if (!open) return null

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    setError('')
    try {
      await onSubmit(form)
    } catch {
      setError("Couldn't save. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, children }) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-neutral-600">
        {label}
      </span>
      {children}
    </label>
  )

  const inputCls =
    'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-400 focus:bg-white'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div
        className="absolute inset-0"
        onClick={saving ? undefined : onClose}
        aria-hidden
      />
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col rounded-t-3xl bg-[#f8faf8]">
        <div className="flex items-center justify-between border-b border-[#e5e9e5] px-5 py-4">
          <h2 className="text-base font-bold text-neutral-900">
            {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4"
        >
          <Field label="Name">
            <input
              className={inputCls}
              placeholder="e.g. M1 Abrams"
              value={form.name}
              onChange={set('name')}
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                className={inputCls}
                value={form.category}
                onChange={set('category')}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Era">
              <select
                className={inputCls}
                value={form.era}
                onChange={set('era')}
              >
                {ERAS.map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Country">
            <input
              className={inputCls}
              placeholder="USA"
              value={form.country}
              onChange={set('country')}
            />
          </Field>

          <Field label="Image URL">
            <input
              className={inputCls}
              placeholder="https://..."
              value={form.image_url}
              onChange={set('image_url')}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Top Speed">
              <input
                className={inputCls}
                placeholder="67 km/h"
                value={form.top_speed}
                onChange={set('top_speed')}
              />
            </Field>
            <Field label="Range">
              <input
                className={inputCls}
                placeholder="426 km"
                value={form.range}
                onChange={set('range')}
              />
            </Field>
            <Field label="Crew">
              <input
                className={inputCls}
                placeholder="4"
                value={form.crew}
                onChange={set('crew')}
              />
            </Field>
            <Field label="Weight">
              <input
                className={inputCls}
                placeholder="62 tons"
                value={form.weight}
                onChange={set('weight')}
              />
            </Field>
          </div>

          <Field label="Armament">
            <input
              className={inputCls}
              placeholder="120mm smoothbore gun..."
              value={form.armament}
              onChange={set('armament')}
            />
          </Field>

          <Field label="Description">
            <textarea
              className={`${inputCls} min-h-[80px] resize-none`}
              placeholder="Brief overview..."
              value={form.description}
              onChange={set('description')}
            />
          </Field>

          <Field label="Admin Note">
            <input
              className={inputCls}
              placeholder="Internal note (admin only)"
              value={form.admin_note}
              onChange={set('admin_note')}
            />
          </Field>
        </form>

        <div className="border-t border-neutral-100 px-5 py-4 safe-bottom">
          {error && (
            <p className="mb-2 text-center text-xs font-semibold text-red-600">{error}</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
