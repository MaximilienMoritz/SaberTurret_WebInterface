import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

export const useJoystickAutofocus = () => {
  const lastSend = useRef(0);
  const SEND_DELAY = 1000;

  useEffect(() => {
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      for (const gp of gamepads) {
        if (!gp) continue;

        if (gp.buttons[21]?.pressed) {
          const now = Date.now();
          if (now - lastSend.current < SEND_DELAY) continue;
          lastSend.current = now;

          SendCommand("autofocus", { action: "start" });
          console.log("Autofocus start");
        }
      }

      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);
};
