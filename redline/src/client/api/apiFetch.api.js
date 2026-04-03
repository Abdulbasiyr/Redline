

export async function apiFetch(url, options = {}) {

  let res;

  try {
    res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }) 
  } catch {
    throw new Error('Unable to Join Network, please try later')
  }


  const data = await res.json().catch(() => null)

  if(!res.ok) throw new Error(data?.message || 'Please, try later')
  return data

}