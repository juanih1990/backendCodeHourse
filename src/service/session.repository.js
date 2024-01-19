export default class SessionRepository {
    constructor(dao) {
        this.dao = dao
    }
    getSession = async () => {
        return this.dao.getSession()
    }
    getSessionOne = async (email, useLean) => {
        return this.dao.getSessionOne(email, useLean)
    }
    getSessionById = async id => {
        return this.dao.getSessionById(id)
    }
    register = async ({ firest_name, last_name, age, email }, passwordHash) => {
        const newUser = ({
            firest_name,
            last_name,
            age,
            email,
            password: passwordHash
        })
        return this.dao.createSession(newUser)
    }
    updateSession = async (id, body) => {
        return this.dao.findByIdAndUpdate(id, body, {
            new: true
        })
    }
    deleteSession = async id => {
        return this.dao.findByIdAndDelete(id)
    }
    updateClientCart = async (userID, cartID) => {
        try {
            const session = await this.dao.updateSessionCart(userID,cartID)
            return session
        } catch (error) {
            throw error
        }
    }
}