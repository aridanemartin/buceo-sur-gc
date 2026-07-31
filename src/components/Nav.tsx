import { useState, useEffect } from 'react'
import styles from './Nav.module.css'
import type { Locale } from '../i18n/locales'

interface NavLink {
  label: string
  href: string
}

interface LocaleLink {
  locale: Locale
  label: string
  href: string
}

interface NavProps {
  lang: Locale
  items: NavLink[]
  localeLinks: LocaleLink[]
  bookHref: string
  bookLabel: string
}

export default function Nav({ lang, items, localeLinks, bookHref, bookLabel }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
        <a href={items[0]?.href ?? '/'} className={styles.logo}>
          <span className={styles.logoText}>Buceo Sur</span>
          <span className={styles.logoSub}>Gran Canaria</span>
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {items.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={styles.link} onClick={() => setMenuOpen(false)}>
                {item.label}
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
              🌐 {lang.toUpperCase()}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {langOpen && (
              <ul className={styles.langDropdown} role="listbox">
                {localeLinks.map((l) => (
                  <li key={l.locale} role="option" aria-selected={lang === l.locale}>
                    <a href={l.href} className={`${styles.langOption} ${lang === l.locale ? styles.langActive : ''}`}>
                      <span className={styles.langCode}>{l.locale.toUpperCase()}</span>
                      <span>{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <a href={bookHref} target="_blank" rel="noopener noreferrer" className={styles.cta} onClick={() => setMenuOpen(false)}>
              {bookLabel}
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
