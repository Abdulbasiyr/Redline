import { createContext, useContext, useState, useEffect } from 'react'
import { updatePage } from '../api/user.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [accountActive, setAccountActive] = useState(false)


  useEffect(() => {
    ( async () => {
      const data = await updatePage()

      if (data.success) {
        setUser({data: data.user, settings: data.settings})
        setAccessToken(data.accessToken)
        setAccountActive(true)
      } 

      setLoading(false) 
    })()
    
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, accountActive, setAccountActive }}>
      {!loading && children} 
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}