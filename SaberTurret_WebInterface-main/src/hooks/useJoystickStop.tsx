import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

export const useJoystickEnableStop = () => {
  const lastSend = useRef(0);
  const SEND_DELAY = 1000;

  useEffect(() => {
    function sendEnableStop() {
      const now = Date.now();
      if (now - lastSend.current < SEND_DELAY) return;
      lastSend.current = now;

      SendCommand("enabelstop", {});
      console.log("enabel_stop");
    }

        // ─── Clavier ───────────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "Delete") {
        sendEnableStop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      for (const gp of gamepads) {
        if (!gp) continue;
        if (gp.buttons[26]?.pressed) {
          console.log("Bouton 26 pressé");
          sendEnableStop();
        }
      }
      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);
};
