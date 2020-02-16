
const app: any = {};
interface Window {
    setupMqtt: (url: string) => Promise<Boolean>;
    subscribeMqtt: (channel: string) => Promise<Boolean>;
    publishMqtt: (channel: string, msg: string) => Promise<Boolean>;
    registerMessageListenerMqtt: (channel: string, cb: (msg: string) => void) => Promise<Boolean>;
}

/*
* Default pattern for setting up an app.
*/
//IIFC
(async () => {

    /**
     * Run after dom is ready
     */
    let init = function () {
        app.game = new Game();
    };

    window.addEventListener('load', init);

    await window.setupMqtt('ws://192.168.1.29:8000');
    await window.subscribeMqtt('hz/bluecherry/backstory');
    await window.subscribeMqtt('hz/bluecherry/backstory-rec');
    await window.registerMessageListenerMqtt('hz/bluecherry/backstory', (msg: string) => {
        const msgArr = msg.split(',');
        if (msg === 'OwO') {
            location.reload();
        } else {
            app.game.position_y = msgArr[0];
            app.game.position_x = msgArr[1];
            app.game.shooting = msgArr[2];
            console.log(app.game.shooting);
        }
    });

    setInterval(() => {
        const score = lpad(app.game._score._points, 4, '0');
        const health = lpad(app.game._player._health, 3, '0');

        const string = score + ',' + health;

        window.publishMqtt('hz/bluecherry/backstory-rec', string);

    }, 1000);
})();

function lpad(s: string, width: number, char: string) {
    return (s.length >= width) ? s : (new Array(width).join(char) + s).slice(-width);
}

