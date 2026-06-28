import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>Buceo Sur</span>
          <span className={styles.sub}>Gran Canaria · España</span>
          <p className={styles.tagline}>
            Inmersiones en toda la isla — todo el año
          </p>
        </div>

        <nav className={styles.links} aria-label="Navegación del pie de página">
          <div>
            <h4 className={styles.linkGroup}>Servicios</h4>
            <ul>
              <li><a href="#servicios">Bautismo de Buceo</a></li>
              <li><a href="#servicios">Cursos</a></li>
              <li><a href="#servicios">Inmersiones</a></li>
              <li><a href="#servicios">Sidemount</a></li>
            </ul>
          </div>
          <div>
            <h4 className={styles.linkGroup}>Empresa</h4>
            <ul>
              <li><a href="#nosotros">Nosotros</a></li>
              <li><a href="#contacto">Contacto</a></li>
              <li><a href="mailto:buceosur.gc@gmail.com">Email</a></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Buceo Sur Gran Canaria. Todos los derechos reservados.</p>
        <p>Textos: Anne Debroise · Fotografías: Juan Antonio / DR</p>
      </div>
    </footer>
  )
}
