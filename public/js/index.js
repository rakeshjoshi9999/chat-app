var socket = io();
// listening for the connect event
socket.on('connect', () => {
    console.log('Connected to the server');
});
// listening for the disconnect event 
socket.on('disconnect', () => {
    console.log('Disconnected from server!')
});

// listening for the new message from server
socket.on('newMessage', (message) => {
    // console.log('Recieved a message', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}:${message.text}`);

    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    // emit a event when a new message is submitted from the form
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    });
    jQuery('#message-form')[0].reset();
});

