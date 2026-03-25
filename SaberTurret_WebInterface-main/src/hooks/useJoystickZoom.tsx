import { useEffect, useState, useRef } from "react";

import SendCommand from "./utils.tsx";



import * as dgram from "node:dgram";

export const useJoystickZoom = () => {
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState(5);
  const [aperture, setAperture] = useState(8);

  const API_URL = "http://172.16.201.61:5000/optic";
  const lastSend = useRef(0);
  const SEND_DELAY = 1000; // délai anti-spam (ms)

  useEffect(() => {
    const sendOptic = async (zoomValue: number, focusValue: number, apertureValue: number) => {
      const now = Date.now();
      if (now - lastSend.current < SEND_DELAY) return;
      lastSend.current = now;

      try {
        const payload = {
          zoom: zoomValue,
          focus: focusValue,
          aperture: apertureValue,
        };

        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log("Optic envoyé :", payload);
      } catch (err) {
        console.warn("Erreur d’envoi du JSON optic :", err);
      }
    };


      const ws = new WebSocket("ws://localhost:8081");

      function sendOptic2(zoom, focus, aperture) {
          SendCommand("optic", { zoom, focus, aperture });
          console.log("sent")
      }

    const checkGamepad = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads) return;

      for (const gp of gamepads) {
        if (!gp) continue;

        // === Zoom ===
        if (gp.buttons[10]?.pressed) {
          setZoom((prev) => {
            const newZoom = Math.min(prev + 1, 180);
            sendOptic2(newZoom, focus, aperture);
            return newZoom;
          });
        }

        if (gp.buttons[12]?.pressed) {
          setZoom((prev) => {
            const newZoom = Math.max(prev - 1, 0);
            sendOptic2(newZoom, focus, aperture);
            return newZoom;
          });
        }

        // === Focus ===
        if (gp.buttons[11]?.pressed) {
          setFocus((prev) => {
            const newFocus = Math.min(prev + 1, 180);
            sendOptic2(zoom, newFocus, aperture);
            return newFocus;
          });
        }

        if (gp.buttons[13]?.pressed) {
          setFocus((prev) => {
            const newFocus = Math.max(prev - 1, 0);
            sendOptic2(zoom, newFocus, aperture);
            return newFocus;
          });
        }

        // === Aperture ===
        if (gp.buttons[22]?.pressed) {
          setAperture((prev) => {
            const newAperture = Math.min(prev + 1, 180);
            sendOptic2(zoom, focus, newAperture);
            return newAperture;
          });
        }

        if (gp.buttons[23]?.pressed) {
          setAperture((prev) => {
            const newAperture = Math.min(prev - 1, 0);
            sendOptic2(zoom, focus, newAperture);
            return newAperture;
          });
        }
      }

      requestAnimationFrame(checkGamepad);
    };

    requestAnimationFrame(checkGamepad);
  }, []);

  return { zoom, focus, aperture };
};
