import styles from './About.module.css'

const stats = [
  { value: '20+', label: 'Años de experiencia' },
  { value: '50+', label: 'Puntos de inmersión' },
  { value: '22°C', label: 'Temperatura media' },
  { value: '12', label: 'Meses al año' },
]

export default function About() {
  return (
    <section id="nosotros" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>Quiénes somos</p>
          <h2 className={styles.title}>
            Inmersiones en toda la isla de Gran Canaria
          </h2>
          <p className={styles.body}>
            Somos un centro de buceo certificado por el Gobierno de Canarias, la FSGT, SSI y PADI,
            ubicado en <strong>Playa de Arinaga</strong>. Ofrecemos inmersiones en los enclaves
            más espectaculares de la isla: formaciones volcánicas, cuevas, arcos y una fauna
            tropical única que te sorprenderá en cada zambullida.
          </p>
          <p className={styles.body}>
            Nuestro equipo bilingüe — francés, español, inglés y alemán — te acompaña
            desde tu primer bautismo hasta el nivel técnico en Sidemount.
          </p>

          <ul className={styles.certifications} aria-label="Certificaciones">
            <li className={styles.cert}>✓ Gobierno de Canarias</li>
            <li className={styles.cert}>✓ FSGT</li>
            <li className={styles.cert}>✓ SSI</li>
            <li className={styles.cert}>✓ PADI</li>
          </ul>
        </div>

        <div className={styles.video}>
          <div className={styles.videoWrapper}>
            <iframe
              src="https://www.youtube-nocookie.com/embed/3ZaJwr3My3Y?wmode=transparent&vq=hd1080"
              title="Inmersión en alta definición — Gran Canaria"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className={styles.videoCaption}>Inmersión en alta definición · Gran Canaria</p>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map(({ value, label }) => (
          <div key={label} className={styles.stat}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
