import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { loginUser, registerUser, requireAuth, logout, rateLimiter, passwordResetRequest, confirmResetCode, confirmCodeLimiter, resetPassword} from './auth.js';
import { updatePage } from './token.js';
import taskRoutes from './tasks.routes.js'
import prisma from './prisma.js';
import z from 'zod';

const app  = express()
const PORT = 3000

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  // origin: 'http://localhost:5173', 
  origin: 'https://redlins.netlify.app',
  credentials: true
}))

app.post('/api/auth/registerUser', registerUser)
app.post('/api/auth/loginUser', loginUser)
app.post('/api/auth/refresh', updatePage)

app.patch('/api/user/settings', requireAuth, async (req, res) => {

  const schema = z.object({
    name: z.string().trim().min(1),
    language: z.string(),
    startPage: z.string(),
    confirmDelete: z.boolean()
  })
    console.log('start server...')

  const parsed = schema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({success: false, message: 'Invalid Settings'})

  const { name, language, startPage, confirmDelete}  = parsed.data

  try {

    const saveSettings =  await prisma.$transaction( async (tx) => {
                            const nameResult = await tx.user.update({where: {id: req.userId}, data: {name}, select: {name: true} })

                            const settingsResult =  await tx.userSettings.update({where: {userId: req.userId}, data: {language, startPage, confirmDelete}, select: {language: true, startPage: true, confirmDelete: true} })
                            return {settingsResult, name: nameResult.name}
                          })

    return res.status(200).json({success: true, message: 'Settings saved!', settings: saveSettings.settingsResult, name: saveSettings.name})

  } catch(err) {
    console.log(err)
    if(err.code === 'P2025') return res.status(404).json({success: false, message: 'Record not Found'})
    return res.status(500).json({success: false, message: 'Settings Error'})
  }

})

app.use('/api/tasks', requireAuth, taskRoutes)
app.post('/api/auth/logout', logout)
app.post('/api/auth/password-reset/request', rateLimiter, passwordResetRequest )
app.post('/api/auth/password-reset/verify', confirmCodeLimiter, confirmResetCode)
app.post('/api/auth/password-reset/confirm', resetPassword)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

