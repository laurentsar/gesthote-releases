export type TypeEmplacement =
  | 'tente'
  | 'caravane'
  | 'camping-car'
  | 'cabane'
  | 'mobil-home'

export const TYPES_EMPLACEMENT: { value: TypeEmplacement; label: string }[] = [
  { value: 'tente', label: 'Tente' },
  { value: 'caravane', label: 'Caravane' },
  { value: 'camping-car', label: 'Camping-car' },
  { value: 'cabane', label: 'Cabane / gîte' },
  { value: 'mobil-home', label: 'Mobil-home' },
]

export type StatutEmplacement = 'disponible' | 'occupe' | 'maintenance'

export interface Emplacement {
  id: string
  nom: string
  type: TypeEmplacement
  capacite: number
  surface: number
  electricite: boolean
  eau: boolean
  ombrage: boolean
  animauxAcceptes: boolean
  statut: StatutEmplacement
  description: string
}

export interface Client {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse: string
  notes: string
}

export type StatutReservation =
  | 'en_attente'
  | 'confirmee'
  | 'terminee'
  | 'annulee'

export const STATUTS_RESERVATION: { value: StatutReservation; label: string }[] = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'terminee', label: 'Terminée' },
  { value: 'annulee', label: 'Annulée' },
]

export interface Reservation {
  id: string
  clientId: string
  emplacementId: string
  dateArrivee: string // ISO date
  dateDepart: string // ISO date
  nbAdultes: number
  nbEnfants: number
  nbAnimaux: number
  statut: StatutReservation
  serviceIds: string[]
  acompte: number
  notes: string
}

export type CategorieService = 'activite' | 'service' | 'produit_fermier'

export const CATEGORIES_SERVICE: { value: CategorieService; label: string }[] = [
  { value: 'activite', label: 'Activité à la ferme' },
  { value: 'service', label: 'Service' },
  { value: 'produit_fermier', label: 'Produit fermier' },
]

export type UniteTarification = 'personne' | 'sejour' | 'jour'

export interface ServiceFerme {
  id: string
  nom: string
  categorie: CategorieService
  description: string
  prix: number
  unite: UniteTarification
}

export interface Saison {
  id: string
  nom: string
  dateDebut: string // MM-DD
  dateFin: string // MM-DD
  prixParNuitParType: Record<TypeEmplacement, number>
}

export type CategorieBoisson =
  | 'fraiche'
  | 'chaude'
  | 'biere'
  | 'vin'
  | 'cocktail'

export const CATEGORIES_BOISSON: { value: CategorieBoisson; label: string; labelPluriel: string }[] = [
  { value: 'fraiche', label: 'Boisson fraîche', labelPluriel: 'Boissons fraîches' },
  { value: 'chaude', label: 'Boisson chaude', labelPluriel: 'Boissons chaudes' },
  { value: 'biere', label: 'Bière', labelPluriel: 'Bières' },
  { value: 'vin', label: 'Vin', labelPluriel: 'Vins' },
  { value: 'cocktail', label: 'Cocktail', labelPluriel: 'Cocktails' },
]

export interface Boisson {
  id: string
  nom: string
  categorie: CategorieBoisson
  contenance: string
  prix: number
}

export interface LigneFacture {
  description: string
  quantite: number
  prixUnitaire: number
}

export type StatutFacture = 'en_attente' | 'payee'

export interface Facture {
  id: string
  numero: string
  reservationId: string
  dateEmission: string
  lignes: LigneFacture[]
  statut: StatutFacture
}
