// import thư viện
const express = require("express");
const ChatRouter = express.Router()

const chatController = require('../controllers/chatController')

// [POST] /save-chat
ChatRouter.post("/save-chat", chatController.saveChat)

module.exports = ChatRouter