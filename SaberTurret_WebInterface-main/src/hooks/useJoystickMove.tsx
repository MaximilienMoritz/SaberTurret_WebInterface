import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

/**
 * Gère les mouvements de la tourelle via le joystick principal (axes).
 * Utilise SendCommand("move", { x, y }).
 */
export const useJoystickMove = () => {
  const AXIS_THRESHOLD = 0.15;
  const SEND_INTERVAL = 50; // ~20 FPS

  const lastSent = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);

  useEffect(() => {
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) {
        requestAnimationFrame(checkGamepad);
        return;
      }

      for (const gp of gamepads) {
        if (!gp) continue;

        const rawX = -(gp.axes[1] ?? 0);
        const rawY = -(gp.axes[0] ?? 0);

        // Deadzone
        const moveX = Math.abs(rawX) > AXIS_THRESHOLD ? rawX : 0;
        const moveY = Math.abs(rawY) > AXIS_THRESHOLD ? rawY : 0;

        const now = Date.now();
        const prev = lastSent.current;

        const timeOk = now - lastTime.current > SEND_INTERVAL;
        const valueChanged =
          Math.abs(moveX - prev.x) > 0.05 ||
          Math.abs(moveY - prev.y) > 0.05;

        if (timeOk && valueChanged) {
          lastSent.current = { x: moveX, y: moveY };
          lastTime.current = now;

          SendCommand("move", { x: moveX, y: moveY });
          console.log(
            `%c🎮 Mouvement → X: ${moveX.toFixed(2)} | Y: ${moveY.toFixed(2)}`,
            "color: cyan; font-weight: bold;"
          );
        }
      }

      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);
};
