import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";
/**
 * Gère les mouvements de la tourelle via le joystick principal (axes).
 * Utilise WebSocket via SendCommand("move", { x, y }).
 * Affiche les infos dans la console pour vérification.
 */
export const useJoystickMove = () => {

    console.log("FILE LOADED: useJoystickMove");

    const AXIS_THRESHOLD = 0.15; // seuil pour ignorer les micro-mouvements
    const SEND_INTERVAL = 50;    // envoi max toutes les 50 ms (~20 FPS)
    const lastSent = useRef({ x: 0, y: 0 });
    const lastTime = useRef(0);
    useEffect(() => {

        // const ws = new WebSocket("ws://localhost:8081");
        // ws.onopen = () => console.log("%c[WS] ✅ Connecté au serveur de mouvement", "color: lime;");
        // ws.onerror = (err) => console.warn("[WS] ❌ Erreur :", err);
        // ws.onclose = () => console.log("%c[WS] ⚠️ Déconnecté", "color: orange;");


        const checkGamepad = () => {
            const gamepads = navigator.getGamepads();
            if (!gamepads) {
                requestAnimationFrame(checkGamepad);
                //return;
            }
            for (const gp of gamepads) {
                if (!gp) continue;
                // Axes principaux : 0 = horizontal, 1 = vertical
                const x = gp.axes[0] ?? 0;
                const y = gp.axes[1] ?? 0;

                console.log("gggg       " + y)

                // Applique un "deadzone" pour éviter le bruit
                const moveX = Math.abs(x) > AXIS_THRESHOLD ? x : 0;
                const moveY = Math.abs(y) > AXIS_THRESHOLD ? y : 0;
                const now = Date.now();
                // Anti-spam : on n’envoie que toutes les SEND_INTERVAL ms
                if (now - lastTime.current > SEND_INTERVAL) {
                    const prev = lastSent.current;
                    // On n’envoie que si la valeur change suffisamment
                    if (Math.abs(moveX - prev.x) > 0.05 || Math.abs(moveY - prev.y) > 0.05) {
                        lastSent.current = { x: moveX, y: moveY };
                        lastTime.current = now;
                        SendCommand("move", { x: moveX, y: moveY });
                        console.log(
                            `%c🎮 Mouvement → X: ${moveX.toFixed(2)} | Y: ${moveY.toFixed(2)}`,
                            "color: cyan; font-weight: bold;"
                        );
                    }
                }
            }
            requestAnimationFrame(checkGamepad);
        };
        requestAnimationFrame(checkGamepad);
        //return () => ws.close();
    }, []);


};