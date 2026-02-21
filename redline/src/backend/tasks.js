import z from "zod"
import prisma from './prisma.js'


export async function addTask(res, req) {

  const schema = z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    color: z.string().min(3),
    date: z.string().transform((value) => {
      const [dd, mm, yyyy] = value.split(".");
      return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    }),
    completed: z.boolean()
  })

  const parsed = schema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({success: false, message: 'Incorrect Data'})

  const {title, text, color, date, completed} = parsed.data
  
  try {
    await prisma.task.create({ data: {}})
  }

} 
