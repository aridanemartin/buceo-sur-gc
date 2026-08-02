// src/components/ContactForm.tsx
// React island: name/email/message fields with a client-side submitted-state
// confirmation (no backend), ported from the old SPA behavior.
import { type FormEvent, useState } from 'react'
import styles from './ContactForm.module.css'

export interface ContactFormLabels {
  name: string
  email: string
  message: string
  submit: string
  successTitle: string
  successText: string
}

interface ContactFormProps {
  labels: ContactFormLabels
}

export default function ContactForm({ labels }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <h3>{labels.successTitle}</h3>
        <p>{labels.successText}</p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-testid="contact-form">
      <label className={styles.field}>
        <span>{labels.name}</span>
        <input
          className={styles.input}
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder={labels.name}
        />
      </label>

      <label className={styles.field}>
        <span>{labels.email}</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={labels.email}
        />
      </label>

      <label className={styles.field}>
        <span>{labels.message}</span>
        <textarea
          className={styles.textarea}
          name="message"
          rows={6}
          required
          placeholder={labels.message}
        />
      </label>

      <button className={styles.submit} type="submit">
        {labels.submit}
      </button>
    </form>
  )
}
