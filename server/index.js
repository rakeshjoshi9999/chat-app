const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

var publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
app.use(express.static(publicPath));
const io = socketIO(server);

var users = new Users();



io.on('connection', (socket) => {
    console.log('New User Connected!');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and Room name are required")
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));

        // emit message on Connecting to server
        socket.emit('newMessage', generateMessage('___________________________________________________________________________________________________________________________________________________', 'Welcome to the chat app'));

        //broadcast a message to everyone in the room of new user joining
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('___________________________________________________________________________________________________________________________________________________', `${params.name} has joined.`));
    });

    // listen to a event from client for creating a message and generate a message from form values
    socket.on('createMessage', (message) => {
        var user = users.getUser(socket.id);
        message.from = user.name;
        io.to(user.room).emit('newMessage', generateMessage(message.from, message.text));
    });

    //listen to sendlocation which can be triggered by Send Location button and emits the coordinates
    socket.on('sendLocation', (coords) => {
        var user = users.getUser(socket.id);
        // emits the generated location message to the client
        io.to(user.room).emit('newLocMessage', generateLocMessage(user.name, coords.latitude, coords.longitude))

    });

    //listen to a event when user disconnects from server
    socket.on('disconnect', () => {
        user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('___________________________________________________________________________________________________________________________________________________', `${user.name} has left the chat`));
        }

    });
});

server.listen(port, () => {
    console.log(`App Running at Port: ${port}`);
});
