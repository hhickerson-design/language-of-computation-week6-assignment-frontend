import { useState } from 'react'

// A book's cover image, or a letter tile when there's no usable cover.
export default function Cover({ book, large = false }) {
  const [failed, setFailed] = useState(false)
  // Goodreads uses a "nophoto" placeholder for books without a cover.
  const usable = book.image_url && !book.image_url.includes('nophoto') && !failed
  return usable ? (
    <img
      className={`cover ${large ? 'large' : ''}`}
      src={book.image_url}
      alt={`Cover of ${book.title}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className={`cover placeholder ${large ? 'large' : ''}`} aria-hidden="true">
      {book.title.slice(0, 1)}
    </span>
  )
}
