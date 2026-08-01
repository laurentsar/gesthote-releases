import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Tableau de bord', icon: '🏡', end: true },
  { to: '/reservations', label: 'Réservations', icon: '📅' },
  { to: '/emplacements', label: 'Emplacements', icon: '⛺' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/activites', label: 'Activités & services', icon: '🐓' },
  { to: '/bar', label: 'Bar du camping', icon: '🍹' },
  { to: '/tarifs', label: 'Tarifs', icon: '🌻' },
  { to: '/facturation', label: 'Facturation', icon: '🧾' },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-forest-800 text-white'
                : 'text-forest-100/80 hover:bg-forest-800/60 hover:text-white'
            }`
          }
        >
          <span className="text-lg leading-none">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar - desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col bg-forest-900 py-6 md:flex">
        <div className="flex items-center gap-3 px-5 pb-6">
          <Logo size={36} />
          <div>
            <p className="text-sm font-semibold leading-tight text-white">
              La Périgourdine
            </p>
            <p className="text-xs text-sunflower-300">Camping à la ferme</p>
          </div>
        </div>
        <NavItems />
        <div className="mx-3 mt-6 rounded-xl bg-forest-800/60 px-3 py-3 text-xs text-forest-100/70">
          Nature · Détente · Authenticité
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between bg-forest-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-sm font-semibold text-white">La Périgourdine</span>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-white"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-72 bg-forest-900 py-6">
            <div className="flex items-center justify-between px-5 pb-6">
              <div className="flex items-center gap-3">
                <Logo size={32} />
                <span className="text-sm font-semibold text-white">
                  La Périgourdine
                </span>
              </div>
              <button
                type="button"
                className="rounded-lg p-1 text-white"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
              >
                ✕
              </button>
            </div>
            <NavItems onNavigate={() => setMobileOpen(false)} />
          </div>
          <div
            className="flex-1 bg-forest-950/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 px-4 pb-16 pt-20 md:px-8 md:pb-10 md:pt-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
