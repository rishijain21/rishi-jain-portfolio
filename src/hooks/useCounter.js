import { useState, useEffect } from "react";

/**
 * useCounter — animates a number from 0 → `to` using a cubic ease-out curve.
 * Only starts when `active` is true (typically when the element enters the viewport).
 * Cleans up the rAF on unmount or when deps change, so no stale callbacks fire.
 */
export const useCounter = (to, dur = 1600, active = false) => {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!active) return;
        let t0 = null;
        let raf;
        const tick = (ts) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to, dur, active]);
    return n;
};
