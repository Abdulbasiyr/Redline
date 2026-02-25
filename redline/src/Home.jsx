
import Body from "./Body"
import TaskAdd from "./TaskAdd"
import Header from "./Header"
import PasswordForgot from "./PasswordForgot.jsx"

import { useState } from "react"
import Account from "./Account.jsx"
import { useAuth } from "./AuthContext.jsx"

function Home ({setTasks, tasks}) {

  const {accountActive, setAccountActive} = useAuth()

  const [isActive, setActive]         = useState(false) // sostoyaniye dlya pokaza TaskAdd modal
  const [detailsCard, setDetailsCard] = useState()      // detali o karte (danniye)
  const [editCard, setEditCard]       = useState(false) // sostoyaniye izmenyatsya danniye ili net

  const [modeAuth, setModeAuth]           = useState(false)
  const [passwordMode, setPasswordMode]   = useState(false) // forgot password modal
  const [search, setSearch]               = useState('')

  return (
    <>
      { passwordMode ? <PasswordForgot/> : null }
      <Header search={search} setSearch={setSearch} setModeAuth={setModeAuth}  accountActive={accountActive} setActive={setActive}/>
      { accountActive ? <Account setAccountActive={setAccountActive} /> : null }
      <Body  search={search}  setEditCard={setEditCard} setDetailsCard={setDetailsCard} detailsCard={detailsCard} setActive={setActive} tasks={tasks} setTasks={setTasks}/>  
      <TaskAdd tasks={tasks} setEditCard={setEditCard} editCard={editCard} detailsCard={detailsCard} setActive={setActive} active={isActive} setTasks={setTasks}/>   
    </>
  )
}
 
export default Home
