
import {z} from 'zod'
import { authenticateUser } from './server'
import { useMemo, useState } from 'react'
import './css/authModal.css'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FaGoogle } from 'react-icons/fa6'
import { useAuth } from './AuthContext'

const AuthModal = ({setPasswordMode}) => {


  const {setAccountActive, setUser, setAccessToken} = useAuth()

  const [searchParams]  = useSearchParams()
  const navigate        = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' }) 
  const [errorMessage, setErrorMessage] = useState('')


  const change = (e) => {
    const {name, value} = e.target
    setForm(prev => ({...prev, [name]: value}) )
  }

  const mode =  useMemo(() => {
                  const  m = searchParams.get('mode') 
                  m === 'login' ? 'login' : 'signup'
                  return m
                }, [searchParams])

  

  const submit = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    
    const email    = form.email.trim()
    const name     = form.name.trim()
    const password = form.password.trim()

    // proverka validnosti dannix
    const userSchema = z.object({
      ...( mode === 'signup' ? {name: z.string().trim().min(1, {message: 'name required'}) }: {} ) ,
      email: z.string().email('invalid email').refine(val => val.endsWith('.com'), 'invalid email'),
      password: z.string().min(7, {message: 'password should minimum 7 symbol'})
    })

    const payload = mode === 'signup' ? {name, email, password, mode} : {email, password, mode}
    const result = userSchema.safeParse(payload)
    if(!result.success) return setErrorMessage(result.error.issues[0].message)
  

    // obrasheniya k serveru
    try {
      const data = await authenticateUser(payload)
      console.log(data)
      setUser({data: data.user, settings: data.settings})
      setAccessToken(data.accessToken)
      setForm({name: '', email: '', password: ''})
      navigate('/')
      setAccountActive(true)
    } catch(err) {
      setErrorMessage(err.message)
    }
  }

  return(
    <div className="authModalContainer">

      <div className="loginAndSign">
        <h1 className='title'>{mode === 'login' ? 'Welcome back!': 'Sign up'}</h1>

        <form className="wrapper__loginAndSign" onSubmit={submit}>
          <div className="inputWrapper">
            { mode === 'signup' ? <input type="text" name='name' value={form.name} onChange={change} placeholder='Name' autoComplete={'name'}/> : null }
            <input type="email"    name='email'       value={form.email}    onChange={change} placeholder='Email' autoComplete={'email'} required/>
            <input type="password" name='password'    value={form.password} onChange={change} placeholder='password' autoComplete={mode === 'login' ? 'current-password' : 'new-password'} maxLength={64}/>
            {mode === 'login' ? <span className='forgotPassword' onClick={e => navigate('/auth/forgotPassword') } > Forgot password? </span> : null}
          </div>

          <button type='submit' className='submit' >{mode === 'signup' ? 'sign up' : mode }</button>
          <span className="errorMessage">{errorMessage}</span>
        </form>

        {mode === 'login' ? <div className='bottomText__loginAndSign'> <span>Dont have an account?</span> <span className='move' onClick={() => navigate('/auth?mode=signup')}>sign up</span> </div>  : <div className='bottomText__loginAndSign'> <span>You have an account?</span> <span className='move' onClick={() => navigate('/auth?mode=login')}>Login</span> </div> }

      </div>  

    </div>
  )

}

export default AuthModal