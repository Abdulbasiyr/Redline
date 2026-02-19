
// pri registration ili logination
export async function authenticateUser(user) {

  const url = user.mode === 'signup' ? '/api/auth/registerUser' : '/api/auth/loginUser'
  console.log(user.mode)

  const payload = {
                    ...(user.mode === 'signup' ? {name: user.name} : {}),
                    email:    user.email,
                    password: user.password
                  }

  const res = await fetch( `http://localhost:3000${url}`, {
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


// function dlya forgotPassword
export async function sendResetPasswordEmail(payload) {
  const res = await fetch('http://localhost:3000/api/auth/password-reset/request', {
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


export async function verifyResetCode(payload) {
  const res = await fetch('http://localhost:3000/api/auth/password-reset/verify', {
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
  const res = await fetch('http://localhost:3000/api/auth/password-reset/confirm', {
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


// pri obnovleniye stranitsi
export async function updatePage() {
  const res = await fetch( `http://localhost:3000/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
              })

  const data = await res.json()
  if(!data.success) return {success: data.success, message: data.message}

  return data

}


// soxraneniye izmeneniye v nastroyke
export async function profileSettings(obj) {
  const {accessToken, ...payload} = obj

  const res = await fetch( `http://localhost:3000/api/user/settings`, {
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


export async function getTasks() {

}


export async function addTasks(data) {

  // const {accessToken, ...payload} = data

  // const res = await fetch( `http://localhost:3000/api/task/add`, {
  //               method: 'POST',
  //               headers: {
  //                 'Authorization': `Bearer ${accessToken}`,
  //                 'Content-type': 'application/json'
  //               },
  //               body: JSON.stringify(payload)
  //             })

  // if(!res.ok) return
  // const data = await res.json()
  // return data
}

export async function updateTask(data) {

}

export async function deleteTask(data) {

}

export async function logout() {
  const res = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
              })

  const  data = await res.json()
  return data
}