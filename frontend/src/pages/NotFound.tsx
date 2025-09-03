import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="min-h-[60vh] grid place-items-center px-4 text-center">
      <div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
