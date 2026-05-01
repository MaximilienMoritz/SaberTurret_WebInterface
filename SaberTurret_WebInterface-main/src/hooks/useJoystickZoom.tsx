import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

/**
 * Gère le zoom via les axes du joystick secondaire (axes[2] ou axes[3]).
 * Utilise SendCommand("zoom", { value }).
 */
export const useJoystickZoom = () => {
  const SEND_INTERVAL = 50; // ~20 FPS
  const MAX_ANGLE_ZOOM = 853;
  const STEP = 15; // incrément par frame, ajustable

  const currentAngle = useRef<number>(Math.floor(MAX_ANGLE_ZOOM / 2));
  const lastTime = useRef<number>(0);

  useEffect(() => {
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) {
        requestAnimationFrame(checkGamepad);
        return;
      }

      for (const gp of gamepads) {
        if (!gp) continue;

        const zoomIn  = gp.buttons[10]?.pressed; // zoom +
        const zoomOut = gp.buttons[12]?.pressed; // zoom -

        if (!zoomIn && !zoomOut) {
          requestAnimationFrame(checkGamepad);
          return;
        }

        const now = Date.now();
        const timeOk = now - lastTime.current > SEND_INTERVAL;

        if (timeOk) {
          const newAngle = Math.round(
            Math.min(
              MAX_ANGLE_ZOOM,
              Math.max(0, currentAngle.current + (zoomIn ? STEP : -STEP))
            )
          );

          if (newAngle !== currentAngle.current) {
            currentAngle.current = newAngle;
            lastTime.current = now;

            SendCommand("zoom", { value: newAngle });
            console.log(
              `%cZoom → ${zoomIn ? "IN ▲" : "OUT ▼"} | Angle: ${newAngle}`,
              "color: orange; font-weight: bold;"
            );
          }
        }
      }

      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);
};
