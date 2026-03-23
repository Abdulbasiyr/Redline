
import { useState } from 'react'
import '../styles/header.css'
import { FiSearch, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'


const Header = ({setActive, accountActive, setSearch, search}) => {
              
  const navigate = useNavigate()
  const [isLine, setIsLine] = useState(false)

  return(
    <>
      
      <header>
        <h1 className='titleHeader'>Redline</h1>    
        <div className="searchWrapper">
          <input type="text" placeholder='search...' value={search} onChange={e => setSearch(e.target.value)}/>
          <FiSearch className='searchIcon'/>
        </div>
        <div className="headerMenu">
          <div className="register__headerMenu">
            { !accountActive ? <button className='authHeader'   onClick={() => { navigate('/auth?mode=login');  } }> Login </button> : null }
            { !accountActive ? <button className='authHeader'   onClick={() => { navigate('/auth?mode=signup');  } }> Sign up </button> : null }
          </div>
          <button className="btnAddHeader" onClick={() => setActive(true)}> <FiPlus size={18}/> <span className="text__addHeader">add</span>  </button>    
        </div>

        <div className={isLine ? 'lineWrapper active' : 'lineWrapper'} onClick={() => setIsLine(prev => !prev)} >
          <div className="line top"></div>
          <div className="line bottom"></div>
        </div>
      </header>

    </>
  )
}

export default Header