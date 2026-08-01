import type { Emplacement, Reservation, Saison, ServiceFerme } from '../types'

export function nbNuits(dateArrivee: string, dateDepart: string): number {
  const a = new Date(dateArrivee)
  const d = new Date(dateDepart)
  const diff = Math.round((d.getTime() - a.getTime()) / 86_400_000)
  return Math.max(diff, 0)
}

function monthDay(date: Date) {
  return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Retourne la saison applicable pour une date donnée (comparaison MM-DD, gère le passage d'année). */
export function saisonPourDate(date: Date, saisons: Saison[]): Saison | undefined {
  const md = monthDay(date)
  return saisons.find((s) => {
    if (s.dateDebut <= s.dateFin) {
      return md >= s.dateDebut && md <= s.dateFin
    }
    // saison à cheval sur le nouvel an
    return md >= s.dateDebut || md <= s.dateFin
  })
}

export function prixNuitee(
  date: Date,
  emplacement: Emplacement,
  saisons: Saison[],
): number {
  const saison = saisonPourDate(date, saisons)
  if (!saison) return 0
  return saison.prixParNuitParType[emplacement.type] ?? 0
}

export function prixHebergement(
  reservation: Pick<Reservation, 'dateArrivee' | 'dateDepart'>,
  emplacement: Emplacement,
  saisons: Saison[],
): number {
  const start = new Date(reservation.dateArrivee)
  const nights = nbNuits(reservation.dateArrivee, reservation.dateDepart)
  let total = 0
  for (let i = 0; i < nights; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    total += prixNuitee(d, emplacement, saisons)
  }
  return total
}

export function prixServices(
  reservation: Pick<
    Reservation,
    'serviceIds' | 'nbAdultes' | 'nbEnfants' | 'dateArrivee' | 'dateDepart'
  >,
  services: ServiceFerme[],
): number {
  const nights = nbNuits(reservation.dateArrivee, reservation.dateDepart) || 1
  const personnes = reservation.nbAdultes + reservation.nbEnfants
  return reservation.serviceIds.reduce((total, id) => {
    const service = services.find((s) => s.id === id)
    if (!service) return total
    if (service.unite === 'personne') return total + service.prix * Math.max(personnes, 1)
    if (service.unite === 'jour') return total + service.prix * nights
    return total + service.prix
  }, 0)
}

export function montantTotalReservation(
  reservation: Reservation,
  emplacement: Emplacement | undefined,
  saisons: Saison[],
  services: ServiceFerme[],
): number {
  if (!emplacement) return 0
  return (
    prixHebergement(reservation, emplacement, saisons) +
    prixServices(reservation, services)
  )
}
