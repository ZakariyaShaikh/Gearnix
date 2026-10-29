import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAddress, deleteAddress, listAddresses, updateAddress } from '@/api/customer.api'

const emptyAddress = {
  label: '', full_name: '', phone: '', line1: '', line2: '', city: '', state: '',
  postal_code: '', country_code: 'IN', is_default: false,
}

function AddressForm({ initial, saving, onCancel, onSave }) {
  const [values, setValues] = useState({ ...emptyAddress, ...(initial || {}) })
  const [errors, setErrors] = useState({})
  const set = (key, value) => setValues((current) => ({ ...current, [key]: value }))

  function submit(event) {
    event.preventDefault()
    const next = {}
    if (values.full_name.trim().length < 2) next.full_name = 'Enter the recipient’s full name.'
    if (!/^(?:\+91\s?)?[6-9]\d{9}$/.test(values.phone.replace(/[\s-]/g, ''))) next.phone = 'Enter a valid 10-digit Indian mobile number.'
    if (values.line1.trim().length < 3) next.line1 = 'Enter at least 3 characters.'
    if (values.city.trim().length < 2) next.city = 'Enter a city.'
    if (values.state.trim().length < 2) next.state = 'Enter a state.'
    if (!/^\d{6}$/.test(values.postal_code.trim())) next.postal_code = 'Enter a 6-digit PIN code.'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...values, phone: values.phone.replace(/\s|-/g, '').replace(/^\+91/, '') })
  }

  const fields = [
    ['full_name', 'Full name', 'Asha Rao', 'text'],
    ['phone', 'Mobile number', '9876543210', 'tel'],
    ['line1', 'Address line 1', 'House / building and street', 'text'],
    ['line2', 'Address line 2 (optional)', 'Apartment, landmark', 'text'],
    ['city', 'City', 'Bengaluru', 'text'],
    ['state', 'State', 'Karnataka', 'text'],
    ['postal_code', 'Postal code', '560001', 'text'],
    ['label', 'Address label (optional)', 'Home, Work', 'text'],
  ]

  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-xl border border-white/10 bg-black/20 p-4 sm:p-6">
      <h2 className="font-primary text-xl font-bold">{initial ? 'Edit address' : 'Add an address'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([key, label, placeholder, type]) => (
          <div key={key} className={`space-y-2 ${key === 'line1' || key === 'line2' ? 'sm:col-span-2' : ''}`}>
            <Label htmlFor={`address-${key}`}>{label}</Label>
            <Input id={`address-${key}`} type={type} autoComplete={key === 'full_name' ? 'name' : key === 'phone' ? 'tel' : undefined} value={values[key] || ''} placeholder={placeholder} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `address-${key}-error` : undefined} className="min-h-11 bg-white text-zinc-900" />
            {errors[key] && <p id={`address-${key}-error`} className="text-sm text-red-300">{errors[key]}</p>}
          </div>
        ))}
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={Boolean(values.is_default)} onChange={(event) => set('is_default', event.target.checked)} className="size-4 accent-fuchsia-600" />Set as my default address</label>
      <div className="flex flex-wrap gap-3"><Button type="submit" disabled={saving} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">{saving ? 'Saving…' : 'Save address'}</Button><Button type="button" variant="outline" onClick={onCancel} className="min-h-11 border-white/20 text-white hover:bg-white/10">Cancel</Button></div>
    </form>
  )
}

