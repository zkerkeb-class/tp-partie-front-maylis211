import './App.css'
import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import PokeList from './components/pokelist'
import PokemonDetail from './pages/PokemonDetail'
import PokemonCreate from './pages/PokemonCreate'
import PokemonEdit from './pages/PokemonEdit'
function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="container">
      <div className="nav">
        <Link to="/" className="nav-link">Liste</Link>
        <Link to="/new" className="nav-link">Ajouter</Link>
        <label className="theme-toggle" aria-label="Mode sombre">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          />
          <span className="toggle-track">
            <span className="toggle-thumb" />
            <span className="toggle-icon toggle-sun">☀</span>
            <span className="toggle-icon toggle-moon">☾</span>
          </span>
        </label>
      </div>
      <Routes>
        <Route path="/" element={<PokeList />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/pokemon/:id/edit" element={<PokemonEdit />} />
        <Route path="/new" element={<PokemonCreate />} />
      </Routes>
    </div>
  )
}

export default App
