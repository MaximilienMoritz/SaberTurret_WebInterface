import React from 'react';

export const ScanlineEffect: React.FC = () => {
  return (
    <>
      {/* Scanlines */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-32 scanline" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              hsl(var(--hud-primary) / 0.03) 2px,
              hsl(var(--hud-primary) / 0.03) 4px
            )`,
          }}
        />
      </div>
      
      {/* Vignette Effect */}
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80" />
      </div>
      
      {/* CRT Screen Curve Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, transparent 60%, hsl(var(--background) / 0.2) 100%)`,
        }}
      />
    </>
  );
};