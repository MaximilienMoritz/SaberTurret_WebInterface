import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

/**
 * Gère les mouvements de la tourelle via le joystick principal (axes) ou WASD.
 * Utilise SendCommand("move", { x, y }).
 */
export const useJoystickMove = () => {
  const AXIS_THRESHOLD = 0.15;
  const SEND_INTERVAL = 50;

  const lastSent = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>(); // Pour pouvoir stopper la boucle

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.key.toLowerCase());
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.key.toLowerCase());

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      let moveX = 0;
      let moveY = 0;
      let sourceIsGamepad = false;

      if (gamepads) {
        for (const gp of gamepads) {
          if (!gp) continue;
          const rawX = -(gp.axes[1] ?? 0);
          const rawY = -(gp.axes[0] ?? 0);

          if (Math.abs(rawX) > AXIS_THRESHOLD || Math.abs(rawY) > AXIS_THRESHOLD) {
            moveX = rawX;
            moveY = rawY;
            sourceIsGamepad = true;
            break;
          }
        }
      }

      if (!sourceIsGamepad) {
        const keys = keysPressed.current;
        if (keys.has("w")) moveX += 1;
        if (keys.has("s")) moveX -= 1;
        if (keys.has("d")) moveY -= 1;
        if (keys.has("a")) moveY += 1;

        if (moveX !== 0 && moveY !== 0) {
          const norm = Math.SQRT2;
          moveX /= norm;
          moveY /= norm;
        }
      }

      const now = Date.now();
      const prev = lastSent.current;

      // --- LOGIQUE D'ENVOI CRITIQUE ---
      const timeOk = now - lastTime.current > SEND_INTERVAL;
      
      // On vérifie si on vient de s'arrêter (passage de "bouge" à "0")
      const isStopping = (moveX === 0 && moveY === 0) && (prev.x !== 0 || prev.y !== 0);
      
      // On vérifie si le mouvement a assez changé
      const hasMovedSignificantly = 
        Math.abs(moveX - prev.x) > 0.05 || 
        Math.abs(moveY - prev.y) > 0.05;

      // On envoie si : (le temps est ok ET un changement notable) OU (on doit forcer l'arrêt)
      if ((timeOk && hasMovedSignificantly) || isStopping) {
        lastSent.current = { x: moveX, y: moveY };
        lastTime.current = now;

        SendCommand("move", { x: moveX, y: moveY });
        
        console.log(
          `%c${sourceIsGamepad ? "🎮" : "⌨️"} ${isStopping ? "STOP" : "MOVE"} → X: ${moveX.toFixed(2)} | Y: ${moveY.toFixed(2)}`,
          `color: ${isStopping ? "orange" : sourceIsGamepad ? "cyan" : "lime"}; font-weight: bold;`
        );
      }

      requestRef.current = requestAnimationFrame(checkGamepad);
    };

    requestRef.current = requestAnimationFrame(checkGamepad);
    
    // Nettoyage pour éviter les boucles infinies en arrière-plan
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);
};
