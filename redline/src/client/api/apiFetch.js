

export async function apiFetch(url, options = {}) {

  let res 

  try {
    res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      credentials: 'include',
      ...options
    }) 
  } catch {
    throw new Error('network error')
  }

  let data;
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if(!res.ok) throw new Error(data?.message || 'request error')
  return data

}