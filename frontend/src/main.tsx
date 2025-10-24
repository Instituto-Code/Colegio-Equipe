import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/authContext.js'
import { CoordenadorProvider } from './contexts/coordenadorContext.js'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CoordenadorProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </CoordenadorProvider>
    </AuthProvider>
  </StrictMode>
)
