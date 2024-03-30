export default class ChatRepository {
    constructor(dao) {
        this.dao = dao
    }
    getChats = async () => {
        return this.dao.getchats()
    }
    getChatsById = async id => {
        return this.dao.getchatsById(id)
    }
    addChats = async chats => {
        return  this.dao.createChats(chats)
    }
    updateChats = async (id,body) => {
       return  this.dao.updateChats(id,body) 
    }
    deleteChats = async id => {
        return  this.dao.deleteChats(id)
    }
   
}