import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

/**
 * Gère les mouvements de la tourelle via le joystick principal (axes).
 * Utilise WebSocket via la fonction SendCommand("move", {x, y}).
 */
export const useJoystickMovement = () => {
    const AXIS_THRESHOLD = 0.15; // seuil pour éviter les micro-mouvements
    const SEND_INTERVAL = 50;    // envoi toutes les 50 ms (~20 FPS)
    const lastSent = useRef({ x: 0, y: 0 });
    const lastTime = useRef(0);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8081");

        ws.onopen = () => console.log("[WS] connecté pour le contrôle de mouvement");
        ws.onerror = (err) => console.warn("[WS] erreur :", err);
        ws.onclose = () => console.log("[WS] fermé");

        const checkGamepad = () => {
            const gamepads = navigator.getGamepads();
            if (!gamepads) {
                requestAnimationFrame(checkGamepad);
                return;
            }

            for (const gp of gamepads) {
                if (!gp) continue;

                // Axes principaux (0 = X, 1 = Y)
                const x = gp.axes[0] ?? 0;
                const y = gp.axes[1] ?? 0;

                const now = Date.now();

                // Filtrage du bruit
                const moveX = Math.abs(x) > AXIS_THRESHOLD ? x : 0;
                const moveY = Math.abs(y) > AXIS_THRESHOLD ? y : 0;

                // Anti-spam / intervalle fixe
                if (now - lastTime.current > SEND_INTERVAL) {
                    const prev = lastSent.current;

                    // On n'envoie que si ça change significativement
                    if (Math.abs(moveX - prev.x) > 0.05 || Math.abs(moveY - prev.y) > 0.05) {
                        lastSent.current = { x: moveX, y: moveY };
                        lastTime.current = now;

                        SendCommand("move", { x: moveX, y: moveY });
                        console.log(
                            `%c🎮 Mouvement → X: ${moveX.toFixed(2)} | Y: ${moveY.toFixed(2)}`,
                            "color: cyan; font-weight: bold;"
                        );
                        // Exemple côté serveur : { "type": "move", "data": { "x": 0.4, "y": -0.1 } }
                    }
                }
            }

            requestAnimationFrame(checkGamepad);
        };

        requestAnimationFrame(checkGamepad);
        return () => ws.close();
    }, []);
};
