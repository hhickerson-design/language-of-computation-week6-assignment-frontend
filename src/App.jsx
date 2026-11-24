import BooksPage from './books/BooksPage.jsx'

// The app's frame. Members and Loans screens will be added to the nav
// once the backend has endpoints for them.
export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <a href="#books" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 21.5v-2Z" />
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H19" />
                <path d="M9 7h6" />
              </svg>
            </span>
            <span className="brand-text">
              <span className="brand-name">Library</span>
              <span className="brand-tagline">Books · Members · Loans</span>
            </span>
          </a>
          <nav aria-label="Main">
            <a href="#books" className="active" aria-current="page">
              Books
            </a>
          </nav>
        </div>
      </header>
      <main>
        <BooksPage />
      </main>
    </>
  )
}
