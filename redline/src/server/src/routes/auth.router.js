
import { Router } from "express";

import { loginUser, registerUser, logout, rateLimiter, passwordResetRequest, confirmResetCode, confirmCodeLimiter, resetPassword} from '../auth.js';
import { updatePage } from '../token.js';

const router = Router()


router.post('/registerUser', registerUser)
router.post('/loginUser', loginUser)
router.post('/refresh', updatePage)

router.post('/password-reset/request', rateLimiter, passwordResetRequest )
router.post('/password-reset/verify', confirmCodeLimiter, confirmResetCode)
router.post('/password-reset/confirm', resetPassword)

router.post('/logout', logout)



export default router