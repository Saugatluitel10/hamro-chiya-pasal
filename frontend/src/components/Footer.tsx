import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import NewsletterForm from './NewsletterForm'

export default function Footer() {
  const { t, locale } = useI18n()
  const year = new Date().getFullYear()
  const prefix = `/${locale}`
  return (
    <footer className={`mt-auto text-sm text-gray-700 dark:text-gray-300 border-t ${locale === 'en' ? 'bg-white py-12 border-gray-200' : 'footer-texture py-10 border-gray-200 dark:border-gray-800'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`mb-6 rounded-lg border border-gray-200 dark:border-gray-800 ${locale === 'en' ? 'p-6 bg-white' : 'p-4 bg-[--color-surface] dark:bg-gray-900'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="font-semibold text-[--color-accent]">{t('newsletter.title') || 'Subscribe for updates'}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{t('newsletter.subtitle') || 'Get news, offers, and stories from Hamro Chiya Pasal.'}</p>
            </div>
            <div className="w-full md:w-auto max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
        <div className={`grid md:grid-cols-4 gap-6 ${locale === 'en' ? 'items-start' : ''}`}>
          <div className={`${locale === 'en' ? 'md:col-span-1' : ''}`}>
            <div className={`font-semibold ${locale === 'en' ? 'mb-3' : 'text-[--color-accent] mb-2'}`}>{t('brand')}</div>
            <p className="text-gray-600 dark:text-gray-400">Friendly, clear, professional. Authentic Nepali tea, brewed right.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Links</div>
            <ul className="space-y-1">
              <li><Link to={`${prefix}/about`} className="hover:underline">About</Link></li>
              <li><Link to={`${prefix}/visit`} className="hover:underline">Visit</Link></li>
              <li><Link to={`${prefix}/contact`} className="hover:underline">Contact</Link></li>
              <li><Link to={`${prefix}/menu`} className="hover:underline">Menu</Link></li>
              <li><Link to={`${prefix}/events`} className="hover:underline">Events</Link></li>
              <li><Link to={`${prefix}/press`} className="hover:underline">Press</Link></li>
              <li><Link to={`${prefix}/careers`} className="hover:underline">Careers</Link></li>
              <li><Link to={`${prefix}/gift-cards`} className="hover:underline">Gift Cards</Link></li>
              <li><Link to={`${prefix}/faqs`} className="hover:underline">FAQs</Link></li>
              <li><Link to={`${prefix}/blog`} className="hover:underline">Blog</Link></li>
              <li><Link to={`${prefix}/policy/shipping`} className="hover:underline">Shipping Policy</Link></li>
              <li><Link to={`${prefix}/policy/returns`} className="hover:underline">Returns & Refunds</Link></li>
              <li><Link to={`${prefix}/policy/terms`} className="hover:underline">Terms & Conditions</Link></li>
              <li><Link to={`${prefix}/policy/privacy`} className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className={`${locale === 'en' ? '' : ''}`}>
            <div className="font-semibold mb-2">Contact</div>
            <ul className="space-y-1">
              <li>Email: <a href="mailto:support@hamrochiya.com" className="hover:underline">support@hamrochiya.com</a></li>
              <li>Phone: <a href="tel:+97711234567" className="hover:underline">+977 1 1234567</a></li>
              <li>Address: 23 Tea Street, Thamel, Kathmandu</li>
              <li><a href="https://maps.app.goo.gl/your-map-link-here" target="_blank" rel="noreferrer" className="hover:underline">View on Maps</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Follow</div>
            <ul className="space-y-1">
              <li><a href="https://instagram.com/yourhandle" target="_blank" rel="noreferrer" className="hover:underline">Instagram</a></li>
              <li><a href="https://facebook.com/yourpage" target="_blank" rel="noreferrer" className="hover:underline">Facebook</a></li>
              <li><a href="https://x.com/yourhandle" target="_blank" rel="noreferrer" className="hover:underline">X</a></li>
              <li><a href="https://youtube.com/yourchannel" target="_blank" rel="noreferrer" className="hover:underline">YouTube</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={`max-w-6xl mx-auto px-4 ${locale === 'en' ? 'mt-10' : 'mt-6'} text-center text-gray-600 dark:text-gray-400`}>
        &copy; {year} {t('brand')} • {t('footer.location')}
      </div>
    </footer>
  )
}
