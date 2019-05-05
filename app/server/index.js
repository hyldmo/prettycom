"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialport_1 = __importDefault(require("serialport"));
var url = __importStar(require("url"));
var WebSocket = __importStar(require("ws"));
var mock = {
    path: '/dev/tty.usbmodem1421',
    comName: 'COM_DEMO',
    manufacturer: 'Arduino (www.arduino.cc)',
    serialNumber: '752303138333518011C1',
    locationId: '14200000',
    vendorId: '2341',
    productId: '0043'
};
var Server = /** @class */ (function () {
    function Server(options) {
        var _this = this;
        this.devices = [];
        this.connected = [];
        this.wss = new WebSocket.Server(options);
        this.on = this.wss.on;
        this.close = function (cb) {
            _this.connected.forEach(function (serial) { return serial.close(); });
            return _this.wss.close(cb);
        };
        console.log("Listening for websocket connections on port " + options.port);
        this.wss.on('connection', function (ws, req) {
            // const send = (message: object) => ws.send(JSON.stringify(message), err => err && console.error(err))
            var _a = url.parse(req.url || '', true).query, mode = _a.mode, baud = _a.baud, device = _a.device;
            var baudrate = Number.parseInt(baud, 10);
            if (mode === 'LIST') {
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var devices;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, serialport_1.default.list()];
                            case 1:
                                devices = _a.sent();
                                devices.forEach(function (a) {
                                    if (!_this.devices.find(function (b) { return a.comName === b.comName; })) {
                                        _this.devices.push(a);
                                        ws.send("ADD:" + JSON.stringify(a));
                                    }
                                });
                                return [2 /*return*/];
                        }
                    });
                }); }, 1000);
                setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        ws.send("ADD:" + JSON.stringify(mock));
                        return [2 /*return*/];
                    });
                }); }, 1000);
            }
            else if (mode === 'CONNECT') {
                if (typeof device !== 'string' || isNaN(baudrate))
                    return;
                if (device === mock.comName) {
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            ws.send("GT " + new Date().getTime() + "\n");
                            return [2 /*return*/];
                        });
                    }); }, 1000);
                    return;
                }
                var serial_1 = new serialport_1.default(device, { baudRate: baudrate });
                serial_1.on('error', function (data) {
                    console.error(data);
                    ws.send(data);
                });
                serial_1.on('data', function (data) {
                    ws.send(data.toString());
                });
                ws.onmessage = function (message) {
                    serial_1.write(message.data.toString());
                };
            }
        });
    }
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBEQUFpRDtBQUNqRCx1Q0FBMEI7QUFDMUIsNENBQStCO0FBRS9CLElBQU0sSUFBSSxHQUFnQztJQUN6QyxJQUFJLEVBQUUsdUJBQXVCO0lBQzdCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLFlBQVksRUFBRSwwQkFBMEI7SUFDeEMsWUFBWSxFQUFFLHNCQUFzQjtJQUNwQyxVQUFVLEVBQUUsVUFBVTtJQUN0QixRQUFRLEVBQUUsTUFBTTtJQUNoQixTQUFTLEVBQUUsTUFBTTtDQUNqQixDQUFBO0FBRUQ7SUFRQyxnQkFBYSxPQUFnQztRQUE3QyxpQkF5REM7UUE1RE8sWUFBTyxHQUFlLEVBQUUsQ0FBQTtRQUN4QixjQUFTLEdBQWlCLEVBQUUsQ0FBQTtRQUduQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUN4QyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBQyxFQUEwQjtZQUN2QyxLQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU0sSUFBSSxPQUFBLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBZCxDQUFjLENBQUMsQ0FBQTtZQUNoRCxPQUFPLEtBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQzFCLENBQUMsQ0FBQTtRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsaURBQStDLE9BQU8sQ0FBQyxJQUFNLENBQUMsQ0FBQTtRQUUxRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsVUFBQyxFQUFFLEVBQUUsR0FB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