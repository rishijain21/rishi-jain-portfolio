import { useIsMobile } from "../../hooks/useIsMobile";
import { R } from "../ui/R";
import { GITHUB_PROFILE_READY } from "../../config/site";

const CURRENT_STATUS_ITEMS = [
    { dot: "#1A1612", text: "Specialist Programmer · Infosys (fintech)" },
    { dot: "#1A1612", text: "Founder & sole engineer · Sovva" },
    { dot: "rgba(26,22,18,0.35)", text: "Taking 1 freelance project at a time" },
    { dot: "rgba(26,22,18,0.25)", text: "Sholapur, Maharashtra · responds within 4 hours, weekdays" },
];

export const AboutSection = () => {
    const isMobile = useIsMobile();
    const sectionPadding = isMobile ? "64px 20px" : "96px 32px";
    return (
        <section id="about" style={{ background: "#FFFFFF", padding: sectionPadding, borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.6fr", gap: isMobile ? 40 : 80, alignItems: "start" }}>

                    <R>
                        <div>
                            <div style={{ width: "100%", maxWidth: isMobile ? "100%" : 320, aspectRatio: "4/5", borderRadius: 16, background: "rgba(26,22,18,0.04)", border: "1px solid rgba(26,22,18,0.08)", overflow: "hidden", marginBottom: 28, position: "relative" }}>
                                <img src="/rishi-jain.png" alt="Rishi Jain" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
                            </div>
                            <div style={{ background: "#F7F4EF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 12, padding: "20px 22px" }}>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#857F79", marginBottom: 14 }}>Currently</div>
                                {CURRENT_STATUS_ITEMS.map((item, i) => (
                                    <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460" }}>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </R>

                    <div>
                        <R>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>How I think about this work</span>
                            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,5vw,44px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 28 }}>
                                I build like it's my own business.<br />
                                <span style={{ fontStyle: "italic", color: "#6B6460" }}>Often, it is.</span>
                            </h2>
                        </R>
                        <R d={0.08}>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B6460", lineHeight: 1.78, marginBottom: 22, maxWidth: 580 }}>
                                I split my time between production fintech work, where mistakes have real financial consequences, and running my own SaaS company, where every mistake is mine to absorb. Most developers have only ever lived on one side of that line. I've spent years on both, and it changes what I notice — what's worth automating, what's worth simplifying, and what's not worth touching at all.
                            </p>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B6460", lineHeight: 1.78, marginBottom: 22, maxWidth: 580 }}>
                                I take one project at a time. Not because I have to — because an agency splitting your project across five accounts can't give you what one senior person, fully focused, can. You'll talk to the person actually writing the code, every time, start to finish.
                            </p>
                            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B6460", lineHeight: 1.78, marginBottom: 36, maxWidth: 580 }}>
                                I'd rather show you something working than tell you I'm good at building it. That's most of what you'll find on this page.
                            </p>
                        </R>
                        <R d={0.14}>
                            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                                <a href="https://www.linkedin.com/in/rishi-jainn/" target="_blank" rel="noopener noreferrer"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid rgba(26,22,18,0.2)", color: "#6B6460", padding: "10px 18px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.2s ease, border-color 0.2s ease" }}
                                    onMouseEnter={e => { e.currentTarget.style.color = "#1A1612"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.5)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = "#6B6460"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 12.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v6.47z" /></svg>
                                    LinkedIn
                                </a>
                                {GITHUB_PROFILE_READY ? (
                                    <a href="https://github.com/rishijain21" target="_blank" rel="noopener noreferrer"
                                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid rgba(26,22,18,0.2)", color: "#6B6460", padding: "10px 18px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.2s ease, border-color 0.2s ease" }}
                                        onMouseEnter={e => { e.currentTarget.style.color = "#1A1612"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.5)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = "#6B6460"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.01-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.22.69.83.57C20.57 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0z" /></svg>
                                        GitHub
                                    </a>
                                ) : (
                                    <a href="#work"
                                        style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: "1px solid rgba(26,22,18,0.2)", color: "#6B6460", padding: "10px 18px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.2s ease, border-color 0.2s ease" }}
                                        onMouseEnter={e => { e.currentTarget.style.color = "#1A1612"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.5)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = "#6B6460"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; }}
                                    >
                                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        View my work
                                    </a>
                                )}
                            </div>
                        </R>
                    </div>
                </div>
            </div>
        </section>
    );
};
