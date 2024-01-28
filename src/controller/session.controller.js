import { SessionService } from '../service/index.js'
import { generateToken } from '../util.js'
import bcrypt from 'bcrypt'
import DtoCurrent from '../dto/current.dto.js'
import config from '../config/config.js'
import CustomError from '../errors/custom.errors.js'



export const viewRegister = async (req, res) => {
    res.render('register', {})
}
export const renderLogin = async (req, res) => {
    res.render('session', {})
}
export const login = async (req, res , next) => {
    const { email, password } = req.body
    try {
        let userFound
        if (email === config.USER && password === config.PASSWORD) {
            const passwordHash = await bcrypt.hash(password, 10)
            userFound = {
                email: config.USER,
                password: passwordHash,
                role: 'admin'
            }
        }
        else {
            userFound = await SessionService.getSessionOne({ email }, false)
        }
        
        if (!userFound) {
            CustomError.loginUser(req.body)   
        }

        const isMatch = bcrypt.compare(password, userFound.password)

        if (!isMatch) return res.status(400).json({ message: 'invalid credencial' })

        const token = generateToken(userFound)
    
        res.cookie('cookieJWT', token).redirect('/api/products/getProduct')


    } catch (error) {
        next(error)
    }
}
export const register = async (req, res, next) => {

        const { firest_name, last_name, age, email, password } = req.body
    try {
        if(!firest_name || !last_name || !age || !email || !password){
             CustomError.createUsers(req.body)      
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await SessionService.register({ firest_name, last_name, age, email }, passwordHash)
    
        const token = generateToken(newUser)
        res.cookie('cookieJWT', token).redirect('/api/products/getProduct')

    } catch (error) {
        next(error) 
    }
}

export const logout = async (req, res) => {
    res.clearCookie('cookieJWT');
    res.redirect('/');
}


export const current = async (req, res) => {
    const { user } = req.user
    const email = user.email
    let perfil
    if (user.role === 'admin') {
        perfil = {
            email: config.USER,
            role: 'admin'
        }
    }
    else {
        perfil = await SessionService.getSessionOne({ email }, true)
    }
    const perfilUser = new DtoCurrent(perfil)
    res.render('perfil', { user: perfilUser })
}

export const githublogin = async (req, res) => {

}

export const githubcallback = async (req, res) => {
        if (!req.user) {
            CustomError.loginGithub()
        }
        res.cookie('cookieJWT', req.user.token).redirect('/api/products/getProduct')
}
