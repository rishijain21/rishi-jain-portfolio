import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { GITHUB_PROFILE_READY } from "../../config/site";

export const Footer = () => {
    const [hoveredLink, setHoveredLink] = useState(null);
    const isMobile = useIsMobile();
    return (
        <footer style={{ background: "#1A1612", borderTop: "1px solid rgba(247,244,239,0.06)", padding: isMobile ? "32px 20px" : "36px 32px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: isMobile ? 24 : 16, flexDirection: isMobile ? "column" : "row", textAlign: isMobile ? "center" : "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Rishi Jain" role="img">
                            <rect width="28" height="28" rx="7" fill="rgba(247,244,239,0.12)" />
                            <path d="M8.5 8h5.5c1.7 0 3 1.3 3 3s-1.3 3-3 3H8.5V8z M8.5 14l4.5 6" stroke="#F7F4EF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        <div>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(247,244,239,1)", marginBottom: 6, lineHeight: 1.6 }}>Every message is read personally. No assistants, no automated replies.</p>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(247,244,239,0.58)" }}>© 2026 Rishi Jain · Technology Partner for founders and growing businesses</span>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(247,244,239,0.58)", marginTop: 4 }}>Sholapur, Maharashtra · India Standard Time</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: isMobile ? 8 : 28, flexWrap: "wrap", justifyContent: "center" }}>
                        {[
                            { label: "LinkedIn", href: "https://www.linkedin.com/in/rishi-jainn/" },
                            // P1.5 / P0.5 — GitHub link only shown when GITHUB_PROFILE_READY is true
                            GITHUB_PROFILE_READY ? { label: "GitHub", href: "https://github.com/rishijain21" } : null,
                            { label: "Email", href: "mailto:jainnrishii21@gmail.com" },
                        ].filter(Boolean).map(l => {
                            const isExternal = l.href.startsWith("http");
                            return (
                                <a key={l.label} href={l.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}
                                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: hoveredLink === l.label ? "#F7F4EF" : "rgba(247,244,239,0.65)", textDecoration: "none", transition: "color 0.18s ease", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: isMobile ? "0 8px" : 0 }}
                                    onMouseEnter={() => setHoveredLink(l.label)}
                                    onMouseLeave={() => setHoveredLink(null)}
                                >{l.label}</a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
};
