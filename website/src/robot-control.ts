import {autoinject, BindingEngine, Disposable, bindable} from 'aurelia-framework';
import {Communication} from './communication';

@autoinject
export class RobotControl {

    @bindable speed = 0.0;
    @bindable rotation = 0.0;
    @bindable alpha = 0.0;
    @bindable message = "";
    communication: Communication;
    bindingEngine: BindingEngine;
    disposables: Disposable[] = [];


    constructor(communication: Communication, bindingEngine: BindingEngine)
    {
        this.communication = communication;
        this.bindingEngine = bindingEngine;
        this.message = "constructor";
    }

    attached() {
        window.addEventListener('deviceorientation', this.orientationChanged.bind(this) , false);
        this.disposables.push(this.bindingEngine.propertyObserver(this, 'speed').subscribe((n,o)=>this.speedChanged()));
        this.disposables.push(this.bindingEngine.propertyObserver(this, 'rotation').subscribe((n, o) => this.speedChanged()));
        this.message = "attached";
    }

    count = 0;

    orientationChanged(data: DeviceOrientationEvent) {
        let speed = 100 * (data.gamma + 45) / 45;
        this.speed = ((speed < 100) && (speed > -100)) ? speed : this.speed;
        this.rotation = data.beta;
    }

    detached() {
        for (let x of this.disposables) {
            x.dispose();
        }
        this.disposables = [];
        window.removeEventListener('deviceorientation', (data) => this.orientationChanged, true);
    }

    speedChanged(): void {
        this.communication.setSpeed(this.speed, this.rotation);
    }
}
