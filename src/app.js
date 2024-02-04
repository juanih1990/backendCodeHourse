import express from 'express'
import morgan from 'morgan'
import productRoutes from './router/products.Router.js'
import cartRoutes from './router/cart.Router.js'
import sessionRoutes from './router/session.Router.js'
import ticketRouter from './router/ticket.Router.js'
import handlebars from 'express-handlebars'
import __dirname from './util.js'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import initializePassport from './config/passport.config.js'
import { verificarToken } from './middleware/verificarToken.js'
import errorHandler from './middleware/error.js'
import { loggerMiddleware } from './logger/loggers.js'
import env from './config/config.js'



const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(loggerMiddleware)
// Ruta de prueba para los logs
app.get('/LoggerTest', (req, res) => {
    req.logger.debug('Debug log')
    req.logger.info('Info log')
    req.logger.warn('Warning log')
    req.logger.error('Error log')
   //  req.logger.fatal('Fatal log') en el tp dice de incluir fatal. pero no existe fatal en winston
  
    res.send('Errores generados en el entorno ' + env.ENTORNO)
})

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

app.get('/', verificarToken, (req, res) => {
    res.render('index', { userData: req.userData, admin: req.userData.admin });
})
app.use('/api/products', productRoutes)
app.use('/api/carts', cartRoutes)
app.use('/api/session', sessionRoutes)
app.use('/api/ticket', ticketRouter)
app.use(errorHandler)
export default app