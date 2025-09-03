import { motion } from 'framer-motion'

export default function About() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        About Hamro Chiya Pasal
      </motion.h1>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        We brew fresh Nepali tea and bring street-side vibes to your day. Built
        with love for the youth of Nepal — simple, fast, and made to scale.
      </p>
    </main>
  )
}
