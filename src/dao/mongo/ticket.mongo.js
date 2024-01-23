import ticketModel from '../mongo/models/ticket.model.js'

export default class Ticket {
    createTicket = async ticket =>{
        return ticketModel.create(ticket)
    }
    getTicket = async () => {
        return ticketModel.find()
    }
    getTicketOne = async ({search}) => {
        return ticketModel.findOne({search})
    }
}