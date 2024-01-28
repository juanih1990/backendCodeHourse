import { ticketService, CartService, ProductService } from '../service/index.js'
import CustomError from '../errors/custom.errors.js'

export const purchase = async (req, res , next) => {
    try {
        const cid = req.params.cid
    const cart = await CartService.getCartById(cid)
    let total = 0
    let ids = []

    for (const cartProduct of cart.products) {

        // Obtener el producto por ID
        const product = await ProductService.getProductById(cartProduct.pid)

        // Verificar si el producto existe y tiene stock
        if (product && product.stock >= cartProduct.quantity) {
            total += product.price * cartProduct.quantity
            const newStock = product.stock - cartProduct.quantity
            //voy borrando los productos del carrito que cumplan con el stock.
            await CartService.deleteProductCart(cid, cartProduct.pid)
            await ProductService.updateProduct(cartProduct.pid, { stock: newStock })
        }
        else {
            ids.push(cartProduct.pid)
        }

    }
    const ticket = {
        amount: total,
        purchaser: cid,
    }

    const createTicket = await ticketService.createTicket(ticket)
    if(!createTicket){
        CustomError.TicketNotGenerated()
    }

    console.log("TOTAL: " + total)
    console.log("TICKET NUMBER: " + createTicket._id)

    return res.status(201).json({ ticket: createTicket._id })

    } catch (error) {
        next(error)
    }
}
export const getTicketByIdPopulate = async (req, res , next) => {
    try {
        const tid = req.params.tid
        const ticket = await ticketService.getTicketByIdPopulate(tid, true)
        if(!ticket){
               CustomError.TicketNotGenerated()
        }
        return res.render('ticket', { ticket: ticket })
    } catch (error) {
        next(error)
    }
}