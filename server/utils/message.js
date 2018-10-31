const generateMessage = (from, text) => {
    return {
        from: from,
        text: text,
        createdAt: new Date().getTime()
    }
}


var generateLocMessage = (from, latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps/?q=${latitude},${longitude}`,
        createAt: new Date().getTime()
    }

}

module.exports = {
    generateMessage,
    generateLocMessage
}
