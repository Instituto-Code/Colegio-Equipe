import { useState } from 'react'
import { LandingPage } from './pages/landing/Landing'

import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LoginUser } from './pages/Auth/login/Login'
import { SiginUser } from './pages/Auth/register/Register'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/login' element={<LoginUser/>}/>
      <Route path='/register' element={<SiginUser/>}/>
    </Routes>
    </>
  )
}

export default App