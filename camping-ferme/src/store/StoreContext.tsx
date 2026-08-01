import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  seedBoissons,
  seedClients,
  seedEmplacements,
  seedFactures,
  seedReservations,
  seedSaisons,
  seedServices,
} from '../data/seed'
import type {
  Boisson,
  Client,
  Emplacement,
  Facture,
  Reservation,
  Saison,
  ServiceFerme,
} from '../types'

const STORAGE_KEY = 'fermecamp:v1'

interface State {
  emplacements: Emplacement[]
  clients: Client[]
  reservations: Reservation[]
  services: ServiceFerme[]
  saisons: Saison[]
  factures: Facture[]
  boissons: Boisson[]
}

const defaultState: State = {
  emplacements: seedEmplacements,
  clients: seedClients,
  reservations: seedReservations,
  services: seedServices,
  saisons: seedSaisons,
  factures: seedFactures,
  boissons: seedBoissons,
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw) as Partial<State>
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

interface StoreValue extends State {
  addEmplacement: (e: Omit<Emplacement, 'id'>) => void
  updateEmplacement: (e: Emplacement) => void
  deleteEmplacement: (id: string) => void

  addClient: (c: Omit<Client, 'id'>) => Client
  updateClient: (c: Client) => void
  deleteClient: (id: string) => void

  addReservation: (r: Omit<Reservation, 'id'>) => void
  updateReservation: (r: Reservation) => void
  deleteReservation: (id: string) => void

  addService: (s: Omit<ServiceFerme, 'id'>) => void
  updateService: (s: ServiceFerme) => void
  deleteService: (id: string) => void

  updateSaison: (s: Saison) => void

  addFacture: (f: Omit<Facture, 'id'>) => void
  updateFacture: (f: Facture) => void

  addBoisson: (b: Omit<Boisson, 'id'>) => void
  updateBoisson: (b: Boisson) => void
  deleteBoisson: (id: string) => void

  resetDemoData: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addEmplacement = useCallback((e: Omit<Emplacement, 'id'>) => {
    setState((s) => ({
      ...s,
      emplacements: [...s.emplacements, { ...e, id: makeId('emp') }],
    }))
  }, [])

  const updateEmplacement = useCallback((e: Emplacement) => {
    setState((s) => ({
      ...s,
      emplacements: s.emplacements.map((x) => (x.id === e.id ? e : x)),
    }))
  }, [])

  const deleteEmplacement = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      emplacements: s.emplacements.filter((x) => x.id !== id),
    }))
  }, [])

  const addClient = useCallback((c: Omit<Client, 'id'>) => {
    const client = { ...c, id: makeId('cli') }
    setState((s) => ({ ...s, clients: [...s.clients, client] }))
    return client
  }, [])

  const updateClient = useCallback((c: Client) => {
    setState((s) => ({
      ...s,
      clients: s.clients.map((x) => (x.id === c.id ? c : x)),
    }))
  }, [])

  const deleteClient = useCallback((id: string) => {
    setState((s) => ({ ...s, clients: s.clients.filter((x) => x.id !== id) }))
  }, [])

  const addReservation = useCallback((r: Omit<Reservation, 'id'>) => {
    setState((s) => ({
      ...s,
      reservations: [...s.reservations, { ...r, id: makeId('res') }],
    }))
  }, [])

  const updateReservation = useCallback((r: Reservation) => {
    setState((s) => ({
      ...s,
      reservations: s.reservations.map((x) => (x.id === r.id ? r : x)),
    }))
  }, [])

  const deleteReservation = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      reservations: s.reservations.filter((x) => x.id !== id),
    }))
  }, [])

  const addService = useCallback((sv: Omit<ServiceFerme, 'id'>) => {
    setState((s) => ({
      ...s,
      services: [...s.services, { ...sv, id: makeId('srv') }],
    }))
  }, [])

  const updateService = useCallback((sv: ServiceFerme) => {
    setState((s) => ({
      ...s,
      services: s.services.map((x) => (x.id === sv.id ? sv : x)),
    }))
  }, [])

  const deleteService = useCallback((id: string) => {
    setState((s) => ({ ...s, services: s.services.filter((x) => x.id !== id) }))
  }, [])

  const updateSaison = useCallback((sa: Saison) => {
    setState((s) => ({
      ...s,
      saisons: s.saisons.map((x) => (x.id === sa.id ? sa : x)),
    }))
  }, [])

  const addFacture = useCallback((f: Omit<Facture, 'id'>) => {
    setState((s) => ({
      ...s,
      factures: [...s.factures, { ...f, id: makeId('fac') }],
    }))
  }, [])

  const updateFacture = useCallback((f: Facture) => {
    setState((s) => ({
      ...s,
      factures: s.factures.map((x) => (x.id === f.id ? f : x)),
    }))
  }, [])

  const addBoisson = useCallback((b: Omit<Boisson, 'id'>) => {
    setState((s) => ({
      ...s,
      boissons: [...s.boissons, { ...b, id: makeId('bo') }],
    }))
  }, [])

  const updateBoisson = useCallback((b: Boisson) => {
    setState((s) => ({
      ...s,
      boissons: s.boissons.map((x) => (x.id === b.id ? b : x)),
    }))
  }, [])

  const deleteBoisson = useCallback((id: string) => {
    setState((s) => ({ ...s, boissons: s.boissons.filter((x) => x.id !== id) }))
  }, [])

  const resetDemoData = useCallback(() => {
    setState(defaultState)
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      addEmplacement,
      updateEmplacement,
      deleteEmplacement,
      addClient,
      updateClient,
      deleteClient,
      addReservation,
      updateReservation,
      deleteReservation,
      addService,
      updateService,
      deleteService,
      updateSaison,
      addFacture,
      updateFacture,
      addBoisson,
      updateBoisson,
      deleteBoisson,
      resetDemoData,
    }),
    [
      state,
      addEmplacement,
      updateEmplacement,
      deleteEmplacement,
      addClient,
      updateClient,
      deleteClient,
      addReservation,
      updateReservation,
      deleteReservation,
      addService,
      updateService,
      deleteService,
      updateSaison,
      addFacture,
      updateFacture,
      addBoisson,
      updateBoisson,
      deleteBoisson,
      resetDemoData,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within a StoreProvider')
  return ctx
}
