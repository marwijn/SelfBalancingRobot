define(["require", "exports"], function (require, exports) {
    "use strict";
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Aurelia';
            config.map([
                { route: ['debug'], name: 'debug', moduleId: 'debug', nav: true, title: 'Debug' },
                { route: ['network-settings'], name: 'network-settings', moduleId: 'network-settings', nav: true, title: 'Network Settings' },
                { route: ['', 'robot-control'], name: 'robot-control', moduleId: 'robot-control', nav: true, title: 'Robot Control' },
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
});
//# sourceMappingURL=app.js.map
//# sourceMappingURL=app.js.map
