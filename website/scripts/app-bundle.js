define('app',["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Aurelia';
            config.map([
                { route: ['debug'], name: 'debug', moduleId: 'debug', nav: true, title: 'Debug' },
                { route: ['calibration'], name: 'calibration', moduleId: 'calibration', nav: true, title: 'Calibration' },
                { route: ['network-settings'], name: 'network-settings', moduleId: 'network-settings', nav: true, title: 'Network Settings' },
                { route: ['', 'robot-control'], name: 'robot-control', moduleId: 'robot-control', nav: true, title: 'Robot Control' },
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('blur-image',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var BlurImageCustomAttribute = (function () {
        function BlurImageCustomAttribute(element) {
            this.element = element;
            this.element = element;
        }
        BlurImageCustomAttribute.prototype.valueChanged = function (newImage) {
            var _this = this;
            if (newImage.complete) {
                drawBlur(this.element, newImage);
            }
            else {
                newImage.onload = function () { return drawBlur(_this.element, newImage); };
            }
        };
        BlurImageCustomAttribute = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [Element])
        ], BlurImageCustomAttribute);
        return BlurImageCustomAttribute;
    }());
    exports.BlurImageCustomAttribute = BlurImageCustomAttribute;
    var mul_table = [
        512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512,
        454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512,
        482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456,
        437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512,
        497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328,
        320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456,
        446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335,
        329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512,
        505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405,
        399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328,
        324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271,
        268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456,
        451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388,
        385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335,
        332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292,
        289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
    var shg_table = [
        9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17,
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19,
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
    var BLUR_RADIUS = 40;
    function stackBlurCanvasRGBA(canvas, top_x, top_y, width, height, radius) {
        if (isNaN(radius) || radius < 1)
            return;
        radius |= 0;
        var context = canvas.getContext("2d");
        var imageData;
        try {
            imageData = context.getImageData(top_x, top_y, width, height);
        }
        catch (e) {
            throw new Error("unable to access image data: " + e);
        }
        var pixels = imageData.data;
        var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
        var div = radius + radius + 1;
        var w4 = width << 2;
        var widthMinus1 = width - 1;
        var heightMinus1 = height - 1;
        var radiusPlus1 = radius + 1;
        var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
        var stackStart = new BlurStack();
        var stack = stackStart;
        for (i = 1; i < div; i++) {
            stack = stack.next = new BlurStack();
            if (i == radiusPlus1)
                var stackEnd = stack;
        }
        stack.next = stackStart;
        var stackIn = null;
        var stackOut = null;
        yw = yi = 0;
        var mul_sum = mul_table[radius];
        var shg_sum = shg_table[radius];
        for (y = 0; y < height; y++) {
            r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
            r_out_sum = radiusPlus1 * (pr = pixels[yi]);
            g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;
            stack = stackStart;
            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            for (i = 1; i < radiusPlus1; i++) {
                p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
                r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
                b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;
                a_sum += (stack.a = (pa = pixels[p + 3])) * rbs;
                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;
                stack = stack.next;
            }
            stackIn = stackStart;
            stackOut = stackEnd;
            for (x = 0; x < width; x++) {
                pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;
                if (pa != 0) {
                    pa = 255 / pa;
                    pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                    pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                }
                else {
                    pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
                }
                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;
                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;
                p = (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
                r_in_sum += (stackIn.r = pixels[p]);
                g_in_sum += (stackIn.g = pixels[p + 1]);
                b_in_sum += (stackIn.b = pixels[p + 2]);
                a_in_sum += (stackIn.a = pixels[p + 3]);
                r_sum += r_in_sum;
                g_sum += g_in_sum;
                b_sum += b_in_sum;
                a_sum += a_in_sum;
                stackIn = stackIn.next;
                r_out_sum += (pr = stackOut.r);
                g_out_sum += (pg = stackOut.g);
                b_out_sum += (pb = stackOut.b);
                a_out_sum += (pa = stackOut.a);
                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;
                stackOut = stackOut.next;
                yi += 4;
            }
            yw += width;
        }
        for (x = 0; x < width; x++) {
            g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
            yi = x << 2;
            r_out_sum = radiusPlus1 * (pr = pixels[yi]);
            g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
            b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
            a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
            r_sum += sumFactor * pr;
            g_sum += sumFactor * pg;
            b_sum += sumFactor * pb;
            a_sum += sumFactor * pa;
            stack = stackStart;
            for (i = 0; i < radiusPlus1; i++) {
                stack.r = pr;
                stack.g = pg;
                stack.b = pb;
                stack.a = pa;
                stack = stack.next;
            }
            yp = width;
            for (i = 1; i <= radius; i++) {
                yi = (yp + x) << 2;
                r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
                g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
                b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;
                a_sum += (stack.a = (pa = pixels[yi + 3])) * rbs;
                r_in_sum += pr;
                g_in_sum += pg;
                b_in_sum += pb;
                a_in_sum += pa;
                stack = stack.next;
                if (i < heightMinus1) {
                    yp += width;
                }
            }
            yi = x;
            stackIn = stackStart;
            stackOut = stackEnd;
            for (y = 0; y < height; y++) {
                p = yi << 2;
                pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;
                if (pa > 0) {
                    pa = 255 / pa;
                    pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
                    pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                    pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
                }
                else {
                    pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
                }
                r_sum -= r_out_sum;
                g_sum -= g_out_sum;
                b_sum -= b_out_sum;
                a_sum -= a_out_sum;
                r_out_sum -= stackIn.r;
                g_out_sum -= stackIn.g;
                b_out_sum -= stackIn.b;
                a_out_sum -= stackIn.a;
                p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width)) << 2;
                r_sum += (r_in_sum += (stackIn.r = pixels[p]));
                g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
                b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));
                a_sum += (a_in_sum += (stackIn.a = pixels[p + 3]));
                stackIn = stackIn.next;
                r_out_sum += (pr = stackOut.r);
                g_out_sum += (pg = stackOut.g);
                b_out_sum += (pb = stackOut.b);
                a_out_sum += (pa = stackOut.a);
                r_in_sum -= pr;
                g_in_sum -= pg;
                b_in_sum -= pb;
                a_in_sum -= pa;
                stackOut = stackOut.next;
                yi += width;
            }
        }
        context.putImageData(imageData, top_x, top_y);
    }
    function BlurStack() {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 0;
        this.next = null;
    }
    function drawBlur(canvas, image) {
        var w = canvas.width;
        var h = canvas.height;
        var canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(image, 0, 0, w, h);
        stackBlurCanvasRGBA(canvas, 0, 0, w, h, BLUR_RADIUS);
    }
    ;
});

