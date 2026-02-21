
import { useEffect, useMemo, useState } from 'react'
import './css/taskAdd.css'
import { useRef } from 'react'
import { addTasks } from './server'
import { updateTask } from './server'
import { useAuth } from './AuthContext'


const TaskAdd = ({setActive, active, setTasks, tasks, detailsCard, setEditCard, editCard}) => {

  const {accessToken} = useAuth


  const titleRef                      = useRef(null)
  const inputRefText                  = useRef(null)
  const dataRef                       = useRef(null)
  const [newDates, setNewDates]       = useState(new Date)
  const [date, setDate]               = useState(null)
  const [ radioState, setRadioState ] = useState(null)
  const [disable, setDisable]         = useState(true)
  const [check, setCheck]             = useState('')


  // yesli editCard true:
  useEffect(() => {
    if(editCard) {
      const title      = detailsCard.querySelector('.title').textContent
      const text       = detailsCard.querySelector('.text').textContent
      const checkColor = detailsCard.dataset.colorCard
      const date       = detailsCard.querySelector('.dateTime').textContent

      titleRef.current.value     = title
      inputRefText.current.value = text
      setCheck(checkColor)
      setRadioState(checkColor)
      dataRef.current.value      = date
    }
  }, [editCard])

  
  function pad(n) {return String(n).padStart(2, '0') }


  // function izmeneniye zapreta na datu po svetam kotoroy vizvono
  function toDateLocalTimeValue(date) {

    const addDays = radioState === 'green' ? 14 : radioState === 'yellow' ? 7 : radioState === 'red' ? 2 : 0
    const dd = new Date(date)
    dd.setDate(dd.getDate() + addDays)

    const y  = dd.getFullYear()
    const m  = pad(dd.getMonth() + 1 )
    const d  = pad(dd.getDate())
    const h  = pad(dd.getHours())
    const mn = pad(dd.getMinutes())
    setDate(`${y}-${m}-${d}T${h}:${mn}`)
    return `${y}-${m}-${d}T${h}:${mn}`
  }

  useEffect(() => {
    toDateLocalTimeValue(newDates)
  }, [radioState])


  const clearDate = () => { dataRef.current.value = '' } // ochistka data input


  // pri kajdom izmeneniye onChange v input radio
  const handlePriorityChange = (value) => {
    setRadioState(value)
    setDisable(false)
    clearDate()
  }


  // vsyo chto svyazano s dobavleniyem card
  const clickAdd = () => {

    const title     = titleRef.current.value 
    const text      = inputRefText.current.value

    if(!title || !text || !radioState || !dataRef.current.value) return


    // izmeneniye danniye
    if(editCard) {
      const newTask = {
        id: detailsCard.dataset.id,
        title, 
        text, 
        color: radioState, 
        date: dataRef.current.value
      }

      setTasks(prev => prev.map(task => task.id === detailsCard.dataset.id ? { ...task, ...newTask} : task ))  // dobavleniye izmenniy card i stariye sushestvuyeshiye

      // ochisheniye poley
      setEditCard(false)
      titleRef.current.value     = null
      inputRefText.current.value = null
      setCheck('')
      clearDate()

      // dobavleniye v bazu dannix
      // updateTasks(newTask)

      return
    }

    // sozdaniye noviye danniye
    const obj = {
      id: crypto.randomUUID(),
      title,
      text,
      color: radioState,
      date: dataRef.current.value,
      completed: false
    }

    setTasks(prev => [...prev, obj])

    titleRef.current.value     = null
    inputRefText.current.value = null
    setCheck('')
    clearDate()

    // addTasks({data: obj, accessToken})

  }




  return(
    <>
      {console.log(tasks)}
      <div className={`container ${ active ? 'active' : '' } `}>

        <button className="close" onClick={() => {
          setActive(false)
          setEditCard(false)
          titleRef.current.value     = null
          inputRefText.current.value = null
          setCheck('')
          clearDate()
          setDisable(true)
          }}>x</button>

        <input type="text" ref={titleRef}  placeholder="Введите название задачи" maxLength={60}/>

        <textarea ref={inputRefText} maxLength={1100}  placeholder='Введите задачу'></textarea>
        
        <div className="checkboxes">
          <label className='cb'>
            <input type="radio"  checked={check === 'green'} onChange={(e) => { 
              handlePriorityChange('green') 
              setCheck('green')  
              }} name='priority'/>
            <span className="box green"></span>
          </label>

          <label className='cb'>
            <input type="radio"  checked={check === 'yellow'} onChange={(e) => {
              handlePriorityChange('yellow') 
              setCheck('yellow')              
              }} name='priority'/>
            <span className="box yellow"></span>
          </label>

          <label className='cb'>
            <input type="radio"  checked={check === 'red'} onChange={(e) => { 
              handlePriorityChange('red') 
              setCheck('red')
              }} name='priority'/>
            <span className="box red"></span>
          </label>
        </div>

        <input type="datetime-local" min={date} max={date} ref={dataRef} disabled={disable} onKeyDown={e => e.preventDefault()} onPaste={e => e.preventDefault()} onDrop={e => e.preventDefault()} />

        <button className='addBtn' onClick={clickAdd}>Добавить</button>
      </div>
    
    </>
  )
}


export default TaskAdd