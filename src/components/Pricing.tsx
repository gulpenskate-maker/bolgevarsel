import styles from './Pricing.module.css'
import { PLANS } from '@/lib/plans'

export default function Pricing() {
  return (
    <div className={styles.wrap} id="pris">
      <div className={styles.inner}>
        <span className={styles.label}>Priser</span>
        <h2 className={styles.title}>Enkle, transparente<br/>abonnementer</h2>
        <p className={styles.trial}>7 dager gratis — kortet belastes ikke før etter prøveperioden</p>
        <div className={styles.plans}>
          {PLANS.map((plan) => (
            <div key={plan.id} className={`${styles.plan} ${plan.featured ? styles.featured : ''}`}>
              {plan.featured && <div className={styles.badge}>Mest populær</div>}
              {!plan.smsEnabled && <div className={styles.badgeEmail}>Kun e-post</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.price}>{plan.price}<span className={styles.suffix}>kr</span></div>
              <div className={styles.per}>per måned</div>
              <ul className={styles.features}>{plan.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <a href={`/registrer?plan=${plan.id}`} className={styles.planBtn}>Kom i gang</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
