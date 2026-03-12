import { apiFetch } from "./apiFetch";


// in registration or login
export async function submitAuth(user) {

  if( user.mode !== 'signup' || user.mode !== 'login') throw new Error('invalid auth mode')

  const url = user.mode === 'signup' ? '/api/auth/registerUser' : '/api/auth/loginUser'

  const payload = {
                    ...(user.mode === 'signup' ? {name: user.name} : {}),
                    email:    user.email,
                    password: user.password
                  }


  return  apiFetch(url, {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(payload)
          })

}


// function for forgotPassword
export async function sendResetPasswordEmail(payload) {

let res;

try {

  res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/password-reset/request`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
              } )

} catch {
  throw new Error('network error')
}

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

  let res;

  try {
    res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/password-reset/verify`, {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Content-type': 'application/json'
                  },
                  body: JSON.stringify(payload)
                })
  } catch {
    throw new Error('network error')
  } 

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
  await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  })
}