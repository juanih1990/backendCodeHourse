import { ticketService, CartService, ProductService } from '../service/index.js'

export const purchase = async (req, res) => {
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
    console.log("Productos no agregados por falta de stock " + ids)

    console.log("TOTAL: " + total)
    console.log("TICKET NUMBER: " + createTicket._id)
    return res.status(201).json({ ticket: createTicket._id })


    // AL FINALIZAR MOSTRAR UN TICKET CON SOLO LOS DATOS DE LA COMPRA.
    //EN CASO DE EXISTIR UNA COMPRA  NO COMPLETADA DEVOLVER LOS IDS CON LOS PRODUCTOS QUE NO PUDIERON PROCESARSE


}
export const getTicketByIdPopulate = async (req, res) => {
    try {
        console.log("Entro a ticket controller")
        const tid = req.params.tid
        const ticket = await ticketService.getTicketByIdPopulate(tid, true)
        return res.render('ticket', { ticket: ticket })
    } catch (error) {
        console.error("Error al obtener el ticket:", error);
        res.status(500).send("Error al obtener el ticket");
    }
}