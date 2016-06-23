export class Communication {
    socket: any;

    constructor() {
        this.socket = new WebSocket(`ws://${window.location.hostname}/ws`);
    }

    setWifiSetting(ssid: string, password: string) : void
    {
        var command =
        {
            "command": "setWifiSettings",
            "ssid": ssid,
            "password": password
        }
        this.socket.send(JSON.stringify(command));
    }

    setSpeed(speed: number, steering: number) : void
    {
        var array = new Int8Array(2);
        array[0] = speed;
        array[1] = steering;
        this.socket.send(array.buffer);
    }
}