import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { TYPES_EMPLACEMENT, type Emplacement, type StatutEmplacement } from '../types'

const emptyForm: Omit<Emplacement, 'id'> = {
  nom: '',
  type: 'tente',
  capacite: 4,
  surface: 80,
  electricite: true,
  eau: true,
  ombrage: false,
  animauxAcceptes: true,
  statut: 'disponible',
  description: '',
}

const statutTone: Record<StatutEmplacement, 'green' | 'red' | 'orange'> = {
  disponible: 'green',
  occupe: 'red',
  maintenance: 'orange',
}

const statutLabel: Record<StatutEmplacement, string> = {
  disponible: 'Disponible',
  occupe: 'Occupé',
  maintenance: 'En maintenance',
}

export default function Emplacements() {
  const { emplacements, addEmplacement, updateEmplacement, deleteEmplacement, reservations } =
    useStore()
  const [editing, setEditing] = useState<Emplacement | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filterType, setFilterType] = useState<string>('all')

  const openCreate = () => {
    setForm(emptyForm)
    setCreating(true)
  }

  const openEdit = (e: Emplacement) => {
    setEditing(e)
    setForm(e)
  }

  const closeModals = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateEmplacement({ ...form, id: editing.id })
    } else {
      addEmplacement(form)
    }
    closeModals()
  }

  const handleDelete = (id: string) => {
    const enUsage = reservations.some((r) => r.emplacementId === id)
    if (enUsage) {
      alert('Impossible de supprimer : cet emplacement a des réservations associées.')
      return
    }
    if (confirm('Supprimer cet emplacement ?')) deleteEmplacement(id)
  }

  const filtered = emplacements.filter(
    (e) => filterType === 'all' || e.type === filterType,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-forest-900">Emplacements</h1>
          <p className="mt-1 text-sm text-forest-600">
            Le parc de tentes, caravanes, cabanes et mobil-homes de la ferme.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
        >
          + Nouvel emplacement
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            filterType === 'all'
              ? 'bg-forest-800 text-white'
              : 'bg-white text-forest-600 ring-1 ring-forest-200'
          }`}
        >
          Tous
        </button>
        {TYPES_EMPLACEMENT.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFilterType(t.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filterType === t.value
                ? 'bg-forest-800 text-white'
                : 'bg-white text-forest-600 ring-1 ring-forest-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <div
            key={e.id}
            className="flex flex-col justify-between rounded-2xl border border-forest-100 bg-white p-5 shadow-sm"
          >
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-forest-900">{e.nom}</h3>
                <Badge tone={statutTone[e.statut]}>{statutLabel[e.statut]}</Badge>
              </div>
              <p className="text-xs uppercase tracking-wide text-sunflower-700">
                {TYPES_EMPLACEMENT.find((t) => t.value === e.type)?.label}
              </p>
              <p className="mt-2 text-sm text-forest-600">{e.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-forest-500">
                <span className="rounded-full bg-forest-50 px-2 py-1">
                  👥 {e.capacite} pers.
                </span>
                <span className="rounded-full bg-forest-50 px-2 py-1">
                  📐 {e.surface} m²
                </span>
                {e.electricite && (
                  <span className="rounded-full bg-forest-50 px-2 py-1">⚡ Électricité</span>
                )}
                {e.eau && <span className="rounded-full bg-forest-50 px-2 py-1">💧 Eau</span>}
                {e.ombrage && (
                  <span className="rounded-full bg-forest-50 px-2 py-1">🌳 Ombragé</span>
                )}
                {e.animauxAcceptes && (
                  <span className="rounded-full bg-forest-50 px-2 py-1">🐾 Animaux OK</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(e)}
                className="flex-1 rounded-lg border border-forest-200 px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-50"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(e.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-forest-500">
            Aucun emplacement pour ce filtre.
          </p>
        )}
      </div>

      {(creating || editing) && (
        <Modal
          title={editing ? "Modifier l'emplacement" : 'Nouvel emplacement'}
          onClose={closeModals}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700">Nom</label>
              <input
                required
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as Emplacement['type'] })
                  }
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                >
                  {TYPES_EMPLACEMENT.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Statut</label>
                <select
                  value={form.statut}
                  onChange={(e) =>
                    setForm({ ...form, statut: e.target.value as StatutEmplacement })
                  }
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                >
                  <option value="disponible">Disponible</option>
                  <option value="occupe">Occupé</option>
                  <option value="maintenance">En maintenance</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">
                  Capacité (pers.)
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.capacite}
                  onChange={(e) => setForm({ ...form, capacite: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Surface (m²)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={form.surface}
                  onChange={(e) => setForm({ ...form, surface: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {(
                [
                  ['electricite', 'Électricité'],
                  ['eau', 'Point d\'eau'],
                  ['ombrage', 'Ombragé'],
                  ['animauxAcceptes', 'Animaux acceptés'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-forest-700">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="h-4 w-4 rounded border-forest-300 text-forest-700"
                  />
                  {label}
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
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
    </div>
  )
}
