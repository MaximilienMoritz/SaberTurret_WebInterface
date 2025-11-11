import React, { useEffect, useState } from "react";

export const GamepadDebug: React.FC = () => {
    const [buttons, setButtons] = useState<number[]>([]);
    const [axes, setAxes] = useState<number[]>([]);
    const [name, setName] = useState<string>("No controller detected");

    useEffect(() => {
        const update = () => {
            const gamepads = navigator.getGamepads();
            if (!gamepads) return;

            const gp = gamepads[0];
            if (gp) {
                setName(gp.id);
                setButtons(gp.buttons.map((b) => (b.pressed ? 1 : 0)));
                setAxes(gp.axes.map((a) => parseFloat(a.toFixed(2))));
            } else {
                setName("No controller detected");
                setButtons([]);
                setAxes([]);
            }

            requestAnimationFrame(update);
        };

        update();
    }, []);

    return (
        <div
            className="absolute left-6 bottom-20 text-xs font-mono text-green-400 border border-green-400/40 rounded-md p-3 bg-black/40 backdrop-blur-sm"
            style={{
                width: "230px", // largeur contrôlée
                maxHeight: "90vh", // ne dépasse pas sur la caméra
                overflowY: "auto"
            }}
        >
            <div className="hud-text text-green-400 mb-2">{name}</div>

            <div>
                <div className="hud-text text-green-300 mb-1">Buttons:</div>
                <div className="grid grid-cols-8 gap-1">
                    {buttons.map((v, i) => (
                        <div
                            key={i}
                            className={`px-2 py-1 rounded border text-center align-middle ${
                                v
                                    ? "text-red-600 text-black"
                                    : "text-green-400"
                            }`}
                        >
                            {i}
                        </div>
                    ))}
                </div>
            </div>

            {/* === Axes === */}
            <div className="mt-3">
                <div className="hud-text text-primary mb-1">Axes:</div>
                {axes.map((v, i) => (
                    <div key={i} className="mb-1">
                        <div className="flex justify-between">
                            <span>Axis {i}</span>
                            <span className="text-primary">{v}</span>
                        </div>
                        <div className="h-1 bg-green-900/50 relative overflow-hidden">
                            <div
                                className="absolute inset-y-0 text-primary transition-all duration-75"
                                style={{
                                    width: `${Math.abs(v) * 100}%`,
                                    left: v >= 0 ? "50%" : `${50 + v * 50}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
