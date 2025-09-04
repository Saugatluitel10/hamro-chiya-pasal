import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TeaCard from '../components/TeaCard'

type Tea = {
  titleNepali: string
  titleEnglish: string
  priceNpr: number
  imageUrl?: string
  ingredients?: string[]
  healthBenefits?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  seasonal?: boolean
}

type Category = {
  key: string
  titleNepali: string
  titleEnglish: string
  teas: Tea[]
}

const fallbackCategories: Category[] = [
  {
    key: 'traditional',
    titleNepali: 'पारम्परिक चिया',
    titleEnglish: 'Traditional Teas',
    teas: [
      {
        titleNepali: 'दूध चिया',
        titleEnglish: 'Dudh Chiya',
        priceNpr: 25,
        imageUrl:
          'https://images.unsplash.com/photo-1542444459-48fa3000b004?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['दूध', 'कालो चिया', 'चिनी'],
        healthBenefits: ['ऊर्जा', 'आराम'],
        difficulty: 'Easy',
      },
      {
        titleNepali: 'कालो चिया',
        titleEnglish: 'Kalo Chiya',
        priceNpr: 20,
        imageUrl:
          'https://images.unsplash.com/photo-1523906921802-b5d2d899e93b?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['कालो चिया', 'तातो पानी'],
        healthBenefits: ['एन्टिअक्सिडेन्ट'],
        difficulty: 'Easy',
      },
      {
        titleNepali: 'अदरक चिया',
        titleEnglish: 'Adrak Chiya',
        priceNpr: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1464347744102-11db6282f854?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['अदरक', 'दूध', 'चिया पत्ती'],
        healthBenefits: ['घाँटी दुखाइको राहत', 'ताप घटाउँछ'],
        difficulty: 'Medium',
      },
      {
        titleNepali: 'इलायची चिया',
        titleEnglish: 'Elaichi Chiya',
        priceNpr: 35,
        imageUrl:
          'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['इलायची', 'दूध', 'चिया पत्ती'],
        healthBenefits: ['पाचन सुधार'],
        difficulty: 'Medium',
      },
    ],
  },
  {
    key: 'premium',
    titleNepali: 'प्रीमियम चिया',
    titleEnglish: 'Premium Teas',
    teas: [
      {
        titleNepali: 'इलाम गोल्ड',
        titleEnglish: 'Ilam Gold',
        priceNpr: 50,
        imageUrl:
          'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['उच्च गुणस्तरको पत्ती'],
        healthBenefits: ['समृद्ध स्वाद', 'एरोमा'],
        difficulty: 'Medium',
        seasonal: false,
      },
      {
        titleNepali: 'हिमालयन ग्रीन',
        titleEnglish: 'Himalayan Green',
        priceNpr: 45,
        imageUrl:
          'https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['ग्रीन टी'],
        healthBenefits: ['डिटक्स', 'मेटाबोलिज्म'],
        difficulty: 'Medium',
      },
      {
        titleNepali: 'सिल्भर टिप्स',
        titleEnglish: 'Silver Tips',
        priceNpr: 60,
        imageUrl:
          'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['बड्स मात्र'],
        healthBenefits: ['हल्का र सुगन्धित'],
        difficulty: 'Hard',
        seasonal: true,
      },
    ],
  },
  {
    key: 'herbal',
    titleNepali: 'जडिबुटी चिया',
    titleEnglish: 'Herbal Teas',
    teas: [
      {
        titleNepali: 'तुलसी चिया',
        titleEnglish: 'Tulsi Tea',
        priceNpr: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1542806100-91272a208e38?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['तुलसी', 'मधु (वैकल्पिक)'],
        healthBenefits: ['सर्दी-खोकीमा लाभदायक'],
        difficulty: 'Easy',
      },
      {
        titleNepali: 'नेटल चिया',
        titleEnglish: 'Nettle Tea',
        priceNpr: 35,
        imageUrl:
          'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['नेटल पात'],
        healthBenefits: ['खनिज तत्वले भरिपूर्ण'],
        difficulty: 'Medium',
        seasonal: true,
      },
      {
        titleNepali: 'लेमन ग्रास',
        titleEnglish: 'Lemon Grass',
        priceNpr: 25,
        imageUrl:
          'https://images.unsplash.com/photo-1598184277221-37d4f243c38b?q=80&w=1200&auto=format&fit=crop',
        ingredients: ['लेमन ग्रास', 'मधु (वैकल्पिक)'],
        healthBenefits: ['सुगन्धित, शान्तिदायक'],
        difficulty: 'Easy',
        seasonal: false,
      },
    ],
  },
]

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${apiBase}/api/menu`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.message || 'Failed to fetch menu')
        if (Array.isArray(data?.categories) && !cancelled) {
          setCategories(data.categories)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load menu')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [apiBase])
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">मेनु / Menu</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          नेपाली स्वाद र आधुनिक शैली — Choose your cup!
        </p>
        <div className="mt-3 text-xs text-gray-500">
          <span className="mr-2">Legend:</span>
          <span className="mr-2">Brew = Brewing difficulty</span>
          <span>Seasonal badge shows limited availability</span>
        </div>
        {loading && (
          <p className="mt-2 text-xs text-gray-500">Refreshing menu…</p>
        )}
        {error && (
          <div className="mt-3 text-sm rounded-md px-3 py-2 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </div>
        )}
      </header>

      {categories.map((cat) => (
        <section key={cat.key} className="mb-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{cat.titleNepali}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{cat.titleEnglish}</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {cat.teas.map((t) => (
              <TeaCard key={t.titleEnglish} {...t} />
            ))}
          </div>
        </section>
      ))}

      {/* Cultural brewing instructions & health notes */}
      <section className="mt-6 grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900"
        >
          <h3 className="font-semibold mb-2">Cultural Brewing Tips (नेपाली शैली)</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>दूध चिया: पानी उमालेपछि चिया र मसला हालेर दूध मिसाउनुहोस्।</li>
            <li>कालो चिया: 2–3 मिनेट steep, हल्का चिनी वा मधु।</li>
            <li>अदरक/इलायची: मसला सुरुमा क्रश गरेर उमार्दा स्वाद गहिरो हुन्छ।</li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 bg-white dark:bg-gray-900"
        >
          <h3 className="font-semibold mb-2">Health Benefits (स्वास्थ्य लाभ)</h3>
          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>ग्रीन टी: एन्टिअक्सिडेन्ट र मेटाबोलिज्म समर्थन</li>
            <li>तुलसी/अदरक: सर्दी-खोकी र जुकाममा राहत</li>
            <li>ब्ल्याक टी: हल्का क्याफिनले ऊर्जा दिन्छ</li>
          </ul>
        </motion.div>
      </section>
    </main>
  )
}
