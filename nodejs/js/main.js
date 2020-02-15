var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
System.register("mqtt", [], function (exports_1, context_1) {
    "use strict";
    var mqttLib, mqtt;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            mqttLib = require('mqtt');
            (function (mqtt) {
                var Mqtt = (function () {
                    function Mqtt() {
                    }
                    Mqtt.setup = function (url) {
                        if (url === void 0) { url = this.client_url; }
                        return __awaiter(this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, new Promise(function (resolve, reject) {
                                            _this.client = mqttLib.connect(url);
                                            var timeout = setTimeout(reject, 1000);
                                            _this.client.on('connect', function () {
                                                return __awaiter(this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        clearTimeout(timeout);
                                                        this.client.on('message', function (topic, message) {
                                                            var msg_str = message.toString();
                                                            this.registeredListeners[topic].forEach(function (e) {
                                                                e(msg_str);
                                                            });
                                                        });
                                                        resolve();
                                                        return [2];
                                                    });
                                                });
                                            });
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    Mqtt.subscribe = function (channel) {
                        return __awaiter(this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4, new Promise(function (resolve, reject) {
                                            _this.client.subscribe(channel, function (err) {
                                                if (!err) {
                                                    _this.registeredListeners[channel] = [];
                                                    resolve();
                                                }
                                                else {
                                                    reject();
                                                }
                                            });
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        });
                    };
                    Mqtt.publish = function (channel, message) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.client.publish(channel, message);
                                return [2];
                            });
                        });
                    };
                    Mqtt.registerMessageListener = function (channel, cb) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                this.registeredListeners[channel].push(cb);
                                return [2];
                            });
                        });
                    };
                    Mqtt.client_url = "mqtt://127.0.0.1:1883";
                    Mqtt.client = null;
                    Mqtt.registeredListeners = {};
                    return Mqtt;
                }());
                mqtt.Mqtt = Mqtt;
            })(mqtt || (mqtt = {}));
            exports_1("mqtt", mqtt);
        }
    };
});
System.register("index", ["mqtt"], function (exports_2, context_2) {
    "use strict";
    var mqtt_1, Mqtt;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (mqtt_1_1) {
                mqtt_1 = mqtt_1_1;
            }
        ],
        execute: function () {
            Mqtt = mqtt_1.mqtt.Mqtt;
            (function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, Mqtt.setup('mqtt://192.168.1.29:1883')];
                        case 1:
                            _a.sent();
                            return [4, Mqtt.subscribe('hz/bluecherry/backstory')];
                        case 2:
                            _a.sent();
                            return [4, Mqtt.subscribe('hz/bluecherry/backstory-rec')];
                        case 3:
                            _a.sent();
                            return [4, Mqtt.registerMessageListener('hz/bluecherry/backstory', function (msg) { console.log(msg); })];
                        case 4:
                            _a.sent();
                            return [4, Mqtt.registerMessageListener('hz/bluecherry/backstory-rec', function (msg) { console.log(msg); })];
                        case 5:
                            _a.sent();
                            return [2];
                    }
                });
            }); })();
        }
    };
});
//# sourceMappingURL=main.js.map