import {  ChatService } from '../service/index.js'
import mongoose from 'mongoose'

export const viewChat = async (req, res) => {
    try {
        const { user } = req.user
        console.log(user)
        res.render('chat' , {} )
    } catch (error) {
        console.error(error)
    }
}