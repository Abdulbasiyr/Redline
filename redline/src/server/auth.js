import bcrypt from 'bcrypt'
import crypto from 'crypto'
import prisma from './prisma.js'
import { z } from 'zod'
import jwt  from 'jsonwebtoken'
import { signAccessToken, signRefreshToken, setRefreshCookie, signResetToken } from './token.js'
import { sendResetCodeEmail } from './email.service.js'
import rateLimit from 'express-rate-limit'


// registration
export async function registerUser(req, res) {


  const {name, email, password} = req.body

  const userObj = {name, email, password}

  // proverka validnost danniye ot polzovatelya
  const userSchema = z.object({
    name:  z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email('invalid email'),
    password: z.string().min(7)
  })
  
  const parsed = userSchema.safeParse(userObj)
  if(!parsed.success) return res.status(400).json({ success: false, message: parsed.error.errors[0].message})
  

  try { 
      
    const exist = await prisma.user.findUnique({  where: { email: parsed.data.email }  })
    if(exist) return res.status(409).json({ success: false, message: 'email уже зарегестрирован' })


    const passwordHash = await bcrypt.hash(parsed.data.password, 10)

    const resultCreate =  await prisma.$transaction( async (tx) => {
                      const user =  await tx.user.create({ 
                                    data: { name: parsed.data.name , email: parsed.data.email, passwordHash },
                                    select: { id: true, name: true, email: true, createdAt: true }
                                  })
                      console.log(user)

                      await tx.userSettings.create({ data: { userId: user.id }})
                      return user
                    })

    const accessToken  = signAccessToken({ userId: resultCreate.id})
    const refreshToken = signRefreshToken({ userId:resultCreate.id})
    setRefreshCookie(res, refreshToken)
    
    console.log('user successfull registered')
    return res.status(201).json({ success: true, user: resultCreate, accessToken})
  
  } catch(err) {
    console.log(err.message)
    return res.status(500).json({ success: false, message: 'Ошибка при создание аккунта' })
  }
}
 
// login 
export async function loginUser(req, res) {
  const { email, password } = req.body

  const userObj = {email, password}

  // proverka validnost dannix polzovatelya
  const userSchema = z.object({
    email: z.string().trim().toLowerCase().email('invalid email'),
    password: z.string().min(7)
  })

  const parsed = userSchema.safeParse(userObj)
  if(!parsed.success) return res.status(400).json({ message: 'email и пароль объязательны' })

  try {
    const user = await prisma.user.findUnique({where: {email: parsed.data.email}, select: { id: true, name: true, email: true, passwordHash: true, createdAt: true }})
    if(!user) return res.status(401).json({success: false, message: "email или пароль неправильный"})

    const isMatch = await bcrypt.compare(parsed.data.password, user.passwordHash)
    if(!isMatch) return res.status(401).json({success: false, message: 'email или пароль неправильный'})

    const settings = await prisma.userSettings.findUnique({where: {userId: user.id}})
    if(!settings) return res.status(500).json({success: false, message: 'User settings not found'})

    const tasks = await prisma.task.findMany({where: {userId: user.id}})
    if(!tasks) return res.status(500).json({success: false, message: 'Tasks not found'})

    const accessToken  = signAccessToken({userId: user.id})
    const refreshToken = signRefreshToken({userId: user.id})
    setRefreshCookie(res, refreshToken)

    const {passwordHash, ...safeUser} = user

    res.status(200).json({success: true, accessToken, user: safeUser, tasks, settings})
  
  } catch(err) {
    console.log(err)
    return res.status(500).json({ success: false, message: 'Ошибка при входе' })
  }
}


// funksiya dlya proverka accessToken
export async function requireAuth(req, res, next) {

  const authHeader = req.headers.authorization
  if(!authHeader) return res.status(401).json({success: false, message: 'unAthutorization'})

  const token = authHeader.split(' ')[1]

  try {
  const payload = jwt.verify(token, process.env.ACCESS_TOKEN)
  req.userId = payload.userId
  next()
  } catch(err) {
    console.log(err)
    res.status(401).json({success: false, message: 'Invalid Token'})
  }
}


