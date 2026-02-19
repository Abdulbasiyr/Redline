import './css/body.css'
import TaskList from './TaskList'
import FilterTabs from "./FilterTabs"
import ShowTaskModal from './ShowTaskModal'
import { useState } from 'react'
import { useAuth } from './AuthContext'


const Body = ({tasks, setTasks, setActive, setDetailsCard, detailsCard, setEditCard}) => {

  const {user} = useAuth()

  const [showMore, setShowMore ]      = useState(false)
  const [filterTabs, setFilterTabs]   = useState(user?.settings?.startPage)


  return(
    <>
    
      <div className="body">
        <FilterTabs setFilterTabs={setFilterTabs} filterTabs={filterTabs} />
        <TaskList filterTabs={filterTabs} setTasks={setTasks} tasks={tasks} setActive={setActive} setEditCard={setEditCard} setShowMore={setShowMore} setDetailsCard={setDetailsCard}/>
        {showMore ? <ShowTaskModal setActive={setActive} setEditCard={setEditCard} tasks={tasks} setTasks={setTasks} setShowMore={setShowMore} detailsCard={detailsCard}  /> : null}
      </div>
      
    </>
  )
}

export default Body