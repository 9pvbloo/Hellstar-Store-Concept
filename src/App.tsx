import './App.css'

import EntryLogo3D from './components/entry/EntryLogo3D'
import DotField from './components/backgrounds/DotField/DotField'

function App() {
  return (
    <main className="entry">
      {/* Grain */}
      <div
        className="entry__grain"
        aria-hidden="true"
      />

      {/* Interactive Dot Field */}
      <div
        className="entry__dot-field"
        aria-hidden="true"
      >
        <DotField
          dotRadius={0.7}
          dotSpacing={14}
          cursorRadius={500}
          bulgeStrength={67}
          glowRadius={260}
          baseColor="rgba(255, 255, 255, 0.20)"
          accentColor="rgba(255, 255, 255, 0.9)"
          glowColor="rgba(255, 255, 255, 0)"
        />
      </div>

      <div
        className="entry__corner-fade"
        aria-hidden="true"
      />

      {/* Existing technical pattern */}
      <div
        className="entry__pattern"
        aria-hidden="true"
      />

      {/* Header */}
      <header className="entry__header">
        <div className="entry__brand">
          HELLSTAR
        </div>

        <div className="entry__meta entry__meta--right">
          <span>2026</span>
          <span>UNOFFICIAL CONCEPT</span>
        </div>
      </header>

      {/* Main content */}
      <section className="entry__content">
        <div
          className="entry__emblem entry__emblem--3d"
          aria-hidden="true"
        >
          <EntryLogo3D />
        </div>

        <button
          className="entry__enter"
          type="button"
        >
          ENTER
        </button>

        <p className="entry__subtitle">
          ANOTHER REALITY AWAITS
        </p>
      </section>

      {/* Footer */}
      <footer className="entry__footer">
        <span>
          PEOPLE / PLACES / IDEAS / BEYOND
        </span>

        <div className="entry__footer-center">
          <span className="entry__status-dot" />
          <span>HS / 001</span>
        </div>

        <span>
          NOT FROM HERE
        </span>
      </footer>
    </main>
  )
}

export default App