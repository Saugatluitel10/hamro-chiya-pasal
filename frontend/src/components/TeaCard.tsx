import { motion } from 'framer-motion'
import { useI18n } from '../i18n/I18nProvider'

export type TeaCardProps = {
  titleNepali: string
  titleEnglish?: string
  priceNpr?: number
  imageUrl?: string
  ingredients?: string[]
  healthBenefits?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  seasonal?: boolean
}

export default function TeaCard({
  titleNepali,
  titleEnglish,
  priceNpr,
  imageUrl,
  ingredients,
  healthBenefits,
  difficulty,
  seasonal,
}: TeaCardProps) {
  const { t } = useI18n()
  const diffText = difficulty ? t(`teacard.diff.${String(difficulty).toLowerCase()}`) : undefined
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow hover:shadow-md transition-shadow"
    >
      {imageUrl && (
        <div className="relative h-40 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={titleEnglish || titleNepali}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          {seasonal && (
            <div className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-xs font-medium text-white shadow">
              {t('teacard.seasonal')}
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{titleNepali}</h3>
            {titleEnglish && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{titleEnglish}</p>
            )}
          </div>
          {typeof priceNpr === 'number' && (
            <div className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              {t('teacard.pricePrefix')} {priceNpr}
            </div>
          )}
        </div>

        {(ingredients?.length || healthBenefits?.length || difficulty) && (
          <div className="mt-3 space-y-2 text-sm">
            {ingredients?.length ? (
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('teacard.ingredients')}</span> {ingredients.join(', ')}
              </p>
            ) : null}
            {healthBenefits?.length ? (
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{t('teacard.benefits')}</span> {healthBenefits.join(', ')}
              </p>
            ) : null}
            {difficulty ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300"><span className="font-medium">{t('teacard.brew')}</span> {diffText}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </motion.article>
  )
}
