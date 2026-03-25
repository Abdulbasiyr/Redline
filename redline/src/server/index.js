import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { loginUser, registerUser, requireAuth, logout, rateLimiter, passwordResetRequest, confirmResetCode, confirmCodeLimiter, resetPassword} from './auth.js';
import { updatePage } from './token.js';
import taskRoutes from './tasks.routes.js'
import { settings } from './settings.js';

const app  = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [ 'http://localhost:5173', 'https://redline-s.netlify.app' ],
  credentials: true
}))

app.post('/api/auth/registerUser', registerUser)
app.post('/api/auth/loginUser', loginUser)
app.post('/api/auth/refresh', updatePage)

app.patch('/api/user/settings', requireAuth, settings)

app.use('/api/tasks', requireAuth, taskRoutes)
app.post('/api/auth/logout', logout)
app.post('/api/auth/password-reset/request', rateLimiter, passwordResetRequest )
app.post('/api/auth/password-reset/verify', confirmCodeLimiter, confirmResetCode)
app.post('/api/auth/password-reset/confirm', resetPassword)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

