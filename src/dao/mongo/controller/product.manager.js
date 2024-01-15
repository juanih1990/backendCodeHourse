import productModel from '../models/product.model.js'
import mongoose from 'mongoose'
import ServicesProduct from '../../../service/product.Services.js'

const servicesProduct = new ServicesProduct()

//Crear un Producto
export const addProduct = async (req, res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body
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
    const isMatch = await servicesProduct.searchOneProduct(code)
    if (isMatch) return res.status(409).json({ message: "El producto ya esta cargado" })

    const resp = await newProduct.save()
    return res.render('addProduct', {})
}
// Render de pantalla para agregar productos
export const viewAddProduct = (req, res) => {
    res.render('addProduct' , {})
}

//Buscar todos los productos
export const getProduct = async (req, res) => {

    const limit = parseInt(req.query?.limit ?? 2)
    const page = parseInt(req.query?.page ?? 1)
    const query = req.query?.query ?? ''
    const sortField = req.query?.sort ?? 'price'
    const sortOrder = req.query?.order ?? 'asc'
    const category = req.query?.category || ''
    const stockOnly = req.query?.stockOnly === 'true'
    const categorys = await servicesProduct.searchCategory('category')
   
    const search = {}
    if (category) {
        search.category = category
    }
    if (stockOnly) {
        search.stock = { $gt: 0 }
    }
    if (query) search.title = { "$regex": query, "$options": "i" }

    const result = await productModel.paginate(
        search
        , {
            page,
            limit,
            sort: { [sortField]: sortOrder },
            lean: true
        })
    result.query = ''
    result.status = 'success'
    
    
    return res.render("products", { payload: result , categorys })

}
//Buscar un producto
export const getProductById = async (req, res) => {
    const id = req.params.id
    //veo que id sea un objectID valido es decir que tenga 24 caracteres.    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'No existe ningun producto con el id: ' + id })
    }
    const product = await servicesProduct.searchById(id)
    if (product == null) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
}
//Actualizar un producto
export const updateProduct = async (req, res) => {
    const update = await servicesProduct.updateProduct(req.params.id, req.body)
    if (!update) return res.status(404).json
    res.json(update)
}
//Borrar un producto
export const deleteProduct = async (req, res) => {
    const deleteProduct = await servicesProduct.deleteProduct(req.params.id)
    console.log(req.params.id)
    if (!deleteProduct) return res.status(404).json
    res.sendStatus(204)
}