define('communication',["require", "exports"], function (require, exports) {
    "use strict";
    var Communication = (function () {
        function Communication() {
            var _this = this;
            this.handlers = [];
            this.lastMessage = new Date();
            this.socket = new WebSocket("ws://" + window.location.hostname + "/ws");
            this.debugSocket = new WebSocket("ws://" + window.location.hostname + "/debug");
            this.debugSocket.onmessage = function (x) { _this.debugMsgReceived(x); };
        }
        Communication.prototype.setWifiSetting = function (ssid, password) {
            var command = {
                "command": "setWifiSettings",
                "ssid": ssid,
                "password": password
            };
            this.socket.send(JSON.stringify(command));
        };
        Communication.prototype.setSpeed = function (speed, steering) {
            var now = new Date();
            var elapsed = now.getTime() - this.lastMessage.getTime();
            if (elapsed < 200)
                return;
            this.lastMessage = now;
            var array = new Int8Array(2);
            array[0] = speed;
            array[1] = steering;
            this.socket.send(array.buffer);
        };
        Communication.prototype.subscribeDebug = function (handler) {
            this.handlers.push(handler);
        };
        Communication.prototype.unSubscribeDebug = function (handler) {
            this.handlers = this.handlers.filter(function (h) { return h !== handler; });
        };
        Communication.prototype.debugMsgReceived = function (data) {
            this.handlers.slice(0).forEach(function (h) { return h(data.data); });
        };
        return Communication;
    }());
    exports.Communication = Communication;
});

