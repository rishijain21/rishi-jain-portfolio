import { useState, useEffect, useRef } from "react";

/**
 * Static proof-panel data lives outside the component so it is never
 * re-created on render. The data schema here is intentionally different
 * from the Work section projects — hero panel shows summary metrics,
 * not full case-study detail.
 */
const HERO_PROJECTS = [
    {
        name: "Sovva", type: "Meal Subscription · SaaS", url: "sovva.io",
        accent: "#1B4FD8",
        metric1Label: "Daily orders automated", metric1Value: "100%",
        metric2Label: "Manual reconciliation", metric2Value: "Eliminated",
        metric3Label: "Modules built", metric3Value: "5",
        outcome: "Subscription billing, daily order generation, CRM, and invoicing — one system, zero manual work. Built and still run by Rishi.",
        stack: [".NET 8", "Angular", "PostgreSQL", "Stripe"],
        liveUrl: "https://sovva.io",
        thumbnail: null,
    },
    {
        name: "Parsec Power Engineers", type: "Corporate · Energy · B2B", url: "parsecpower.in",
        accent: "#92400E",
        metric1Label: "Years in business", metric1Value: "30+",
        metric2Label: "Digital presence before", metric2Value: "Zero",
        metric3Label: "Delivered by Rishi", metric3Value: "End-to-end",
        outcome: "Full corporate site, solar savings calculator, SEO-optimised copy — a 30-year company's first digital presence.",
        stack: ["WordPress", "Custom JS", "SEO", "Copywriting"],
        liveUrl: "https://parsecpower.in",
        thumbnail: null,
    },
    {
        name: "Mechanical Bazaar", type: "B2B · Industrial Procurement", url: "mechanicalbazaar.in",
        accent: "#065F46",
        metric1Label: "Product categories", metric1Value: "8",
        metric2Label: "Quote channels", metric2Value: "2",
        metric3Label: "Phone calls to get a quote", metric3Value: "Zero",
        outcome: "A B2B catalogue and quote flow that lets bulk buyers evaluate and enquire without a phone call.",
        stack: ["HTML5", "CSS3", "Vanilla JS"],
        liveUrl: "https://mechanicalbazaar.in",
        thumbnail: null,
    },
    {
        name: "Smile Your Confidence", type: "Healthcare · Dental · Booking", url: "smileyourconfidence.in",
        accent: "#0891B2",
        metric1Label: "Treatments listed", metric1Value: "12+",
        metric2Label: "Booking flow", metric2Value: "Live",
        metric3Label: "Solo delivery", metric3Value: "End-to-end",
        outcome: "A specialist dental clinic in Jaipur — patients can now find, evaluate, and book appointments entirely online.",
        stack: ["WordPress", "Elementor", "Booking Plugin", "SEO"],
        liveUrl: "https://smileyourconfidence.in",
        thumbnail: null,
    },
];

export const HeroProofPanel = () => {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);
    // Ref tracks pending timeout so we can cancel it on unmount or rapid clicks.
    const timeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const switchTo = (idx) => {
        if (idx === active) return;
        setFading(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setActive(idx);
            setFading(false);
            timeoutRef.current = null;
        }, 200);
    };

    const p = HERO_PROJECTS[active];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.10)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(26,22,18,0.08), 0 1px 4px rgba(26,22,18,0.04)" }}>
                <div style={{ background: "#F7F4EF", borderBottom: "1px solid rgba(26,22,18,0.08)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                    {["#FF605C", "#FFBD44", "#00CA4E"].map(c => (
                        <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                    ))}
                    <span style={{ marginLeft: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#857F79" }}>rishi.jain/work</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                        {HERO_PROJECTS.map((proj, idx) => (
                            <button
                                key={proj.name}
                                onClick={() => switchTo(idx)}
                                aria-label={`View project ${idx + 1}: ${proj.name}`}
                                style={{ width: 8, height: 8, borderRadius: "50%", background: idx === active ? p.accent : "rgba(26,22,18,0.15)", border: "none", cursor: "pointer", transition: "background 0.2s ease", padding: 0 }}
                            />
                        ))}
                    </div>
                </div>

                {p.thumbnail && (
                    <img src={p.thumbnail} alt={`${p.name} screenshot`} style={{ width: "100%", display: "block", borderBottom: "1px solid rgba(26,22,18,0.06)" }} loading="lazy" />
                )}

                <div style={{ padding: "20px 20px 20px", opacity: fading ? 0 : 1, transform: fading ? "translateY(6px)" : "none", transition: "opacity 0.2s ease, transform 0.2s ease" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                        <div>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: p.accent, marginBottom: 4 }}>{p.type}</div>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 500, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{p.name}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${p.accent}12`, border: `1px solid ${p.accent}28`, borderRadius: 100, padding: "3px 10px" }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A" }} />
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#16A34A", fontWeight: 600 }}>LIVE</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {[
                            { label: p.metric1Label, value: p.metric1Value },
                            { label: p.metric2Label, value: p.metric2Value },
                            { label: p.metric3Label, value: p.metric3Value },
                        ].map((m) => (
                            <div key={m.label} style={{ background: "#F7F4EF", border: "1px solid rgba(26,22,18,0.07)", borderRadius: 8, padding: "10px 10px 8px" }}>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700, color: p.accent, lineHeight: 1, marginBottom: 5 }}>{m.value}</div>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#857F79", lineHeight: 1.3, fontWeight: 500 }}>{m.label}</div>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12.5, color: "#6B6460", lineHeight: 1.65, margin: "0 0 14px", borderLeft: `2px solid ${p.accent}`, paddingLeft: 10 }}>{p.outcome}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                        {p.stack.map(t => (
                            <span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, color: "#6B6460", background: "rgba(26,22,18,0.05)", border: "1px solid rgba(26,22,18,0.10)", padding: "2px 8px", borderRadius: 4 }}>{t}</span>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(26,22,18,0.06)", paddingTop: 12 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#857F79" }}>→ {p.url}</span>
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: p.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "gap 0.15s ease" }}
                            onMouseEnter={e => e.currentTarget.style.gap = "7px"}
                            onMouseLeave={e => e.currentTarget.style.gap = "4px"}
                        >
                            View live site
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 4px 0", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#857F79" }}>{active + 1} of {HERO_PROJECTS.length} live projects shown</span>
                <span style={{ color: "rgba(26,22,18,0.15)", fontSize: 12 }}>·</span>
                <a href="#work" style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#6B6460", textDecoration: "none", fontWeight: 500 }}>See all case studies →</a>
            </div>
        </div>
    );
};
