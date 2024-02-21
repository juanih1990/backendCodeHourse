import { Router } from 'express'
import {  changeRol } from '../controller/users.controller.js'

const router = Router()
router.put('/premium/:uid', changeRol)
export default router