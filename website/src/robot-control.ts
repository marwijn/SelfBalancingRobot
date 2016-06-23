import {autoinject} from 'aurelia-framework';
import {Communication} from 'communication';

@autoinject
export class RobotControl {
    speed = 0;
    rotation = 0;
    communication : Communication;

    constructor(communication: Communication)
    {
        this.communication = communication;
    }

    get message(): string {
        return `${this.speed}, ${this.rotation}`;
    }
}
