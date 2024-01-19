import { Router } from 'express'
import { getProducts, getProductById, addProduct ,updateProduct ,deleteProduct , viewAddProduct } from '../controller/product.controller.js'
import passport from 'passport'

const router = Router()

router.get(
            '/getProduct',
            passport.authenticate('jwt' , {session: false}),
            getProducts
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