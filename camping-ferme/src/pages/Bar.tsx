import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import Modal from '../components/Modal'
import { CATEGORIES_BOISSON, type Boisson, type CategorieBoisson } from '../types'
import { formatCurrency } from '../utils/format'

const emptyForm: Omit<Boisson, 'id'> = {
  nom: '',
  categorie: 'fraiche',
  contenance: '',
  prix: 2.5,
}

export default function Bar() {
  const { boissons, addBoisson, updateBoisson, deleteBoisson } = useStore()
  const [editing, setEditing] = useState<Boisson | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const openCreate = () => {
    setForm(emptyForm)
    setCreating(true)
  }
  const openEdit = (b: Boisson) => {
    setEditing(b)
    setForm(b)
  }
  const closeModals = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateBoisson({ ...form, id: editing.id })
    else addBoisson(form)
    closeModals()
  }

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette boisson de la carte du bar ?')) deleteBoisson(id)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-forest-900">Le Bar du camping</h1>
          <p className="mt-1 text-sm text-forest-600">
            Fraîcheur et convivialité au cœur du Périgord — la carte est modifiable à tout
            moment.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
        >
          + Ajouter une boisson
        </button>
      </div>

      {CATEGORIES_BOISSON.map((cat) => {
        const items = boissons.filter((b) => b.categorie === cat.value)
        if (items.length === 0) return null
        return (
          <div key={cat.value}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sunflower-700">
              {cat.labelPluriel}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm">
              <ul className="divide-y divide-forest-50">
                {items.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-forest-900">{b.nom}</p>
                      {b.contenance && (
                        <p className="text-xs text-forest-500">{b.contenance}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-forest-900">
                        {formatCurrency(b.prix)}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEdit(b)}
                        className="rounded-lg border border-forest-200 px-2.5 py-1 text-xs font-medium text-forest-700 hover:bg-forest-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}

      {boissons.length === 0 && (
        <p className="py-8 text-center text-sm text-forest-500">
          La carte du bar est vide pour le moment.
        </p>
      )}

      {(creating || editing) && (
        <Modal title={editing ? 'Modifier la boisson' : 'Nouvelle boisson'} onClose={closeModals}>
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
            <div>
              <label className="block text-sm font-medium text-forest-700">Catégorie</label>
              <select
                value={form.categorie}
                onChange={(e) =>
                  setForm({ ...form, categorie: e.target.value as CategorieBoisson })
                }
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              >
                {CATEGORIES_BOISSON.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">
                  Contenance (optionnel)
                </label>
                <input
                  placeholder="33 cl, verre…"
                  value={form.contenance}
                  onChange={(e) => setForm({ ...form, contenance: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Prix (€)</label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  required
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
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
                {editing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
