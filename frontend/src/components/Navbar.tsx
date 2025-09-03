import { NavLink } from 'react-router-dom'

const base = 'text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400'
const active = 'text-emerald-700 dark:text-emerald-300'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <nav className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink to="/" className="font-semibold text-emerald-600 dark:text-emerald-400">
          Chiya Pasal
        </NavLink>
        <div className="flex items-center gap-5">
          <NavLink to="/menu" className={({isActive}) => `${base} ${isActive ? active : ''}`}>Menu</NavLink>
          <NavLink to="/about" className={({isActive}) => `${base} ${isActive ? active : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => `${base} ${isActive ? active : ''}`}>Contact</NavLink>
        </div>
      </nav>
    </header>
  )
}
