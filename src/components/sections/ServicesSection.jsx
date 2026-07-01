import { useIsMobile } from "../../hooks/useIsMobile";
import { SERVICES } from "../../data/services";
import { R } from "../ui/R";
import { track } from "../../utils/track";

export const ServicesSection = () => {
    const isMobile = useIsMobile();
    return (
        <section id="services" style={{ background: "#FFFFFF", padding: isMobile ? "56px 20px" : "84px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <R>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>How I can help</span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,5vw,44px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 16 }}>Pick the problem.<br /><span style={{ fontStyle: "italic", color: "#6B6460" }}>Not the technology.</span></h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6B6460", maxWidth: 480, lineHeight: 1.72, marginBottom: 48 }}>Every engagement starts with what's broken or missing in your business — the tools are just how I fix it.</p>
                </R>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                    {SERVICES.map((s, i) => (
                        <R key={s.name} d={i * 0.05}>
                            <div
                                style={{ background: "#F7F4EF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 14, padding: 24, height: "100%", display: "flex", flexDirection: "column", gap: 14, transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,22,18,0.07)"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,22,18,0.08)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: "#1A1612", margin: 0 }}>{s.name}</h3>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#6B6460", lineHeight: 1.68, margin: 0, flex: 1 }}>{s.body}</p>
                                <a href="#contact" onClick={() => track("service_click", { service: s.name })} style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, fontWeight: 600, color: "#1B4FD8", textDecoration: "none", minHeight: 24, display: "inline-flex", alignItems: "center" }}>Talk Through This →</a>
                            </div>
                        </R>
                    ))}
                </div>
            </div>
        </section>
    );
};
