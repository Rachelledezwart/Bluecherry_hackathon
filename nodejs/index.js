const mqttClient = require('./mqqt-client');

(async () => {
    await mqttClient.setup('mqtt://192.168.1.29:1883');
    await mqttClient.subscribe('hz/bluecherry/backstory');
    await mqttClient.subscribe('hz/bluecherry/backstory-rec');
    await mqttClient.registerMessageListener('hz/bluecherry/backstory', msg => {console.log(msg);})
    
    await mqttClient.registerMessageListener('hz/bluecherry/backstory-rec', msg => {console.log(msg);})
})();