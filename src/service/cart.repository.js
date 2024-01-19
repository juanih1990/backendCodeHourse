export default class CartRepository {
    constructor(dao){
       this.dao = dao
    }
    getCart = async () => {
        return  this.dao.getCart()
    }
    getCartOne = async ({code}) => {
        return  this.dao.getCartOne({code})
    }
    getCartById = async (id , useLean) => {
        return  this.dao.getCartById(id , useLean )
    }
    createCart = async () => {
        try {
            const cart = await this.getCartOne({ closeBuy: false })
            let respuesta
            if ((!cart) || (cart === null)) {
                const newCart = ({
                    products: [],
                    quantity: 1
                })
                const resp = await this.dao.createCart(newCart)
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
    updateCart= async (id,body) => {
        return  this.dao.updateCart(id,body)
    }
    deleteCart = async (id) => {
        return  this.dao.deleteCart(id)
    }
    deleteProductCart = async (cid,pid) => {
        return  this.dao.deleteProductCart(cid,pid)
    }
    addItem = async (cid) => {
        try {
           
            const showCart = await this.dao.getCartById(cid)
            if (showCart == null) return res.status(404).json({ message: 'Carrito vacio. Te invitamos a comprar!' })
            return showCart
        } catch (error) {
            throw error
        }
    }
    updateQuantity= async(cid, pid, newQuantity)=> {
        return this.dao.updateQuantity(cid, pid, newQuantity)
    }
  
}