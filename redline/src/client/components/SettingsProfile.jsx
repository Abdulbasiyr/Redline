
import { useState } from 'react'
import '../styles/settingsProfile.css'
import ReactCountryFlag from 'react-country-flag'
import { FiCheckSquare , FiEdit } from 'react-icons/fi'
import { useAuth } from './AuthContext.jsx'
import { profileSettings } from '../api/user.js'

const SettingsProfile = ({setSettingsProfile, setProfile, setSettings, settings}) => {

  const {user, setUser, accessToken} = useAuth()
  
  const languageSetting = user.settings.language === 'English' ? {country: 'GB', name: 'English'} : {country: 'RU', name: 'Russian'}

  const [language, setLanguage]             = useState(languageSetting)
  const [languageActive, setLanguageActive] = useState(false)
  const [editName, setEditName]             = useState(false)
  const [confirmDelete, setConfirmDelete]   = useState(user.settings.confirmDelete)
  const [startPage, setStartPage]           = useState(user.settings.startPage)  // dlya filterTabs
  const [name, setName]                     = useState(user.data.name)

  const [isSaving, setIsSaving] = useState(false)


  const saveChanges = async () => {
    const obj = {
      name,
      language: language.name,
      confirmDelete,
      startPage,
      accessToken
    }
    setIsSaving(true)
    const result = await profileSettings(obj)
    setIsSaving(false)
    
    if(!result.success) return console.log(user)
    setUser(prev => ({...prev, data: {...prev.data, name: result.name}, settings: result.settings }) )

  }

  return (
    <div className='settings'>
      <div className="settingsTitle">Settings</div>
        { settings ? null : <button className="back__profile"  onClick={e => setSettingsProfile(false)}>{'<'}</button> }
        <button className="close__profile" onClick={e => { setProfile(false); setSettings(false) } }>x</button> 
        <div className="account__settings">
          <h3>Account</h3>
          { !editName ? (<div className="name"> <span >{name}</span> <button onClick={e => setEditName(true)}> <FiEdit size={18}/> </button> </div> ) : (<div className="editName"> <input placeholder='Измените Имя' maxLength={28} value={name} onChange={e => setName(e.target.value)} /> <button className="saveEditName" onClick={e => { name ? setEditName(false) : null}}> <FiCheckSquare color='#fff' size={22} /> </button> </div> ) }
          <span>Email: {user.data.email}</span>
          <span>Member Since: {user.data.createdAt.split('T')[0]}</span>
        </div>

        <div className="language">
          <span>Preference</span>
          <div className="choose__language">
            <div className="resultLanguage" onClick={e => setLanguageActive(prev => !prev)}> <ReactCountryFlag countryCode={language.country} svg style={ { width: '20px', height: '20px' } } /> {language.name} </div>
            { language.country === 'RU' && languageActive ? <button onClick={e => { setLanguage({country: 'GB', name: 'English'});  setLanguageActive(false) } }> <ReactCountryFlag countryCode='GB' svg style={ { width: '20px', height: '20px' } }  /> English</button> : null }
            { language.country === 'GB' && languageActive ? <button onClick={e => { setLanguage({country: 'RU', name: 'Russian'});  setLanguageActive(false) } } > <ReactCountryFlag countryCode='RU' svg style={ { width: '20px', height: '20px' } } /> Russian</button> : null }
          </div>
        </div>

        <div className="startPageWrapper">
          <span>Start Page</span>
          <div className="startPage">
            <button onClick={e => setStartPage('all')}     className={startPage === 'all'    ? 'active' : ''}>All</button>
            <button onClick={e => setStartPage('green')}   className={startPage === 'green'  ? 'active' : ''}>Green</button>
            <button onClick={e => setStartPage('yellow')}  className={startPage === 'yellow' ? 'active' : ''}>Yellow</button>
            <button onClick={e => setStartPage('red')}     className={startPage ===    'red' ? 'active' : ''}>Red</button>
          </div>
        </div>

        <div className="confirmDelete">
          <span>Confirm before delete</span>
          <div className={confirmDelete ? 'confirmDeleteWrapper active' : 'confirmDeleteWrapper' }  onClick={e => setConfirmDelete(prev => !prev)}>
            <div className="confirmDeleteItem"></div>
          </div>
        </div>
        <button className='saveChanges' style={isSaving ? {transform: 'none', backgroundColor: '#79a5be'} : {}} disabled={isSaving} onClick={saveChanges} >{isSaving? 'saving...' : 'save'}</button>
    </div>
  )
}

export default SettingsProfile