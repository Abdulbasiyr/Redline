import prisma from "../lib/prisma.js";
import z from "zod";

export async function settings(req, res) {

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

}