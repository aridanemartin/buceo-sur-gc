import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-label="Portada">
      <div className={styles.vignette} />
      <img
        src="/logo.png"
        alt="Buceo Sur Gran Canaria"
        className={styles.logo}
        width={480}
        height={186}
      />
      <a href="#nosotros" className={styles.scroll} aria-label="Ir a la siguiente sección">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </a>
    </section>
  )
}
