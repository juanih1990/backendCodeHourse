import productModel from "../dao/mongo/models/product.model.js";


class ProductService {
    constructor() {
        this.productModel = new productModel()
    }

    searchOneProduct = async (code) => {
        try {
            return await productModel.findOne({ code })
        } catch (error) {
            throw error
        }
    }

    searchCategory = async (code) => {
        try {
            return await productModel.distinct('category')
        } catch (error) {
            throw error
        }

    }

    searchById = async (id) => {
        try {
            return await productModel.findById(id)
        } catch (error) {
            throw error
        }

    }
    updateProduct = async (id,body) => {
        try {
            return await productModel.findByIdAndUpdate(id, body, {
                new: true
            })
        } catch (error) {
            throw error
        }
       
    }

    deleteProduct = async(id) => {
        try {
            return await productModel.findByIdAndDelete(id)
        } catch (error) {
            throw error
        }
    }
}
export default ProductService