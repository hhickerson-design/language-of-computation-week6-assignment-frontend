import { useEffect, useState } from 'react'
import { listBooks } from '../api.js'
import BookDetail from './BookDetail.jsx'
import Cover from './Cover.jsx'
import './books.css'

const PAGE_SIZE = 20

const SORT_OPTIONS = [
  { value: 'id', label: 'Default order' },
  { value: 'title', label: 'Title' },
  { value: 'rating', label: 'Average rating' },
  { value: 'ratings_count', label: 'Number of ratings' },
  { value: 'year', label: 'Publication year' },
]

const EMPTY_FILTERS = { q: '', author: '', min_rating: '', sort: 'id', descending: false }

export default function BooksPage() {
  // What's typed in the form, vs. what we last searched for.
  // Splitting them means the list only reloads when you press Search.
  const [draft, setDraft] = useState(EMPTY_FILTERS)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [offset, setOffset] = useState(0)

  // The last answer from the backend, tagged with the search it answers.
  // While a new search is in flight, the old books stay on screen (dimmed).
  const [result, setResult] = useState(null) // { key, page, error }
  const [selectedId, setSelectedId] = useState(null)

  const requestKey = JSON.stringify({ ...filters, offset })
  const loading = result?.key !== requestKey
  const page = result?.page // { total, limit, offset, items }
  const error = loading ? null : result.error

  useEffect(() => {
    let cancelled = false // ignore answers to searches the user has moved past
    listBooks({ ...filters, limit: PAGE_SIZE, offset })
      .then((data) => !cancelled && setResult({ key: requestKey, page: data, error: null }))
      .catch((err) => !cancelled && setResult({ key: requestKey, page: null, error: err.message }))
    return () => {
      cancelled = true
    }
  }, [filters, offset, requestKey])

  function updateDraft(field, value) {
    setDraft((d) => ({ ...d, [field]: value }))
  }

  function search(event) {
    event.preventDefault()
    setFilters(draft)
    setOffset(0)
  }

  function clear() {
    setDraft(EMPTY_FILTERS)
    setFilters(EMPTY_FILTERS)
    setOffset(0)
  }

  const total = page?.total ?? 0
  const firstShown = total === 0 ? 0 : offset + 1
  const lastShown = Math.min(offset + PAGE_SIZE, total)

  return (
    <section className="books-page">
      <form className="book-filters" onSubmit={search}>
        <label>
          Title
          <input
            type="search"
            value={draft.q}
            placeholder="e.g. hunger games"
            onChange={(e) => updateDraft('q', e.target.value)}
          />
        </label>
        <label>
          Author
          <input
            type="search"
            value={draft.author}
            placeholder="e.g. rowling"
            onChange={(e) => updateDraft('author', e.target.value)}
          />
        </label>
        <label>
          Min. rating
          <select value={draft.min_rating} onChange={(e) => updateDraft('min_rating', e.target.value)}>
            <option value="">Any</option>
            <option value="3">3+</option>
            <option value="3.5">3.5+</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
          </select>
        </label>
        <label>
          Sort by
          <select value={draft.sort} onChange={(e) => updateDraft('sort', e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={draft.descending}
            onChange={(e) => updateDraft('descending', e.target.checked)}
          />
          Highest first
        </label>
        <div className="filter-buttons">
          <button type="submit">Search</button>
          <button type="button" className="secondary" onClick={clear}>
            Clear
          </button>
        </div>
      </form>

      {error && <p className="message error">{error}</p>}

      {!error && (
        <>
          <div className="results-bar">
            <span>
              {loading ? 'Loading…' : `Showing ${firstShown}–${lastShown} of ${total.toLocaleString()} books`}
            </span>
            <Pager offset={offset} total={total} loading={loading} onChange={setOffset} />
          </div>

          {!loading && total === 0 && <p className="message">No books match those filters.</p>}

          <ul className={`book-grid ${loading ? 'is-loading' : ''}`}>
            {page?.items.map((book) => (
              <li key={book.id}>
                <button type="button" className="book-card" onClick={() => setSelectedId(book.id)}>
                  <Cover book={book} />
                  <span className="book-title">{book.title}</span>
                  <span className="book-authors">{book.authors}</span>
                  <span className="book-meta">
                    {book.average_rating != null && <>★ {book.average_rating.toFixed(2)}</>}
                    {book.original_publication_year != null && <> · {book.original_publication_year}</>}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {total > PAGE_SIZE && (
            <div className="results-bar bottom">
              <Pager offset={offset} total={total} loading={loading} onChange={setOffset} />
            </div>
          )}
        </>
      )}

      {selectedId != null && (
        <BookDetail key={selectedId} id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </section>
  )
}

function Pager({ offset, total, loading, onChange }) {
  const pageNumber = Math.floor(offset / PAGE_SIZE) + 1
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return (
    <span className="pager">
      <button type="button" disabled={loading || offset === 0} onClick={() => onChange(offset - PAGE_SIZE)}>
        ← Previous
      </button>
      <span>
        Page {pageNumber} of {pageCount.toLocaleString()}
      </span>
      <button
        type="button"
        disabled={loading || offset + PAGE_SIZE >= total}
        onClick={() => onChange(offset + PAGE_SIZE)}
      >
        Next →
      </button>
    </span>
  )
}
