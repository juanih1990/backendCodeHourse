import sessiontModel from '../models/session.model.js'
import mongoose from 'mongoose'
import { generateToken } from '../../../util.js'
import bcrypt from 'bcrypt'
import SessionService from '../../../service/session.services.js'

const serviceSession = new SessionService()

//render views login 
export const renderLogin = async (req, res) => {
        res.render('session', {})
}
//render views register 
export const viewRegister = async (req, res) => {
        res.render('register', {})
}
//Loguear
export const login = async (req, res) => {
        const { email, password } = req.body
        try {
                const userFound = await serviceSession.searchUserByEmail({ email } , false)
                if (!userFound) return res.status(400).json({ message: 'user not found' })

                const isMatch = bcrypt.compare(password, userFound.password)

                if (!isMatch) return res.status(400).json({ message: 'invalid credencial' })

                const token = generateToken(userFound)

                res.cookie('cookieJWT', token).redirect('/api/products/getProduct')


        } catch (error) {
                res.status(500).json({ message: error.message })
        }
}
//Loguear con github
export const githublogin = async (req, res) => { }
//Loguear con githubCallback
export const githubcallback = async (req, res) => {
        if (!req.user) {
                return res.status(400).send('invalid github')
        }
        res.cookie('cookieJWT', req.user.token).redirect('/api/products/getProduct')
}
//Registrar usuarios
export const register = async (req, res) => {
        try {
                const { firest_name, last_name, age, email, password } = req.body
                const passwordHash = await bcrypt.hash(password, 10)
                const newUser = await serviceSession.register({ firest_name, last_name, age, email } , passwordHash)
                await newUser.save()
                const token = generateToken(newUser)
                res.cookie('cookieJWT', token).redirect('/api/products/getProduct')
        } catch (error) {
                res.status(500).json({ message: error.message })
        }
}
//Cerrar session .
export const logout = async (req, res) => {
        // Elimina el token JWT almacenado en la cookie
        res.clearCookie('cookieJWT');
        res.redirect('/');
}

//Perfil de usuario .
export const current = async (req, res) => {
        const  {user}  = req.user
        const email = user.email
        const perfil = await serviceSession.searchUserByEmail( {email} , true)
        res.render('perfil', { user: perfil })
}

