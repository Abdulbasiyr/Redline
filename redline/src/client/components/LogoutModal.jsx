
import { useNavigate } from 'react-router-dom'
import '../styles/logoutModal.css'
import { logout } from '../api/auth.js'
import { useAuth } from './AuthContext.jsx'

const LogoutModal = ({setIsLogoutOpen, setAccountActive}) => {

  const navigate = useNavigate()
  const {setUser, user, setAccessToken, accessToken}   = useAuth()

  const handleLogout = async () => {

    try {
      await logout()
      
      setUser('')
      setAccessToken('')
      setAccountActive(false)
      navigate('/')
    } catch(err) {
      console.log(err.message)
    }

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