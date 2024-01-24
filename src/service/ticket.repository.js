export default class ticketRepository {
    constructor(dao) {
        this.dao = dao
    }
    createTicket = async ticket => {
        return this.dao.createTicket(ticket)
    }
    getTicket = async () => {
        return this.dao.getTicket()
    }
    getTicketOne = async ({ search }) => {
        return this.dao.getTicketOne({ search })
    }
    getTicketByIdPopulate = async (id, useLean) => {
        return this.dao.getTicketByIdPopulate(id, useLean)
    }
}