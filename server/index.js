const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocMessage } = require('./utils/message')

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

    //listen to sendlocation which can be triggered by Send Location button and emits the coordinates
    socket.on('sendLocation', (coords) => {
        // emits the generated location message to the client
        io.emit('newLocMessage', generateLocMessage('Admin', coords.latitude, coords.longitude))

    });

    //listen to a event when user disconnects from server
    socket.on('disconnect', () => {
        socket.broadcast.emit('newMessage', generateMessage('Admin', 'User has left the chat'));
    });
});

server.listen(port, () => {
    console.log(`App Running at Port: ${port}`);
});
