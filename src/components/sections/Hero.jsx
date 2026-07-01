import { useInView } from "../../hooks/useInView";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useCounter } from "../../hooks/useCounter";
import { SITE_CONFIG } from "../../config/site";
import { R } from "../ui/R";
import { AvailabilityDot } from "../ui/AvailabilityDot";
import { HeroProofPanel } from "../ui/HeroProofPanel";
import { track } from "../../utils/track";

export const Hero = () => {
    const [ref, vis] = useInView({ threshold: 0.5 });
    const isMobile = useIsMobile();
    const y20 = useCounter(SITE_CONFIG.baseProjectsCount, 1600, vis);
    const y6 = useCounter(SITE_CONFIG.yearsExperience, 1400, vis);
    // P1.11 — Third stat is always the static value 1 (one company built and run).
    // The useCounter call was removed because the animated value is never rendered
    // (the render always outputs the literal 1 for i===2). No rAF wasted.

    return (
        <section className="grain-overlay" style={{
            minHeight: "min(100vh, 820px)", display: "flex", flexDirection: "column", justifyContent: "center",
            padding: isMobile ? "100px 20px 60px" : "88px 32px clamp(48px, 8vw, 96px)",
            background: "#F7F4EF", position: "relative", overflow: "hidden",
        }}>
            <h1 style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 }}>
                Rishi Jain — Technology Partner for founders and growing businesses. I build the systems your business actually runs on, drawing on both production fintech experience and running my own SaaS company.
            </h1>

            <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : "clamp(32px, 4vw, 64px)", alignItems: "center" }}>
                <div>
                    <R>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.22)", borderRadius: 100, padding: "6px 16px", marginBottom: 24 }}>
                            <AvailabilityDot />
                        </div>
                    </R>

                    <R d={0.08}>
                        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px,8vw,68px)", fontWeight: 400, color: "#1A1612", lineHeight: 1.08, letterSpacing: "-0.02em", margin: "0 0 28px" }}>
                            I build the systems<br />
                            your business<br />
                            <span style={{ fontStyle: "italic", color: "#1B4FD8" }}>actually runs on.</span>
                        </h2>
                    </R>

                    <R d={0.16}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 17, color: "#6B6460", lineHeight: 1.72, maxWidth: isMobile ? "100%" : 520, margin: "0 0 12px" }}>
                            I've shipped production software where mistakes cost real money, and I've built and still run my own SaaS company, where every mistake is mine. That combination is rare — and it's why founders and small business owners trust me with the systems they can't afford to get wrong.
                        </p>
                    </R>

                    <R d={0.19}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", lineHeight: 1.6, maxWidth: isMobile ? "100%" : 480, margin: "0 0 36px" }}>
                            Six years, two kinds of risk, one person who owns it end to end.
                        </p>
                    </R>

                    <R d={0.22}>
                        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28, position: "relative", zIndex: 2 }}>
                            <a href="#contact" onClick={() => track("cta_click", { location: "hero", cta: "tell_me_about_project" })}
                                style={{ background: "#1A1612", color: "#F7F4EF", padding: "15px 32px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 2px 8px rgba(26,22,18,0.15)" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#2C2620"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(26,22,18,0.22)"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,22,18,0.15)"; }}
                                onMouseDown={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                                onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                            >
                                Tell Me About Your Project
                                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </a>
                            <a href="#work"
                                style={{ background: "transparent", color: "#6B6460", border: "1px solid rgba(26,22,18,0.2)", padding: "15px 32px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 15, textDecoration: "none", transition: "color 0.2s ease, border-color 0.2s ease, background 0.2s ease" }}
                                onMouseEnter={e => { e.currentTarget.style.color = "#1A1612"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.5)"; e.currentTarget.style.background = "rgba(26,22,18,0.04)"; }}
                                onMouseLeave={e => { e.currentTarget.style.color = "#6B6460"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; e.currentTarget.style.background = "transparent"; }}
                            >See What I've Built</a>
                        </div>
                    </R>

                    <R d={0.28}>
                        <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? 16 : 40, paddingTop: 32, borderTop: "1px solid rgba(26,22,18,0.1)", position: "relative", zIndex: 2 }}>
                            {[
                                { n: y20, suf: "+", label: "Systems built and still running" },
                                { n: y6, suf: "+", label: "Years carrying real production risk" },
                                { n: 1, suf: "", label: "Company I've built and run myself" },
                            ].map((s, i) => (
                                <div key={i} style={{ minWidth: 80 }}>
                                    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 34, fontWeight: 400, color: "#1A1612", letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.n}{s.suf}</div>
                                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </R>
                </div>

                <R d={0.12} className="hero-visual-r">
                    <div style={{ padding: "8px 4px 4px", paddingTop: 16 }}>
                        <HeroProofPanel />
                    </div>
                </R>
            </div>
        </section>
    );
};
