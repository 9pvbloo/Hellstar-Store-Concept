import './App.css'

function App() {
  return (
    <main className="entry">
      <div className="entry__grain" aria-hidden="true" />
      <div className="entry__pattern" aria-hidden="true" />

      <header className="entry__header">
        <div className="entry__brand">
          HELLSTAR
        </div>

        <div className="entry__meta entry__meta--right">
          <span>2026</span>
          <span>UNOFFICIAL CONCEPT</span>
        </div>
      </header>

      <section className="entry__content">
        <div className="entry__emblem" aria-hidden="true">
          <div className="entry__emblem-inner">
            ✦
          </div>
        </div>

        <button className="entry__enter" type="button">
          ENTER
        </button>

        <p className="entry__subtitle">
          ANOTHER REALITY AWAITS
        </p>
      </section>

      <footer className="entry__footer">
        <span>PEOPLE / PLACES / IDEAS / BEYOND</span>

        <div className="entry__footer-center">
          <span className="entry__status-dot" />
          <span>HS / 001</span>
        </div>

        <span>NOT FROM HERE</span>
      </footer>
    </main>
  )
}

export default App