import CartModel from '../mongo/models/cart.model.js'

export default class Cart {
    getCart = async () => {
        return CartModel.find()
    }
    getCartOne = async ({search}) => {
        return CartModel.findOne({ search })
    }
    getCartById = async (id , useLean = false) => {
        const query =  CartModel.findById(id)
        const QueryCartID = useLean ? await query.populate('products.pid').lean().exec() : await query
        return QueryCartID
    }
    createCart = async product => {
        return CartModel.create(product)
    }
    updateCart= async (id,body) => {
        return CartModel.findByIdAndUpdate(id,body , {
            new : true
        })
    }
    deleteCart = async id => {
        return CartModel.findByIdAndDelete(id)
    }
    deleteProductCart = async (cid,pid) => {
        try {
            const result =  CartModel.updateOne(
                { _id: cid, 'products.pid': pid },
                { $pull: { products: { pid: pid } } }
            )
            return result
        } catch (error) {
            throw error
        }
    }
    updateQuantity= async(cid, pid, newQuantity)=> {
        try {
            const result = await CartModel.updateOne(
                { _id: cid, 'products.pid': pid },
                { $set: { 'products.$.quantity': newQuantity } }
            )
            return result
        } catch (error) {
            throw error
        }

    
    }

}