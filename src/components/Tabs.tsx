import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import styles from './Tabs.module.css'

// src/components/Tabs.tsx
// Accessible tabs island (WAI-ARIA tabs pattern). The Astro caller passes one
// named slot per tab id — e.g. <div slot="info">…</div> — and the slot content
// lands in props[id], rendered server-side by Astro before hydration.

export interface TabDef {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabDef[]
  label: string
  idPrefix?: string
  children?: unknown
  [slot: string]: unknown
}

export default function Tabs({ tabs, label, idPrefix = 'tabs', ...slots }: TabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? '')
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeId))

  // A single tab (e.g. when the Inmersiones tab is hidden) renders as plain
  // content: no tab strip, and the panel loses its tabpanel ARIA semantics
  // since there is no tablist to be labelled by.
  const withTabList = tabs.length > 1

  const tabId = (id: string) => `${idPrefix}-tab-${id}`
  const panelId = (id: string) => `${idPrefix}-panel-${id}`

  const activate = (index: number) => {
    const next = (index + tabs.length) % tabs.length
    setActiveId(tabs[next].id)
    document.getElementById(tabId(tabs[next].id))?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        activate(activeIndex + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        activate(activeIndex - 1)
        break
      case 'Home':
        e.preventDefault()
        activate(0)
        break
      case 'End':
        e.preventDefault()
        activate(tabs.length - 1)
        break
    }
  }

  return (
    <div className={styles.tabs}>
      {withTabList && (
        <div role="tablist" aria-label={label} className={styles.tablist}>
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              id={tabId(t.id)}
              role="tab"
              aria-selected={activeId === t.id}
              aria-controls={panelId(t.id)}
              tabIndex={activeId === t.id ? 0 : -1}
              className={activeId === t.id ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              onClick={() => setActiveId(t.id)}
              onKeyDown={onKeyDown}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      {tabs.map((t) => (
        <div
          key={t.id}
          id={panelId(t.id)}
          role={withTabList ? 'tabpanel' : undefined}
          aria-labelledby={withTabList ? tabId(t.id) : undefined}
          className={styles.panel}
          hidden={activeId !== t.id}
          tabIndex={withTabList ? 0 : undefined}
        >
          {slots[t.id]}
        </div>
      ))}
    </div>
  )
}
