import React, { useState, useEffect } from "react";

const VideoBackground: React.FC = () => {
    const [reloadKey, setReloadKey] = useState(0);

    // 🔄 petit système de reconnexion automatique si le flux se bloque
    useEffect(() => {
        const interval = setInterval(() => {
            setReloadKey((prev) => prev + 1);
        }, 10000); // recharge l'image toutes les 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <img
            key={reloadKey}
            src={`http://172.16.201.61:5000/stream`} // évite le cache navigateur
            alt="Camera Live stream"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                objectFit: "contain",
                zIndex: -1,
                pointerEvents: "none",
                backgroundColor: "black",
                // retourne la caméra
                transform: "scaleY(-1) scaleX(-1)",
            }}
            onError={(e) => {
                console.warn("⚠️ Flux vidéo indisponible, tentative de reconnexion...");
                setTimeout(() => setReloadKey((prev) => prev + 1), 2000);
            }}
        />
    );
};

export default VideoBackground;
