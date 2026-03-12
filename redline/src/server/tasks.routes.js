import { Router } from "express"
import { apiAddTasks, apiDeleteTask, apiGetTasks, apiPatchTask } from "./tasks.js"

const router = Router()

router.get('/get', apiGetTasks)
router.post('/add', apiAddTasks)
router.patch('/update/:id', apiPatchTask)
router.delete('/delete/:id', apiDeleteTask)



export default router