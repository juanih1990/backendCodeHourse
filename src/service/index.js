import { producto, cart, session  , ticket} from "../dao/factory.js"

import ProductRepository from "./product.repository.js"
import CartRepository from "./cart.repository.js"
import SessionRepository from "./session.repository.js"
import ticketRepository  from "./ticket.repository.js"

export const ProductService = new ProductRepository( new producto())
export const SessionService = new SessionRepository( new session())
export const CartService = new CartRepository( new cart())
export const ticketService = new ticketRepository( new ticket())
