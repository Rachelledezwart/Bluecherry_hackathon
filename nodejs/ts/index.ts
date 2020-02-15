import {mqtt} from './mqtt'

const Mqtt = mqtt.Mqtt;

(async () => {
    await Mqtt.setup('mqtt://192.168.1.29:1883');
    await Mqtt.subscribe('hz/bluecherry/backstory');
    await Mqtt.subscribe('hz/bluecherry/backstory-rec');
    await Mqtt.registerMessageListener('hz/bluecherry/backstory', (msg: string) => {console.log(msg);})
    await Mqtt.registerMessageListener('hz/bluecherry/backstory-rec', (msg: string) => {console.log(msg);})
})();