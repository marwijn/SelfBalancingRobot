export class Communication {
    socket: WebSocket;
    debugSocket: WebSocket;
    lastMessage : Date;

    handlers: { (msg: string): void; }[] = [];

    constructor() {
        this.lastMessage = new Date();
        this.socket = new WebSocket(`ws://${window.location.hostname}/ws`);
        this.debugSocket = new WebSocket(`ws://${window.location.hostname}/debug`);
        this.debugSocket.onmessage = (x) => { this.debugMsgReceived(x) };
    }

    setWifiSetting(ssid: string, password: string): void {
        let command =
            {
                "command": "setWifiSettings",
                "ssid": ssid,
                "password": password
            }
        this.socket.send(JSON.stringify(command));
    }

    setSpeed(speed: number, steering: number): void {
        let now = new Date();
        let elapsed = now - this.lastMessage;
        if (elapsed < 200) return;
        this.lastMessage = now;

        let array = new Int8Array(2);
        array[0] = speed;
        array[1] = steering;
        this.socket.send(array.buffer);
    }



    public subscribeDebug(handler: { (msg: string): void }) {
        this.handlers.push(handler);
    }

    public unSubscribeDebug(handler: { (msg: string): void }) {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    private debugMsgReceived(data: MessageEvent): void {
        this.handlers.slice(0).forEach(h => h(data.data));
    }
}