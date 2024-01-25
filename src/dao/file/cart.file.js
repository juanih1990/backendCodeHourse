import FileManager  from "./file.manager.js"

export default class Cart extends FileManager {
    constructor(filename = './db.cart.json'){
        super(filename)
    }

    getCart = async() => { return this.get()}
    getProductById = async id => { return this.getById(id)}
    createCart = async cart => {  return this.add(cart)}
}