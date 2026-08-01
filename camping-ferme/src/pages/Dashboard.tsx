import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext'
import StatCard from '../components/StatCard'
import Badge from '../components/Badge'
import { formatCurrency, formatDateShort, todayIso } from '../utils/format'
import { montantTotalReservation } from '../utils/pricing'
import { STATUTS_RESERVATION, TYPES_EMPLACEMENT } from '../types'

export default function Dashboard() {
  const { emplacements, reservations, clients, services, saisons } = useStore()
  const today = todayIso()

  const enSejour = reservations.filter(
    (r) =>
      r.statut === 'confirmee' &&
      r.dateArrivee <= today &&
      r.dateDepart > today,
  )
  const arrivees = reservations.filter(
    (r) => r.dateArrivee === today && r.statut !== 'annulee',
  )
  const departs = reservations.filter(
    (r) => r.dateDepart === today && r.statut !== 'annulee',
  )

  const tauxOccupation = emplacements.length
    ? Math.round((enSejour.length / emplacements.length) * 100)
    : 0

  const moisEnCours = today.slice(0, 7)
  const revenuMois = reservations
    .filter((r) => r.statut !== 'annulee' && r.dateArrivee.slice(0, 7) === moisEnCours)
    .reduce((sum, r) => {
      const emp = emplacements.find((e) => e.id === r.emplacementId)
      return sum + montantTotalReservation(r, emp, saisons, services)
    }, 0)

  const prochaines = reservations
    .filter((r) => r.statut !== 'annulee' && r.dateArrivee >= today)
    .sort((a, b) => a.dateArrivee.localeCompare(b.dateArrivee))
    .slice(0, 5)

  const clientNom = (id: string) => {
    const c = clients.find((x) => x.id === id)
    return c ? `${c.prenom} ${c.nom}` : 'Client inconnu'
  }
  const emplacementNom = (id: string) =>
    emplacements.find((e) => e.id === id)?.nom ?? 'Emplacement inconnu'

  const parType = TYPES_EMPLACEMENT.map((t) => ({
    ...t,
    count: emplacements.filter((e) => e.type === t.value).length,
  })).filter((t) => t.count > 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-forest-900">
          Bonjour 👋 bienvenue à La Périgourdine
        </h1>
        <p className="mt-1 text-sm text-forest-600">
          Vue d'ensemble de votre camping à la ferme.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Taux d'occupation"
          value={`${tauxOccupation}%`}
          hint={`${enSejour.length} / ${emplacements.length} emplacements occupés`}
          icon="⛺"
        />
        <StatCard label="Arrivées aujourd'hui" value={arrivees.length} icon="🚗" />
        <StatCard label="Départs aujourd'hui" value={departs.length} icon="👋" />
        <StatCard
          label="Revenu du mois"
          value={formatCurrency(revenuMois)}
          hint="Hébergement + activités"
          icon="🌻"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-forest-900">Prochaines réservations</h2>
            <Link
              to="/reservations"
              className="text-sm font-medium text-forest-600 hover:text-forest-800"
            >
              Voir tout →
            </Link>
          </div>
          {prochaines.length === 0 ? (
            <p className="py-8 text-center text-sm text-forest-500">
              Aucune réservation à venir.
            </p>
          ) : (
            <ul className="divide-y divide-forest-50">
              {prochaines.map((r) => {
                const statut = STATUTS_RESERVATION.find((s) => s.value === r.statut)
                return (
                  <li key={r.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-forest-900">
                        {clientNom(r.clientId)}
                      </p>
                      <p className="text-xs text-forest-500">
                        {emplacementNom(r.emplacementId)} · {formatDateShort(r.dateArrivee)}{' '}
                        → {formatDateShort(r.dateDepart)}
                      </p>
                    </div>
                    <Badge tone={r.statut === 'confirmee' ? 'green' : 'orange'}>
                      {statut?.label}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-forest-900">Parc d'emplacements</h2>
          <ul className="space-y-3">
            {parType.map((t) => (
              <li key={t.value} className="flex items-center justify-between text-sm">
                <span className="text-forest-700">{t.label}</span>
                <span className="font-medium text-forest-900">{t.count}</span>
              </li>
            ))}
          </ul>
          <Link
            to="/emplacements"
            className="mt-4 inline-block text-sm font-medium text-forest-600 hover:text-forest-800"
          >
            Gérer les emplacements →
          </Link>
        </div>
      </div>
    </div>
  )
}
