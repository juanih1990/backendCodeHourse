import cartModel from '../models/cart.model.js'
import cartClient from '../models/session.model.js'
import mongoose from 'mongoose'
import ServicesCart from '../../../service/cart.Services.js'

const serviceCart = new ServicesCart()

//crear el carrito
export const createCart = async (req, res) => {
    try {
        const respuesta = await serviceCart.createCart()
        //extraigo el id del usuario del token
        const { user } = req.user
        console.log("ide del usuario " + user._id)
        // Asigna el ID del carrito recién creado a la sesión del usuario
        const session = await cartClient.findOneAndUpdate(
            { _id: user._id },
            { $set: { cart: respuesta._id } },
            { new: true }
        )
        console.log("respues del servicio: " + respuesta)
    
        return res.status(201).json({ cartId: respuesta });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito.' + error });
    }

}
//Mostrar todos los carritos
export const getCart = async (req, res) => {

    //buscar los carritos que tiene como referencia el cliente  en lugar de cid usar ese parametro
    const { user } = req.user
    const match = await cartClient.findById(user._id)
    const cid = match.cart
    // const cid = user.cart
    //veo que cid sea un objectID valido es decir que tenga 24 caracteres.    
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(404).json({ message: 'No tiene ningun carrito abierto. Te invitamos a comprar!' })
    }

    try {
        const showCart = await serviceCart.getCartById(cid)
        res.render('cart', { cart: showCart })
    } catch (error) {
        res.status(500).json({ eror: "Error al mostrar el carrito. " + error })
    }
}
//Agregar item al carrito .
export const addItemCart = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid

    //veo que cid sea un objectID valido es decir que tenga 24 caracteres.    
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(404).json({ message: 'No existe el carrito con  id: ' + cid })
    }
    try {
        //Busco si el carrito existe
        const cartId = await serviceCart.addItem(cid)
    
       //Si el carrito existe reviso si el id del producto que quiero agregar existe dentro del carrito que acabo de buscar
        const cartPid = cartId.products.find(product => product.pid == pid);
        //Si el producto existe aumento su cantidad en uno por el momento
        if (cartPid) {
            cartPid.quantity = (cartPid.quantity || 0) + 1
            const saveCart = await cartId.save()
            return res.json(saveCart)
        }
        //Si no existe lo creo.
        else {
            cartId.products.push({
                pid: pid,
                quantity: 1
            })

            //guardo el producto en el carrito
            const saveCart = await cartId.save()
            return res.json(saveCart)
        }
    } catch (error) {
        console.log("Error " + error)
        res.status(500).json({ message: "Error interno del servidor" })
    }
}
//Elimina del carrito el producto seleccionado
export const deleteProductCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const result = await serviceCart.deleteProductCart(cid,pid)
        return res.status(200).json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
//Elimina el carrito.
export const deleteCarts = async (req, res) => {
    const cid = req.params.cid
    try {
        //cuando borro todo el carrito tambien tengo que borrar carts del cliente
        const result = await serviceCart.deleteCart(cid)
        console.log("borre todo el carrito")
        return res.status(200).json({ message: 'Carrito eliminado correctamente' })
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}
//Modifica solo la cantidad en el carrito, por la cantidad pasada
export const updateQuantity = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const newQuantity = req.body.quantity
    try {
        const result = await serviceCart.updateQuantity(cid,pid,newQuantity)
        if (result.modifiedCount > 0) {
            return res.status(200).json({ message: 'Cantidad actualizada correctamente' })
        }
        else {
            return res.status(404).json({ message: "Ocurrio un problema al actualizar el producto , vuelva a intentarlo" })
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' })
    }
}