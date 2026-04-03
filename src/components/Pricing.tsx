import styles from './Pricing.module.css'

const plans = [
  { name: 'Basis', price: '49', features: ['1 lokasjon', '1 mottaker', 'Daglig SMS kl. 07:30', 'Bølge, vind og temperatur'], featured: false },
  { name: 'Familie', price: '99', features: ['1 lokasjon', 'Opptil 3 mottakere', 'Daglig SMS kl. 07:30', 'Bølge, vind og temperatur', 'Farevarsel ved kuling'], featured: true },
  { name: 'Pro', price: '199', features: ['5 lokasjoner', 'Opptil 5 mottakere', 'Daglig SMS kl. 07:30', 'Ukentlig rapport', 'Farevarsel ved kuling'], featured: false },
]

export default function Pricing() {
  return (
    <div className={styles.wrap} id="pris">
      <div className={styles.inner}>
        <span className={styles.label}>Priser</span>
        <h2 className={styles.title}>Enkle, transparente<br/>abonnementer</h2>
        <div className={styles.plans}>
          {plans.map((plan) => (
            <div key={plan.name} className={`${styles.plan} ${plan.featured ? styles.featured : ''}`}>
              {plan.featured && <div className={styles.badge}>Mest populær</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.price}>{plan.price}<span className={styles.suffix}>kr</span></div>
              <div className={styles.per}>per måned</div>
              <ul className={styles.features}>{plan.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <a href="#" className={styles.planBtn}>Kom i gang</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