define('calibration',["require", "exports"], function (require, exports) {
    "use strict";
    var Calibration = (function () {
        function Calibration() {
        }
        return Calibration;
    }());
    exports.Calibration = Calibration;
});

define('child-router',["require", "exports"], function (require, exports) {
    "use strict";
    var ChildRouter = (function () {
        function ChildRouter() {
            this.heading = 'Child Router';
        }
        ChildRouter.prototype.configureRouter = function (config, router) {
            config.map([
                { route: ['', 'welcome'], name: 'welcome', moduleId: 'welcome', nav: true, title: 'Welcome' },
                { route: 'users', name: 'users', moduleId: 'users', nav: true, title: 'Github Users' },
                { route: 'child-router', name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' }
            ]);
            this.router = router;
        };
        return ChildRouter;
    }());
    exports.ChildRouter = ChildRouter;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('debug',["require", "exports", 'aurelia-framework', './communication'], function (require, exports, aurelia_framework_1, communication_1) {
    "use strict";
    var Debug = (function () {
        function Debug(communication) {
            this.lines = [];
            this.communication = communication;
        }
        Debug.prototype.messageReceived = function (msg) {
            this.lines.push(msg);
        };
        Debug.prototype.attached = function () {
            var _this = this;
            this.communication.subscribeDebug(function (x) { return _this.messageReceived(x); });
            this.messageReceived("attached");
        };
        Debug.prototype.detached = function () {
            var _this = this;
            this.communication.unSubscribeDebug(function (x) { return _this.messageReceived(x); });
        };
        Debug = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [communication_1.Communication])
        ], Debug);
        return Debug;
    }());
    exports.Debug = Debug;
});

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

