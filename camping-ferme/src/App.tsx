import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { StoreProvider } from './store/StoreContext'
import Dashboard from './pages/Dashboard'
import Emplacements from './pages/Emplacements'
import Reservations from './pages/Reservations'
import Clients from './pages/Clients'
import Tarifs from './pages/Tarifs'
import ActivitesServices from './pages/ActivitesServices'
import Bar from './pages/Bar'
import Facturation from './pages/Facturation'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/emplacements" element={<Emplacements />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/tarifs" element={<Tarifs />} />
            <Route path="/activites" element={<ActivitesServices />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/facturation" element={<Facturation />} />
          </Routes>
        </Layout>
      </HashRouter>
    </StoreProvider>
  )
}
