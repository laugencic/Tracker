import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './Tracker'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)