const tmi = require('tmi.js');
require('./config.cfg')();

module.exports = function() {   
    this.client = new tmi.Client({
        options: { debug: true, messagesLogLevel: "info" },
        connection: {
            reconnect: true,
            secure: true
        },
        identity: {
            username: botUsername,
            password: botOAuth
        },
        channels: [ channel ]
    });      
}