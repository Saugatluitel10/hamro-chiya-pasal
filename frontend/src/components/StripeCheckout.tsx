import { useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

function Inner({ amountNpr, onSuccess, onError }: { amountNpr: number; onSuccess: () => void; onError: (msg?: string) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setBusy(true)
    try {
      const result = await stripe.confirmPayment({ elements, redirect: 'if_required' })
      if (result.error) {
        onError(result.error.message || 'Payment failed')
        return
      }
      onSuccess()
    } catch {
      onError('Payment failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-3">
      <PaymentElement options={{ layout: 'tabs' }} />
      <button
        type="button"
        onClick={handlePay}
        disabled={busy || !stripe || !elements}
        className="w-full inline-flex items-center justify-center rounded-md bg-[--color-primary] text-white px-3 py-2 text-sm hover:bg-[#6f1616] disabled:opacity-60"
      >
        {busy ? 'Processing…' : `Pay NPR ${amountNpr}`}
      </button>
    </div>
  )
}

export default function StripeCheckout({ clientSecret, publishableKey, amountNpr, onSuccess, onError }: { clientSecret: string; publishableKey: string; amountNpr: number; onSuccess: () => void; onError: (msg?: string) => void }) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey])
  const options = useMemo(() => ({ clientSecret, appearance: { theme: 'stripe' as const } }), [clientSecret])
  return (
    <Elements stripe={stripePromise} options={options}>
      <Inner amountNpr={amountNpr} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