define('main',["require", "exports", './environment'], function (require, exports, environment_1) {
    "use strict";
    Promise.config({
        warnings: {
            wForgottenReturn: false
        }
    });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('network-settings',["require", "exports", 'aurelia-framework', './communication'], function (require, exports, aurelia_framework_1, communication_1) {
    "use strict";
    var NetworkSettings = (function () {
        function NetworkSettings(communication) {
            this.communication = communication;
        }
        NetworkSettings.prototype.submit = function () {
            this.communication.setWifiSetting(this.ssid, this.password);
        };
        NetworkSettings = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [communication_1.Communication])
        ], NetworkSettings);
        return NetworkSettings;
    }());
    exports.NetworkSettings = NetworkSettings;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('robot-control',["require", "exports", 'aurelia-framework', './communication', "jquery", "rangeslider"], function (require, exports, aurelia_framework_1, communication_1) {
    "use strict";
    var RobotControl = (function () {
        function RobotControl(communication, bindingEngine) {
            this.speed = 0.0;
            this.rotation = 0.0;
            this.alpha = 0.0;
            this.message = "";
            this.disposables = [];
            this.count = 0;
            this.communication = communication;
            this.bindingEngine = bindingEngine;
            this.message = "constructor";
        }
        RobotControl.prototype.attached = function () {
            var _this = this;
            window.addEventListener('deviceorientation', this.orientationChanged.bind(this), false);
            this.disposables.push(this.bindingEngine.propertyObserver(this, 'speed').subscribe(function (n, o) { return _this.speedChanged(); }));
            this.disposables.push(this.bindingEngine.propertyObserver(this, 'rotation').subscribe(function (n, o) { return _this.speedChanged(); }));
            this.message = "attached";
        };
        RobotControl.prototype.orientationChanged = function (data) {
            var speed = 100 * (data.gamma + 45) / 45;
            this.speed = ((speed < 100) && (speed > -100)) ? speed : this.speed;
            this.rotation = data.beta;
        };
        RobotControl.prototype.detached = function () {
            var _this = this;
            for (var _i = 0, _a = this.disposables; _i < _a.length; _i++) {
                var x = _a[_i];
                x.dispose();
            }
            this.disposables = [];
            window.removeEventListener('deviceorientation', function (data) { return _this.orientationChanged; }, true);
        };
        RobotControl.prototype.speedChanged = function () {
            this.communication.setSpeed(this.speed, this.rotation);
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], RobotControl.prototype, "speed", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], RobotControl.prototype, "rotation", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], RobotControl.prototype, "alpha", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], RobotControl.prototype, "message", void 0);
        RobotControl = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [communication_1.Communication, aurelia_framework_1.BindingEngine])
        ], RobotControl);
        return RobotControl;
    }());
    exports.RobotControl = RobotControl;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('slider',["require", "exports", 'aurelia-framework', "jquery", "rangeslider"], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Slider = (function () {
        function Slider(element, bindingEngine) {
            this.disposables = [];
            this.element = element;
            this.bindingEngine = bindingEngine;
        }
        Slider.prototype.attached = function () {
            var _this = this;
            this.slider = $(this.element).find('input[type="range"]');
            this.slider.rangeslider({
                polyfill: false,
                onSlide: function (pos, val) { return _this.slide(val); }
            });
            this.horizontalSlider = $(this.element).find('.rangeslider--horizontal > .rangeslider__handle');
            $(window).on("resize", function () {
                console.debug("resize");
                _this.horizontalSlider.css("width", "" + _this.horizontalSlider.height() + "px");
            });
            this.horizontalSlider.css("width", "" + this.horizontalSlider.height() + "px");
            this.slider.rangeslider('update', true);
            this.disposables.push(this.bindingEngine.propertyObserver(this, 'value').subscribe(function (n, o) { return _this.onChanged(n); }));
        };
        Slider.prototype.onChanged = function (val) {
            if ((val != this.currentVal) || (this.currentVal == null)) {
                this.currentVal = val;
                this.slider.val(val).change();
            }
        };
        Slider.prototype.detach = function () {
            for (var _i = 0, _a = this.disposables; _i < _a.length; _i++) {
                var x = _a[_i];
                x.dispose();
            }
            this.disposables = [];
        };
        Slider.prototype.slide = function (val) {
            this.value = val;
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', String)
        ], Slider.prototype, "dataOrientation", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay }), 
            __metadata('design:type', Number)
        ], Slider.prototype, "value", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Slider.prototype, "min", void 0);
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Slider.prototype, "max", void 0);
        Slider = __decorate([
            aurelia_framework_1.autoinject, 
            __metadata('design:paramtypes', [Element, aurelia_framework_1.BindingEngine])
        ], Slider);
        return Slider;
    }());
    exports.Slider = Slider;
});

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    function configure(config) {
    }
    exports.configure = configure;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('resources/elements/slider',["require", "exports", 'aurelia-framework'], function (require, exports, aurelia_framework_1) {
    "use strict";
    var Slider = (function () {
        function Slider() {
        }
        Slider.prototype.valueChanged = function (newValue, oldValue) {
        };
        __decorate([
            aurelia_framework_1.bindable, 
            __metadata('design:type', Object)
        ], Slider.prototype, "value", void 0);
        return Slider;
    }());
    exports.Slider = Slider;
});

