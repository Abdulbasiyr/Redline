import { useRef } from 'react'
import './css/header.css'
import { FiSearch, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'


const Header = ({setActive, accountActive, setSearch, search}) => {
              
  const navigate = useNavigate()

  return(
    <>
      
      <header>
        <h1 className='titleHeader'>Redline</h1>    
        <div className="searchWrapper">
          <input type="text" placeholder='search...' value={search} onChange={e => setSearch(e.target.value)}/>
          <FiSearch className='searchIcon'/>
        </div>
        <div className="headerMenu">
          { !accountActive ? <button className='authHeader'   onClick={() => { navigate('/auth?mode=login');  } }> Login </button> : null }
          { !accountActive ? <button className='authHeader'   onClick={() => { navigate('/auth?mode=signup');  } }> Sign up </button> : null }
          <button className="btnAddHeader" onClick={() => setActive(true)}> <FiPlus size={18}/> add </button>    
        </div>
      </header>

    </>
  )
}

export default Header