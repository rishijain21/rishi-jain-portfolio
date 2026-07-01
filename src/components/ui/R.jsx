import { useInView } from "../../hooks/useInView";

// Detect reduced-motion preference once at module level.
// This is safe to read synchronously — it's a media query, not a DOM node.
const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Reveal wrapper.
 * - Animates children from translateY(20px) + opacity:0 → normal on first inview.
 * - When prefers-reduced-motion is set, children are immediately visible with no transition.
 * - `d` (delay in seconds), `style` and `className` are forwarded.
 */
export const R = ({ children, d = 0, style = {}, className = "" }) => {
    const [ref, vis] = useInView();

    const motionStyle = prefersReducedMotion
        ? {}
        : {
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${d}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${d}s`,
          };

    return (
        <div ref={ref} className={className || undefined} style={{ ...motionStyle, ...style }}>
            {children}
        </div>
    );
};
