var socket = io();

socket.on('connect', () => {
    console.log('Connected to the server');

    socket.on('incomingMessage', (message) => {
        console.log('Recieved a message', message)
    })
});

socket.emit('createMessage', {
    to: "938989333",
    text: "I am fine bro! How are you?"
})

socket.on('disconnect', () => {
    console.log('Disconnected from server!')
});