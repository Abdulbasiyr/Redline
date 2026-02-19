import z from "zod"


export async function addTask(res, req) {
  const {title, text, color, date} = req.body

  const schema = z.object({
    title: z.string().min(1),
    text: z.string().min(1),
    color: z.string().min(3),
    date: z.string().transform((value) => {
      const [dd, mm, yyyy] = value.split(".");
      return new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
    })
  })

  const parsed = schema.safeParse(req.body)
  if(!parsed.success) return res.status(400).json({success: false, message: 'Incorrect Data'})

  


} 
