import {z} from 'zod'
import prisma from './prisma.js'


export async function apiAddTasks(req, res) {

  const schema = z.object({
    clientId: z.string(),
    title: z.string().min(1),
    text: z.string().min(1),
    color: z.string().min(3),
    date: z.coerce.date(),
    completed: z.boolean()
  })

  const parsed = schema.safeParse(req.body.data)
  
  if(!parsed.success) { return console.log(parsed.error.issues[0].message), res.status(400).json({success: false, message: 'Incorrect Data'})  }

  const {clientId, ...newTask} = parsed.data
  
  try {
    await prisma.task.create({ data: {...newTask, userId: req.userId}, select: {id: true}})

    return res.status(200).json({success: true})
  } catch(err) {
    console.log(err)
    res.status(500).json({success: false, message: 'Server error'})
  }

} 


// get 
export async function apiGetTasks(req, res) {

  if(!req.userId) return res.status(401).json({success: false, message: 'unAuthorized'})

  try {
    const tasks = await prisma.task.findMany({where: {userId: req.userId}})
    return res.status(200).json({success: true, tasks})
  } catch(err) {
    console.log(err)
    return res.status(500).json({success: false, message: 'Server error'})
  }

}


// delete
export async function apiDeleteTask(req, res) {

  if(!req.userId) return res.status(401).json({success: false, message: 'unAuthorized'})

  const id = req.params.id
  if(!id) return res.status(400).json({success: false, message: 'Invalid task'})

  try {
    const task = await prisma.task.findFirst({where: {id, userId: req.userId}})
    if(!task) return res.status(404).json({success: false, message: 'Task not Found'})

    await prisma.task.delete({where: {id} })
    return res.status(200).json({success: true})
  } catch(err) {
    console.log(err)
    res.status(500).json({success: false, message: 'Server Error'})
  }
    
}


// patch task 
export async function apiPatchTask(req, res) {

  if(!req.userId) return res.status(401).json({success: false, message: 'unAuthorized'})

  const schema = z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    color: z.string().min(3),
    date: z.coerce().date()
  })

  const parsed = schema.safeParse(req.body)
  
  if(!parsed.success) { return console.log(parsed.error.issues[0].message), res.status(400).json({success: false, message: 'Incorrect Data'})  }

  return console.log('zod success')
}