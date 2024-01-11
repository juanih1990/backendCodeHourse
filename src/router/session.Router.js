import { Router } from 'express'
import { login, register, logout, renderLogin, current, githublogin, githubcallback, viewRegister } from '../dao/mongo/controller/session.manager.js'
import passport from 'passport'

const router = Router()

router.get('/', renderLogin)
router.get('/viewRegister', viewRegister)
router.post('/login', login)
router.get(
    '/githublogin',
    passport.authenticate('github', { scope: ['user:email'] }),
    githublogin
)
router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: 'error?error=githubFail' }),
    githubcallback
)
router.post('/register', register)
router.get('/logout', logout)
router.get(
    '/current',
    passport.authenticate('jwt', {session: false}),
    current)


export default router