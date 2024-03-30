import { Router } from 'express'
import { viewChat } from '../controller/chat.controller.js'
import passport from 'passport'

const router = Router()

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    viewChat)




export default router