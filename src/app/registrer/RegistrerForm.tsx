'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './page.module.css'
import { PLANS } from '@/lib/plans'

export default function RegistrerForm() {
  const searchParams = useSearchParams()
  const defaultPlan = searchParams.get('plan') || 'familie'
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan: selectedPlan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error || 'Noe gikk galt')
    } catch {
      setError('Noe gikk galt. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a href="/" className={styles.logo}>bølge<span>varsel</span></a>
      </nav>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Velg ditt abonnement</h1>
          <p className={styles.sub}>14 dager gratis. Avslutt når du vil.</p>
        </div>
        <div className={styles.plans}>
          {PLANS.map((plan) => (
            <button key={plan.id} className={`${styles.plan} ${selectedPlan === plan.id ? styles.selected : ''} ${plan.featured ? styles.featured : ''}`} onClick={() => setSelectedPlan(plan.id)}>
              {plan.featured && <span className={styles.badge}>Mest populær</span>}
              {!plan.smsEnabled && <span className={styles.badge} style={{background:'#f0fdf4',color:'#16a34a'}}>Kun e-post</span>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>{plan.price}<span>kr/mnd</span></div>
              <div className={styles.planDesc}>
                {plan.lokasjoner} lokasjon{plan.lokasjoner > 1 ? 'er' : ''}
                {plan.mottakere > 0 ? ` · ${plan.mottakere} mottaker${plan.mottakere > 1 ? 'e' : ''}` : ' · Kun e-post'}
              </div>
              <ul className={styles.planFeatures}>{plan.features.map(f => <li key={f}>{f}</li>)}</ul>
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Din e-postadresse</label>
          <input className={styles.input} type="email" placeholder="hei@eksempel.no" value={email} onChange={e => setEmail(e.target.value)} required/>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Sender...' : 'Start gratis prøveperiode →'}
          </button>
          <p className={styles.hint}>Du legger inn lokasjon og mottakere etter betaling</p>
        </form>
      </div>
    </div>
  )
}
