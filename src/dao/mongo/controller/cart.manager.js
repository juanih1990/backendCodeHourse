import cartModel from '../models/cart.model.js'
import cartClient from '../models/session.model.js'
import mongoose from 'mongoose'

//crear el carrito
export const createCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne({ closeBuy: false })

        let respuesta
        if (!cart) {
                const newCart = new cartModel({
                products: [],
                quantity: 1
               
            })
           //guardo el carrito en el cliente , por que cada cliente tiene sus carritos
            const resp = await newCart.save()
            respuesta = resp._id
           
            //extraigo el id del usuario del token
            const {user} = req.user
            // Asigna el ID del carrito recién creado a la sesión del usuario
           const session = await cartClient.findOneAndUpdate(
                { _id: user._id }, 
                { $set: { cart: resp._id } },
                { new: true }
            )
        }
        else {
            respuesta = cart._id
        }
        return res.status(201).json({ cartId: respuesta });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito.' + error });
    }

}

//Mostrar todos los carritos
export const getCart = async (req, res) => {

    //buscar los carritos que tiene como referencia el cliente  en lugar de cid usar ese parametro
    const {user} = req.user
    const match = await cartClient.findById(user._id)
    const cid = match.cart
   // const cid = user.cart
    //veo que cid sea un objectID valido es decir que tenga 24 caracteres.    
    if (!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(404).json({ message: 'No tiene ningun carrito abierto. Te invitamos a comprar!' })
    }

    try {
        const showCart = await cartModel.findById(cid).populate('products.pid').lean().exec()
        if (showCart == null) return res.status(404).json({ message: 'Carrito vacio. Te invitamos a comprar!' })

        res.render('cart' , {cart: showCart})
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
        const cartId = await cartModel.findById(cid)
        //Si no existe muestro un mensaje de error
        if (!cartId) return res.status(404).json({ message: "Error: no se encontro el carrito " })
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
    console.log("cid " + cid)
    console.log("pid " + pid)
    try {
        const result = await cartModel.updateOne(
            { _id: cid, 'products.pid': pid },
            { $pull: { products: { pid: pid } } }
        )
        return res.status(200).json({ message: 'Carrito eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
//Elimina el carrito.
export const deleteCarts = async (req, res) => {
    const cid = req.params.cid
    console.log("cid d" + cid)
    try {
        const result = await cartModel.deleteOne({ _id: cid })
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
        const result = await cartModel.updateOne(
            { _id: cid, 'products.pid': pid },
            { $set: { 'products.$.quantity': newQuantity } }
        );
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