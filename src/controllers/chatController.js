const User = require('../models/userModel')
const Chat = require('../models/chatModel')


const saveChat = async (req, res, next) => {
    try {
        const { sender_id, receiver_id, message } = req.body
        const user = await User.findById(sender_id);
        const image = user.image;
        const chat = await Chat.create({
            sender_id,
            receiver_id,
            message,
            image,
        })
        const chatMessage = await chat.save();
        res.status(200).send({success: true, msg : "Inserted", chatMessage})
    } catch (error) {
        return res.status(400).send({success: false, msg : error.message})
    }
}

module.exports = {
    saveChat,
}