
import { useEffect} from "react"
import { getTasks } from "./server"
import TaskItem from "./TaskItem"
import { useAuth } from "./AuthContext"

const TaskList = ({setTasks, tasks, setShowMore, setDetailsCard, setActive, setEditCard, filterTabs}) => {

  const {accessToken, accountActive} = useAuth()


function toIsoDate(value) {
  // если date иногда приходит не как строка — подстрахуемся
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

    const left = daysLeft(task.date);

    // если даты нет или она битая — не трогаем цвет
    if (left === null) return task;

    let color = task.createColor;

    if (left <= 2) color = "red";
    else if (left <= 7) color = "yellow";
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
                  key={index}
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