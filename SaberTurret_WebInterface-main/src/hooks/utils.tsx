export default function sendCommand(type: string, data: Record<string, any>) {
    fetch(`http://172.16.151.143:5001/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).catch(console.error);
}