
import { useState } from 'react'
import '../styles/account.css'
import {FiUser, FiSettings, FiLogOut} from 'react-icons/fi'
import Profile from './Profile'
import { useAuth } from './AuthContext'
import LogoutModal from './LogoutModal'

const Account = ({setAccountActive}) => {

  const {user} = useAuth()

  const [account, setAccount]                 = useState(false)
  const [settingsProfile, setSettingsProfile] = useState(false)
  const [profile,  setProfile]                = useState(false)
  const [settings, setSettings]               = useState(false)
  const [isLogoutOpen, setIsLogoutOpen]       = useState(false)

  const firstWord = user?.data?.name.slice(0, 1).toUpperCase()
  
  return(

    <div className="accountContainer">

      <div className="avatar" onClick={e => setAccount(prev => !prev)} > <h3 className="avatar__name"  >{firstWord}</h3> </div>

      { account ? <div className="user-menu">
                    <div className="profileMenu user-menu__item" onClick={e => { setProfile(true); setSettings(false) } }> <FiUser size={19}/>     Profile </div>
                    <div className="settigsMenu user-menu__item" onClick={e => { setSettings(true); setProfile(true) } }>  <FiSettings size={19}/> Settings</div>
                    <div className="logoutMenu  user-menu__item" onClick={e => setIsLogoutOpen(true)}> <FiLogOut size={19}/> Logout  </div>
                  </div>
      : null }

      { profile ? <Profile setSettings={setSettings} settings={settings} setSettingsProfile={setSettingsProfile} settingsProfile={settingsProfile} setProfile={setProfile} /> : null }
      { isLogoutOpen ?  <LogoutModal setAccountActive={setAccountActive} setIsLogoutOpen={setIsLogoutOpen} /> : null}
      
    </div>

  )

}

export default Account