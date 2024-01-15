import sessionModel from '../dao/mongo/models/session.model.js'

class SessionService {
    constructor() {
        this.sessionModel = new sessionModel()
    }

    searchUserByEmail = async ({email}, useLean = false) => {
        try {
            const query =  sessionModel.findOne({ email })
            const userFound = useLean ? await query.lean() : await query
            return userFound
        } catch (error) {
            throw error
        }
    }

    register = async ({ firest_name, last_name, age, email }, passwordHash) => {
        const newUser = new sessionModel({
            firest_name,
            last_name,
            age,
            email,
            password: passwordHash
        })
        return newUser
    }
}

export default SessionService