define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./styles.css\"></require>\n\n  <nav-bar router.bind=\"router\"></nav-bar>\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!rangeslider.css', ['module'], function(module) { module.exports = ".rangeslider,\n.rangeslider__fill {\n  display: block;\n  -moz-box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);\n  -webkit-box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);\n  box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);\n  -moz-border-radius: 100px;\n  -webkit-border-radius: 100px;\n  border-radius: 100px; }\n\n.rangeslider {\n  background: #e6e6e6;\n  position: relative; }\n\n.rangeslider--horizontal {\n  height: 33.3%;\n  width: 100%;\n  transform: translate(0, 100%); }\n\n.rangeslider--vertical {\n  width: 30%;\n  height: 100%;\n  margin-left: 35%; }\n\n.rangeslider--disabled {\n  filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=40);\n  opacity: 0.4; }\n\n.rangeslider__fill {\n  background: #00ff00;\n  position: absolute; }\n\n.rangeslider--horizontal .rangeslider__fill {\n  top: 0;\n  height: 100%; }\n\n.rangeslider--vertical .rangeslider__fill {\n  bottom: 0;\n  width: 100%; }\n\n.rangeslider__handle {\n  background: white;\n  border: 1px solid #ccc;\n  cursor: pointer;\n  display: inline-block;\n  position: absolute;\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIwLjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC4xIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIgLz48L3N2Zz4g\");\n  background-size: 100%;\n  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, rgba(255, 255, 255, 0)), color-stop(100%, rgba(0, 0, 0, 0.1)));\n  background-image: -moz-linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1));\n  background-image: -webkit-linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1));\n  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1));\n  -moz-box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);\n  -webkit-box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);\n  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);\n  -moz-border-radius: 50%;\n  -webkit-border-radius: 50%;\n  border-radius: 50%; }\n\n.rangeslider__handle:after {\n  content: \"\";\n  display: block;\n  width: 50%;\n  height: 50%;\n  margin: auto;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjEzIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAuMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\");\n  background-size: 100%;\n  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, rgba(0, 0, 0, 0.13)), color-stop(100%, rgba(255, 255, 255, 0)));\n  background-image: -moz-linear-gradient(rgba(0, 0, 0, 0.13), rgba(255, 255, 255, 0));\n  background-image: -webkit-linear-gradient(rgba(0, 0, 0, 0.13), rgba(255, 255, 255, 0));\n  background-image: linear-gradient(rgba(0, 0, 0, 0.13), rgba(255, 255, 255, 0));\n  -moz-border-radius: 50%;\n  -webkit-border-radius: 50%;\n  border-radius: 50%; }\n\n.rangeslider__handle:active, .rangeslider--active .rangeslider__handle {\n  background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiBncmFkaWVudFVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgeDE9IjAuNSIgeTE9IjAuMCIgeDI9IjAuNSIgeTI9IjEuMCI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC4xMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JhZCkiIC8+PC9zdmc+IA==\");\n  background-size: 100%;\n  background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, rgba(0, 0, 0, 0.1)), color-stop(100%, rgba(0, 0, 0, 0.12)));\n  background-image: -moz-linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.12));\n  background-image: -webkit-linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.12));\n  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.12)); }\n\n.rangeslider--horizontal .rangeslider__handle {\n  top: -25%;\n  height: 150%;\n  touch-action: pan-y;\n  -ms-touch-action: pan-y; }\n\n.rangeslider--vertical .rangeslider__handle {\n  left: -25%;\n  width: 150%;\n  padding-bottom: 150%;\n  touch-action: pan-x;\n  -ms-touch-action: pan-x; }\n\ninput[type=\"range\"]:focus + .rangeslider .rangeslider__handle {\n  -moz-box-shadow: 0 0 8px rgba(255, 0, 255, 0.9);\n  -webkit-box-shadow: 0 0 8px rgba(255, 0, 255, 0.9);\n  box-shadow: 0 0 8px rgba(255, 0, 255, 0.9); }\n"; });
define('text!calibration.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./slider\"></require>\n  <slider class=\"col-xs-3\" data-orientation=\"vertical\"></slider>\n  <slider class=\"col-xs-3\" data-orientation=\"vertical\"></slider>\n  <slider class=\"col-xs-3\" data-orientation=\"vertical\"></slider>\n  <slider class=\"col-xs-3\" data-orientation=\"vertical\"></slider>\n</template>\n"; });
define('text!child-router.html', ['module'], function(module) { module.exports = "<template>\r\n  <section class=\"au-animate\">\r\n    <h2>${heading}</h2>\r\n    <div>\r\n      <div class=\"col-md-2\">\r\n        <ul class=\"well nav nav-pills nav-stacked\">\r\n          <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\r\n            <a href.bind=\"row.href\">${row.title}</a>\r\n          </li>\r\n        </ul>\r\n      </div>\r\n      <div class=\"col-md-10\" style=\"padding: 0\">\r\n        <router-view></router-view>\r\n      </div>\r\n    </div>\r\n  </section>\r\n</template>\r\n"; });
define('text!debug.html', ['module'], function(module) { module.exports = "<template>\r\n    <section class=\"au-animate\">\r\n        <ul>\r\n            <li repeat.for=\"line of lines\">${line}</li>\r\n        </ul>\r\n    </section>\r\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body {\n  margin: 0; }\n\n.splash {\n  text-align: center;\n  margin: 10% 0 0 0;\n  box-sizing: border-box; }\n\n.splash .message {\n  font-size: 72px;\n  line-height: 72px;\n  text-shadow: rgba(0, 0, 0, 0.5) 0 0 15px;\n  text-transform: uppercase;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif; }\n\n.splash .fa-spinner {\n  text-align: center;\n  display: inline-block;\n  font-size: 72px;\n  margin-top: 50px; }\n\n.page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n@media print {\n  .page-host {\n    position: absolute;\n    left: 10px;\n    right: 0;\n    top: 50px;\n    bottom: 0;\n    overflow-y: inherit;\n    overflow-x: inherit; } }\n\nsection {\n  margin: 0 20px; }\n\n.navbar-nav li.loader {\n  margin: 12px 24px 0 6px; }\n\n.pictureDetail {\n  max-width: 425px; }\n\n/* animate page transitions */\nsection.au-enter-active {\n  -webkit-animation: fadeInRight 1s;\n  animation: fadeInRight 1s; }\n\ndiv.au-stagger {\n  /* 50ms will be applied between each successive enter operation */\n  -webkit-animation-delay: 50ms;\n  animation-delay: 50ms; }\n\n.card-container.au-enter {\n  opacity: 0; }\n\n.card-container.au-enter-active {\n  -webkit-animation: fadeIn 2s;\n  animation: fadeIn 2s; }\n\n.card {\n  overflow: hidden;\n  position: relative;\n  border: 1px solid #CCC;\n  border-radius: 8px;\n  text-align: center;\n  padding: 0;\n  background-color: #337ab7;\n  color: #88acd9;\n  margin-bottom: 32px;\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); }\n\n.card .content {\n  margin-top: 10px; }\n\n.card .content .name {\n  color: white;\n  text-shadow: 0 0 6px rgba(0, 0, 0, 0.5);\n  font-size: 18px; }\n\n.card .header-bg {\n  /* This stretches the canvas across the entire hero unit */\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 70px;\n  border-bottom: 1px #FFF solid;\n  border-radius: 6px 6px 0 0; }\n\n.card .avatar {\n  position: relative;\n  margin-top: 15px;\n  z-index: 100; }\n\n.card .avatar img {\n  width: 100px;\n  height: 100px;\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  border-radius: 50%;\n  border: 2px #FFF solid; }\n\n/* animation definitions */\n@-webkit-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none; } }\n\n@keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0); }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none; } }\n\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\ninput[type=range].speed-control {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 2.1px 0; }\n\ninput[type=range].speed-control:focus {\n  outline: none; }\n\ninput[type=range].speed-control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #007000;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].speed-control::-webkit-slider-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -2.3px; }\n\ninput[type=range].speed-control:focus::-webkit-slider-runnable-track {\n  background: #008a00; }\n\ninput[type=range].speed-control::-moz-range-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #007000;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].speed-control::-moz-range-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer; }\n\ninput[type=range].speed-control::-ms-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range].speed-control::-ms-fill-lower {\n  background: #005700;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].speed-control::-ms-fill-upper {\n  background: #007000;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].speed-control::-ms-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  height: 31.8px; }\n\ninput[type=range].speed-control:focus::-ms-fill-lower {\n  background: #007000; }\n\ninput[type=range].speed-control:focus::-ms-fill-upper {\n  background: #008a00; }\n\ninput[type=range].speed-control {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 2.1px 0; }\n\ninput[type=range].speed-control:focus {\n  outline: none; }\n\ninput[type=range].speed-control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #007000;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].speed-control::-webkit-slider-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -2.3px; }\n\ninput[type=range].speed-control:focus::-webkit-slider-runnable-track {\n  background: #008a00; }\n\ninput[type=range].speed-control::-moz-range-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #007000;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].speed-control::-moz-range-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer; }\n\ninput[type=range].speed-control::-ms-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range].speed-control::-ms-fill-lower {\n  background: #005700;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].speed-control::-ms-fill-upper {\n  background: #007000;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].speed-control::-ms-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  height: 31.8px; }\n\ninput[type=range].speed-control:focus::-ms-fill-lower {\n  background: #007000; }\n\ninput[type=range].speed-control:focus::-ms-fill-upper {\n  background: #008a00; }\n\ninput[type=range].speed-control {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 2.1px 0; }\n\ninput[type=range].speed-control:focus {\n  outline: none; }\n\ninput[type=range].speed-control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #007000;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].speed-control::-webkit-slider-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -2.3px; }\n\ninput[type=range].speed-control:focus::-webkit-slider-runnable-track {\n  background: #008a00; }\n\ninput[type=range].speed-control::-moz-range-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #007000;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].speed-control::-moz-range-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer; }\n\ninput[type=range].speed-control::-ms-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range].speed-control::-ms-fill-lower {\n  background: #005700;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].speed-control::-ms-fill-upper {\n  background: #007000;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].speed-control::-ms-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  height: 31.8px; }\n\ninput[type=range].speed-control:focus::-ms-fill-lower {\n  background: #007000; }\n\ninput[type=range].speed-control:focus::-ms-fill-upper {\n  background: #008a00; }\n\ninput[type=range].steering-control {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 2.1px 0;\n  transform: rotate(270deg); }\n\ninput[type=range].steering-control:focus {\n  outline: none; }\n\ninput[type=range].steering-control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #ffff80;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].steering-control::-webkit-slider-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -2.3px; }\n\ninput[type=range].steering-control:focus::-webkit-slider-runnable-track {\n  background: #ffff9a; }\n\ninput[type=range].steering-control::-moz-range-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #ffff80;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].steering-control::-moz-range-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer; }\n\ninput[type=range].steering-control::-ms-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range].steering-control::-ms-fill-lower {\n  background: #ffff66;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].steering-control::-ms-fill-upper {\n  background: #ffff80;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].steering-control::-ms-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  height: 31.8px; }\n\ninput[type=range].steering-control:focus::-ms-fill-lower {\n  background: #ffff80; }\n\ninput[type=range].steering-control:focus::-ms-fill-upper {\n  background: #ffff9a; }\n\ninput[type=range].steering-control {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 2.1px 0; }\n\ninput[type=range].steering-control:focus {\n  outline: none; }\n\ninput[type=range].steering-control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #ffff80;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].steering-control::-webkit-slider-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -2.3px; }\n\ninput[type=range].steering-control:focus::-webkit-slider-runnable-track {\n  background: #ffff9a; }\n\ninput[type=range].steering-control::-moz-range-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #ffff80;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].steering-control::-moz-range-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer; }\n\ninput[type=range].steering-control::-ms-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range].steering-control::-ms-fill-lower {\n  background: #ffff66;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].steering-control::-ms-fill-upper {\n  background: #ffff80;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].steering-control::-ms-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  height: 31.8px; }\n\ninput[type=range].steering-control:focus::-ms-fill-lower {\n  background: #ffff80; }\n\ninput[type=range].steering-control:focus::-ms-fill-upper {\n  background: #ffff9a; }\n\ninput[type=range].steering-control {\n  -webkit-appearance: none;\n  width: 100%;\n  margin: 2.1px 0; }\n\ninput[type=range].steering-control:focus {\n  outline: none; }\n\ninput[type=range].steering-control::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #ffff80;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].steering-control::-webkit-slider-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  -webkit-appearance: none;\n  margin-top: -2.3px; }\n\ninput[type=range].steering-control:focus::-webkit-slider-runnable-track {\n  background: #ffff9a; }\n\ninput[type=range].steering-control::-moz-range-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  background: #ffff80;\n  border-radius: 6px;\n  border: 0.2px solid #010101; }\n\ninput[type=range].steering-control::-moz-range-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  height: 36px;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer; }\n\ninput[type=range].steering-control::-ms-track {\n  width: 100%;\n  height: 31.8px;\n  cursor: pointer;\n  background: transparent;\n  border-color: transparent;\n  color: transparent; }\n\ninput[type=range].steering-control::-ms-fill-lower {\n  background: #ffff66;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].steering-control::-ms-fill-upper {\n  background: #ffff80;\n  border: 0.2px solid #010101;\n  border-radius: 12px;\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d; }\n\ninput[type=range].steering-control::-ms-thumb {\n  box-shadow: 1px 1px 1px #000000, 0 0 1px #0d0d0d;\n  border: 1px solid #000000;\n  width: 16px;\n  border-radius: 3px;\n  background: #ffffff;\n  cursor: pointer;\n  height: 31.8px; }\n\ninput[type=range].steering-control:focus::-ms-fill-lower {\n  background: #ffff80; }\n\ninput[type=range].steering-control:focus::-ms-fill-upper {\n  background: #ffff9a; }\n\nrouter-view {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto; }\n\nslider.col-xs-3 {\n  height: 100%;\n  padding-left: 0;\n  padding-right: 0; }\n\n.div4 {\n  height: 25%;\n  overflow-x: hidden;\n  overflow-y: hidden; }\n\n.div2 {\n  height: 50%;\n  overflow-x: hidden;\n  overflow-y: hidden; }\n\n.div1 {\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: hidden; }\n\n.au-animate {\n  height: 100%; }\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">\n        <span class=\"sr-only\">Toggle Navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-home\"></i>\n        <span>${router.title}</span>\n      </a>\n    </div>\n\n    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">\n      <ul class=\"nav navbar-nav\">\n        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1.in\" href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"loader\" if.bind=\"router.isNavigating\">\n          <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</template>\n"; });
define('text!network-settings.html', ['module'], function(module) { module.exports = "<template>\r\n    <section class=\"au-animate\">\r\n        <form role=\"form\" submit.delegate=\"submit()\">\r\n        <div class=\"form-group\">\r\n            <label for=\"ssid\">SSID</label>\r\n            <input type=\"text\" value.bind=\"ssid\" class=\"form-control\" id=\"ssid\" placeholder=\"ssid\">\r\n        </div>\r\n        <div class=\"form-group\">\r\n            <label for=\"password\">Password</label>\r\n            <input type=\"password\" value.bind=\"password\" class=\"form-control\" id=\"password\">\r\n        </div>\r\n       \r\n        <button type=\"submit\" class=\"btn btn-default\">Submit</button>\r\n        </form>\r\n    </section>\r\n</template>"; });
define('text!robot-control.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./slider\"></require>\n  <require from=\"./rangeslider.css\"></require>\n  <section class=\"au-animate\">\n    <!--\n        <!--<input type=\"range\" max=\"100\" min=\"-100\" value.bind=\"speed & throttle:100\" class=\"speed-control\"/>\n        <input type=\"range\" max=\"100\" min=\"-100\" value.bind=\"rotation & throttle:100\" class=\"steering-control\"/>\n\n        <input type=\"range\" value.bind=\"speed\"></input>\n        <input type=\"range\" value.bind=\"rotation\"></input>\n        <slider></slider>\n    <input type=\"range\" data-orientation=\"vertical\">\n    <\n    <div>next</div>-->\n    <slider class=\"col-xs-4 div1\" data-orientation=\"vertical\" value.bind=\"speed\" min=\"-100\" max=\"100\"></slider>\n    <div class=\"div4\">\n        <input type=\"checkbox\">\n    </div>\n    <div class=\"col-xs-8 div2\">\n      <slider data-orientation=\"horizontal\" value.bind=\"rotation\" min=\"-100\" max=\"100\"></slider>\n    </div>\n  </section>\n</template>\n"; });
define('text!slider.html', ['module'], function(module) { module.exports = "<template bindable=\"min, max, dataOrientation\">\n  <require from=\"./rangeslider.css\"></require>\n  <input\n    width = 100%,\n    height = 100%,\n    type=\"range\",\n    data-orientation=\"${dataOrientation}\"\n    max=\"${max}\",\n    min=\"${min}\"\n  >\n</template>\n"; });
define('text!resources/elements/slider.html', ['module'], function(module) { module.exports = "<template>\n  <h1>${value}</h1>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map