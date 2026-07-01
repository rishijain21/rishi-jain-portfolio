import { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { SITE_CONFIG } from "../../config/site";
import { track } from "../../utils/track";

export const MobileStickyBar = () => {
    const isMobile = useIsMobile();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!isMobile) return;
        const h = () => setVisible(window.scrollY > window.innerHeight * 0.5);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, [isMobile]);
    if (!isMobile) return null;
    return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 180, padding: "12px 16px 20px", background: "rgba(247,244,239,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(26,22,18,0.08)", transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)", pointerEvents: visible ? "auto" : "none" }}>
            <a href="#contact" onClick={() => track("cta_click", { location: "mobile_sticky", cta: "tell_me_about_project" })}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1A1612", color: "#F7F4EF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 24px", borderRadius: 10, textDecoration: "none", width: "100%", boxSizing: "border-box" }}
            >
                Tell Me About Your Project
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#857F79", textAlign: "center", marginTop: 8 }}>
                {SITE_CONFIG.available ? SITE_CONFIG.availabilityText : SITE_CONFIG.unavailableText}
            </p>
        </div>
    );
};
