import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/archivo-black/400.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/ibm-plex-mono/400.css'

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)