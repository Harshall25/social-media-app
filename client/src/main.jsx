import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GLobalContextState } from './context/index.jsx'

createRoot(document.getElementById('root')).render(
  <GLobalContextState> 
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </GLobalContextState>


)
