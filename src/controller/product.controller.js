import { ProductService } from '../service/index.js'
import mongoose from 'mongoose'

export const getProducts = async(req,res) => {
    const limit = parseInt(req.query?.limit ?? 2)
    const page = parseInt(req.query?.page ?? 1)
    const query = req.query?.query ?? ''
    const sortField = req.query?.sort ?? 'price'
    const sortOrder = req.query?.order ?? 'asc'
    const category = req.query?.category || ''
    const stockOnly = req.query?.stockOnly === 'true'
    const categorys = await ProductService.searchCategory('category')

    const search = {}
    if (category) {
        search.category = category
    }
    if (stockOnly) {
        search.stock = { $gt: 0 }
    }
    if (query) search.title = { "$regex": query, "$options": "i" }

    const result = await ProductService.paginate(search, page, limit, sortField, sortOrder)
    result.query = ''
    result.status = 'success'


    return res.render("products", { payload: result, categorys })
}

export const getProductById = async(req,res) => {
    const id = req.params.id
     //veo que id sea un objectID valido es decir que tenga 24 caracteres.    
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'No existe ningun producto con el id: ' + id })
    }
    const product = await ProductService.getProductById(id)
    if (product == null) return res.status(404).json({ message: 'Producto no encontrado' })
    res.json(product)
}

export const addProduct = async(req,res) => {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body
    const newProduct = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      }
    const isMatch = await ProductService.getProductOne(code)
    console.log(isMatch)
    if (isMatch) return res.status(409).json({ message: "El producto ya esta cargado" })
    const resp = await ProductService.addProduct(newProduct)
    return res.render('addProduct', {})
}

export const updateProduct = async(req,res) => {
    const update = await ProductService.updateProduct(req.params.id, req.body)
    if (!update) return res.status(404).json
    res.json(update)
}

export const deleteProduct = async(req,res) => {
    const deleteProduct = await ProductService.deleteProduct(req.params.id)
    console.log(req.params.id)
    if (!deleteProduct) return res.status(404).json
    res.sendStatus(204)
}

export const viewAddProduct = async(req,res) => {
    res.render('addProduct', {})
}