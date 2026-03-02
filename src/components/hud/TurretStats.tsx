import React, { useEffect, useState } from 'react';

interface TurretStatsProps {
  maxRAM: number;
  maxHeat: number;
  maxCPU: number;
  status: 'ready' | 'firing' | 'reloading' | 'overheated';
}

export const TurretStats: React.FC<TurretStatsProps> = ({
                                                          maxRAM,
                                                          maxHeat,
                                                          maxCPU,
                                                          status,
                                                        }) => {
  const [RAM, setRAM] = useState(0);
  const [heat, setHeat] = useState(0);
  const [CPU, setCPU] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://172.16.151.33:5000/status');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setRAM(data.mem_percent);
        setCPU(data.cpu_percent);
        setHeat(data.temp_c);
      } catch (err) {
        console.warn('⚠️ Impossible de récupérer les données du statut:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return 'text-primary';
      case 'firing':
        return 'text-yellow-500';
      case 'reloading':
        return 'text-blue-500';
      case 'overheated':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };

  return (
      <div
          className="p-3 border border-primary/50 bg-background/50 backdrop-blur-sm"
          style={{
            width: '220px', // réduit la largeur globale
            fontSize: '0.85rem', // texte un peu plus compact
          }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="hud-text text-xs font-bold">SYSTEM STATUS</h3>
          <span
              className={`${getStatusColor()} text-[10px] font-mono uppercase pulse-glow`}
          >
          {status}
        </span>
        </div>

        <div className="space-y-2">
          {/* RAM */}
          <div>
            <div className="flex justify-between text-[10px] hud-text mb-0.5">
              <span>RAM</span>
              <span className="font-mono">{RAM.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-primary/10 relative overflow-hidden rounded-sm">
              <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
                  style={{ width: `${RAM}%` }}
              />
            </div>
          </div>

          {/* HEAT */}
          <div>
            <div className="flex justify-between text-[10px] hud-text mb-0.5">
              <span>HEAT</span>
              <span className="font-mono">{heat.toFixed(1)}°C</span>
            </div>
            <div className="h-1.5 bg-primary/10 relative overflow-hidden rounded-sm">
              <div
                  className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                      heat > 80
                          ? 'bg-red-500'
                          : heat > 60
                              ? 'bg-yellow-500'
                              : 'bg-primary'
                  }`}
                  style={{ width: `${(heat / maxHeat) * 100}%` }}
              />
            </div>
          </div>

          {/* CPU */}
          <div>
            <div className="flex justify-between text-[10px] hud-text mb-0.5">
              <span>CPU</span>
              <span className="font-mono">{CPU.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-primary/10 relative overflow-hidden rounded-sm">
              <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
                  style={{ width: `${(CPU / maxCPU) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer infos */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-primary/30 text-[10px]">
          <div>
            <span className="text-muted-foreground">MODE</span>
            <span className="hud-text ml-1 font-mono">MANUEL</span>
          </div>
          <div>
            <span className="text-muted-foreground">HOST</span>
            <span className="hud-text ml-1 font-mono">sabercontroller</span>
          </div>
        </div>
      </div>
  );
};
