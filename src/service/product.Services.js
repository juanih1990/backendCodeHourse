import productModel from "../dao/mongo/models/product.model.js";


class ProductService {
    constructor() {
        this.productModel = new productModel()
    }

    addNewProduct = async ({ title, description, price, thumbnail, code, stock, status, category }) => {
        try {
            const newProduct = new productModel({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                status
        
            })
            return newProduct
        } catch (error) {
            throw error
        }
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

    paginate = async(search,page,limit,sortField,sortOrder) =>{
        try {
           const paginate = await productModel.paginate(
                search
                , {
                    page,
                    limit,
                    sort: { [sortField]: sortOrder },
                    lean: true
                })
                return paginate
        } catch (error) {
            
        }
    }
}
export default ProductService