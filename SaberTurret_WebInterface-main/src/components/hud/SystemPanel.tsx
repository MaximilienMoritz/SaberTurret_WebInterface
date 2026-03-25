import React from 'react';

interface SystemPanelProps {
  systems: {
    id: string;
    label: string;
    status: 'active' | 'standby' | 'warning' | 'offline';
  }[];
}

export const SystemPanel: React.FC<SystemPanelProps> = ({ systems }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-primary';
      case 'standby':
        return 'text-muted-foreground';
      case 'warning':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-primary';
    }
  };
  
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return '●';
      case 'standby':
        return '○';
      case 'warning':
        return '▲';
      case 'offline':
        return '✕';
      default:
        return '○';
    }
  };
  
  return (
    <div className="flex flex-col gap-2">
      <div className="hud-text text-xs font-bold mb-2">SYSTEMS</div>
      {systems.map((system) => (
        <div
          key={system.id}
          className={`relative px-3 py-2 border ${
            system.status === 'active' ? 'border-primary' : 'border-primary/30'
          } ${system.status === 'active' ? 'hud-glow' : ''}`}
        >
          <div className="flex items-center justify-between gap-4">
            <span className="hud-text text-sm font-mono">{system.label}</span>
            <span className={`${getStatusColor(system.status)} text-lg`}>
              {getStatusIndicator(system.status)}
            </span>
          </div>
          
          {/* Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20">
            <div
              className={`h-full ${
                system.status === 'active' ? 'bg-primary' : 'bg-primary/10'
              } transition-all duration-300`}
              style={{
                width: system.status === 'active' ? '100%' : system.status === 'standby' ? '50%' : '0%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};