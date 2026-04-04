import '../styles/body.css'
import TaskList from './TaskList.jsx'
import FilterTabs from "./FilterTabs.jsx"
import ShowTaskModal from './ShowTaskModal.jsx'
import { useState, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'
import { getTasks } from "../api/tasks.api.js"



const Body = ({tasks, setTasks, setActive, setDetailsCard, detailsCard, setEditCard, search}) => {

  const {user, accessToken, accountActive} = useAuth()

  const [showMore, setShowMore ]      = useState(false)
  const [filterTabs, setFilterTabs]   = useState(user?.settings?.startPage || 'all')


  function toIsoDate(value) {
    // если date иногда приходит не как строка
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function daysLeft(deadline) {
    const d = toIsoDate(deadline);
    if (!d) return null;

    const now = new Date();

    // считаем "календарные дни" (чтобы не бесило из-за часов/минут)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDeadline = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const ms = startOfDeadline - startOfToday;
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  }


  function applyUrgencyColors(tasks) {
    return (tasks ?? []).map((task) => {
      if (!task) return task;
      if(task.completed) return task

      const left = daysLeft(task.date);

      // если даты нет или она битая 
      if (left === null) return task;

      let color = task.createColor;

      if (left <= 2)       color = "red";
      else if (left <= 7)  color = "yellow";
      else if (left <= 14) color = "green";


      return { ...task, color };
    });
  }


  useEffect( () => {
    if(!accountActive) return
    (async () => {
      const data = await getTasks(accessToken)
      if(!data.success) return 

      const colored = applyUrgencyColors(data.tasks)
      setTasks( colored )
    })()
  },[])


  return(
    <>
    
      <div className="body">
        <FilterTabs tasks={tasks} setFilterTabs={setFilterTabs} filterTabs={filterTabs} />
        <TaskList search={search} filterTabs={filterTabs} setTasks={setTasks} tasks={tasks} setActive={setActive} setEditCard={setEditCard} setShowMore={setShowMore} setDetailsCard={setDetailsCard}/>
        {showMore ? <ShowTaskModal setActive={setActive} setEditCard={setEditCard} tasks={tasks} setTasks={setTasks} setShowMore={setShowMore} detailsCard={detailsCard}  /> : null}
      </div>
      
    </>
  )
}

export default Body