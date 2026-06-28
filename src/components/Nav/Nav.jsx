import { useState, useEffect } from 'react'
import styles from './Nav.module.css'
import { translations } from '../../i18n'

const navHrefs = ['#nosotros', '#servicios', '#servicios', '#contacto']

const languages = [
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'fr', label: 'FR', full: 'Français' },
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'de', label: 'DE', full: 'Deutsch' },
]

export default function Nav({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const tx = translations[lang]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setLangOpen(false)
    if (langOpen) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [langOpen])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav} aria-label="Navegación principal">
        <a href="#inicio" className={styles.logo}>
          <span className={styles.logoText}>Buceo Sur</span>
          <span className={styles.logoSub}>Gran Canaria</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {tx.nav.map((label, i) => (
            <li key={label}>
              <a
                href={navHrefs[i]}
                className={styles.link}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}

          <li className={styles.langItem} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.langBtn}
              onClick={() => setLangOpen((o) => !o)}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              🌐 {languages.find((l) => l.code === lang)?.label}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {langOpen && (
              <ul className={styles.langDropdown} role="listbox">
                {languages.map(({ code, label, full }) => (
                  <li key={code} role="option" aria-selected={lang === code}>
                    <button
                      className={`${styles.langOption} ${lang === code ? styles.langActive : ''}`}
                      onClick={() => { setLang(code); setLangOpen(false) }}
                    >
                      <span className={styles.langCode}>{label}</span>
                      <span>{full}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <a href="#contacto" className={styles.cta} onClick={() => setMenuOpen(false)}>
              {tx.book}
            </a>
          </li>
        </ul>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  )
}
