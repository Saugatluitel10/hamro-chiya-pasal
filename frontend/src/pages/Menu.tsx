import { motion } from 'framer-motion'

const items = [
  { name: 'Masala Chiya', price: 'Rs. 50' },
  { name: 'Milk Tea', price: 'Rs. 40' },
  { name: 'Black Tea', price: 'Rs. 30' },
  { name: 'Lemon Tea', price: 'Rs. 45' },
]

export default function Menu() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
          >
            <div className="font-semibold">{it.name}</div>
            <div className="text-emerald-600 dark:text-emerald-400">{it.price}</div>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
