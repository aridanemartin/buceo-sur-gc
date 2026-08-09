import { useEffect, useState } from 'react'
import type { Locale } from '../i18n/locales'
import { ui } from '../i18n/strings'
import { SITE } from '../lib/constants'
import styles from './Nav.module.css'

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
  homeHref: string
}

export default function Nav({ lang, items, localeLinks, bookHref, bookLabel, homeHref }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const a11y = ui[lang].a11y

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
      <nav className={styles.nav} aria-label={a11y.mainNav}>
        <a href={homeHref} className={styles.logo}>
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
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {langOpen && (
              <ul className={styles.langDropdown} role="listbox">
                {localeLinks.map((l) => (
                  <li key={l.locale} role="option" aria-selected={lang === l.locale}>
                    <a
                      href={l.href}
                      className={`${styles.langOption} ${lang === l.locale ? styles.langActive : ''}`}
                    >
                      <span className={styles.langCode}>{l.locale.toUpperCase()}</span>
                      <span>{l.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li>
            <a
              href={bookHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
              onClick={() => setMenuOpen(false)}
            >
              {bookLabel}
            </a>
          </li>

          <li className={styles.socialItem}>
            <div className={styles.socialRow}>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={styles.socialLink}
                onClick={() => setMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon} aria-hidden="true">
                  <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.631.771-1.631 1.562v1.878h2.773l-.443 2.91h-2.33v7.03C18.343 21.244 22 17.08 22 12.06" />
                </svg>
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={styles.socialLink}
                onClick={() => setMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={styles.socialIcon} aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"></circle>
                </svg>
              </a>
              <a
                href={SITE.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className={styles.socialLink}
                onClick={() => setMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.socialIcon} aria-hidden="true">
                  <path d="M23.498 6.186a3.02 3.02 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.02 3.02 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.02 3.02 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.02 3.02 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814M9.545 15.568V8.432L15.818 12z" />
                </svg>
              </a>
              <a
                href={SITE.social.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google review"
                className={styles.socialLink}
                onClick={() => setMenuOpen(false)}
              >
                <svg viewBox="0 0 24 24" className={styles.socialIcon} aria-hidden="true">
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24" />
                  <path fill="#FBBC05" d="M5.27 14.29a7.14 7.14 0 0 1 0-4.58V6.62H1.29a11.9 11.9 0 0 0 0 10.76z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96" />
                </svg>
              </a>
            </div>
          </li>
        </ul>

        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          aria-label={menuOpen ? a11y.closeMenu : a11y.openMenu}
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