export function AddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    listAddresses().then((data) => { if (active) setAddresses(data) }).catch((requestError) => { if (active) setError(requestError.message || 'Unable to load addresses.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function saveAddress(values) {
    setSaving(true); setError(''); setNotice('')
    try {
      const saved = editing?.address_id ? await updateAddress(editing.address_id, values) : await createAddress(values)
      setAddresses((current) => {
        const updated = editing?.address_id ? current.map((item) => item.address_id === editing.address_id ? { ...item, ...saved, ...values } : item) : [...current, { ...saved, ...values }]
        if (values.is_default) return updated.map((item) => ({ ...item, is_default: item.address_id === (saved.address_id || editing?.address_id) ? 1 : 0 }))
        return updated
      })
      setEditing(null); setNotice(editing?.address_id ? 'Address updated.' : 'Address saved.')
    } catch (requestError) {
      setError(requestError.message || 'Unable to save this address.')
    } finally { setSaving(false) }
  }

  async function makeDefault(address) {
    setError(''); setNotice('')
    try {
      await updateAddress(address.address_id, { is_default: true })
      setAddresses((current) => current.map((item) => ({ ...item, is_default: item.address_id === address.address_id ? 1 : 0 })))
      setNotice('Default address updated.')
    } catch (requestError) { setError(requestError.message || 'Unable to set the default address.') }
  }

  async function confirmDelete(address) {
    setError(''); setNotice('')
    try {
      const result = await deleteAddress(address.address_id)
      setAddresses((current) => current.filter((item) => item.address_id !== address.address_id).map((item) => ({
        ...item,
        is_default: result?.new_default_address_id
          ? Number(item.address_id) === Number(result.new_default_address_id) ? 1 : 0
          : item.is_default,
      })))
      setDeletingId(null); setNotice('Address removed.')
    } catch (requestError) { setError(requestError.message || 'Unable to remove this address.') }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-accent-pink">Your account</p><h1 className="mt-2 font-primary text-3xl font-bold">Saved addresses</h1><p className="mt-2 text-brand-text-muted">Use an Indian address with a 10-digit mobile number and 6-digit PIN.</p></div><Link to="/profile" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-accent-pink hover:underline">Back to profile</Link></header>
      {error && <p role="alert" className="rounded-lg border border-red-400/40 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-400/30 bg-emerald-950/20 p-3 text-sm text-emerald-200">{notice}</p>}
      {editing && <AddressForm key={editing.address_id || 'new'} initial={editing.address_id ? editing : null} saving={saving} onCancel={() => setEditing(null)} onSave={saveAddress} />}
      {loading ? <p role="status" className="py-10 text-center text-brand-text-muted">Loading addresses…</p> : addresses.length === 0 && !editing ? <div className="rounded-xl border border-white/10 bg-brand-black p-8 text-center"><p className="text-brand-text-muted">No saved addresses yet.</p></div> : null}
      {!loading && addresses.length > 0 && <div className="grid gap-4 md:grid-cols-2">{addresses.map((address) => {
        const isDefault = Boolean(Number(address.is_default))
        return <article key={address.address_id} className="space-y-4 rounded-xl border border-brand-border-subtle bg-brand-black p-5">
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{address.full_name}</h2>{address.label && <p className="mt-1 text-xs uppercase tracking-wide text-brand-text-muted">{address.label}</p>}</div>{isDefault && <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Default</span>}</div>
          <address className="not-italic text-sm leading-6 text-brand-text-muted">{address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />{address.city}, {address.state} {address.postal_code}<br />India<br />{address.phone}</address>
          <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3"><Button type="button" variant="outline" onClick={() => setEditing(address)} className="min-h-10 border-white/20 text-white hover:bg-white/10">Edit</Button>{!isDefault && <Button type="button" variant="outline" onClick={() => makeDefault(address)} className="min-h-10 border-white/20 text-white hover:bg-white/10">Set as default</Button>}{deletingId === address.address_id ? <><Button type="button" variant="destructive" onClick={() => confirmDelete(address)} className="min-h-10">Confirm delete</Button><Button type="button" variant="outline" onClick={() => setDeletingId(null)} className="min-h-10 border-white/20 text-white">Keep</Button></> : <Button type="button" variant="outline" aria-label={`Delete ${address.label || 'saved'} address`} onClick={() => setDeletingId(address.address_id)} className="min-h-10 border-red-400/40 text-red-200 hover:bg-red-950/30">Delete</Button>}</div>
        </article>
      })}</div>}
      {!loading && !editing && <Button type="button" onClick={() => setEditing(emptyAddress)} className="min-h-11 bg-brand-accent-pink text-white hover:bg-brand-accent-magenta">Add address</Button>}
    </section>
  )
}