// fetch limit for code
export const confirmCodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})


// limit zaprosa na resetPassword
export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many requests. Please try again later' },
  standardHeaders: true,
  legacyHeaders: false
}) 

// otpravka code dlya sbrosa parolya pri ForgetPassword
export async function passwordResetRequest(req, res) {
  
  const emailSchema = z.object({
    email: z.string().trim().toLowerCase().email()
  })
  
  const parsed = emailSchema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({success: false, message: 'Invalid email'})

  try {

  const user = await prisma.user.findUnique({where: {email: parsed.data.email}})
  if(!user) return res.json({success:false, message: 'if the email exists, a code has been sent'})

  const code      = crypto.randomInt(100000, 1000000).toString()

  const FIVE_MINUTES =  5 * 60 * 1000
  const expiresAt    = new Date(Date.now() + FIVE_MINUTES)


  const row = await prisma.passwordResetToken.create({data: {userId: user.id, code, expiresAt, used: false}})

    try{
      await sendResetCodeEmail(user.email, code)
    } catch(e) {
      console.log(e.message)
      await prisma.passwordResetToken.delete({where: {id: row.id}})
      throw e
    }


  return res.json({success: true, email: user.email, message: 'if the email exists, a code has been sent'})

  } catch(err) {
    console.log(err)
    return res.status(500).json({success: false, message: 'Server Error'})
  }
}


// verify code 
export async function confirmResetCode(req, res) {
  const codeSchema = z.object({ email: z.string().trim().toLowerCase().email(), code: z.string().trim().regex(/^\d{6}$/) })
  const parsed = codeSchema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({success: false, message: 'Invalid code'})

  const { email, code } = parsed.data
  try {

    const user = await prisma.user.findUnique({where: {email}, select: {id: true}})
    if(!user) return res.status(400).json({success: false, message: 'Invalid code'})

    const row = await prisma.passwordResetToken.findFirst({where: {userId: user.id, used: false, code}, orderBy: {expiresAt: 'desc'}, select: {id: true, expiresAt: true}})
    if(!row) return res.status(400).json({success: false, message: 'Invalid code'})

    if(row.expiresAt < new Date()) return res.status(400).json({success: false, message: 'Code expired'})

    const resetToken = signResetToken({userId: user.id, resetId: row.id})
    
    return res.json({success: true, resetToken})

  } catch(err) {
    console.log(err)
    res.status(500).json({success: false, message: 'Server Error'})
  }
}


// confirm reset password
export async function resetPassword(req, res) {
  console.log('reset start')
  
  const resetPasShema = z.object({
    password: z.string().trim().min(7),
    resetToken: z.string() 
  })

  const parsed = resetPasShema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({success: false, message: 'Invalid password'})

  const { password, resetToken } = parsed.data
  
  console.log('after parse pass')
  try {

  const payload = jwt.verify(resetToken, process.env.RESET_TOKEN)
  const { userId, resetId } = payload

  const token = await prisma.passwordResetToken.findFirst({where: {id: resetId, userId, used: false} })
  if(!token) return res.status(400).json({success: false, message: 'Invalid password'})
  if(token.expiresAt < new Date()) return res.status(400).json({success: false, message: 'Invalid password'})

  const passwordHash = await bcrypt.hash(password, 10)
  console.log('continue...')
  await prisma.$transaction(async (tx) => {
    await tx.user.update({where: {id: userId}, data: {passwordHash}, select: {id: true, email: true, createdAt: true}})

    const row = await tx.passwordResetToken.updateMany({where: {id: resetId, userId, used: false}, data: {used: true} })
    if(row.count !== 1) throw new Error('RESET_EXPIRED')

    return 
  })
  console.log('success')


  return res.status(200).json({success: true})
  } catch(err) {
    console.log(err)
    return res.status(500).json({success: false, message: 'Server error'})
  }

}


// Exit in account
export async function logout(req, res) {

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    path: '/api/auth'
  })



  return res.status(200)
}