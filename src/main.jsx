import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AuraApp from './AuraApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuraApp />
  </StrictMode>,
)
