import { Link } from 'react-router-dom'

export type Crumb = { label: string; href: string }
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items?.length) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-3 text-sm text-gray-600 dark:text-gray-300">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="mx-2 text-gray-400">/</span>}
            {i < items.length - 1 ? (
              <Link to={c.href} className="hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-gray-800 dark:text-gray-200">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
