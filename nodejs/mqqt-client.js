const mqtt = require('mqtt');

const client_url = 'mqtt://broker.hivemq.com:1883';
var client = null;

var registeredListeners = {}

async function setup() {
    await new Promise((resolve, reject) => {
        client = mqtt.connect(client_url);
        timeout = setTimeout(reject, 1000);
        client.on('connect', async function() {
            clearTimeout(timeout);

            client.on('message', function (topic, message) {
                // message is Buffer
                msg_str = message.toString();
                registeredListeners[topic].forEach(e => {
                    e(msg_str);
                })
            })
            resolve();
        });
    });
}

async function subscribe(channel) {
    await new Promise((resolve, reject) => {
        client.subscribe(channel, err => {
            if (!err) {
                registeredListeners[channel] = []
                resolve();
            } else {
                reject();
            }
        })
    });
}

async function publish(channel, message) {
    client.publish(channel, message)
}

async function registerMessageListener(channel, cb) {
    registeredListeners[channel].push(cb);
}

module.exports = {
    setup: setup,
    subscribe: subscribe,
    publish: publish,
    registerMessageListener: registerMessageListener
}