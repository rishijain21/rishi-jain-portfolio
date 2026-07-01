import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { PROJECTS } from "../../data/projects";
import { R } from "../ui/R";
import { CaseStudyCard } from "../ui/CaseStudyCard";

export const Work = () => {
    const isMobile = useIsMobile();
    const sectionPadding = isMobile ? "56px 20px 72px" : "72px 32px 100px";
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredProjects = activeFilter === "all" ? PROJECTS
        : activeFilter === "saas" ? PROJECTS.filter(p => p.category === "saas")
            : PROJECTS.filter(p => p.category === "web");

    return (
        <section id="work" style={{ background: "#FFFFFF", padding: sectionPadding, borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <R>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>Proof, not promises</span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,5vw,50px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 16 }}>Four businesses, four industries.<br /><span style={{ fontStyle: "italic", color: "#6B6460" }}>The same result.</span></h2>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 15 : 17, color: "#6B6460", maxWidth: isMobile ? "100%" : 580, lineHeight: 1.72, marginBottom: isMobile ? 40 : 60 }}>Each one replaced disconnected manual work with a single system the business now runs on daily. Here's exactly how, and what it took.</p>
                </R>
                <R d={0.05}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap" }}>
                        {[{ key: "all", label: "All Projects" }, { key: "saas", label: "SaaS & Apps" }, { key: "web", label: "Business Websites" }].map(f => (
                            <button key={f.key} onClick={() => setActiveFilter(f.key)} style={{
                                fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: activeFilter === f.key ? 600 : 500,
                                color: activeFilter === f.key ? "#F7F4EF" : "#6B6460",
                                background: activeFilter === f.key ? "#1A1612" : "transparent",
                                border: activeFilter === f.key ? "1px solid #1A1612" : "1px solid rgba(26,22,18,0.2)",
                                padding: "8px 18px", borderRadius: 100, cursor: "pointer", transition: "all 0.18s ease",
                            }}
                                onMouseEnter={e => { if (activeFilter !== f.key) { e.currentTarget.style.borderColor = "rgba(26,22,18,0.5)"; e.currentTarget.style.color = "#1A1612"; } }}
                                onMouseLeave={e => { if (activeFilter !== f.key) { e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; e.currentTarget.style.color = "#6B6460"; } }}
                            >{f.label}</button>
                        ))}
                    </div>
                </R>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {filteredProjects.map((p, i) => <CaseStudyCard key={p.name} project={p} i={i} />)}
                </div>
            </div>
        </section>
    );
};
