import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/authContext.js'
import { CoordenadorProvider } from './contexts/coordenadorContext.js'
import { Toaster } from 'sonner'
import { TeachProvider } from './contexts/teacherContext.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CoordenadorProvider>
          <TeachProvider>
            <App />
            <Toaster />
          </TeachProvider>
        </CoordenadorProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
