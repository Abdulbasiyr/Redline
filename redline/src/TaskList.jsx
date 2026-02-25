
import TaskItem from "./TaskItem"

const TaskList = ({tasks, setShowMore, setDetailsCard, setActive, setEditCard, filterTabs, search}) => {

const q = search.trim().toLowerCase()

const base = q.length ? tasks.filter(t => (t.title ?? "").toLowerCase().includes(q)) : tasks

const visible = base.filter(task => {
  if (filterTabs === "done") return task.completed === true
  if (filterTabs === "all") return task.completed === false
  return task.color === filterTabs && task.completed === false
})

return (
  <>
    {visible.length >= 1
      ? visible.map(task => (
          <TaskItem
            key={task.id ?? task.clientId}
            setActive={setActive}
            setEditCard={setEditCard}
            task={task}
            setShowMore={setShowMore}
            setDetailsCard={setDetailsCard}
          />
        ))
      : null}
  </>
)
}

export default TaskList