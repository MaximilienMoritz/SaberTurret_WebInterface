import { useEffect, useState, useRef } from "react";

import SendCommand from "./utils.tsx";
import * as dgram from "node:dgram";

export const useJoystickAutoFocus = () => {

  const API_URL = "http://172.16.201.61:5000/optic";
  const lastSend = useRef(0);
  const SEND_DELAY = 1000; // délai anti-spam (ms)

  useEffect(() => {

      const ws = new WebSocket("ws://localhost:8081");

      function sendFocus() {

          const now = Date.now();
          if (now - lastSend.current < SEND_DELAY) return;
          lastSend.current = now;

          SendCommand("focus", { "do": 1 });
          console.log("sent")
      }

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      for (const gp of gamepads) {
        if (!gp) continue;

        // === Focus ===
        if (gp.buttons[4]?.pressed) {
            console.log("Focus")
              sendFocus()
        }

      }

      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);


};
