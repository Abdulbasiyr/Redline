

// in registration or login
export async function submitAuth(user) {

  if( user.mode !== 'signup' || user.mode !== 'login') return

  const url = user.mode === 'signup' ? '/api/auth/registerUser' : '/api/auth/loginUser'

  const payload = {
                    ...(user.mode === 'signup' ? {name: user.name} : {}),
                    email:    user.email,
                    password: user.password
                  }

  const res = await fetch( `${import.meta.env.VITE_API_URL}${url}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
              })


  const data = await res.json()

  if(!res.ok) throw new Error(data.message || 'auth Error')

  return data

}


// function for forgotPassword
export async function sendResetPasswordEmail(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/password-reset/request`, {
                      method: 'POST',
                      credentials: 'include',
                      headers: {
                        'Content-type': 'application/json'
                      },
                      body: JSON.stringify(payload)
                    } )

  let data = null

  try {
    data = await res.json()
  } catch(e) {
    data = null
  }

  if(!res.ok) {
    if(res.status === 429) {
      return {limit: true, message: data?.message || 'Too many requests'}
    }

    throw new Error(data?.message || 'Request failed')
  }

  return data
  
}


// verify code
export async function verifyResetCode(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/password-reset/verify`, {
                      method: 'POST',
                      credentials: 'include',
                      headers: {
                        'Content-type': 'application/json'
                      },
                      body: JSON.stringify(payload)
                    })

  const data = await res.json()
  return data
}


// Change reset password
export async function confirmResetPassword(payload) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/password-reset/confirm`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
              })
  const data = await res.json()
  return data
}


// exit in account
export async function logout() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include'
              })

  const  data = await res.json()
  return data
}