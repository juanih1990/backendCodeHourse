import fs from 'fs'

class FileManager {
    constructor(filename = './db.json') {
        this.filename = filename
    }

    get = async () => {
        return fs.promises.readFile(this.filename, 'utf-8')
            .then(r => JSON.parse(r))
            .catch(e => [])
    }

    getById = async id => {
        const data = await this.get()
        const dato = data.find(d => d._id === parseInt(id))
        return dato
    }

    add = async (data) => {
        const list = await this.get()
        data._id = list.length + 1
        list.push(data)
        const saveData = fs.promises.writeFile(this.filename, JSON.stringify(list))
        return data
    }

    update = async (id, data) => {
        const list = await this.get();
        const idx = list.findIndex(a => a._id === id)
        if (idx !== -1) {
            list[idx] = { ...list[idx], cart: data }
            await fs.promises.writeFile(this.filename, JSON.stringify(list));
            return list[idx]
        } else {
            throw new Error('Usuario no encontrado')
        }
    }
    save = async (idcart, pid) => {
        const data = await this.get()
        const cartIndex = data.findIndex((d) => d._id === parseInt(idcart))
        try {
            if (cartIndex !== -1) {
                const updatedCart = { ...data[cartIndex] }
                const productIndex = updatedCart.products.findIndex((p) => p.pid === parseInt(pid))
                if (productIndex !== -1) {
                    updatedCart.products[productIndex].quantity++
                } else {
                    const lastPID = updatedCart.products.reduce((max, product) => Math.max(max, product.pid), 0);
                    const newPID = lastPID + 1;
                    updatedCart.products.push({ pid: newPID, quantity: 1 })
                }

                data[cartIndex] = updatedCart

                await fs.promises.writeFile(this.filename, JSON.stringify(data))

                return data[cartIndex]
            } 
        } catch (error) {
            // Si no se encuentra el carrito con el ID especificado, manejar el error correspondiente
            throw new Error("Carrito no encontrado")
        }

    }
}
export default FileManager