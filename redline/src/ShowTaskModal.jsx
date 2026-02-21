
import './css/showTaskModal.css'
import { deleteTask } from './server'
import { FiTrash2, FiCalendar, FiCheckSquare } from 'react-icons/fi'

const ShowTaskModal = ({setShowMore, detailsCard, setTasks}) => {

  const id       = detailsCard.dataset.id
  const title    = detailsCard.querySelector('.title').textContent
  const text     = detailsCard.querySelector('.text').textContent
  const dateTime = detailsCard.querySelector('.dateTime').textContent
  
  
  const deleteClick = (e) => {
    const id   = e.target.closest('.showMoreContainer').dataset.idMore
    setTasks(prev => prev.filter(task => task.id !== id))
    setShowMore(false)
    // deleteTask(id)
  }


  const handleCheck = () => {

    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: true} : task))
    setShowMore(false)
  }

  return(

    <div className="showMoreContainer" data-id-more={id}>
      <button className="close" onClick={() => { setShowMore(false) }} >x</button>
      <h2  className='titleMore'> {title} </h2>
      <p   className='textMore'> {text} </p>
      <div className='dateTimeMore'> <span> <FiCalendar className='calendar' size={20}/> </span> <span> {dateTime} </span> </div>

      <div className="changeButtons">
        <button className="btn check"  onClick={handleCheck}> <FiCheckSquare style={{color: 'rgb(19, 0, 194)'}} size={20}/> </button>
        <button className="btn delete" onClick={(e) => deleteClick(e)}> <FiTrash2 size={20} fontWeight={300}/> </button>
      </div>
    </div>

  )
}

export default ShowTaskModal