import { Router } from 'express'
import { changeRol, allUsers ,deleteInactive} from '../controller/users.controller.js'

const router = Router()
router.get('/', allUsers)
router.put('/premium/:uid', changeRol)
router.delete('/deleteInactive' , deleteInactive)
export default router