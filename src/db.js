import mongoose from 'mongoose'
import config from './config/config.js'

export const connectDB = async () => {
    try {
        const mongoURL = config.MONGO_URL
        const mongoDBName = config.MONGO_DB_NAME
        await mongoose.connect(mongoURL, { dbName: mongoDBName })
        console.log("Conexion exitosa a la base de datos")
    } catch (error) {
        console.log("error")
    }
}