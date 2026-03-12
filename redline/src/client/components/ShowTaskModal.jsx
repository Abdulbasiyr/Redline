
import { useAuth } from './AuthContext.jsx'
import '../styles/showTaskModal.css'
import { deleteTask, updateTask } from '../api/tasks.js'
import { FiTrash2, FiCalendar, FiCheckSquare } from 'react-icons/fi'

const ShowTaskModal = ({setShowMore, detailsCard, setTasks}) => {

  const {accessToken} = useAuth()
 
  const id          = detailsCard.dataset.id ?? detailsCard.dataset.clientId
  const title       = detailsCard.querySelector('.title').textContent
  const text        = detailsCard.querySelector('.text').textContent
  const dateTime    = detailsCard.querySelector('.dateTime').textContent
  const createColor = detailsCard.dataset.createColor
  
  
  const deleteClick = async (e) => {
    const id   = e.target.closest('.showMoreContainer').dataset.idMore
    setTasks(prev => prev.filter(task => (task.id ?? task.clientId) !== id))
    setShowMore(false)
    const data = await deleteTask({id, accessToken})
    console.log(data)
    if(!data?.success) return console.log(data?.message)
  }


  const handleCheck = async () => {

    setTasks(prev => prev.map(task => (task.id ?? task.clientId) === id ? { ...task, completed: true} : task))
    setShowMore(false)

    const id = detailsCard.dataset?.id
    if(!id) return

    await updateTask({accessToken, id, completed: true})

  }

  return(

    <div className="showMoreContainer" data-id-more={id}>
      <button className="close" onClick={() => { setShowMore(false) }} >x</button>
      <h2  className='titleMore'> {title} </h2>
      <p   className='textMore'> {text} </p>
      <div className={`baseColor ${createColor}`} > create color </div>
      <div className='dateTimeMore'> <span> <FiCalendar className='calendar' size={20}/> </span> <span> {dateTime} </span> </div>

      <div className="changeButtons">
        <button className="btn check"  onClick={handleCheck}> <FiCheckSquare style={{color: 'rgb(19, 0, 194)'}} size={20}/> </button>
        <button className="btn delete" onClick={(e) => deleteClick(e)}> <FiTrash2 size={20} fontWeight={300}/> </button>
      </div>
    </div>

  )
}

export default ShowTaskModal