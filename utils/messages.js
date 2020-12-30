const moment = require('moment');

function formatMessage(username, text, time){
    return {
        username,
        text,
        time
    };
}

function getTime(){
    return moment().format('h:mm a');
}

module.exports = {formatMessage, getTime};