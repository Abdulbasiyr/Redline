import { apiFetch } from "./apiFetch"


// when reload page
export async function updatePage() {
  return apiFetch('/api/auth/refresh', {method: 'POST'})
}


// save edits in settings
export async function profileSettings(obj) {
  const {accessToken, ...payload} = obj

  return  apiFetch('/api/user/settings', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
          })

}