const moment = require('moment');

const generateMessage = (from, text) => {
    return {
        from: from,
        text: text,
        createdAt: moment().valueOf()
    }
}


var generateLocMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
        createAt: moment().valueOf()
    }

}

module.exports = {
    generateMessage,
    generateLocMessage
}
