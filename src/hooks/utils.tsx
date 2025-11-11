const ws = new WebSocket("ws://localhost:8081");

export default function sendCommand(type: string, data: Record<string, any>) {
    ws.send(JSON.stringify({ type, data }));
}
