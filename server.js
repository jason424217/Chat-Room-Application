//dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser} = require('./utils/users');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');


//global
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = 'ChatRoom Bot';


//set static folder
const PORT = 3000 || process.env.PORT;
app.use(express.static(path.join(__dirname, 'public')));


//run when client connect
io.on('connection', socket => {
    socket.on("joinRoom", ({ username, password }) => {
        const user = userJoin(socket.id, username, password);
        //Welecom current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom'));
    })

    //listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.emit('message', formatMessage(user.username, msg));
    });
});


server.listen(PORT, () => console.log('Server running on port %s', PORT));



//alt+shift+F for formatting the code