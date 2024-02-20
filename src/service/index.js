import { producto, cart, session  , ticket} from "../dao/factory.js"
import Mail from "../modules/mail.modules.js"
import ProductRepository from "./product.repository.js"
import CartRepository from "./cart.repository.js"
import SessionRepository from "./session.repository.js"
import ticketRepository  from "./ticket.repository.js"

const mailModule = new  Mail()
const ticketDao = new ticket()

export const ProductService = new ProductRepository( new producto())
export const SessionService = new SessionRepository( new session() , ticketDao, mailModule )
export const CartService = new CartRepository( new cart())
export const ticketService = new ticketRepository( ticketDao)
