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


//Send location 
var locationBtn = jQuery('#send-location');

locationBtn.on('click', function (e) {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }

    navigator.geolocation.getCurrentPosition(function (Position) {
        // emits the location details
        socket.emit('sendLocation', {
            longitude: Position.coords.longitude,
            latitude: Position.coords.latitude
        });
    }, function () {
        alert('Unable to fetch the location')
    }, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        })
});

// listens to the generated location message form server and displays it on the client browser
socket.on('newLocMessage', (locData) => {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    li.text(`${locData.from}: `);
    a.attr('href', locData.url);
    li.append(a);
    jQuery('#messages').append(li);
})

