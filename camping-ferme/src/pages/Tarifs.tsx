import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { TYPES_EMPLACEMENT, type Saison } from '../types'
import { formatCurrency } from '../utils/format'

function monthDayLabel(md: string) {
  const [month, day] = md.split('-').map(Number)
  const d = new Date(2024, month - 1, day)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })
}

export default function Tarifs() {
  const { saisons, updateSaison } = useStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Saison | null>(null)

  const startEdit = (s: Saison) => {
    setEditingId(s.id)
    setDraft({ ...s, prixParNuitParType: { ...s.prixParNuitParType } })
  }

  const save = () => {
    if (draft) updateSaison(draft)
    setEditingId(null)
    setDraft(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-forest-900">Tarifs saisonniers</h1>
        <p className="mt-1 text-sm text-forest-600">
          Prix par nuit et par type d'emplacement, selon la saison.
        </p>
      </div>

      <div className="grid gap-4">
        {saisons.map((s) => {
          const isEditing = editingId === s.id
          const current = isEditing && draft ? draft : s
          return (
            <div
              key={s.id}
              className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-forest-900">{s.nom}</h2>
                  <p className="text-xs text-forest-500">
                    Du {monthDayLabel(s.dateDebut)} au {monthDayLabel(s.dateFin)}
                  </p>
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setDraft(null)
                      }}
                      className="rounded-lg px-3 py-1.5 text-sm text-forest-600 hover:bg-forest-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={save}
                      className="rounded-lg bg-forest-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-forest-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="rounded-lg border border-forest-200 px-3 py-1.5 text-sm font-medium text-forest-700 hover:bg-forest-50"
                  >
                    Modifier
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {TYPES_EMPLACEMENT.map((t) => (
                  <div key={t.value} className="rounded-xl bg-forest-50 p-3">
                    <p className="text-xs font-medium text-forest-600">{t.label}</p>
                    {isEditing && draft ? (
                      <input
                        type="number"
                        min={0}
                        value={draft.prixParNuitParType[t.value]}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            prixParNuitParType: {
                              ...draft.prixParNuitParType,
                              [t.value]: Number(e.target.value),
                            },
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-forest-200 px-2 py-1 text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-lg font-semibold text-forest-900">
                        {formatCurrency(current.prixParNuitParType[t.value])}
                        <span className="text-xs font-normal text-forest-500"> / nuit</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
