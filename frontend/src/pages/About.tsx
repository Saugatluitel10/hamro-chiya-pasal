import { motion } from 'framer-motion'
import { useState } from 'react'

type Region = 'Ilam' | 'Dhankuta' | 'Kaski'

const regionInfo: Record<Region, { blurb: string } > = {
  Ilam: {
    blurb:
      'Ilam is Nepal’s tea heartland — known for golden tips, complex aroma, and crisp mornings that shape the leaves.',
  },
  Dhankuta: {
    blurb:
      'Dhankuta’s rolling hills produce bright, balanced cups with gentle sweetness. We partner with smallholders here.',
  },
  Kaski: {
    blurb:
      'From the mid-hills around Pokhara, select gardens yield delicate greens with a refreshing finish.',
  },
}

export default function About() {
  const [active, setActive] = useState<Region>('Ilam')
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Business Story */}
      <section className="max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4"
        >
          हाम्रो कथा / Our Story
        </motion.h1>
        <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            परिवारको परम्परा र चियाप्रतिको मायाबाट जन्मिएको — Hamro Chiya Pasal.
            सानो टोलको पसलबाट सुरु भएको हाम्रो यात्रा आज समुदायको मनपर्ने भेटघाटस्थान भएको छ।
          </p>
          <p>
            हामी इलाम र धनकुटाबाट सीधा स्रोत गर्ने परम्परागत र आधुनिक स्वादको सन्तुलन दिन्छौं।
            हाम्रो प्रतिबद्धता: प्रामाणिक नेपाली स्वाद, न्यायपूर्ण व्यापार, र दिगोपन।
          </p>
        </div>
      </section>

      {/* Sourcing & Map */}
      <section className="mt-10 grid md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Tea Sourcing & Regions</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Direct farmer relationships • Fair trade practices • Seasonal harvests
          </p>

          <div className="flex gap-2 mb-3">
            {(Object.keys(regionInfo) as Region[]).map((r) => (
              <button
                key={r}
                onClick={() => setActive(r)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  active === r
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
            <p className="text-gray-700 dark:text-gray-300 text-sm">{regionInfo[active].blurb}</p>
            <ul className="mt-3 text-sm list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Seasonal harvest windows with careful hand-plucking</li>
              <li>Transparent pricing and community investment</li>
              <li>Small-batch processing for consistent quality</li>
            </ul>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-emerald-50 dark:bg-emerald-900/10"
        >
          {/* Simple map placeholder with markers */}
          <div
            className="aspect-[4/3] bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 p-4 flex items-end justify-start">
            <div className="rounded-md bg-white/90 dark:bg-gray-900/80 backdrop-blur px-3 py-2 text-sm shadow">
              Nepal Tea Regions — Click a region above
            </div>
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">Our Team (हाम्रो टिम)</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Family heritage • Years of expertise • Community involvement
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Aama', role: 'Master Brewer', years: 20 },
            { name: 'Bhai', role: 'Sourcing Lead', years: 6 },
            { name: 'Didi', role: 'Community & Culture', years: 8 },
            { name: 'Kaka', role: 'Operations', years: 12 },
            { name: 'Sathi', role: 'Barista', years: 3 },
            { name: 'Mama', role: 'Quality Control', years: 10 },
          ].map((m) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900"
            >
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{m.role}</div>
              <div className="mt-1 text-xs text-gray-500">{m.years}+ years of tea expertise</div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}
