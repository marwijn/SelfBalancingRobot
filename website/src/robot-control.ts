import {autoinject} from 'aurelia-framework';

@autoinject
export class NetworkSettings {
    speed = 0;
    rotation = 0;

    constructor() {
    }

    get message(): string {
        return `${this.speed}, ${this.rotation}`;
    }
}
