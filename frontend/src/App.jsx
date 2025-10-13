import { LandingPage } from './pages/landing/Landing'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { LoginUser } from './pages/Auth/login/Login'
import { SiginUser } from './pages/Auth/register/Register'
import { ForgotPass } from './pages/Auth/resetPass/ForgortPass'
import { ResetPass } from './pages/Auth/resetPass/ResetPass'
import { AuthProvider } from './contexts/authContext'

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginUser />} />
          <Route path='/register' element={<SiginUser />} />
          <Route path='/forgot' element={<ForgotPass />} />
          <Route path='/resetPass/:token' element={<ResetPass />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App