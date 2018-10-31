const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage } = require('./utils/message')

var publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
app.use(express.static(publicPath));
const io = socketIO(server);


io.on('connection', (socket) => {
    console.log('New User Connected!');
    // emit message on Connecting to server
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //broadcast a message to everyone on the network of new user joining
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    // listen to a event from client for creating a message and generate a message from form values
    socket.on('createMessage', (message) => {
        console.log('new messgae at server', message)
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    //listen to a event when user disconnects from server
    socket.on('disconnect', () => {
        console.log('User Disconnected!')
    });
});


server.listen(port, () => {
    console.log(`App Running at Port: ${port}`);
});
