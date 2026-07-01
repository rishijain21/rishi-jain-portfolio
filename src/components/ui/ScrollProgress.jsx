import { useState, useEffect } from "react";

export const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const h = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setProgress((window.scrollY / total) * 100);
        };
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, zIndex: 300,
            width: `${progress}%`, height: 3,
            background: "#1A1612",
            transition: "width 0.1s linear",
            pointerEvents: "none",
        }} />
    );
};
