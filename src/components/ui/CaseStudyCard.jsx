import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useInView } from "../../hooks/useInView";
import { R } from "./R";
import { track } from "../../utils/track";

// Tab config is static — defined outside component to avoid re-creation on render.
const AVAILABLE_TABS = ["overview", "video", "screenshots"];
const TAB_CONFIG = {
    overview: { label: "Overview" },
    video: { label: "Demo" },
    screenshots: { label: "Screenshots" },
};

export const CaseStudyCard = ({ project, i }) => {
    const [mediaTab, setMediaTab] = useState("overview");
    const [mediaPanelVisible, setMediaPanelVisible] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const isMobile = useIsMobile();
    const [cardRef, cardVis] = useInView();
    const switchTimeoutRef = useRef(null);

    useEffect(() => {
        if (activeImageIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setActiveImageIndex(null);
            if (e.key === "ArrowRight" && project.screenshots) {
                setActiveImageIndex((prev) => (prev + 1) % project.screenshots.length);
            }
            if (e.key === "ArrowLeft" && project.screenshots) {
                setActiveImageIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeImageIndex, project.screenshots]);

    // Cancel pending tab-switch timeout on unmount.
    useEffect(() => {
        return () => {
            if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
        };
    }, []);

    const switchTab = (tab) => {
        if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
        setMediaPanelVisible(false);
        switchTimeoutRef.current = setTimeout(() => {
            setMediaTab(tab);
            setMediaPanelVisible(true);
            switchTimeoutRef.current = null;
        }, 80);
    };

    return (
        <R d={i * 0.08}>
            <div style={{ background: "#FFFFFF", border: project.flagship ? "1px solid rgba(27,79,216,0.25)" : "1px solid rgba(26,22,18,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: project.flagship ? "0 6px 28px rgba(27,79,216,0.10)" : "0 2px 16px rgba(26,22,18,0.05)", marginBottom: 24, transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,22,18,0.18)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,22,18,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = project.flagship ? "rgba(27,79,216,0.25)" : "rgba(26,22,18,0.08)"; e.currentTarget.style.boxShadow = project.flagship ? "0 6px 28px rgba(27,79,216,0.10)" : "0 2px 16px rgba(26,22,18,0.05)"; e.currentTarget.style.transform = "none"; }}
            >
                {project.flagship && (
                    <div style={{ background: "#1B4FD8", padding: "7px 28px", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#F7F4EF" }}>
                        Built and still run by Rishi
                    </div>
                )}

                {/* P1.15 — Stat pill always visible. Desktop: inline-flex beside title. Mobile: smaller pill below title. */}
                <div style={{ padding: isMobile ? "18px 20px" : "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)", display: "flex", flexWrap: "wrap", gap: 12, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between" }}>
                    <div>
                        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: project.accent, display: "block", marginBottom: 6 }}>{project.type}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(20px,4vw,28px)", fontWeight: 500, color: "#1A1612", letterSpacing: "-0.01em", margin: 0 }}>{project.name}</h3>
                            {project.url && (
                                <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer"
                                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: project.accent, background: `${project.accent}10`, border: `1px solid ${project.accent}28`, borderRadius: 100, padding: "4px 10px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "background 0.15s ease", letterSpacing: "normal" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = `${project.accent}20`; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = `${project.accent}10`; }}
                                >
                                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10 14a3.5 3.5 0 0 0 5 0l4-4a3.5 3.5 0 0 0-5-5l-1 1M14 10a3.5 3.5 0 0 0-5 0l-4 4a3.5 3.5 0 0 0 5 5l1-1" /></svg>
                                    {project.url}
                                </a>
                            )}
                        </div>
                        {/* Mobile stat pill — rendered under the title, smaller treatment */}
                        {isMobile && (
                            <div style={{ marginTop: 10, background: `${project.accent}12`, border: `1px solid ${project.accent}25`, borderRadius: 6, padding: "5px 10px", display: "inline-block" }}>
                                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: project.accent }}>{project.stat}</span>
                            </div>
                        )}
                    </div>
                    {/* Desktop stat pill */}
                    {!isMobile && (
                        <div style={{ background: `${project.accent}12`, border: `1px solid ${project.accent}25`, borderRadius: 8, padding: "8px 16px" }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: project.accent }}>{project.stat}</span>
                        </div>
                    )}
                </div>

                <div className="hide-scrollbar" style={{ borderBottom: "1px solid rgba(26,22,18,0.06)", background: "rgba(26,22,18,0.018)" }}>
                    <div
                        role="tablist"
                        aria-label={`${project.name} case study sections`}
                        className="hide-scrollbar"
                        style={{ display: "flex", padding: isMobile ? "0 20px" : "0 28px", overflowX: "auto", whiteSpace: "nowrap", alignItems: "center", scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {AVAILABLE_TABS.map(tab => (
                            <button
                                key={tab}
                                role="tab"
                                aria-label={`Show ${TAB_CONFIG[tab].label} for ${project.name}`}
                                aria-selected={mediaTab === tab}
                                onClick={() => switchTab(tab)}
                                style={{
                                    fontFamily: "'Inter', sans-serif", fontSize: 12,
                                    fontWeight: mediaTab === tab ? 600 : 500,
                                    color: mediaTab === tab ? project.accent : "#857F79",
                                    background: mediaTab === tab ? `${project.accent}0f` : "none",
                                    border: mediaTab === tab ? `1px solid ${project.accent}25` : "1px solid transparent",
                                    padding: "6px 14px", marginRight: 8, marginTop: 10, marginBottom: 10,
                                    borderRadius: 100, cursor: "pointer", transition: "color 0.15s ease, background 0.15s ease",
                                    textTransform: "capitalize", flexShrink: 0, whiteSpace: "nowrap",
                                }}
                            >
                                {TAB_CONFIG[tab].label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: isMobile ? "18px 20px" : "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
                    <div style={{ opacity: mediaPanelVisible ? 1 : 0, transform: mediaPanelVisible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.16s ease, transform 0.16s ease" }}>
                        {mediaTab === "overview" && (
                            <div style={{ background: "#F7F4EF", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(26,22,18,0.08)" }}>
                                <div style={{ background: "#EDE9E3", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(26,22,18,0.10)" }}>
                                    {["#FF605C", "#FFBD44", "#00CA4E"].map(c => (<div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />))}
                                    <span style={{ marginLeft: 10, fontSize: 11, color: "#857F79", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "normal" }}>{project.url}</span>
                                </div>
                                <div style={{ padding: 12 }}>
                                    <div ref={cardRef} style={{ opacity: cardVis ? 1 : 0, transform: cardVis ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s" }}>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                            {project.metrics.map((m) => (
                                                <div key={m.label} style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(26,22,18,0.06)", flex: isMobile ? "1 1 calc(50% - 8px)" : "0 1 auto", minWidth: isMobile ? "calc(50% - 8px)" : 120, maxWidth: isMobile ? "100%" : 180 }}>
                                                    <div style={{ fontSize: 10, color: "#857F79", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{m.label}</div>
                                                    <div style={{ fontSize: 15, fontWeight: 700, color: project.accent, fontFamily: "'Inter', sans-serif" }}>{m.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 52 }}>
                                        {project.bars.map((h, j) => (<div key={j} style={{ flex: 1, background: project.accent, opacity: 0.15 + h * 0.5, borderRadius: "3px 3px 0 0", height: `${h * 52}px` }} />))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {mediaTab === "video" && project.videoUrl && (
                            <div style={{ background: "#F7F4EF", borderRadius: 12, border: "1px solid rgba(26,22,18,0.10)", overflow: "hidden", position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                                <div style={{ background: "#EDE9E3", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(26,22,18,0.10)" }}>
                                    {["#FF605C", "#FFBD44", "#00CA4E"].map(c => (<div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />))}
                                    <span style={{ marginLeft: 10, fontSize: 11, color: "#857F79", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "normal" }}>{project.url || "demo-preview.app"}</span>
                                </div>
                                <video
                                    src={project.videoUrl}
                                    controls
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{ width: "100%", aspectRatio: "16/9", display: "block", background: "#1A1612" }}
                                />
                            </div>
                        )}
                        {mediaTab === "video" && !project.videoUrl && (project.loomUrl || project.embedUrl) && (
                            <div style={{ background: "#F7F4EF", borderRadius: 12, border: "1px solid rgba(26,22,18,0.08)", overflow: "hidden" }}>
                                <iframe src={project.loomUrl || project.embedUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={`${project.name} demo video`} style={{ width: "100%", aspectRatio: "16/9", minHeight: 360, borderRadius: 8, display: "block" }} />
                            </div>
                        )}
                        {mediaTab === "video" && !project.videoUrl && !project.loomUrl && !project.embedUrl && (
                            <div style={{ background: "#F7F4EF", borderRadius: 12, border: "1px solid rgba(26,22,18,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 32px", gap: 16 }}>
                                <svg width="40" height="40" fill="none" stroke="#857F79" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" fill="#857F79" stroke="none" /></svg>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>Demo video coming soon. <a href="#contact" style={{ color: "#1B4FD8", textDecoration: "underline" }}>Request a walkthrough →</a></p>
                            </div>
                        )}

                        {mediaTab === "screenshots" && project.screenshots && project.screenshots.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                                {project.screenshots.map((item, j) => {
                                    const ss = typeof item === "string" ? { src: item, caption: null, type: "desktop" } : item;
                                    const isMob = ss.type === "mobile";
                                    return (
                                        <div
                                            key={j}
                                            onClick={() => setActiveImageIndex(j)}
                                            style={{
                                                cursor: "pointer",
                                                background: "#FFFFFF",
                                                borderRadius: 12,
                                                border: "1px solid rgba(26,22,18,0.12)",
                                                overflow: "hidden",
                                                boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                                                transition: "transform 0.2s ease, boxShadow 0.2s ease",
                                                display: "flex",
                                                flexDirection: "column",
                                                position: "relative"
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = "translateY(-4px)";
                                                e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.12)";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.04)";
                                            }}
                                        >
                                            {isMob ? (
                                                <div style={{ background: "#1E1E1E", padding: "8px 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
                                                    <div style={{ width: 44, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
                                                </div>
                                            ) : (
                                                <div style={{ background: "#EDE9E3", padding: "7px 12px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(26,22,18,0.08)", flexShrink: 0 }}>
                                                    {["#FF605C", "#FFBD44", "#00CA4E"].map(c => (<div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />))}
                                                </div>
                                            )}
                                            <div style={{ position: "relative", overflow: "hidden", height: 360, flexShrink: 0 }}>
                                                <img src={ss.src} alt={`${project.name} screenshot ${j + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} loading="lazy" />
                                                <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(14,17,23,0.85)", color: "#FFFFFF", padding: "5px 10px", borderRadius: 20, fontSize: 11, fontFamily: "'Inter', sans-serif", fontWeight: 500, backdropFilter: "blur(6px)", display: "flex", alignItems: "center", gap: 5, boxShadow: "0 4px 10px rgba(0,0,0,0.2)" }}>
                                                    <span>🔍</span> Expand
                                                </div>
                                            </div>
                                            {ss.caption && (
                                                <div style={{ padding: "12px 14px", background: "#FBF9F5", borderTop: "1px solid rgba(26,22,18,0.06)", fontSize: 12, fontFamily: "'Inter', sans-serif", color: "#5A534E", fontWeight: 500, lineHeight: 1.4, flex: 1, display: "flex", alignItems: "center" }}>
                                                    {ss.caption}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {mediaTab === "screenshots" && project.screenshots && project.screenshots.length === 0 && (
                            <div style={{ background: "#F7F4EF", borderRadius: 12, border: "1px solid rgba(26,22,18,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 32px", gap: 16 }}>
                                <svg width="40" height="40" fill="none" stroke="#857F79" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21,15 16,10 5,21" /></svg>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>Screenshots coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 0, padding: isMobile ? "18px 20px" : "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
                    {[{ label: "The Problem", content: project.problem }, { label: "The Decision", content: project.solution }, { label: "Key Outcomes", isOutcomes: true, outcomes: project.outcomes }].map((col, j) => (
                        <div key={col.label} style={{ paddingRight: isMobile ? 0 : (j < 2 ? 28 : 0), paddingLeft: isMobile ? 0 : (j > 0 ? 28 : 0), borderRight: isMobile ? "none" : (j < 2 ? "1px solid rgba(26,22,18,0.10)" : "none"), borderBottom: isMobile && j < 2 ? "1px solid rgba(26,22,18,0.10)" : "none", paddingBottom: isMobile && j < 2 ? 20 : 0, paddingTop: isMobile && j > 0 ? 20 : 0 }}>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#857F79", marginBottom: 12 }}>{col.label}</div>
                            {col.isOutcomes
                                ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{col.outcomes.map((o) => (<div key={o} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: project.accent, marginTop: 6, flexShrink: 0 }} /><span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", lineHeight: 1.6 }}>{o}</span></div>))}</div>
                                : <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", lineHeight: 1.68, margin: 0 }}>{col.content}</p>
                            }
                        </div>
                    ))}
                </div>

                {project.lesson && (
                    <div style={{ padding: isMobile ? "16px 20px" : "16px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)", background: "rgba(26,22,18,0.015)" }}>
                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#857F79", marginBottom: 8 }}>Lesson Learned</div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#6B6460", lineHeight: 1.68, margin: 0, fontStyle: "italic" }}>{project.lesson}</p>
                    </div>
                )}

                <div style={{ padding: isMobile ? "14px 20px" : "14px 28px", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {project.stack.map(t => (<span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: "#6B6460", background: "rgba(26,22,18,0.05)", border: "1px solid rgba(26,22,18,0.1)", padding: "3px 9px", borderRadius: 4, letterSpacing: "normal" }}>{t}</span>))}
                    </div>
                    {project.url && (
                        <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer"
                            onClick={() => track("case_study_click", { project: project.name })}
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: project.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, transition: "gap 0.15s ease" }}
                            onMouseEnter={e => { e.currentTarget.style.gap = "8px"; e.currentTarget.style.textDecoration = "underline"; e.currentTarget.style.textUnderlineOffset = "3px"; }}
                            onMouseLeave={e => { e.currentTarget.style.gap = "5px"; e.currentTarget.style.textDecoration = "none"; }}
                        >View live site →</a>
                    )}
                </div>
            </div>

            {activeImageIndex !== null && project.screenshots && (
                <div
                    onClick={() => setActiveImageIndex(null)}
                    style={{
                        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                        background: "rgba(14, 17, 23, 0.90)", backdropFilter: "blur(10px)",
                        zIndex: 99999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        padding: 24, cursor: "default"
                    }}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex(null); }}
                        style={{ position: "absolute", top: 20, right: 24, background: "rgba(255,255,255,0.12)", border: "none", color: "#FFFFFF", width: 40, height: 40, borderRadius: "50%", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >×</button>
                    {project.screenshots.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length); }}
                                style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", color: "#FFFFFF", width: 48, height: 48, borderRadius: "50%", fontSize: 20, cursor: "pointer" }}
                            >←</button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev + 1) % project.screenshots.length); }}
                                style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", color: "#FFFFFF", width: 48, height: 48, borderRadius: "50%", fontSize: 20, cursor: "pointer" }}
                            >→</button>
                        </>
                    )}
                    {(() => {
                        const currentModalItem = typeof project.screenshots[activeImageIndex] === "string" ? { src: project.screenshots[activeImageIndex], type: "desktop", caption: null } : project.screenshots[activeImageIndex];
                        const isMobModal = currentModalItem.type === "mobile";
                        return (
                            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: isMobModal ? 420 : 1100, width: isMobModal ? "90vw" : "92vw", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <div style={{ width: "100%", background: "#FFFFFF", borderRadius: isMobModal ? 36 : 14, border: isMobModal ? "10px solid #1E1E1E" : "1px solid rgba(255,255,255,0.15)", boxShadow: "0 25px 80px rgba(0,0,0,0.7)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                                    {isMobModal ? (
                                        <div style={{ background: "#1E1E1E", padding: "12px 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
                                            <div style={{ width: 56, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.4)" }} />
                                        </div>
                                    ) : (
                                        <div style={{ background: "#EDE9E3", padding: "10px 16px", display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
                                            {["#FF605C", "#FFBD44", "#00CA4E"].map(c => (<div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />))}
                                        </div>
                                    )}
                                    <div className="hide-scrollbar" style={{ overflowY: "auto", maxHeight: isMobModal ? "72vh" : "76vh" }}>
                                        <img src={currentModalItem.src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
                                    </div>
                                </div>
                                <div style={{ marginTop: 16, color: "#FFFFFF", fontFamily: "'Inter', sans-serif", fontSize: 13, background: "rgba(255,255,255,0.15)", padding: "6px 18px", borderRadius: 20, textAlign: "center", backdropFilter: "blur(6px)" }}>
                                    {activeImageIndex + 1} / {project.screenshots.length}
                                    {currentModalItem.caption && <span style={{ marginLeft: 8, color: "#E0DDD9" }}>— {currentModalItem.caption}</span>}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </R>
    );
};
