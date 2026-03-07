
import { useEffect, useRef } from 'react'
import './css/taskItem.css'
import { FiChevronRight, FiEdit, FiClock } from 'react-icons/fi'

const TaskItem = ({task, setEditCard, setActive, setShowMore, setDetailsCard, detailsCard}) => {



  const containerRef = useRef(null)

  const [d, t] = task.date.split('T') 
  const [yyyy, mm, dd] = d.split('-')
  const date = `${dd}.${mm}.${yyyy}`
  const time = t.slice(0, 5)

  const id = task.id ?? task.clientId

  useEffect(() => { containerRef.current.querySelectorAll('.card') }, [] )

  return(
    
    <div className={`card ${task.color}`} data-create-color={task.createColor} data-color-card={task.color} ref={containerRef} data-id={id}>
      <div className="colorCardWrapper"> <div className={`colorCard ${task.color}`}></div> </div> 
      
      <div className="textWrapper">
        <h3 className='title'>{task.title}</h3>
        <p  className='text'>{task.text}</p>
      </div>
      <div className="wrapperStateCard">
        <div className="dateTime"> {date}</div>
      </div>
      <div className="more-buttons">
        <button className="btn edit"  onClick={(e) => { setEditCard(true); setDetailsCard(e.currentTarget.closest('.card')); setActive(true)}}> <FiEdit size={16}/> </button>
        <button className="show-more" onClick={(e) => {
          setShowMore(true) 
          setDetailsCard(e.currentTarget.closest('.card'))
          }}> <FiChevronRight size={18}/> </button>
      </div>

    </div>

  )
}

export default TaskItem