import { useEffect, useRef } from "react";
import SendCommand from "./utils.tsx";

export const useJoystickHoming = () => {
  const lastSend = useRef(0);
  const SEND_DELAY = 1000;

  useEffect(() => {
    function sendHoming() {
      const now = Date.now();
      if (now - lastSend.current < SEND_DELAY) return;
      lastSend.current = now;

      SendCommand("homing", {});
      console.log("%c🏠 Homing envoyé", "color: orange; font-weight: bold;");
    }

    // ─── Clavier ───────────────────────────────────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h") {
        sendHoming();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // ─── Gamepad ───────────────────────────────────────────────────────────
    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) {
        requestAnimationFrame(checkGamepad);
        return;
      }

      for (const gp of gamepads) {
        if (!gp) continue;
        if (gp.buttons[27]?.pressed) {
          sendHoming();
        }
      }

      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
