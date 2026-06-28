import { useState } from 'react'
import styles from './Contact.module.css'

export default function Contact() {
  const [fields, setFields] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    setFields((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sent')
  }

  return (
    <section id="contacto" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p className={styles.eyebrow}>Ponte en contacto</p>
          <h2 className={styles.title}>¿Listo para bucear?</h2>
          <p className={styles.subtitle}>
            Contáctanos por email o WhatsApp. Solemos estar en el agua, así que
            responderemos en cuanto podamos.
          </p>

          <ul className={styles.details}>
            <li>
              <span className={styles.detailIcon} aria-hidden="true">✉</span>
              <div>
                <strong>Email</strong>
                <a href="mailto:buceosur.gc@gmail.com" className={styles.detailLink}>
                  buceosur.gc@gmail.com
                </a>
              </div>
            </li>
            <li>
              <span className={styles.detailIcon} aria-hidden="true">📱</span>
              <div>
                <strong>Teléfono / WhatsApp</strong>
                <a href="tel:+34651352573" className={styles.detailLink}>
                  +34 651 35 25 73 — Anne
                </a>
                <a href="tel:+34655989917" className={styles.detailLink}>
                  +34 655 98 99 17 — Yann (instruc.)
                </a>
              </div>
            </li>
            <li>
              <span className={styles.detailIcon} aria-hidden="true">📍</span>
              <div>
                <strong>Dirección</strong>
                <address className={styles.address}>
                  Calle Roger de Lauria, 80<br />
                  Playa de Arinaga<br />
                  Gran Canaria, España
                </address>
              </div>
            </li>
          </ul>

          <div className={styles.social}>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.tripadvisor.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="TripAdvisor"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
                <path d="M12 7l-1 3-3 .5 2 2-.5 3L12 14l2.5 1.5-.5-3 2-2-3-.5z" />
              </svg>
              TripAdvisor
            </a>
          </div>
        </div>

        <div className={styles.formWrap}>
          {status === 'sent' ? (
            <div className={styles.success} role="alert">
              <span className={styles.successIcon}>✓</span>
              <h3>¡Mensaje enviado!</h3>
              <p>Te responderemos lo antes posible por email o WhatsApp.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <h3 className={styles.formTitle}>Envíanos un mensaje</h3>

              <div className={styles.field}>
                <label htmlFor="name" className={styles.label}>Nombre *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={styles.input}
                  value={fields.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={styles.input}
                  value={fields.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="message" className={styles.label}>Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  rows={5}
                  value={fields.message}
                  onChange={handleChange}
                  required
                  placeholder="¿Qué te gustaría hacer? ¿Cuándo?"
                />
              </div>

              <button type="submit" className={styles.submit}>
                Enviar mensaje
              </button>

              <p className={styles.privacy}>
                Tus datos se usan únicamente para responder tu consulta.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
