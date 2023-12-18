// import thư viên & files
require('dotenv').config()
const express = require("express");
const configServer = require('./config/configServer');
const db = require('./db/index')
const User = require('./models/userModel')
const Chat = require('./models/chatModel')

// import file routes
const AccountRouter = require('./routing/AccountRouter');
const ChatRouter = require('./routing/ChatRouter');
const error = require('./middlewares/handleError')

// connect database
db.connect()

// PORT
const app = express();
const port = process.env.PORT || 3000;


// config server
configServer(app, __dirname);

// router
app.use('/api/auth', AccountRouter)
app.use('/api/auth', ChatRouter)


// middleware error
app.use(error.notFound)
app.use(error.handleError)

// io socket
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

// connection io
var usp = io.of('/user-namespace')
usp.on('connection', async function(socket){
    const userId = socket.handshake.auth.token;
    
    //set onl-off
    await User.findByIdAndUpdate(
        {_id: userId,},
        {$set: {is_online: '1'}},
        {new: true}
    )
    // gửi cho all people
    socket.broadcast.emit('setOnline', {userId: userId})
   
    socket.on('disconnect', async function(){
        const userId = socket.handshake.auth.token;

        await User.findByIdAndUpdate(
            {_id: userId,},
            {$set: {is_online: '0', last_logout: new Date()}},
            {new: true}
        );
        socket.broadcast.emit('setOffline', {userId: userId})
    })

    // chatting
    socket.on('show-chat', (data) => {
        socket.broadcast.emit('loadNewChat', data)
    })

    // load chat
    socket.on('existsChat', async (data) => {
        const user = await User.findById(data.sender_id);
        const image = user.image;
        var chat = await Chat.find({$or: [
            {sender_id: data.sender_id, receiver_id: data.receiver_id},
            {sender_id: data.receiver_id, receiver_id: data.sender_id},
        ]})
        socket.emit('loadChat', { chat, image })
    })
})


// listen server
httpServer.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
