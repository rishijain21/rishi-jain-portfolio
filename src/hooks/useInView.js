import { useState, useEffect, useRef } from "react";

/**
 * Fires once when the element enters the viewport.
 * Disconnects the observer after the first intersection — intentional for
 * reveal animations that should never re-trigger.
 *
 * @param {IntersectionObserverInit} opts — standard IO options.
 *   Spread last so callers can override threshold (default: 0.1).
 */
export const useInView = (opts = {}) => {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const options = { threshold: 0.1, ...opts };
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVis(true);
                io.disconnect();
            }
        }, options);
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
        // opts is intentionally excluded — this hook is meant to fire once
        // on mount. Callers pass a stable literal object; re-subscribing on
        // every render would break the single-fire semantics.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return [ref, vis];
};
