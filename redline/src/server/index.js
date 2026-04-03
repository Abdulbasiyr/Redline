import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import taskRoutes from './src/routes/tasks.routes.js'
import { settings } from './src/settings.js';
import { requireAuth } from './src/auth.js';
import authRouter from './src/routes/auth.router.js'

const app  = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: [ 'http://localhost:5173', 'https://redline-s.netlify.app' ],
  credentials: true
}))



app.patch('/api/user/settings', requireAuth, settings)

app.use('/api/auth', authRouter)
app.use('/api/tasks', requireAuth, taskRoutes)


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

