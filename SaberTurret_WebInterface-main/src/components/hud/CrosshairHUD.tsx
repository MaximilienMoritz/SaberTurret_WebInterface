import React from "react";

export const CrosshairHUD: React.FC = () => {
    return (
        <div className="relative w-96 h-96 flex items-center justify-center">
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 400 400"
            >
                {/* === Grand cercle principal === */}
                <circle
                    cx="200"
                    cy="200"
                    r="180"
                    fill="none"
                    stroke="limegreen"
                    strokeWidth="3"
                    opacity="0.9"
                />

                {/* === Petit cercle central (mire) === */}
                <circle
                    cx="200"
                    cy="200"
                    r="30"
                    fill="none"
                    stroke="limegreen"
                    strokeWidth="2"
                    opacity="0.9"
                />

                {/* === Traits de la mire === */}
                {/* Gauche */}
                <line
                    x1="160"
                    y1="200"
                    x2="140"
                    y2="200"
                    stroke="limegreen"
                    strokeWidth="2"
                    opacity="0.9"
                />

                {/* Droite */}
                <line
                    x1="240"
                    y1="200"
                    x2="260"
                    y2="200"
                    stroke="limegreen"
                    strokeWidth="2"
                    opacity="0.9"
                />

                {/* Haut */}
                <line
                    x1="200"
                    y1="160"
                    x2="200"
                    y2="140"
                    stroke="limegreen"
                    strokeWidth="2"
                    opacity="0.9"
                />
            </svg>
        </div>
    );
};
