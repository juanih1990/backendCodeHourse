import ChatModel from '../mongo/models/chat.model.js'

export default class Product {
    getChats = async () => {
        return ChatModel.find()
    }
    getChatsById = async id => {
        return ChatModel.findById(id)
    }
    createChats  = async chats => {
        return ChatModel.create(chats)
    }
    updateChats  = async (id,body) => {
        return ChatModel.findByIdAndUpdate(id,body , {
            new : true
        })
    }
    deleteChats  = async id => {
        return ChatModel.findByIdAndDelete(id)
    }
}