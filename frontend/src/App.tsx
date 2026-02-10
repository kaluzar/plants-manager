import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Locations from './pages/Locations'
import Plants from './pages/Plants'
import PlantDetail from './pages/PlantDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="locations" element={<Locations />} />
          <Route path="plants" element={<Plants />} />
          <Route path="plants/:id" element={<PlantDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
