import { apiFetch } from "./apiFetch.api.js"


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
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
          })

}