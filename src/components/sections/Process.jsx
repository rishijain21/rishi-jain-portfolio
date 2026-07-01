import { useIsMobile } from "../../hooks/useIsMobile";
import { PROCESS_STEPS } from "../../data/processSteps";
import { R } from "../ui/R";

export const Process = () => {
    const isMobile = useIsMobile();
    return (
        <section id="process" style={{ background: "#F7F4EF", padding: isMobile ? "56px 20px" : "80px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                <R>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>How working together actually goes</span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,5vw,44px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 12 }}>No black box.<br /><span style={{ fontStyle: "italic", color: "#6B6460" }}>No disappearing act.</span></h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6B6460", marginBottom: 48 }}>This is the same process whether the project is six weeks or six months.</p>
                </R>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {PROCESS_STEPS.map((s, i) => (
                        <R key={s.title} d={i * 0.06}>
                            <div style={{ display: "flex", gap: 20, padding: "20px 0", borderTop: i > 0 ? "1px solid rgba(26,22,18,0.08)" : "none" }}>
                                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 400, color: "#1B4FD8", minWidth: 36, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</div>
                                <div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600, color: "#1A1612", marginBottom: 6 }}>{s.title}</div>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14.5, color: "#6B6460", lineHeight: 1.7, margin: 0, maxWidth: 620 }}>{s.body}</p>
                                </div>
                            </div>
                        </R>
                    ))}
                </div>
            </div>
        </section>
    );
};
