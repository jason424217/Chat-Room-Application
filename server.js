//dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


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
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room); //?????????

        //Welecom current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom'));

        //Broadcast when a user connects except the one connecting
        socket.broadcast.to(user.room)
            .emit('message', formatMessage(botName, user.username + ' has joined the chat'));

        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    //listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //Runs when clinet disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, user.username + ' has left the chat'));

            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });

});


server.listen(PORT, () => console.log('Server running on port %s', PORT));



//alt+shift+F for formatting the code