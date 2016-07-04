import {autoinject, BindingEngine, Disposable} from 'aurelia-framework';
import {Communication} from 'communication';

@autoinject
export class RobotControl {
    speed = 0;
    rotation = 0;
    communication: Communication;
    bindingEngine: BindingEngine;
    disposables: Disposable[] = [];


    constructor(communication: Communication, bindingEngine: BindingEngine)
    {
        this.communication = communication;
        this.bindingEngine = bindingEngine;
    }

    attached() {
        this.disposables.push(this.bindingEngine.propertyObserver(this, 'speed').subscribe((n,o)=>this.speedChanged()));
        this.disposables.push(this.bindingEngine.propertyObserver(this, 'rotation').subscribe((n,o)=>this.speedChanged()));
    }

    detached() {
        for (let x of this.disposables) {
            x.dispose();
        }
        this.disposables = [];
    }

    speedChanged(): void {
        this.communication.setSpeed(this.speed, this.rotation);
    }

    get message(): string {
        return `${this.speed}, ${this.rotation}`;
    }
}
