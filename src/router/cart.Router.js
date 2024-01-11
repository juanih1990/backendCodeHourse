import { Router } from 'express'
import { createCart, addItemCart, getCart, deleteProductCart, deleteCarts, updateQuantity } from '../dao/mongo/controller/cart.manager.js'
import passport from 'passport'

const router = Router()

router.post(
    '/',  
    passport.authenticate('jwt' , {session: false}), 
    createCart)
router.get(
    '/:cid',  
    passport.authenticate('jwt' , {session: false}), 
    getCart)
router.post('/:cid/product/:pid', addItemCart)
router.delete('/:cid/product/:pid', deleteProductCart)
router.delete('/:cid', deleteCarts)
router.put('/:cid/product/:pid', updateQuantity)

export default router