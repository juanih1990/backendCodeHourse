import { Router } from 'express'
import { getProduct, getProductById, addProduct ,updateProduct ,deleteProduct , viewAddProduct } from '../dao/mongo/controller/product.manager.js'
import passport from 'passport'

const router = Router()

router.get(
            '/getProduct',
            passport.authenticate('jwt' , {session: false}),
            getProduct 
)
router.get('/getProductById/:id', getProductById)
router.get(
    '/ViewAddProduct' ,
    passport.authenticate('jwt' , {session: false}) , 
     viewAddProduct)
router.post('/addProduct', addProduct)
router.put('/updateProduct/:id' , updateProduct )
router.delete('/deleteProduct/:id', deleteProduct)


export default router