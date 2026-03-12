
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/passwordForgot.css'
import { FiArrowLeft } from 'react-icons/fi'
import { confirmResetPassword, sendResetPasswordEmail, verifyResetCode } from '../api/auth.js'
import {z} from 'zod'

const PasswordForgot = () => { 

  const navigate = useNavigate()
  const maxLength = 6
  const [verification, setVerification]     = useState('email')
  const [value, setValue]                   = useState('')
  const [email, setEmail]                   = useState('')
  const [userEmail, setUserEmail]           = useState('')
  const [message, setMessage]               = useState('')
  const [limitButton, setLimitButton]       = useState(false)
  const [isResetToken, setIsResetToken]     = useState('')
  const [resetPassword, setResetPassword]   = useState('')
  const [isSaving, setIsSaving]             = useState(false)


  const handleChange = async (e) => {
    const raw = e.target.value
    const cleaned = raw.replace(/\D/g, '').slice(0, maxLength)
    setMessage('')
    setValue(cleaned)

    if(cleaned.length === 6) { 
      console.log(email, cleaned)    
      const data = await verifyResetCode({email, code: cleaned}) 
      if(!data.success) return setMessage(data.message)

      setIsResetToken(data.resetToken)
      setVerification('password')

      console.log('maxlength:', true)
    }

  }


  const sendResetEmail = async (e) => {
    setMessage('')
    e.preventDefault()
    
    const emailSchema = z.object({ email: z.string().trim().toLowerCase().email('Invalid email') })
    const parsed = emailSchema.safeParse({email})
    if(!parsed.success)  {return setMessage(parsed.error.issues[0].message) }
    setVerification('code')

    const data = await sendResetPasswordEmail({email: parsed.data.email})
    if(data.limit) {
      setLimitButton(true)
      setMessage(data.message)
      return
    }
    setUserEmail(data.email)
    console.log(data)

    if(!data.success) return setMessage(data.message)  
    
  } 

  
  const handleChangePassword = async (e) => {
    e.preventDefault( )
    setMessage('')
    setIsSaving(true)

    const pasShema = z.object({ password: z.string().trim().min(7) })
    const parsed = pasShema.safeParse({password: resetPassword}) 
    if(!parsed.success){ return console.log(parsed.error.issues[0].message), setMessage('Invalid password') }

    const data = await confirmResetPassword({email, password: parsed.data.password, resetToken: isResetToken})
    if(!data?.success) { return console.log('choto neto', data), setMessage(data?.message), setIsSaving(false) }
    console.log(data)

    navigate('/auth?mode=login')
  }


  
  return(
    <div className="passwordContainer">
      <h2 className="titleHeader">Redline</h2>
      <div className="passwordWrapper">
        <div className={verification === 'email' ? 'email__passwordWrapper active' : 'email__passwordWrapper'}>
          <form onSubmit={sendResetEmail} className='formEmail__passwordWrapper'>
            <input type="email" autoComplete='email' value={email} onChange={e => setEmail(e.target.value)} required placeholder='Enter your email' />

            <button type='submit' className={limitButton ? 'submitButton disabledButton': 'submitButton'} disabled={limitButton} >Continue</button>
          </form>
        </div>

        <div className={verification === 'code' ? 'verification__passwordWrapper active' : 'verification__passwordWrapper'}>
          <div className="titleWrapper">
            <FiArrowLeft size={22} className='icon__titleWrapper' onClick={e => setVerification('email')} /> 
            <h3> Verification </h3>
          </div>
          <span> If you have an account, we have sent a code to {userEmail}. Enter it below. </span>
          <div className="textCodePassword">
            { Array.from({length: maxLength}).map((_, i) => {
              return <div key={i} className="codePassword">{value[i] || ''}</div>
            }) }
            <input inputMode='numeric' maxLength={6} onChange={handleChange} value={value}/>
          </div>
        </div>

        <div className={verification === 'password' ? 'resetChangePassword active' : 'resetChangePassword'}>
          <h3>Change to Password</h3>
          <form onSubmit={handleChangePassword}>
            <input type="password" value={resetPassword} onChange={e => setResetPassword(e.target.value)} maxLength={64} placeholder='Enter Password' />
            <button type='submit' className={isSaving ? 'buttonChangePassword disabled' : 'buttonChangePassword'} disabled={isSaving} required >{isSaving ? 'Savin...' : 'Save password'}</button>
          </form>
        </div>

        <span className="passwordWrapper__message">{message}</span>

      </div>
    </div>
  )
}

export default PasswordForgot