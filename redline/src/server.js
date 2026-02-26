
// in registration or login
export async function authenticateUser(user) {

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


// when reload page
export async function updatePage() {
  const res = await fetch( `${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
              })
  

  const data = await res.json()
  if(!data.success) return {success: data.success, message: data.message}

  return data

}


// save edits in settings
export async function profileSettings(obj) {
  const {accessToken, ...payload} = obj

  const res = await fetch( `${import.meta.env.VITE_API_URL}/api/user/settings`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(payload)
              })

  if(!res.ok) throw new Error('Request failed')
  const data = await res.json()
  return data
}


// get tasks
export async function getTasks(accessToken) {

  const res = await fetch( `${import.meta.env.VITE_API_URL}/api/tasks/get`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                },
              })

  const data = await res.json()
  if(!res.ok) return {message: 'Request failed'}
  return data

}


// add tasks
export async function addTasks(datas) {

  const {accessToken, ...payload} = datas
  const res = await fetch( `${import.meta.env.VITE_API_URL}/api/tasks/add`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
              })

  const data = await res.json()
  if(!res.ok) return {message: 'Request failed'}
  return data
}


// update task
export async function updateTask(datas) {
  const {accessToken, id, ...payload} = datas

  const res = await fetch( `${import.meta.env.VITE_API_URL}/api/tasks/update/${id}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(payload)
              })

  const data = await res.json()
  console.log(data)
  if(!res.ok) return {message: 'Request failed'}
  return data
}


// delete task
export async function deleteTask(datas) {
  const {accessToken, id} = datas
  console.log(id, accessToken)
  const res = await fetch( `${import.meta.env.VITE_API_URL}/api/tasks/delete/${id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-type': 'application/json'
                }
              })

  const data = await res.json()
  console.log(data)
  if(!res.ok) return {message: 'Request failed'}
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