
import Body from "./Body"
import TaskAdd from "./TaskAdd"
import Header from "./Header"
import PasswordForgot from "./PasswordForgot.jsx"

import { useState } from "react"
import Account from "./Account.jsx"
import { useAuth } from "./AuthContext.jsx"

function Home () {

  const {accountActive, setAccountActive, setUser, user} = useAuth()

  const [isActive, setActive]         = useState(false) // sostoyaniye dlya pokaza TaskAdd modal
  const [tasks, setTasks]             = useState([])    // Tasks danniye kotoriye dobavilis nedavno
  const [detailsCard, setDetailsCard] = useState()      // detali o karte (danniye)
  const [editCard, setEditCard]       = useState(false) // sostoyaniye izmenyatsya danniye ili net

  const [modeAuth, setModeAuth]           = useState(false)
  const [passwordMode, setPasswordMode]   = useState(false) // forgot password modal


  return (
    <>
      {/* {modeAuth ? <AuthModal  setAuthData={setAuthData} setAccountActive={setAccountActive} setPasswordMode={setPasswordMode} /> : null } */}
      { passwordMode ? <PasswordForgot/> : null }
      <Header setModeAuth={setModeAuth}  accountActive={accountActive} setActive={setActive}/>
      { accountActive ? <Account setAccountActive={setAccountActive} /> : null }
      <Body    setEditCard={setEditCard} setDetailsCard={setDetailsCard} detailsCard={detailsCard} setActive={setActive} tasks={tasks} setTasks={setTasks}/>  
      <TaskAdd tasks={tasks} setEditCard={setEditCard} editCard={editCard} detailsCard={detailsCard} setActive={setActive} active={isActive} setTasks={setTasks}/>   
    </>
  )
}
 
export default Home
