import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import { CATEGORIES_SERVICE, type CategorieService, type ServiceFerme, type UniteTarification } from '../types'
import { formatCurrency } from '../utils/format'

const emptyForm: Omit<ServiceFerme, 'id'> = {
  nom: '',
  categorie: 'activite',
  description: '',
  prix: 5,
  unite: 'personne',
}

const categorieTone: Record<CategorieService, 'green' | 'orange' | 'blue'> = {
  activite: 'green',
  service: 'blue',
  produit_fermier: 'orange',
}

const uniteLabel: Record<UniteTarification, string> = {
  personne: '/ personne',
  sejour: '/ séjour',
  jour: '/ jour',
}

export default function ActivitesServices() {
  const { services, addService, updateService, deleteService, reservations } = useStore()
  const [editing, setEditing] = useState<ServiceFerme | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<string>('all')

  const openCreate = () => {
    setForm(emptyForm)
    setCreating(true)
  }
  const openEdit = (s: ServiceFerme) => {
    setEditing(s)
    setForm(s)
  }
  const closeModals = () => {
    setCreating(false)
    setEditing(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) updateService({ ...form, id: editing.id })
    else addService(form)
    closeModals()
  }

  const handleDelete = (id: string) => {
    const enUsage = reservations.some((r) => r.serviceIds.includes(id))
    if (enUsage) {
      alert('Impossible de supprimer : utilisé dans des réservations existantes.')
      return
    }
    if (confirm('Supprimer cette activité / ce service ?')) deleteService(id)
  }

  const filtered = services.filter((s) => filter === 'all' || s.categorie === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-forest-900">Activités & services</h1>
          <p className="mt-1 text-sm text-forest-600">
            Ce qui fait le charme d'un camping à la ferme : animaux, produits, activités.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-xl bg-forest-800 px-4 py-2 text-sm font-medium text-white hover:bg-forest-700"
        >
          + Nouvelle offre
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            filter === 'all'
              ? 'bg-forest-800 text-white'
              : 'bg-white text-forest-600 ring-1 ring-forest-200'
          }`}
        >
          Toutes
        </button>
        {CATEGORIES_SERVICE.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setFilter(c.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === c.value
                ? 'bg-forest-800 text-white'
                : 'bg-white text-forest-600 ring-1 ring-forest-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="flex flex-col justify-between rounded-2xl border border-forest-100 bg-white p-5 shadow-sm"
          >
            <div>
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-forest-900">{s.nom}</h3>
                <Badge tone={categorieTone[s.categorie]}>
                  {CATEGORIES_SERVICE.find((c) => c.value === s.categorie)?.label}
                </Badge>
              </div>
              <p className="text-sm text-forest-600">{s.description}</p>
              <p className="mt-2 text-lg font-semibold text-forest-900">
                {formatCurrency(s.prix)}{' '}
                <span className="text-xs font-normal text-forest-500">
                  {uniteLabel[s.unite]}
                </span>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => openEdit(s)}
                className="flex-1 rounded-lg border border-forest-200 px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-50"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-forest-500">
            Aucune offre pour ce filtre.
          </p>
        )}
      </div>

      {(creating || editing) && (
        <Modal title={editing ? "Modifier l'offre" : 'Nouvelle offre'} onClose={closeModals}>
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
                  setForm({ ...form, categorie: e.target.value as CategorieService })
                }
                className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
              >
                {CATEGORIES_SERVICE.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-700">Prix (€)</label>
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={form.prix}
                  onChange={(e) => setForm({ ...form, prix: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-700">Unité</label>
                <select
                  value={form.unite}
                  onChange={(e) =>
                    setForm({ ...form, unite: e.target.value as UniteTarification })
                  }
                  className="mt-1 w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none"
                >
                  <option value="personne">Par personne</option>
                  <option value="jour">Par jour</option>
                  <option value="sejour">Par séjour</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700">Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
