
import { useEffect, useState } from "react"
import { getTasks } from "./server"
import TaskItem from "./TaskItem"

const TaskList = ({setTasks, tasks, setShowMore, setDetailsCard, setActive, setEditCard, filterTabs}) => {


  useEffect( () => {
    (async () => {
      // const data = await getTasks()
      setTasks(prev => [...prev])
    })()
  },[])

  return(
    <>
      { tasks?.length >= 1 ? tasks.filter(task => filterTabs === 'all' ? true : task.color === filterTabs ).map((task, index) => <TaskItem key={task.id || index} setActive={setActive} setEditCard={setEditCard} task={task} setShowMore={setShowMore} setDetailsCard={setDetailsCard} /> ) : null }
    </>
  )
}

export default TaskList