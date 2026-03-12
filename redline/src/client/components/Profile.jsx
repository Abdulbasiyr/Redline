
import SettingsProfile from './SettingsProfile.jsx'
import { useAuth } from './AuthContext.jsx'

const Profile = ({setSettingsProfile, settingsProfile, setProfile, settings, setSettings}) => {

  const {user} = useAuth()

  const isSettingsOpen = settingsProfile || settings

  return(


  <div className={isSettingsOpen ? 'profileContainer settings' : 'profileContainer'}>
    
    <div className="profile">
      <div className="title__profile">My Profile</div>
        <button className="close__profile" onClick={e => setProfile(false)}>x</button>

      <div className="avatar__profile"> <h3>S</h3> </div>

      <div className="prifleData">
        <span>Name:  {user.data.name}</span>
        <span>Email: {user.data.email}</span>
        <span>Member Since: {user.data.createdAt.split('T')[0]}</span>
      </div>

      <button className="settingBtn" onClick={e => setSettingsProfile(true)}>Settings</button> 
    </div>

    <SettingsProfile setSettings={setSettings} settings={settings} setSettingsProfile={setSettingsProfile} setProfile={setProfile} />

  </div>


  )
}

export default Profile