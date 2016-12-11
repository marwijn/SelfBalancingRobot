import {autoinject} from 'aurelia-framework';
import {Communication} from './communication';

@autoinject
export class Debug {
    communication: Communication;
    public lines: string[] = [];

    constructor(communication: Communication) {
        this.communication = communication;
    }

    private messageReceived(msg: string) {
        this.lines.push(msg);
    }

    public attached() {
        this.communication.subscribeDebug((x) => this.messageReceived(x));
        this.messageReceived("attached");
    }

    public detached() {
        this.communication.unSubscribeDebug((x) => this.messageReceived(x));
    }
}
