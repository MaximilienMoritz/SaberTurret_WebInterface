import React from "react";

interface CrosshairHUDProps {
    zoom: number; // 0 → 180
}

export const CrosshairHUD: React.FC<CrosshairHUDProps> = ({ zoom }) => {
    // Normalisation du zoom (0 → 1)
    const zoomNormalized = Math.min(Math.max(zoom / 180, 0), 1);

    // Définition des angles : démarre à gauche (180°) → va vers le haut (90°)
    const startAngle = 180; // gauche
    const endAngle = 180 - zoomNormalized * 90; // monte vers 90° quand zoom max

    // Conversion polaire → cartésienne
    const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
        const rad = (angleDeg - 90) * (Math.PI / 180);
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const radius = 160;
    const start = polarToCartesian(200, 200, radius, startAngle);
    const end = polarToCartesian(200, 200, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    const arcPath = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;

    return (
        <div className="relative w-96 h-96 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                {/* === Cercle principal === */}
                <circle
                    cx="200"
                    cy="200"
                    r="190"
                    fill="none"
                    stroke="limegreen"
                    strokeWidth="6"
                    opacity="0.3"
                />

                {/* === Cercle central === */}
                <circle
                    cx="200"
                    cy="200"
                    r="30"
                    fill="none"
                    stroke="limegreen"
                    strokeWidth="2"
                    opacity="0.9"
                />

                {/* === Traits (version plus longs dans un seul sens) === */}
                <line x1="160" y1="200" x2="120" y2="200" stroke="limegreen" strokeWidth="2" /> {/* gauche */}
                <line x1="240" y1="200" x2="280" y2="200" stroke="limegreen" strokeWidth="2" /> {/* droite */}
                <line x1="200" y1="160" x2="200" y2="120" stroke="limegreen" strokeWidth="2" /> {/* haut */}

                {/* === Arc dynamique === */}
                <path
                    d={arcPath}
                    stroke="limegreen"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                        transition: "d 0.1s linear", // animation fluide en théorie mdr
                    }}
                />

                {/* === Texte du zoom === */}
                <text
                    x="125"
                    y="185"
                    fill="limegreen"
                    fontSize="16"
                    fontFamily="monospace"
                >
                    x{Math.round(zoom)}
                </text>
            </svg>
        </div>
    );
};
