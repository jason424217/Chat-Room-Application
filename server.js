//dependencies
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {formatMessage, getTime} = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');



//global
const app = express();
const server = http.createServer(app);
const io = socketio(server);
var MongoClient = require('mongodb').MongoClient;
const { timeStamp } = require('console');
const botName = 'ChatRoom Bot';
const wrongPswd = 'wrong password!';
var url = 'mongodb://localhost:27017/node_chat';

//use MongoClient to connect to our cluster. client.connect() will return a promise
//start execute the function when connect is finished in async way
MongoClient.connect(url, function(err, db) {
    var messagesCollection = db.collection('messages');
    //run when client connect
    io.on('connection', socket => {
        socket.on("joinRoom", ({ username, password }) => {
            const user = userJoin(socket.id, username, password);
            if(user === -1){
                socket.emit('wrong_identity', wrongPswd);
            }

            //Welecom current user
            socket.emit('message', formatMessage(botName, 'Welcome to ChatRoom. The Chat history is below this line.', getTime()));

            //.then() 可以将参数中的函数添加到当前 Promise 的正常执行序列
            //resolve() 中可以放置一个参数用于向下一个 then 传递一个值，then 中的函数也可以返回一个值传递给 then
            messagesCollection.find().toArray().then(function (docs){
                socket.emit("chatHistory", docs);
            })
        })


        //listen for chatMessage
        socket.on('chatMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            var timeStamp = getTime();
            messagesCollection.insertOne({username: user.username, 
                text:msg, socketID:socket.id, time: timeStamp}, function(err, res){
                    if(err !== null){
                        console.log("error is" + err);
                    }
                })
            io.emit('message', formatMessage(user.username, msg, timeStamp));
        });
    });
});


//set static folder
const PORT = 3000 || process.env.PORT;
app.use(express.static(path.join(__dirname, 'public')));



server.listen(PORT, () => console.log('Server running on port %s', PORT));



//alt+shift+F for formatting the code