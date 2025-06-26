import { useState } from 'react'
import { LoginUser } from './pages/Register/Login/Login'
import { SiginUser } from './pages/Register/SignIn/SignIn'
import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<LoginUser/>}/>
      <Route path='/SignIn' element={<SiginUser/>}/>
    </Routes>
    
    </>
  )
}

export default App
