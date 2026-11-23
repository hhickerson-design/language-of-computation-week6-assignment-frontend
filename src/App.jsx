import BooksPage from './books/BooksPage.jsx'

// The app's frame. Members and Loans screens will be added to the nav
// once the backend has endpoints for them.
export default function App() {
  return (
    <>
      <header className="app-header">
        <h1>Library</h1>
        <nav>
          <a href="#books" className="active">
            Books
          </a>
        </nav>
      </header>
      <main>
        <BooksPage />
      </main>
    </>
  )
}
