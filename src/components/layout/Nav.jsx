import { useState, useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NAV_LINKS } from "../../data/navLinks";
import { AvailabilityDot } from "../ui/AvailabilityDot";
import { track } from "../../utils/track";

export const Nav = () => {
    const [solid, setSolid] = useState(false);
    const [hoveredNav, setHoveredNav] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const h = () => setSolid(window.scrollY > 56);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);

    // Close drawer on Escape key — standard keyboard UX for modal-like drawers.
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    // Inert background when mobile menu is open — prevents keyboard focus escaping to page content
    useEffect(() => {
        const main = document.getElementById("main-content");
        const footer = document.querySelector("footer");
        if (menuOpen) {
            if (main) main.inert = true;
            if (footer) footer.inert = true;
        } else {
            if (main) main.inert = false;
            if (footer) footer.inert = false;
        }
        return () => {
            if (main) main.inert = false;
            if (footer) footer.inert = false;
        };
    }, [menuOpen]);

    return (
        <>
            {isMobile && (
                <div onClick={() => setMenuOpen(false)} aria-hidden="true" style={{
                    position: "fixed", inset: 0, zIndex: 249,
                    background: "rgba(26,22,18,0.4)",
                    opacity: menuOpen ? 1 : 0,
                    pointerEvents: menuOpen ? "auto" : "none",
                    transition: "opacity 0.25s ease",
                    backdropFilter: menuOpen ? "blur(2px)" : "none",
                }} />
            )}
            <div role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden={!menuOpen} inert={!menuOpen ? "" : undefined} style={{
                position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 250,
                background: "#F7F4EF", borderRadius: "20px 20px 0 0",
                boxShadow: "0 -8px 40px rgba(26,22,18,0.12)",
                border: "1px solid rgba(26,22,18,0.08)", borderBottom: "none",
                transform: menuOpen ? "translateY(0)" : "translateY(100%)",
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 24, padding: "40px 32px 48px", minHeight: "auto", paddingTop: 56,
            }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(26,22,18,0.15)", marginBottom: 8, alignSelf: "center" }} />
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{
                    position: "absolute", top: 24, right: 24,
                    background: "none", border: "none", color: "#6B6460", fontSize: 24, cursor: "pointer",
                    width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
                {NAV_LINKS.map(l => (
                    <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
                        fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 600,
                        color: "#1A1612", textDecoration: "none",
                    }}>{l.label}</a>
                ))}
                <a href="#contact" onClick={() => { setMenuOpen(false); track("cta_click", { location: "nav", cta: "tell_me_about_project" }); }} style={{
                    background: "#1A1612", color: "#F7F4EF",
                    fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    fontSize: 16, padding: "12px 28px", borderRadius: 6, textDecoration: "none", marginTop: 8,
                }}>Tell Me About Your Project</a>
                <AvailabilityDot />
            </div>

            <header style={{
                position: "fixed", inset: "0 0 auto", zIndex: 200,
                background: solid ? "rgba(247,244,239,0.94)" : "transparent",
                backdropFilter: solid ? "blur(20px)" : "none",
                borderBottom: solid ? "1px solid rgba(26,22,18,0.08)" : "none",
                transition: "background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease",
            }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto", padding: "0 32px",
                    height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    {/* Logo — anchor back to top; SVG is decorative */}
                    <a href="#" aria-label="Rishi Jain — back to top" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true" role="presentation" xmlns="http://www.w3.org/2000/svg">
                            <rect width="34" height="34" rx="7" fill="#1A1612" />
                            {/* R — stem + bowl + leg */}
                            <path d="M9 9.5v15" stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" />
                            <path d="M9 9.5h5.5a3.5 3.5 0 0 1 0 7H9" stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.5 16.5L18 24.5" stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" />
                            {/* J — top serif, vertical stem, bottom curve */}
                            <path d="M22 9.5h4" stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" />
                            <path d="M24 9.5v12a3 3 0 0 1-3 3" stroke="#F7F4EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1612", letterSpacing: "-.02em" }}>Rishi Jain</span>
                    </a>

                    {isMobile ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" style={{
                                background: "none", border: "none", color: "#6B6460", fontSize: 22, cursor: "pointer",
                                width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                    <line x1="3" y1="6" x2="17" y2="6" />
                                    <line x1="3" y1="10" x2="17" y2="10" />
                                    <line x1="3" y1="14" x2="17" y2="14" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <nav style={{ display: "flex", gap: 28, alignItems: "center" }}>
                            {NAV_LINKS.map(l => (
                                <a key={l.label} href={l.href}
                                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: hoveredNav === l.label ? "#1A1612" : "#6B6460", textDecoration: "none", transition: "color 0.18s ease" }}
                                    onMouseEnter={() => setHoveredNav(l.label)} onMouseLeave={() => setHoveredNav(null)}
                                >
                                    <span style={{ position: "relative", display: "inline-block" }}>
                                        {l.label}
                                        <span style={{ position: "absolute", bottom: -2, left: 0, width: hoveredNav === l.label ? "100%" : "0%", height: 1, background: "#1A1612", transition: "width 0.2s ease", display: "block" }} />
                                    </span>
                                </a>
                            ))}
                            <span aria-hidden="true" style={{ width: 1, height: 18, background: "rgba(26,22,18,0.12)" }} />
                            <AvailabilityDot small />
                            <a href="#contact" onClick={() => track("cta_click", { location: "nav", cta: "tell_me_about_project" })}
                                style={{ background: "#1A1612", color: "#F7F4EF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, padding: "10px 20px", borderRadius: 6, textDecoration: "none", lineHeight: 1, transition: "background 0.2s ease, transform 0.2s ease" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#2C2620"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; }}
                            >Tell Me About Your Project</a>
                        </nav>
                    )}
                </div>
            </header>
        </>
    );
};
