import {Router, RouterConfiguration} from 'aurelia-router'

export class App {
  router: Router;
  
  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['debug'], name: 'debug', moduleId: 'debug', nav: true, title: 'Debug' },
      { route: ['calibration'], name: 'calibration', moduleId: 'calibration', nav: true, title: 'Calibration' },
      { route: ['network-settings'], name: 'network-settings', moduleId: 'network-settings', nav: true, title: 'Network Settings' },
      { route: ['', 'robot-control'], name: 'robot-control', moduleId: 'robot-control', nav: true, title: 'Robot Control' },
    ]);

    this.router = router;
  }
}
