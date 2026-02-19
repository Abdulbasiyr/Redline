import { Route, Routes } from 'react-router-dom'
import './app.css'
import Home from './Home'
import AuthModal from './AuthModal'
import PasswordForgot from './PasswordForgot'
import { useState } from 'react'

const App = () => {

  const [authData, setAuthData]           = useState({})


  return(
    <Routes>  
      <Route path='/' element={ <Home setAuthData={setAuthData} authData={authData} /> } />
      <Route path='/auth' element={ <AuthModal setAuthData={setAuthData} /> } />
      <Route path='/auth/forgotPassword' element={ <PasswordForgot /> } />
    </Routes>
  )
}

export default App