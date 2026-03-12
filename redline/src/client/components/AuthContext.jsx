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
      
      let data

      try {

        data = await updatePage()
        if(!data) return 
        setUser({data: data.user, settings: data.settings})
        setAccessToken(data.accessToken)
        setAccountActive(true)

      } catch(err) {
        console.log(err.message)
      } finally {
        setLoading(false) 
      }

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