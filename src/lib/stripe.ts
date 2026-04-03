export const PLANS = {
  basis: {
    name: 'Basis',
    price: 49,
    priceId: 'price_1TI5ooDF2t9Ys3TQvOQMK6c7',
  },
  familie: {
    name: 'Familie',
    price: 99,
    priceId: 'price_1TI5otDF2t9Ys3TQQeZqW0Bh',
  },
  pro: {
    name: 'Pro',
    price: 199,
    priceId: 'price_1TI5owDF2t9Ys3TQai5tcWFQ',
  },
}

async function stripeRequest(path: string, body?: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body ? new URLSearchParams(body).toString() : undefined,
  })
  return res.json()
}

export async function getOrCreateCustomer(email: string) {
  const list = await stripeRequest(`/customers?email=${encodeURIComponent(email)}&limit=1`)
  if (list.data?.length > 0) return list.data[0]
  return stripeRequest('/customers', { email })
}

export async function createCheckoutSession(customerId: string, priceId: string, email: string, plan: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  return stripeRequest('/checkout/sessions', {
    customer: customerId,
    mode: 'subscription',
    'payment_method_types[0]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: `${siteUrl}/velkommen?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/registrer`,
    'metadata[email]': email,
    'metadata[plan]': plan,
  })
}

export async function constructWebhookEvent(body: string, sig: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET!
  const parts = sig.split(',').reduce((acc: Record<string, string>, part) => {
    const [k, v] = part.split('=')
    acc[k] = v
    return acc
  }, {})
  const timestamp = parts['t']
  const payload = `${timestamp}.${body}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const expected = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
  if (expected !== parts['v1']) throw new Error('Invalid signature')
  return JSON.parse(body)
}
