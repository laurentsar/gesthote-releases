import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import Modal from '../components/Modal'
import type { Client } from '../types'
import { formatDateShort } from '../utils/format'

const emptyForm: Omit<Client, 'id'> = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  adresse: '',
  notes: '',
}

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient, reservations, emplacements } =
    useStore()
  const [editing, setEditing] = useState<Client | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Client | null>(null)

  const openCreate = () => {
    setForm(emptyForm)
    setCreating(true)
  }
  const openEdit = (c: Client) => {
    setEditing(c)
    setForm(c)
  }
  const closeModals = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateClient({ ...form, id: editing.id })
    else addClient(form)
    closeModals()
  }

  const handleDelete = (id: string) => {
    const enUsage = reservations.some((r) => r.clientId === id)
    if (enUsage) {
      alert('Impossible de supprimer : ce client a des réservations associées.')
      return
    }
    if (confirm('Supprimer ce client ?')) deleteClient(id)
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return (
      `${c.prenom} ${c.nom}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    )
  })

  const reservationsDe = (clientId: string) =>
    reservations
      .filter((r) => r.clientId === clientId)
      .sort((a, b) => b.dateArrivee.localeCompare(a.dateArrivee))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-forest-900">Clients</h1>
          <p className="mt-1 text-sm text-forest-600">Carnet d'adresses des vacanciers.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
        >
          + Nouveau client
        </button>
      </div>

      <input
        placeholder="Rechercher par nom ou e-mail…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
      />

      <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-forest-700">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Contact</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Séjours</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-forest-50/50">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setDetail(c)}
                    className="font-medium text-forest-900 hover:underline"
                  >
                    {c.prenom} {c.nom}
                  </button>
                </td>
                <td className="hidden px-4 py-3 text-forest-600 sm:table-cell">
                  {c.email}
                  <br />
                  {c.telephone}
                </td>
                <td className="hidden px-4 py-3 text-forest-600 md:table-cell">
                  {reservationsDe(c.id).length}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="rounded-lg border border-forest-200 px-2.5 py-1 text-xs font-medium text-forest-700 hover:bg-forest-50"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-forest-500">
                  Aucun client trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <Modal title={editing ? 'Modifier le client' : 'Nouveau client'} onClose={closeModals}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">Prénom</label>
                <input
                  required
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Nom</label>
                <input
                  required
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700">Téléphone</label>
              <input
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700">Adresse</label>
              <input
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeModals}
                className="rounded-lg px-4 py-2 text-sm font-medium text-forest-600 hover:bg-forest-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="rounded-lg bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
              >
                {editing ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal title={`${detail.prenom} ${detail.nom}`} onClose={() => setDetail(null)}>
          <div className="space-y-3 text-sm">
            <p className="text-forest-600">
              {detail.email || '—'} · {detail.telephone || '—'}
            </p>
            {detail.adresse && <p className="text-forest-600">{detail.adresse}</p>}
            {detail.notes && (
              <p className="rounded-lg bg-sunflower-50 p-2 text-sunflower-900">{detail.notes}</p>
            )}
            <div>
              <h3 className="mb-2 font-medium text-forest-900">Historique des séjours</h3>
              {reservationsDe(detail.id).length === 0 ? (
                <p className="text-forest-500">Aucun séjour enregistré.</p>
              ) : (
                <ul className="space-y-2">
                  {reservationsDe(detail.id).map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between rounded-lg bg-forest-50 px-3 py-2"
                    >
                      <span>
                        {emplacements.find((e) => e.id === r.emplacementId)?.nom}
                      </span>
                      <span className="text-forest-500">
                        {formatDateShort(r.dateArrivee)} → {formatDateShort(r.dateDepart)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
