import config from "../config/config.js"
import mongoose from "mongoose"

export let producto
export let session
export let cart
export let ticket

console.log(`Persistencie with ${config.PERSISTENCE}`)

switch (config.PERSISTENCE) {
    case "MONGO":
        const mongoURL = config.MONGO_URL
        const mongoDBName = config.MONGO_DB_NAME
        await mongoose.connect(mongoURL, { dbName: mongoDBName })
        console.log("Conexion exitosa a la base de datos mongo")
        const { default: ProductsMongo } = await import('./mongo/products.mongo.js')
        const { default: CartMongo } = await import('./mongo/carts.mongo.js')
        const { default: SessionMongo } = await import('./mongo/session.mongo.js')
        const { default: TicketMongo } = await import('./mongo/ticket.mongo.js')

        producto = ProductsMongo
        session = SessionMongo
        cart = CartMongo
        ticket = TicketMongo
        
        break
    default:
        throw new Error('Persistence not recognized')
}