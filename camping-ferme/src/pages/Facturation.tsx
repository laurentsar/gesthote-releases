import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import type { Facture, LigneFacture } from '../types'
import { formatCurrency, formatDate, todayIso } from '../utils/format'
import { nbNuits, prixHebergement, prixServices } from '../utils/pricing'

export default function Facturation() {
  const {
    reservations,
    clients,
    emplacements,
    services,
    saisons,
    factures,
    addFacture,
    updateFacture,
  } = useStore()
  const [viewing, setViewing] = useState<Facture | null>(null)

  const clientNom = (id: string) => {
    const c = clients.find((x) => x.id === id)
    return c ? `${c.prenom} ${c.nom}` : '—'
  }

  const facturables = reservations.filter(
    (r) =>
      r.statut !== 'annulee' && !factures.some((f) => f.reservationId === r.id),
  )

  const genererFacture = (reservationId: string) => {
    const r = reservations.find((x) => x.id === reservationId)
    if (!r) return
    const emp = emplacements.find((e) => e.id === r.emplacementId)
    if (!emp) return
    const nuits = nbNuits(r.dateArrivee, r.dateDepart)
    const lignes: LigneFacture[] = [
      {
        description: `${emp.nom} — ${nuits} nuit(s)`,
        quantite: nuits,
        prixUnitaire: nuits ? prixHebergement(r, emp, saisons) / nuits : 0,
      },
    ]
    r.serviceIds.forEach((id) => {
      const s = services.find((x) => x.id === id)
      if (!s) return
      lignes.push({
        description: s.nom,
        quantite: 1,
        prixUnitaire: prixServices(
          { ...r, serviceIds: [id] },
          services,
        ),
      })
    })
    const numero = `F${new Date().getFullYear()}-${String(factures.length + 1).padStart(3, '0')}`
    addFacture({
      numero,
      reservationId,
      dateEmission: todayIso(),
      lignes,
      statut: 'en_attente',
    })
  }

  const totalFacture = (f: Facture) =>
    f.lignes.reduce((sum, l) => sum + l.quantite * l.prixUnitaire, 0)

  const togglePaiement = (f: Facture) => {
    updateFacture({ ...f, statut: f.statut === 'payee' ? 'en_attente' : 'payee' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-forest-900">Facturation</h1>
        <p className="mt-1 text-sm text-forest-600">
          Générez et suivez les factures des séjours.
        </p>
      </div>

      <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-forest-900">Réservations à facturer</h2>
        {facturables.length === 0 ? (
          <p className="text-sm text-forest-500">Toutes les réservations sont facturées.</p>
        ) : (
          <ul className="divide-y divide-forest-50">
            {facturables.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-forest-900">{clientNom(r.clientId)}</p>
                  <p className="text-xs text-forest-500">
                    {emplacements.find((e) => e.id === r.emplacementId)?.nom} ·{' '}
                    {formatDate(r.dateArrivee)} → {formatDate(r.dateDepart)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => genererFacture(r.id)}
                  className="rounded-lg bg-forest-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-forest-700"
                >
                  Générer la facture
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-forest-50 text-forest-700">
            <tr>
              <th className="px-4 py-3 font-medium">N°</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-50">
            {factures
              .slice()
              .sort((a, b) => b.numero.localeCompare(a.numero))
              .map((f) => {
                const r = reservations.find((x) => x.id === f.reservationId)
                return (
                  <tr key={f.id} className="hover:bg-forest-50/50">
                    <td className="px-4 py-3 font-medium text-forest-900">{f.numero}</td>
                    <td className="px-4 py-3 text-forest-600">
                      {r ? clientNom(r.clientId) : '—'}
                    </td>
                    <td className="px-4 py-3 text-forest-600">
                      {formatDate(f.dateEmission)}
                    </td>
                    <td className="px-4 py-3 text-forest-600">
                      {formatCurrency(totalFacture(f))}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={f.statut === 'payee' ? 'green' : 'orange'}>
                        {f.statut === 'payee' ? 'Payée' : 'En attente'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setViewing(f)}
                          className="rounded-lg border border-forest-200 px-2.5 py-1 text-xs font-medium text-forest-700 hover:bg-forest-50"
                        >
                          Voir
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePaiement(f)}
                          className="rounded-lg border border-forest-200 px-2.5 py-1 text-xs font-medium text-forest-700 hover:bg-forest-50"
                        >
                          {f.statut === 'payee' ? 'Marquer non payée' : 'Marquer payée'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            {factures.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-forest-500">
                  Aucune facture générée pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <Modal title={`Facture ${viewing.numero}`} onClose={() => setViewing(null)}>
          {(() => {
            const r = reservations.find((x) => x.id === viewing.reservationId)
            return (
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-forest-600">
                  <span>{r ? clientNom(r.clientId) : '—'}</span>
                  <span>{formatDate(viewing.dateEmission)}</span>
                </div>
                <table className="w-full text-left">
                  <thead className="text-xs uppercase text-forest-500">
                    <tr>
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Qté</th>
                      <th className="pb-2 text-right">Prix unit.</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-50">
                    {viewing.lignes.map((l, i) => (
                      <tr key={i}>
                        <td className="py-1.5">{l.description}</td>
                        <td className="py-1.5 text-right">{l.quantite}</td>
                        <td className="py-1.5 text-right">
                          {formatCurrency(l.prixUnitaire)}
                        </td>
                        <td className="py-1.5 text-right">
                          {formatCurrency(l.quantite * l.prixUnitaire)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between border-t border-forest-100 pt-3 text-base font-semibold text-forest-900">
                  <span>Total</span>
                  <span>{formatCurrency(totalFacture(viewing))}</span>
                </div>
              </div>
            )
          })()}
        </Modal>
      )}
    </div>
  )
}
