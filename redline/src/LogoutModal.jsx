
import { useNavigate } from 'react-router-dom'
import './css/logoutModal.css'
import { logout } from './server'
import { useAuth } from './AuthContext'

const LogoutModal = ({setIsLogoutOpen, setAccountActive}) => {

  const navigate = useNavigate()
  const {setUser, user, setAccessToken, accessToken}   = useAuth()

  const handleLogout = async () => {
    await logout()
    console.log('jovob keli')
    setUser('')
    setAccessToken('')
    setAccountActive(false)
    navigate('/')
  }

 return(
   <div className="logoutModal">
      <div className="logoutModal__header"> <h3>Logout</h3> </div>
      <p className='logoutModal__text' >Вы точно хотите выйти?</p>
      <div className="logoutModal__actions">
        <button className="logoutModal__cancel btn" onClick={e => setIsLogoutOpen(false)}>No</button>
        <button className="logoutModal__confirm btn" onClick={handleLogout}>Logout</button>
      </div>
   </div>
 )

}

export default LogoutModal