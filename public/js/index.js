var socket = io();

socket.on('connect', () => {
    console.log('Connected to the server');
});


socket.on('disconnect', () => {
    console.log('Disconnected from server!')
});

socket.on('incomingMessage', (message) => {
    console.log('Recieved a message', message)
});
