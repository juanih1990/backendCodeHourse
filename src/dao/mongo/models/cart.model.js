import mongoose from 'mongoose'

const cartSchema =  new mongoose.Schema({
    products: [{
        pid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            require: true

        },
        quantity: {
            type: Number,
            require: true
        }
    }],
    closeBuy : {        //va a indicar si finalizo la compra, es decir puede agregar varios productos al carrito, y cuando finaliza la compra (da click al boton comprar pasa a true. por defecto false)
        type: Boolean,
        required: true,
        default: false
    }
})
export default mongoose.model('Cart', cartSchema)