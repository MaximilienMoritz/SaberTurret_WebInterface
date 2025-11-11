import React from 'react';

interface GyroscopeIndicatorProps {
  pitch: number;
  roll: number;
  yaw: number;
}

export const GyroscopeIndicator: React.FC<GyroscopeIndicatorProps> = ({ pitch, roll, yaw }) => {
  return (
    <div className="relative w-48 h-48">
      <svg className="absolute inset-0 w-full h-full hud-glow" viewBox="0 0 200 200">
        {/* Outer Ring */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary opacity-40"
        />
        
        {/* Middle Ring - Roll */}
        <g transform={`rotate(${roll} 100 100)`}>
          <circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary opacity-60"
          />
          
          {/* Roll Indicator */}
          <line
            x1="100"
            y1="30"
            x2="100"
            y2="40"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
        </g>
        
        {/* Inner Ring - Pitch */}
        <g transform={`rotate(${pitch} 100 100)`}>
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary opacity-80"
          />
          
          {/* Horizontal Line */}
          <line
            x1="50"
            y1="100"
            x2="150"
            y2="100"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary"
          />
        </g>
        
        {/* Vertical Line */}
        <line
          x1="100"
          y1="50"
          x2="100"
          y2="150"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
        
        {/* Center Point */}
        <circle cx="100" cy="100" r="3" fill="currentColor" className="text-primary" />
        
        {/* Cardinal Marks */}
        {['N', 'E', 'S', 'W'].map((dir, i) => {
          const angle = i * 90;
          const rad = (angle * Math.PI) / 180;
          const x = 100 + 80 * Math.sin(rad);
          const y = 100 - 80 * Math.cos(rad);
          
          return (
            <text
              key={dir}
              x={x}
              y={y + 3}
              fill="currentColor"
              fontSize="12"
              textAnchor="middle"
              className="text-primary font-mono font-bold"
            >
              {dir}
            </text>
          );
        })}
        
        {/* Degree Marks */}
        {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const isCardinal = deg % 90 === 0;
          const r1 = isCardinal ? 85 : 87;
          const r2 = 90;
          const x1 = 100 + r1 * Math.sin(rad);
          const y1 = 100 - r1 * Math.cos(rad);
          const x2 = 100 + r2 * Math.sin(rad);
          const y2 = 100 - r2 * Math.cos(rad);
          
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth={isCardinal ? "1.5" : "0.5"}
              className="text-primary opacity-60"
            />
          );
        })}
      </svg>
      
      {/* Digital Readouts */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-mono hud-text">
        <span>P:{pitch.toFixed(0)}°</span>
        <span>R:{roll.toFixed(0)}°</span>
        <span>Y:{yaw.toFixed(0)}°</span>
      </div>
    </div>
  );
};