
import './css/filterTabs.css'
import { useState } from 'react'


const FilterTabs = ({setFilterTabs, filterTabs}) => {

  const items = ['all', 'green', 'yellow', 'red']

  const [deadlineActive, setDeadlineActive] = useState('notDeadline')
  


  return(
    <>
      <div className="filter-tabs">
        <div className="filters">
          {items.map((text, index) => {
            return  <button key={index} className={`menu ${filterTabs === text ? filterTabs : ''}`} onClick={() => setFilterTabs(items[index])}>
                      {text}
                      <span className='filterCardCount green'>10</span>
                    </button>
          })}
        </div>
        <div className="deadlineButtons">
          <button className={deadlineActive === 'notDeadline' ? 'active' : 'not'} onClick={e => setDeadlineActive('notDeadline')}>  НЕ срочные </button>
          <button className={deadlineActive === 'deadline'    ? 'active' : 'not'} onClick={e => setDeadlineActive('deadline')}>  Срочные    </button>
        </div>

      </div>
    
    </>
  )
}

export default FilterTabs