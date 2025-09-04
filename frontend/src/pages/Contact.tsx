import { motion } from 'framer-motion'
import { useState } from 'react'
import type React from 'react'

type MessageType = 'inquiry' | 'feedback' | 'catering'
type PreferredContact = 'email' | 'phone' | 'whatsapp'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [messageType, setMessageType] = useState<MessageType>('inquiry')
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('email')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)
  // Honeypot field (should remain empty). Bots often fill hidden inputs.
  const [hp, setHp] = useState('')

  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)

    if (!name || (!email && !phone)) {
      setResult({ ok: false, msg: 'कृपया तपाईंको नाम र कम्तिमा एउटा सम्पर्क (इमेल वा फोन) दिनुहोस्।' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, messageType, preferredContact, message, hp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to send')
      setResult({ ok: true, msg: data?.message || 'धन्यवाद! सन्देश प्राप्त भयो।' })
      setName(''); setEmail(''); setPhone(''); setMessage('')
      setMessageType('inquiry'); setPreferredContact('email')
      setHp('')
    } catch (err: any) {
      setResult({ ok: false, msg: err?.message || 'सर्भरमा समस्या आयो।' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-4"
      >
        Contact & Location (सम्पर्क र ठेगाना)
      </motion.h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Location + Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Location (ठेगाना)</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Thamel Marg, Kathmandu 44600, Nepal
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <iframe
              title="Hamro Chiya Pasal Location"
              className="w-full aspect-video"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Thamel%20Marg%2C%20Kathmandu%2044600%2C%20Nepal&output=embed"
            />
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-1">Nearby Landmarks</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                <li>Thamel Chowk (5 min walk)</li>
                <li>Garden of Dreams (8 min walk)</li>
                <li>Kanti Path (10 min walk)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
              <h3 className="font-semibold mb-1">Access & Parking</h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 list-disc pl-5 space-y-1">
                <li>Street parking: limited (evenings better)</li>
                <li>Public transport: Micro/Bus stop at Kanti Path</li>
                <li>Ride-hailing: Set drop-off to Thamel Chowk</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold mb-1">Business Hours (खुल्ने समय)</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 grid grid-cols-2 gap-y-1">
              <li>Sun–Thu: 7:00 AM – 8:30 PM</li>
              <li>Fri: 7:00 AM – 9:30 PM</li>
              <li>Sat: 8:00 AM – 9:00 PM</li>
              <li>Holidays: 9:00 AM – 6:00 PM</li>
            </ul>
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Best time to visit: 10–12 AM, 4–6 PM • Rush hour: 7–9 PM (Fri/Sat)
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
            <h3 className="font-semibold mb-1">Contact Info</h3>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Phone: +977-9800000000</li>
              <li>WhatsApp: +977-9800000000</li>
              <li>Email: hello@hamro-chiya-pasal.com</li>
              <li>Instagram: @hamro.chiya.pasal • Facebook: Hamro Chiya Pasal</li>
            </ul>
          </div>
        </section>

        {/* Right: Form */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Send us a message</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Response time: within 24 hours (business days). For urgent catering, call or WhatsApp.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                placeholder="Your Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <select
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as MessageType)}
              >
                <option value="inquiry">Inquiry (सामान्य सोधपुछ)</option>
                <option value="feedback">Feedback (प्रतिक्रिया)</option>
                <option value="catering">Catering (समारोह/केटरिङ)</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <select
                className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                value={preferredContact}
                onChange={(e) => setPreferredContact(e.target.value as PreferredContact)}
              >
                <option value="email">Preferred: Email</option>
                <option value="phone">Preferred: Phone</option>
                <option value="whatsapp">Preferred: WhatsApp</option>
              </select>
            </div>
            <textarea
              rows={6}
              className="border rounded px-3 py-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {/* Honeypot: visually hidden text field to trap bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] -top-[9999px]">
              <label htmlFor="hp" className="sr-only">Leave this field blank</label>
              <input
                id="hp"
                name="hp"
                type="text"
                autoComplete="off"
                tabIndex={-1}
                value={hp}
                onChange={(e) => setHp(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send Message'}
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400">We respect your privacy and do not share details.</span>
            </div>

            {result && (
              <div
                className={
                  'text-sm rounded-md px-3 py-2 ' +
                  (result.ok
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200')
                }
              >
                {result.msg}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  )
}
