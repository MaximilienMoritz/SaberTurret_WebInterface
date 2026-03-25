import dgram from "dgram";
import { WebSocketServer } from "ws";

const UDP_PORT = 5005;
const RASPBERRY_IP = "172.16.151.143";
const client = dgram.createSocket("udp4");

const wss = new WebSocketServer({ port: 8081 });
console.log("WebSocket server running on ws://localhost:8081");

wss.on("connection", (ws) => {
    console.log("Web client connected");

    ws.on("message", (msg) => {
        try {
            const command = JSON.parse(msg.toString());
            const payload = JSON.stringify(command); // send as-is
            client.send(payload, UDP_PORT, RASPBERRY_IP);
            console.log("Sent UDP:", payload);
        } catch (err) {
            console.error("Invalid message:", err);
        }
    });
});
