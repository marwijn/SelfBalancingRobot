import {autoinject} from 'aurelia-framework';
import {Communication} from './communication';

@autoinject
export class NetworkSettings {
    ssid: string;
    password: string;
    communication: Communication;

    constructor(communication: Communication) {
        this.communication = communication;
    }

    submit() {
        this.communication.setWifiSetting(this.ssid, this.password);
    }
}
