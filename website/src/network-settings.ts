import {autoinject} from 'aurelia-framework';
import {}

@autoinject
export class NetworkSettings {
    ssid: string;
    password: string;

    constructor() {      
    }

    submit() {
        alert(`Welcome, ${this.ssid}, ${this.password}!`);
    }
}
