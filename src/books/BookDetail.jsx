import { useEffect, useState } from 'react'
import { getBook } from '../api.js'
import Cover from './Cover.jsx'

// A side panel with every field the backend stores for one book.
// The parent gives it key={id}, so picking another book starts a fresh panel.
export default function BookDetail({ id, onClose }) {
  const [book, setBook] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getBook(id)
      .then((data) => !cancelled && setBook(data))
      .catch((err) => !cancelled && setError(err.message))
    return () => {
      cancelled = true
    }
  }, [id])

  // Close with the Escape key.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="detail-backdrop" onClick={onClose}>
      <aside className="detail-panel" role="dialog" aria-label="Book details" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {error && <p className="message error">{error}</p>}
        {!book && !error && <p className="message">Loading…</p>}

        {book && (
          <>
            <Cover book={book} large />
            <h2>{book.title}</h2>
            {book.original_title && book.original_title !== book.title && (
              <p className="subtle">Originally published as “{book.original_title}”</p>
            )}
            <p className="detail-authors">{book.authors}</p>
            <dl>
              <Field label="Published" value={book.original_publication_year} />
              <Field
                label="Average rating"
                value={book.average_rating != null ? `★ ${book.average_rating.toFixed(2)}` : null}
              />
              <Field label="Number of ratings" value={book.ratings_count?.toLocaleString()} />
              <Field label="Language" value={book.language_code} />
              <Field label="ISBN-10" value={book.isbn} />
              <Field label="ISBN-13" value={book.isbn13} />
              <Field label="Library ID" value={book.id} />
            </dl>
          </>
        )}
      </aside>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value ?? '—'}</dd>
    </>
  )
}
