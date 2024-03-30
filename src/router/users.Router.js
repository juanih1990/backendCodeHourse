import { Router } from 'express'
import { changeRol, allUsers ,deleteInactive , updateRol} from '../controller/users.controller.js'

const router = Router()
router.get('/', allUsers)
router.put('/premium/:uid', changeRol)
router.put('/updateRol/:uid', updateRol)
router.delete('/deleteInactive' , deleteInactive)
export default router