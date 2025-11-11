import { useEffect, useState } from "react";

export const useJoystickLogout = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [controllerName, setControllerName] = useState<string | null>(null);

    useEffect(() => {
        const checkGamepad = () => {
            const gamepads = navigator.getGamepads();
            if (!gamepads) return;

            let connected = false;

            for (const gp of gamepads) {
                if (!gp) continue;
                connected = true;

                // Bouton 2 : déclenche le logout (bouton rouge sur joystick standard)
                if (gp.buttons[2].pressed) {
                    console.log("Bouton joystick → logout");
                    localStorage.removeItem("auth");
                    window.location.href = "/";
                }
            }

            setIsConnected(connected);

            if(!connected){
                setControllerName(null);
            }
        };

        const loop = () => {
            checkGamepad();
            requestAnimationFrame(loop);
        };
        loop();

        window.addEventListener("gamepadconnected", (e) => {
            console.log("🎮 Gamepad connecté:", e.gamepad.id);
            setIsConnected(true);
            setControllerName(e.gamepad.id);
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            console.log("❌ Gamepad déconnecté:", e.gamepad.id);
            setIsConnected(false);
            setControllerName(null)
        });
    }, []);

    return { isConnected, controllerName };
};
