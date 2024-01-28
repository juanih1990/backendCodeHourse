import { ProductService } from '../service/index.js'
import mongoose from 'mongoose'
import { opts } from '../config/commander.js'
import CustomError from '../errors/custom.errors.js'

export const getProducts = async (req, res, next) => {
    try {
        if (opts.persistence === 'FILE') {
            const result = await ProductService.getProducts()
            return res.render("productsFile", { payload: result })
        }
        else {
            const limit = parseInt(req.query?.limit ?? 2)
            const page = parseInt(req.query?.page ?? 1)
            const query = req.query?.query ?? ''
            const sortField = req.query?.sort ?? 'price'
            const sortOrder = req.query?.order ?? 'asc'
            const category = req.query?.category || ''
            const stockOnly = req.query?.stockOnly === 'true'
            const admin = req.userData?.admin ?? false
            const categorys = await ProductService.searchCategory('category')
            console.log("admin?" + req.userData.admin)
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
            result.admin = admin
            console.log(result.admin)

            return res.render("products", { payload: result, categorys })
        }
    } catch (error) {
        next(error)
    }


}

export const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id 
        if (!mongoose.Types.ObjectId.isValid(id)) {
            CustomError.ProductNotFound()
        }
        const product = await ProductService.getProductById(id)
        if (product == null) {
            CustomError.ProductNotFound()
        }
        res.json(product)
    } catch (error) {
        next(error)
    }

}

export const addProduct = async (req, res, next) => {
    try {
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
        if (isMatch) {
            CustomError.ProductInStock()
        }

        const resp = await ProductService.addProduct(newProduct)
        return res.render('addProduct', {})
    } catch (error) {
        next(error)
    }

}

export const updateProduct = async (req, res, next) => {
    try {
        const update = await ProductService.updateProduct(req.params.id, req.body)
        if (!update) {
            CustomError.UpdatingError()
        }
        res.json(update)
    } catch (error) {
        next(error)
    }

}

export const deleteProduct = async (req, res , next) => {
    try {
        const deleteProduct = await ProductService.deleteProduct(req.params.id)
        if (!deleteProduct) {
            CustomError.DeleteError()
        }
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
}

export const viewAddProduct = async (req, res) => {
    res.render('addProduct', {})
}