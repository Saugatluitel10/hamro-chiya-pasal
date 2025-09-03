import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">हाम्रो चिया, हाम्रो स्टाइल</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Fresh Nepali Tea for the Youth
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-prose">
            Simple to order, simple to love. Crafted for today’s generation with authentic Nepali taste.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
            >
              View Menu
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium hover:bg-white/70 dark:hover:bg-gray-800"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="md:justify-self-end">
          <div className="aspect-video w-full max-w-md rounded-2xl bg-gradient-to-tr from-emerald-200 to-emerald-400 dark:from-emerald-700 dark:to-emerald-500 shadow-lg" />
        </motion.div>
      </section>

      {/* Quick highlights */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { title: 'Fast Service', desc: 'Quick brew, quicker smiles.' },
            { title: 'Authentic Taste', desc: 'From Kathmandu with love.' },
            { title: 'Budget Friendly', desc: 'Youth-approved pricing.' },
          ].map((f) => (
            <div key={f.title} className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900">
              <div className="font-semibold mb-1">{f.title}</div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
