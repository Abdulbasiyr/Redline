

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