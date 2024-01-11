import mongoose from 'mongoose'
const sessionSchema =  new mongoose.Schema({
    firest_name: String,
    last_name: String,
    age: Number,
    email: String,
    password: String,
    role:{
        type: String,
        default : 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
    }
},{
    timestamps: true
})
export default mongoose.model('session', sessionSchema)