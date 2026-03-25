import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

export const useJoystickEnableMoteur = () => {
  const lastSend = useRef(0);
  const SEND_DELAY = 1000;

  useEffect(() => {
    function sendEnableMoteur() {
      const now = Date.now();
      if (now - lastSend.current < SEND_DELAY) return;
      lastSend.current = now;

      SendCommand("testenabel", {});
      console.log("sending enable moteur");
    }

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      for (const gp of gamepads) {
        if (!gp) continue;
        if (gp.buttons[28]?.pressed) {
          console.log("Bouton 28 pressé");
          sendEnableMoteur();
        }
      }
      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);
};
