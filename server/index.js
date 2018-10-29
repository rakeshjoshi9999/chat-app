const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
app.use(express.static(publicPath));
const io = socketIO(server);


io.on('connection', (socket) => {
    console.log('New User Connected!');

    socket.emit('incomingMessage', {
        from: "938939393",
        text: "Hey.. How are you?",
        createdAt: Date.now()
    })

    socket.on('createMessage', (message) => {
        console.log("Sending a message:", message)
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected!')
    });
});


server.listen(3000, () => {
    console.log('App running on port 3000')
});