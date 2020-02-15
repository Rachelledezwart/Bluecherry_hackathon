const mqttLib = require('mqtt');

export module mqtt {
    interface listenerArray {
        [key: string]: Array<(msg: string) => void>
    }

    export class Mqtt {
        public static client_url: string = "mqtt://127.0.0.1:1883";
        public static client: any = null;
        public static registeredListeners: listenerArray = {}

        public static async setup(url: string = this.client_url) {
            await new Promise((resolve, reject) => {
                this.client = mqttLib.connect(url);
                var timeout = setTimeout(reject, 1000);
                this.client.on('connect', async function() {
                    clearTimeout(timeout);

                    this.client.on('message', function (topic: string, message: Buffer) {
                        // message is Buffer
                        var msg_str = message.toString();
                        this.registeredListeners[topic].forEach((e: (str: string) => void) => {
                            e(msg_str);
                        })
                    })
                    resolve();
                });
            });
        }

        public static async subscribe(channel: string) {
            await new Promise((resolve, reject) => {
                this.client.subscribe(channel, (err: Boolean) => {
                    if (!err) {
                        this.registeredListeners[channel] = [];
                        resolve();
                    } else {
                        reject();
                    }
                })
            });
        }

        public static async publish(channel: string, message: string) {
            this.client.publish(channel, message);
        }

        public static async registerMessageListener(channel: string, cb: (msg: string) => void) {
            this.registeredListeners[channel].push(cb);
        }
    }
}