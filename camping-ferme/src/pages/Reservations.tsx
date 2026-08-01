import { useMemo, useState } from 'react'
import { useStore } from '../store/StoreContext'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { STATUTS_RESERVATION, type Reservation, type StatutReservation } from '../types'
import { formatCurrency, formatDate } from '../utils/format'
import { montantTotalReservation, nbNuits } from '../utils/pricing'

const emptyForm: Omit<Reservation, 'id'> = {
  clientId: '',
  emplacementId: '',
  dateArrivee: new Date().toISOString().slice(0, 10),
  dateDepart: new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10),
  nbAdultes: 2,
  nbEnfants: 0,
  nbAnimaux: 0,
  statut: 'en_attente',
  serviceIds: [],
  acompte: 0,
  notes: '',
}

const statutTone: Record<StatutReservation, 'green' | 'orange' | 'gray' | 'red'> = {
  confirmee: 'green',
  en_attente: 'orange',
  terminee: 'gray',
  annulee: 'red',
}

export default function Reservations() {
  const {
    reservations,
    clients,
    emplacements,
    services,
    saisons,
    addReservation,
    updateReservation,
    deleteReservation,
    addClient,
  } = useStore()

  const [editing, setEditing] = useState<Reservation | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [statutFilter, setStatutFilter] = useState<string>('all')
  const [quickClient, setQuickClient] = useState(false)
  const [quickClientForm, setQuickClientForm] = useState({ prenom: '', nom: '', email: '' })

  const openCreate = () => {
    setForm(emptyForm)
    setCreating(true)
  }
  const openEdit = (r: Reservation) => {
    setEditing(r)
    setForm(r)
  }
  const closeModals = () => {
    setCreating(false)
    setEditing(null)
    setQuickClient(false)
  }

  const emplacementChoisi = emplacements.find((e) => e.id === form.emplacementId)
  const nuits = nbNuits(form.dateArrivee, form.dateDepart)
  const montantEstime = useMemo(
    () =>
      montantTotalReservation(
        { ...form, id: 'preview' },
        emplacementChoisi,
        saisons,
        services,
      ),
    [form, emplacementChoisi, saisons, services],
  )

  const conflit = useMemo(() => {
    if (!form.emplacementId) return false
    return reservations.some(
      (r) =>
        r.id !== editing?.id &&
        r.emplacementId === form.emplacementId &&
        r.statut !== 'annulee' &&
        form.dateArrivee < r.dateDepart &&
        form.dateDepart > r.dateArrivee,
    )
  }, [reservations, form, editing])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.clientId) {
      alert('Sélectionnez ou créez un client.')
      return
    }
    if (form.dateDepart <= form.dateArrivee) {
      alert('La date de départ doit être après la date d\'arrivée.')
      return
    }
    if (editing) updateReservation({ ...form, id: editing.id })
    else addReservation(form)
    closeModals()
  }

  const handleQuickClient = () => {
    if (!quickClientForm.prenom || !quickClientForm.nom) return
    const client = addClient({
      ...quickClientForm,
      telephone: '',
      adresse: '',
      notes: '',
    })
    setForm({ ...form, clientId: client.id })
    setQuickClient(false)
    setQuickClientForm({ prenom: '', nom: '', email: '' })
  }

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette réservation ?')) deleteReservation(id)
  }

  const toggleService = (id: string) => {
    setForm((f) => ({
      ...f,
      serviceIds: f.serviceIds.includes(id)
        ? f.serviceIds.filter((s) => s !== id)
        : [...f.serviceIds, id],
    }))
  }

  const filtered = reservations
    .filter((r) => statutFilter === 'all' || r.statut === statutFilter)
    .sort((a, b) => b.dateArrivee.localeCompare(a.dateArrivee))

  const clientNom = (id: string) => {
    const c = clients.find((x) => x.id === id)
    return c ? `${c.prenom} ${c.nom}` : '—'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-forest-900">Réservations</h1>
          <p className="mt-1 text-sm text-forest-600">
            Suivez les séjours, du premier contact au départ.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
        >
          + Nouvelle réservation
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatutFilter('all')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            statutFilter === 'all'
              ? 'bg-forest-800 text-white'
              : 'bg-white text-forest-600 ring-1 ring-forest-200'
          }`}
        >
          Toutes
        </button>
        {STATUTS_RESERVATION.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setStatutFilter(s.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              statutFilter === s.value
                ? 'bg-forest-800 text-white'
                : 'bg-white text-forest-600 ring-1 ring-forest-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-forest-100 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-forest-50 text-forest-700">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Emplacement</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {filtered.map((r) => {
              const emp = emplacements.find((e) => e.id === r.emplacementId)
              return (
                <tr key={r.id} className="hover:bg-forest-50/50">
                  <td className="px-4 py-3 font-medium text-forest-900">
                    {clientNom(r.clientId)}
                  </td>
                  <td className="px-4 py-3 text-forest-600">{emp?.nom ?? '—'}</td>
                  <td className="px-4 py-3 text-forest-600">
                    {formatDate(r.dateArrivee)} → {formatDate(r.dateDepart)}
                  </td>
                  <td className="px-4 py-3 text-forest-600">
                    {formatCurrency(montantTotalReservation(r, emp, saisons, services))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statutTone[r.statut]}>
                      {STATUTS_RESERVATION.find((s) => s.value === r.statut)?.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="rounded-lg border border-forest-200 px-2.5 py-1 text-xs font-medium text-forest-700 hover:bg-forest-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-forest-500">
                  Aucune réservation pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <Modal
          title={editing ? 'Modifier la réservation' : 'Nouvelle réservation'}
          onClose={closeModals}
          wide
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700">Client</label>
              {quickClient ? (
                <div className="mt-1 flex flex-wrap items-end gap-2 rounded-lg bg-forest-50 p-3">
                  <input
                    placeholder="Prénom"
                    value={quickClientForm.prenom}
                    onChange={(e) =>
                      setQuickClientForm({ ...quickClientForm, prenom: e.target.value })
                    }
                    className="w-28 rounded-lg border border-forest-200 px-2 py-1.5 text-sm"
                  />
                  <input
                    placeholder="Nom"
                    value={quickClientForm.nom}
                    onChange={(e) =>
                      setQuickClientForm({ ...quickClientForm, nom: e.target.value })
                    }
                    className="w-28 rounded-lg border border-forest-200 px-2 py-1.5 text-sm"
                  />
                  <input
                    placeholder="E-mail"
                    value={quickClientForm.email}
                    onChange={(e) =>
                      setQuickClientForm({ ...quickClientForm, email: e.target.value })
                    }
                    className="w-40 rounded-lg border border-forest-200 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleQuickClient}
                    className="rounded-lg bg-forest-800 px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickClient(false)}
                    className="text-xs text-forest-500"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex gap-2">
                  <select
                    required
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                  >
                    <option value="">Sélectionner un client…</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.prenom} {c.nom}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setQuickClient(true)}
                    className="whitespace-nowrap rounded-lg border border-forest-200 px-3 py-2 text-sm text-forest-700 hover:bg-forest-50"
                  >
                    + Nouveau
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700">Emplacement</label>
              <select
                required
                value={form.emplacementId}
                onChange={(e) => setForm({ ...form, emplacementId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              >
                <option value="">Sélectionner un emplacement…</option>
                {emplacements.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nom} ({e.capacite} pers.)
                  </option>
                ))}
              </select>
              {conflit && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  ⚠️ Cet emplacement est déjà réservé sur une partie de ces dates.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">Arrivée</label>
                <input
                  type="date"
                  required
                  value={form.dateArrivee}
                  onChange={(e) => setForm({ ...form, dateArrivee: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Départ</label>
                <input
                  type="date"
                  required
                  value={form.dateDepart}
                  onChange={(e) => setForm({ ...form, dateDepart: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">Adultes</label>
                <input
                  type="number"
                  min={1}
                  value={form.nbAdultes}
                  onChange={(e) => setForm({ ...form, nbAdultes: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Enfants</label>
                <input
                  type="number"
                  min={0}
                  value={form.nbEnfants}
                  onChange={(e) => setForm({ ...form, nbEnfants: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Animaux</label>
                <input
                  type="number"
                  min={0}
                  value={form.nbAnimaux}
                  onChange={(e) => setForm({ ...form, nbAnimaux: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-forest-700">
                Activités & services
              </label>
              <div className="mt-1 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {services.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center gap-2 rounded-lg border border-forest-100 px-2.5 py-1.5 text-sm text-forest-700"
                  >
                    <input
                      type="checkbox"
                      checked={form.serviceIds.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                      className="h-4 w-4 rounded border-forest-300 text-forest-700"
                    />
                    {s.nom}{' '}
                    <span className="ml-auto text-xs text-forest-400">
                      {formatCurrency(s.prix)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) =>
                    setForm({ ...form, statut: e.target.value as StatutReservation })
                  }
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                >
                  {STATUTS_RESERVATION.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Acompte (€)</label>
                <input
                  type="number"
                  min={0}
                  value={form.acompte}
                  onChange={(e) => setForm({ ...form, acompte: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
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

            <div className="rounded-xl bg-sunflower-50 p-4 text-sm text-sunflower-900">
              <div className="flex justify-between">
                <span>{nuits} nuit(s)</span>
                <span className="font-semibold">{formatCurrency(montantEstime)}</span>
              </div>
              {form.acompte > 0 && (
                <div className="mt-1 flex justify-between text-xs text-sunflower-700">
                  <span>Reste dû après acompte</span>
                  <span>{formatCurrency(Math.max(montantEstime - form.acompte, 0))}</span>
                </div>
              )}
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
                {editing ? 'Enregistrer' : 'Créer la réservation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
