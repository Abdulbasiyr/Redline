import { Route, Routes } from 'react-router-dom'
import '../styles/app.css'
import Home from './Home'
import AuthModal from './AuthModal'
import PasswordForgot from './PasswordForgot'
import { useState } from 'react'

const App = () => {

  const [authData, setAuthData]           = useState({})
  const [tasks, setTasks]                 = useState([])    // Tasks danniye kotoriye dobavilis nedavno

  return(
    <Routes>  
      <Route path='/' element={ <Home setTasks={setTasks} tasks={tasks} setAuthData={setAuthData} authData={authData} /> } />
      <Route path='/auth' element={ <AuthModal setTasks={setTasks} setAuthData={setAuthData} /> } />
      <Route path='/auth/forgotPassword' element={ <PasswordForgot /> } />
    </Routes>
  )
}

export default App