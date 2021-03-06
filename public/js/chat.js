var socket = io();

//Autoscroll
function scrollToBottom() {
    // selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    var height = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;

    if (height >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}
// listening for the connect event
socket.on('connect', () => {
    console.log('Connected to the server');
    var params = $.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert('Name and Room Name sholud be provided');
            window.location.href = '/'
        } else {
            console.log('No Error!');
        }
    });
});
// listening for the disconnect event 
socket.on('disconnect', () => {
    console.log('Disconnected from server!')
});

socket.on('updateUserList', (users) => {
    var ul = jQuery('<ul></ul>');

    users.forEach(function (user) {
        ul.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ul);
})

// listening for the new message from server
socket.on('newMessage', (message) => {
    var time = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#message-template").html();

    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        createdAt: time
    });
    // console.log('Recieved a message', message);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from}:${message.text}:::${time}`);

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    // emit a event when a new message is submitted from the form
    socket.emit('createMessage', {
        from: '',
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
    locationBtn.attr('disabled', 'disabled').text('Sending location....')
    navigator.geolocation.getCurrentPosition(function (Position) {
        locationBtn.removeAttr('disabled', 'disabled').text('Send location')

        // emits the location details
        socket.emit('sendLocation', {
            longitude: Position.coords.longitude,
            latitude: Position.coords.latitude
        });
    }, function () {
        locationBtn.removeAttr('disabled', 'disabled').text('Send location')

        alert('Unable to fetch the location')
    }, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        })
});

// listens to the generated location message form server and displays it on the client browser
socket.on('newLocMessage', (locData) => {
    var time = moment(locData.createdAt).format('h:mm a');
    var template = jQuery("#loc-message-template").html();
    var html = Mustache.render(template, {
        from: locData.from,
        url: locData.url,
        createdAt: time
    });
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My Current Location</a>');
    // li.text(`${locData.from} ${time}: `);
    // a.attr('href', locData.url);
    // li.append(a);
    jQuery('#messages').append(html);
    scrollToBottom();
})

