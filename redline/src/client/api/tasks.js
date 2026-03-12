import { apiFetch } from "./apiFetch"


// get tasks
export async function getTasks(accessToken) {

  return  apiFetch('/api/tasks/get', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
  })

}


// add tasks
export async function addTasks(datas) {

  const {accessToken, ...payload} = datas

  return  apiFetch('/api/tasks/add', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            },
            body: JSON.stringify(payload)
  })

}


// update task
export async function updateTask(datas) {
  const {accessToken, id, ...payload} = datas

  return  apiFetch(`/api/tasks/update/${id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            },
            body: JSON.stringify(payload)
  })

}


// delete task
export async function deleteTask(datas) {
  const {accessToken, id} = datas

  return apiFetch(`/api/tasks/delete/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            }
  } )


}