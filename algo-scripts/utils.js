
function byteArrayToBase64(array) {
    return btoa(byteArrayToString(array));
}


function byteArrayToString(array) {
    return String.fromCharCode.apply(null, array);
}

module.exports = byteArrayToBase64