import { useIsMobile } from "../../hooks/useIsMobile";
import { TESTIMONIALS } from "../../data/testimonials";
import { TESTIMONIALS_READY } from "../../config/site";
import { R } from "../ui/R";

export const Testimonials = () => {
    const isMobile = useIsMobile();
    const hasReal = TESTIMONIALS_READY && TESTIMONIALS.length >= 1;
    return (
        <section id="testimonials" style={{ background: "#F7F4EF", padding: isMobile ? "56px 20px" : "80px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <R>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>Don't take my word for it</span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,5vw,40px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 32 }}>What it's actually like to work together.</h2>
                </R>
                {hasReal ? (
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : `repeat(${Math.min(TESTIMONIALS.length, 3)}, 1fr)`, gap: 16 }}>
                        {TESTIMONIALS.map((t, i) => (
                            <R key={t.name} d={i * 0.05}>
                                <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 14, padding: 24 }}>
                                    <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontSize: 16, color: "#1A1612", lineHeight: 1.6, margin: "0 0 16px" }}>"{t.quote}"</p>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1A1612" }}>{t.name}</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#857F79" }}>{t.role}</div>
                                </div>
                            </R>
                        ))}
                    </div>
                ) : (
                    <R d={0.06}>
                        <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 14, padding: 28, display: "flex", gap: 18, alignItems: "flex-start" }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(27,79,216,0.08)", border: "1px solid rgba(27,79,216,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <svg width="16" height="16" fill="none" stroke="#1B4FD8" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M7 8h10M7 12h6M5 20l3.5-3.5H19a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2v2z" /></svg>
                            </div>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#6B6460", lineHeight: 1.72, margin: 0 }}>
                                Testimonials are on their way — in the meantime, every metric above is real and tied to a named, live project. Happy to connect you directly with a past client if that's useful.
                            </p>
                        </div>
                    </R>
                )}
            </div>
        </section>
    );
};
