import { motion, useMotionValue, animate } from 'framer-motion'
import { Link } from 'react-router-dom'
import TeaCard from '../components/TeaCard'
import { useEffect, useState } from 'react'

function Counter({ to, duration = 1.2 }: { to: number; duration?: number }) {
  const count = useMotionValue(0)
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const controls = animate(count, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [count, to, duration])
  return <span>{display}</span>
}

export default function Home() {
  const featured = [
    {
      titleNepali: 'दूध चिया',
      titleEnglish: 'Dudh Chiya',
      priceNpr: 25,
      imageUrl: 'https://images.unsplash.com/photo-1531934786730-f9bde0f92ea1?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'कालो चिया',
      titleEnglish: 'Kalo Chiya',
      priceNpr: 20,
      imageUrl: 'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'अदरक चिया',
      titleEnglish: 'Adrak Chiya',
      priceNpr: 30,
      imageUrl: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'इलाम गोल्ड',
      titleEnglish: 'Ilam Gold',
      priceNpr: 50,
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'हिमालयन ग्रीन',
      titleEnglish: 'Himalayan Green',
      priceNpr: 45,
      imageUrl: 'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      titleNepali: 'सिल्भर टिप्स',
      titleEnglish: 'Silver Tips',
      priceNpr: 60,
      imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
    },
  ]

  return (
    <main className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero with background image */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(6, 95, 70, 0.35), rgba(6, 95, 70, 0.6)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-8 items-center text-white">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-emerald-200 font-semibold mb-2">हाम्रो चिया, हाम्रो स्टाइल</p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
              स्वागत छ हाम्रो चिया पसलमा
            </h1>
            <p className="text-white/90 mb-6 max-w-prose">
              हिमाल, चिया बगान र हाम्रो संस्कृतिको स्वाद—नेपाली युवाका लागि सरल, ताजा र प्रामाणिक।
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center rounded-md bg-white/90 text-emerald-900 px-4 py-2 font-medium hover:bg-white"
              >
                मेनु हेर्नुहोस्
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-md border border-white/60 px-4 py-2 font-medium hover:bg-white/10"
              >
                सम्पर्क गर्नुहोस्
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-white/90">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">🏔️ Himalaya</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">🍃 Ilam Tea</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1">🇳🇵 Authentic</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured teas */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Featured Teas</h2>
            <p className="text-gray-600 dark:text-gray-300">Our 6 signature cups — नेपाली स्वाद संगै</p>
          </div>
          <Link to="/menu" className="text-emerald-700 dark:text-emerald-400 font-medium hover:underline">
            Explore full menu →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {featured.map((t) => (
            <TeaCard key={t.titleNepali} {...t} />
          ))}
        </div>
      </section>

      {/* Business highlights */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"><Counter to={7} />+ </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Years in Business</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900 text-center">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"><Counter to={98} />% </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Customer Satisfaction</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <div className="font-semibold mb-1">Location & Hours</div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Pulchowk, Lalitpur</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Sun–Fri: 7am–8pm | Sat: 9am–6pm</p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-6 bg-white dark:bg-gray-900">
            <div className="font-semibold mb-2">Authenticity</div>
            <div className="flex flex-wrap gap-2">
              {['Ilam Sourced', 'Hand-brewed', 'Fresh Spices'].map((b) => (
                <span key={b} className="inline-flex items-center rounded-full border border-emerald-200 dark:border-emerald-900/40 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { name: 'Aayush', quote: 'Best dudh chiya in town — bilkul authentic!' },
            { name: 'Suhana', quote: 'Warm vibes, fast service, and Nepali flavour.' },
            { name: 'Prakash', quote: 'Ilam Gold is a must-try. Superb aroma.' },
          ].map((t) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">“{t.quote}”</p>
              <footer className="mt-2 text-xs text-gray-500">— {t.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      </section>
    </main>
  )
}
