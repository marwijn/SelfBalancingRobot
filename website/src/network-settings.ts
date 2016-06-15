import {autoinject} from 'aurelia-framework';

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
