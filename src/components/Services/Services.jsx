import styles from './Services.module.css'

const services = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="24" cy="24" r="20" />
        <path d="M24 14v10l6 6" />
        <circle cx="24" cy="24" r="3" fill="currentColor" stroke="none" />
      </svg>
    ),
    title: 'Bautismo de Buceo',
    description:
      'Tu primera inmersión en el mar. Sin experiencia previa, con un instructor certificado que te acompaña en todo momento. Descubre el mundo submarino de Gran Canaria de forma segura y emocionante.',
    tags: ['Para todos', 'Sin requisitos', 'Instructor incluido'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 36V22a12 12 0 0 1 24 0v14" />
        <path d="M8 36h32" />
        <path d="M18 36v4M30 36v4" />
        <circle cx="24" cy="20" r="4" />
      </svg>
    ),
    title: 'Cursos de Buceo',
    description:
      'Formación completa desde nivel Open Water hasta especialidades técnicas. Cursos certificados por PADI, SSI y FSGT, adaptados a tu ritmo y nivel de experiencia.',
    tags: ['PADI', 'SSI', 'FSGT'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 36 Q12 24 20 28 Q28 32 36 20 Q40 14 42 12" />
        <circle cx="24" cy="28" r="2" fill="currentColor" stroke="none" />
        <path d="M6 40h36" />
      </svg>
    ),
    title: 'Inmersiones y Estancias',
    description:
      'Explora más de 50 puntos de inmersión alrededor de la isla: cuevas volcánicas, arcos naturales, vida marina tropical y pecios históricos. Paquetes con alojamiento disponibles.',
    tags: ['+50 puntos', 'Todo el año', 'Pack alojamiento'],
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="10" y="16" width="12" height="20" rx="4" />
        <rect x="26" y="16" width="12" height="20" rx="4" />
        <path d="M22 26h4" />
        <path d="M16 12v4M32 12v4" />
      </svg>
    ),
    title: 'Sidemount',
    description:
      'La técnica de buceo con las botellas laterales al cuerpo. Mayor comodidad, mejor hidrodinámica y mayor seguridad. Formación específica con instructores especializados.',
    tags: ['Técnico', 'Especialización', 'Iniciación disponible'],
  },
]

export default function Services() {
  return (
    <section id="servicios" className={styles.section}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Lo que ofrecemos</p>
        <h2 className={styles.title}>Servicios de buceo en Gran Canaria</h2>
        <p className={styles.subtitle}>
          Desde tu primera inmersión hasta el buceo técnico avanzado, tenemos el
          programa perfecto para ti.
        </p>
      </div>

      <div className={styles.grid}>
        {services.map(({ icon, title, description, tags }) => (
          <article key={title} className={styles.card}>
            <div className={styles.iconWrap}>{icon}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardBody}>{description}</p>
            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag} className={styles.tag}>{tag}</li>
              ))}
            </ul>
            <a href="#contacto" className={styles.cardLink}>
              Más información →
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
