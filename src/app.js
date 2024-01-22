import express from 'express'
import morgan from 'morgan'
import productRoutes from './router/products.Router.js'
import cartRoutes from './router/cart.Router.js'
import sessionRoutes from './router/session.Router.js'
import handlebars from 'express-handlebars'
import __dirname from './util.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { verificarToken } from './middleware/verificarToken.js'




const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//handlebars
app.engine('handlebars', handlebars.engine())
//seteo las vistas 
app.set('views', __dirname + '/views')
//indicamos que motor de plantilla usar
app.set('view engine', 'handlebars')
app.use('/static', express.static(__dirname + '/public'))

app.use(morgan('dev'))

//session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser())

//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.get('/', verificarToken ,(req, res) => {
    res.render('index', { userData: req.userData  , admin: req.userData.admin});
})
app.use('/api/products',  productRoutes)
app.use('/api/carts', cartRoutes)
app.use('/api/session', sessionRoutes)
export default app