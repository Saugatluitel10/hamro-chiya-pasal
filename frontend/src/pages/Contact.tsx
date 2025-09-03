import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        Contact Us
      </motion.h1>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Have feedback or want to say namaste? Reach out!
      </p>
      <form className="grid gap-4">
        <input className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Your Name" />
        <input type="email" className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Email" />
        <textarea rows={4} className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800" placeholder="Message" />
        <button type="button" className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700">
          Send
        </button>
      </form>
    </main>
  )
}
