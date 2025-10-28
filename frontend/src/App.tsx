import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import AdminTeas from './pages/AdminTeas'
import AdminSocial from './pages/AdminSocial'
import AdminOrders from './pages/AdminOrders'
import KitchenBoard from './pages/KitchenBoard'
import OrderSuccess from './pages/OrderSuccess'
import Checkout from './pages/Checkout'
import Gallery from './pages/Gallery'
import Product from './pages/Product'
import Visit from './pages/Visit'
import Press from './pages/Press'
import Careers from './pages/Careers'
import Events from './pages/Events'
import GiftCards from './pages/GiftCards'
import FAQs from './pages/FAQs'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/Toast'
import Analytics from './components/Analytics'
import ConsentBanner from './components/ConsentBanner'
import { useI18n } from './i18n/I18nProvider'
import PolicyShipping from './pages/PolicyShipping'
import PolicyReturns from './pages/PolicyReturns'
import PolicyTerms from './pages/PolicyTerms'
import PolicyPrivacy from './pages/PolicyPrivacy'
import StructuredData from './components/StructuredData'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Site-wide Organization structured data */}
      {typeof window !== 'undefined' && (
        <StructuredData
          json={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hamro Chiya Pasal',
            url: window.location.origin,
            logo: `${window.location.origin}/og/og-default.svg`,
            sameAs: [
              'https://www.instagram.com/hamro.chiya.pasal',
              'https://www.facebook.com/HamroChiyaPasal',
            ],
          }}
        />
      )}

      <Routes>
        {/* Redirect base and legacy unprefixed paths to preferred locale */}
        <Route path="/" element={<RedirectToPreferredLocale />} />
        <Route path="/menu" element={<RedirectUnprefixed to="menu" />} />
        <Route path="/about" element={<RedirectUnprefixed to="about" />} />
        <Route path="/contact" element={<RedirectUnprefixed to="contact" />} />

        {/* Locale-prefixed routes */}
        <Route path="ne" element={<LocaleLayoutFixed locale="ne" />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="about" element={<About />} />
          <Route path="visit" element={<Visit />} />
          <Route path="press" element={<Press />} />
          <Route path="events" element={<Events />} />
          <Route path="gift-cards" element={<GiftCards />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="policy/shipping" element={<PolicyShipping />} />
          <Route path="policy/returns" element={<PolicyReturns />} />
          <Route path="policy/terms" element={<PolicyTerms />} />
          <Route path="policy/privacy" element={<PolicyPrivacy />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="admin/teas" element={<AdminTeas />} />
          <Route path="admin/social" element={<AdminSocial />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/kitchen" element={<KitchenBoard />} />
          <Route path="order/success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="en" element={<LocaleLayoutFixed locale="en" />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="about" element={<About />} />
          <Route path="visit" element={<Visit />} />
          <Route path="events" element={<Events />} />
          <Route path="press" element={<Press />} />
          <Route path="gift-cards" element={<GiftCards />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="policy/shipping" element={<PolicyShipping />} />
          <Route path="policy/returns" element={<PolicyReturns />} />
          <Route path="policy/terms" element={<PolicyTerms />} />
          <Route path="policy/privacy" element={<PolicyPrivacy />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="admin/teas" element={<AdminTeas />} />
          <Route path="admin/social" element={<AdminSocial />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/kitchen" element={<KitchenBoard />} />
          <Route path="order/success" element={<OrderSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <ToastContainer />
      <ConsentBanner />
      <Analytics />
    </div>
  )
}

export default App

// --- Helpers & Layout for locale-prefixed routing ---

function detectPreferredLocale(): 'ne' | 'en' {
  try {
    const saved = localStorage.getItem('locale')
    if (saved === 'ne' || saved === 'en') return saved
  } catch {
    // Access to localStorage can fail in SSR or privacy modes; ignore and fallback below
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language?.toLowerCase() : 'ne'
  if (nav && nav.startsWith('ne')) return 'ne'
  return 'en'
}

function RedirectToPreferredLocale() {
  const l = detectPreferredLocale()
  return <Navigate to={`/${l}/`} replace />
}

function RedirectUnprefixed({ to }: { to: 'menu' | 'about' | 'contact' }) {
  const l = detectPreferredLocale()
  return <Navigate to={`/${l}/${to}`} replace />
}

function LocaleLayoutFixed({ locale }: { locale: 'ne' | 'en' }) {
  const { setLocale } = useI18n()
  // Sync the i18n context with the URL segment
  useEffect(() => {
    setLocale(locale)
    try {
      const root = document.documentElement
      const add = locale === 'ne' ? 'locale-ne' : 'locale-en'
      const remove = locale === 'ne' ? 'locale-en' : 'locale-ne'
      root.classList.add(add)
      root.classList.remove(remove)
      return () => { root.classList.remove(add) }
    } catch {
      // ignore if document unavailable
    }
  }, [locale, setLocale])
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Outlet />
    </motion.div>
  )
}
