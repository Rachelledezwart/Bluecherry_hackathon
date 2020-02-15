const mqttClient = require('./mqqt-client');

(async () => {
    await mqttClient.setup();
    await mqttClient.subscribe('presence');
    await mqttClient.registerMessageListener('presence', msg => {console.log(msg);})
    setTimeout(
        () => {mqttClient.publish('presence', 'asdf')}, 1000
    )
})();