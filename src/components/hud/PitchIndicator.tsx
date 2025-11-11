import React from 'react';

interface PitchIndicatorProps {
  value: number;
  max: number;
}

export const PitchIndicator: React.FC<PitchIndicatorProps> = ({ value, max }) => {
  const percentage = (value / max) * 100;
  const angle = (percentage * 180) / 100 - 90;
  
  return (
    <div className="relative w-64 h-32">
      <svg className="absolute inset-0 w-full h-full hud-glow" viewBox="0 0 256 128">
        {/* Semi-circle background */}
        <path
          d="M 28 100 A 100 100 0 0 1 228 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary opacity-30"
        />
        
        {/* Graduations */}
        {[0, 25, 50, 75, 100].map((mark) => {
          const markAngle = (mark * 180) / 100 - 90;
          const rad = (markAngle * Math.PI) / 180;
          const x1 = 128 + 90 * Math.cos(rad);
          const y1 = 100 + 90 * Math.sin(rad);
          const x2 = 128 + 100 * Math.cos(rad);
          const y2 = 100 + 100 * Math.sin(rad);
          
          return (
            <g key={mark}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary opacity-60"
              />
              <text
                x={128 + 75 * Math.cos(rad)}
                y={100 + 75 * Math.sin(rad) + 3}
                fill="currentColor"
                fontSize="10"
                textAnchor="middle"
                className="text-primary font-mono"
              >
                {mark}
              </text>
            </g>
          );
        })}
        
        {/* Active arc */}
        <path
          d={`M 28 100 A 100 100 0 0 1 ${128 + 100 * Math.cos((angle * Math.PI) / 180)} ${
            100 + 100 * Math.sin((angle * Math.PI) / 180)
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary opacity-90"
        />
        
        {/* Indicator needle */}
        <line
          x1="128"
          y1="100"
          x2={128 + 85 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 85 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />
        
        {/* Center pivot */}
        <circle cx="128" cy="100" r="4" fill="currentColor" className="text-primary" />
      </svg>
      
      {/* Label */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 hud-text text-xs font-bold">
        PITCH
      </div>
      
      {/* Value Display */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 hud-text text-sm font-mono">
        {value.toFixed(0)}°
      </div>
    </div>
  );
};