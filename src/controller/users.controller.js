import { SessionService } from '../service/index.js'
import CustomError from '../errors/custom.errors.js'

export const changeRol = async(req,res) => {
    try {
        const uid = req.params.uid
        
        const user = await SessionService.getSessionById(uid)
        if(!user) {
            CustomError.loginUser(user)   
        }
        else{
            if(user.role === 'user'){
                const update = await SessionService.updateRole(user._id,'premium')
                console.log("ROl: " + update.role)
                return res.json({ status: 'success', payload: update })
            }
            else if(user.role === 'premium'){
                const update = await SessionService.updateRole(user._id,'user')
                console.log("ROl: " + update.role)
                return res.json({ status: 'success', payload: update })
            } 
        }
    } catch (error) {
        console.log("Error: " + error)
       // next(error)
    }
}
