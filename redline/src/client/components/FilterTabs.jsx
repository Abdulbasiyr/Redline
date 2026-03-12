
import '../styles/filterTabs.css'
import { useMemo } from 'react'


const FilterTabs = ({setFilterTabs, filterTabs, tasks}) => {

  const items = ['all', 'green', 'yellow', 'red']

  // count for filterTabs
  const counts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if(task.completed) return acc
      acc.all += 1
      acc[task.color] = (acc[task.color] ?? 0) + 1 
      return acc
    }, {all: 0, green: 0, yellow: 0, red: 0 })
  }, [tasks])


  return(
    <>
      <div className="filter-tabs">
        <div className="filters">
          {items.map((text, index) => {
            return  <button key={index} className={`menu ${filterTabs === text ? filterTabs : ''}`} onClick={() => setFilterTabs(items[index])}>
                      {text}
                      <span className={`filterCardCount ${text}`}>{counts[text]}</span>
                    </button>
          })}
        </div>

        <div className="doneAction">
          <button className={filterTabs === 'done' ? 'doneBtn active' : 'doneBtn'} onClick={e => setFilterTabs('done')}> Done </button>
        </div>

      </div>
    
    </>
  )
}

export default FilterTabs