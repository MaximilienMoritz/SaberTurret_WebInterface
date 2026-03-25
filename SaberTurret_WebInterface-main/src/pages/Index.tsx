import React, { useState, useEffect } from 'react';
import { CrosshairHUD } from '@/components/hud/CrosshairHUD';
import { PitchIndicator } from '@/components/hud/PitchIndicator';
import { SystemPanel } from '@/components/hud/SystemPanel';
import { GyroscopeIndicator } from '@/components/hud/GyroscopeIndicator';
import { TurretStats } from '@/components/hud/TurretStats';
import { ScanlineEffect } from '@/components/hud/ScanlineEffect';
import VideoBackground from '@/components/hud/VideoBackground';
import { useJoystickLogout } from '@/hooks/JoystickInitialisation';
import { GamepadDebug } from "@/hooks/JoystickDebug";
import { useJoystickZoom } from "@/hooks/useJoystickZoom";
import {useJoystickFocus} from "@/hooks/useJoystickFocus.tsx";
import {useJoystickMove} from "@/hooks/useJoystickMove.tsx";
import { useJoystickEnableMoteur } from '@/hooks/useJoystickEnableMoteur';
import { useJoystickEnableStop } from '@/hooks/useJoystickStop';


const Index = () => {
  // const [zoom, setZoom] = useState(5);
  const [distance, setDistance] = useState(424);
  const [altitude, setAltitude] = useState(230);
  const [pitch, setPitch] = useState(15);
  const [roll, setRoll] = useState(0);
  const [yaw, setYaw] = useState(45);
  const [heat, setHeat] = useState(45);
  const [ammo, setAmmo] = useState(280);
  const [power, setPower] = useState(85);

  // Hook personnalisé pour gérer le zoom via joystick
  const { zoom, focus, aperture } = useJoystickZoom();


  // Active la détection joystick
  const { isConnected, controllerName } = useJoystickLogout();

  useJoystickFocus();
  useJoystickMove();
  useJoystickEnableMoteur();
  useJoystickEnableStop();

  useEffect(() => {
    const interval = setInterval(() => {
      setPitch((prev) => prev + (Math.random() - 0.5) * 2);
      setRoll((prev) => prev + (Math.random() - 0.5) * 1);
      setYaw((prev) => (prev + 0.5) % 360);
      setDistance((prev) => Math.max(100, prev + (Math.random() - 0.5) * 10));
      setHeat((prev) => Math.min(100, Math.max(20, prev + (Math.random() - 0.5) * 3)));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const systems = [
    { id: 'A', label: 'A - WPN', status: 'active' as const },
    { id: 'B', label: 'B - NAV', status: 'active' as const },
    { id: 'C', label: 'C - COM', status: 'standby' as const },
    { id: 'D', label: 'D - ECM', status: 'active' as const },
    { id: 'E', label: 'E - RDR', status: 'active' as const },
    { id: 'F', label: 'F - ENG', status: 'warning' as const },
  ];

  const turretStatus = heat > 80 ? 'overheated' : ammo === 0 ? 'reloading' : 'ready';

  return (
      <div className="relative min-h-screen overflow-hidden">

        {/* === VIDEO BACKGROUND === */}
        <VideoBackground />

        {/* === DEBUG GAMEPAD (à retirer pour les phases suivantes) === */}
        <GamepadDebug />

        {/* === OVERLAY GRID (optionnel) === */}
        <div className="absolute inset-0 hud-grid opacity-10 pointer-events-none" />

        {/* === MAIN HUD === */}
        <div className="relative min-h-screen flex items-center justify-center p-8 text-white">
          {/* Left Panel
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <SystemPanel systems={systems} />
          </div>
            */}

          {/* Center Crosshair */}
          <div className="relative">
            <CrosshairHUD />
          </div>

          {/* Right Bottom - Turret Stats */}
          <div className="absolute right-8 bottom-8">
            <TurretStats
                maxRAM={100}     // correspond à 100%
                maxHeat={100}    // température max affichée
                maxCPU={100}     // CPU max en %
                status={turretStatus}
            />
          </div>

          {/* Top Info Bar */}
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
            <div className="space-y-1">
            </div>

            <div className="text-center">
              <div className="hud-text text-2xl font-bold flicker">S.A.B.R.E</div>
              <div className="hud-text text-xs mt-1">
                Smart Auto Ballistic Reconnaissance Engine
              </div>
            </div>

            <div className="space-y-1 text-right">
              <div className="hud-text text-xs">
                <span className="text-muted-foreground">SPD</span>
                <span className="ml-2">MACH 1.2</span>
              </div>
              <div className="hud-text text-xs">
                <span className="text-muted-foreground">ALT</span>
                <span className="ml-2">35,000 FT</span>
              </div>
            </div>
          </div>

            {/* Zoom Indicator (temporaire) */}
          <div className="absolute top-4 right-4 text-xs font-mono text-green-400">
            ZOOM: x{zoom.toFixed(1)}
          </div>

          {/* Bottom Bar */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-8">
            <div className="hud-text text-xs">
              <span className="text-muted-foreground">LAT</span>
              <span className="ml-2 font-mono">47.6062°N</span>
            </div>
            <div className="hud-text text-xs">
              <span className="text-muted-foreground">LON</span>
              <span className="ml-2 font-mono">122.3321°W</span>
            </div>
            <div className="hud-text text-xs">
              <span className="text-muted-foreground">TIME</span>
              <span className="ml-2 font-mono">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

        </div>

        <button
            onClick={() => {
              localStorage.removeItem("auth");
              window.location.href = "/";
            }}
            className="absolute bottom-8 left-8 text-red-500 text-xs border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-black transition"
        >
          LOGOUT
        </button>

        {/* === Indicateur joystick === */}
        <div className="absolute top-4 left-4 text-xs hud-text text-left">
          <div className={isConnected ? "text-primary" : "text-red-500"}>
            CTRL LINK: {isConnected ? "ONLINE" : "OFFLINE"}
          </div>
          {isConnected && (
              <div className="text-primary/70 text-[10px] mt-1 tracking-widest">
                {controllerName}
              </div>
          )}
        </div>

        {/* === SCANLINE EFFECT ===
        <ScanlineEffect />
        */}
      </div>
  );
};

export default Index;
