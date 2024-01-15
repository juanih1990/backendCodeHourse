import cartModel from '../dao/mongo/models/cart.model.js'

class CartService {
    constructor() {
        this.cartModel = new cartModel()
    }

    createCart = async () => {
        try {
            const cart = await cartModel.findOne({ closeBuy: false })
            console.log("mi carrito: " + cart)
            let respuesta
            if ((!cart) || (cart === null)) {
                const newCart = new cartModel({
                    products: [],
                    quantity: 1
                })
                const resp = await newCart.save()
                respuesta = resp._id

                return respuesta
            }
            else {
                return respuesta = cart._id
            }
        } catch (error) {
            throw error
        }
    }

    getCartById = async (cid) => {
        try {
            const showCart = await cartModel.findById(cid).populate('products.pid').lean().exec()
            if (showCart == null) return res.status(404).json({ message: 'Carrito vacio. Te invitamos a comprar!' })
            console.log(showCart)
            return showCart
        } catch (error) {
            throw error
        }
    }

    addItem = async (cid) => {
        try {
            const showCart = await cartModel.findById(cid)
            if (showCart == null) return res.status(404).json({ message: 'Carrito vacio. Te invitamos a comprar!' })
            return showCart
        } catch (error) {
            throw error
        }
    }

    deleteProductCart = async (cid, pid) => {
        try {
            const result = await cartModel.updateOne(
                { _id: cid, 'products.pid': pid },
                { $pull: { products: { pid: pid } } }
            )
            return result
        } catch (error) {
            throw error
        }
    }

    deleteCart = async (cid) => {
        try {
            //cuando borro todo el carrito tambien tengo que borrar carts del cliente
            console.log("entre al servicio")
            const result = await cartModel.deleteOne({ _id: cid })
            return result
        } catch (error) {
            throw error
        }
    }

    updateQuantity = async (cid, pid, newQuantity) => {
        try {
            const result = await cartModel.updateOne(
                { _id: cid, 'products.pid': pid },
                { $set: { 'products.$.quantity': newQuantity } }
            )
            return result
        } catch (error) {
            throw error
        }

    }

}

export default CartService
