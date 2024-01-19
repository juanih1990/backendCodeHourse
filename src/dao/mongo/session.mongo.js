import SessionModel from '../mongo/models/session.model.js'

export default class Session {
    getSession = async () => {
        return SessionModel.find()
    }
    getSessionOne = async ({ email }, useLean = false) => {
        const query = SessionModel.findOne({ email })
        const userFound = useLean ? await query.lean() : await query
        return userFound
    }
    getSessionById = async id => {
        return SessionModel.findById(id)
    }
    createSession = async user => {
        return SessionModel.create(user)
    }
    updateSession = async (id, body) => {
        return SessionModel.findByIdAndUpdate(id, body, {
            new: true
        })
    }
    updateSessionCart = async (id, cartID) => {
        return SessionModel.findOneAndUpdate(
            { _id: id },
            { $set: { cart: cartID } },
            { new: true }
        )
    }
    deleteSession = async id => {
        return SessionModel.findByIdAndDelete(id)
    }
}