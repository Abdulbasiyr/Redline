

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