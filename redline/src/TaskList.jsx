
import { useEffect, useState } from "react"
import { getTasks } from "./server"
import TaskItem from "./TaskItem"

const TaskList = ({setTasks, tasks, setShowMore, setDetailsCard, setActive, setEditCard, filterTabs}) => {


  // useEffect( () => {
  //   (async () => {
  //     const data = await getTasks()
  //     setTasks(prev => [...prev])
  //   })()
  // },[])

  return(
    <>
      {
        tasks?.length >= 1
          ? tasks
              .filter((task) => {
                // 1) done tab
                if (filterTabs === "done") return task.completed === true

                // 2) all tab (только активные)
                if (filterTabs === "all") return task.completed === false

                // 3) color tabs (только активные этого цвета)
                return task.color === filterTabs && task.completed === false
              })
              .map((task, index) => (
                <TaskItem
                  key={task.id || index}
                  setActive={setActive}
                  setEditCard={setEditCard}
                  task={task}
                  setShowMore={setShowMore}
                  setDetailsCard={setDetailsCard}
                />
              ))
          : null
      }
    </>
  )
}

export default TaskList