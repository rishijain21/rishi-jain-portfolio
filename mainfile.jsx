// Rishi Jain Portfolio
// Technology Partner
// https://rishijain.dev

import { useState, useEffect, useRef } from "react";

/* ─── SITE CONFIG ───────────────────────────────────────────── */
const SITE_CONFIG = {
    available: true,
    availabilityText: "1 project slot open",
    unavailableText: "Booked — accepting Q4 2026 enquiries",
    responseTime: "4 hours",
    baseProjectsCount: 20,
    yearsExperience: 6,
    priceRangeText: "Most engagements fall between $3,000–$15,000, depending on scope.",
    // TODO: Set real WhatsApp number before launch (country code without +, e.g. "919876543210")
    whatsappNumber: "",
};

const GITHUB_PROFILE_READY = false; // flip once github.com/rishijain21 has populated READMEs
const TESTIMONIALS_READY = false; // flip once 2+ real client testimonials are collected

/* ─── TRACKING ──────────────────────────────────────────────── */
const track = (event, data = {}) => {
    if (typeof window !== "undefined" && window.gtag) window.gtag("event", event, data);
    if (typeof window !== "undefined" && window.plausible) window.plausible(event, { props: data });
};

/* ─── HOOKS ─────────────────────────────────────────────────── */
const useInView = (opts = {}) => {
    const ref = useRef(null);
    const [vis, setVis] = useState(false);
    useEffect(() => {
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) { setVis(true); io.disconnect(); }
        }, { threshold: opts.threshold || 0.1, ...opts });
        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);
    return [ref, vis];
};

const useCounter = (to, dur = 1600, active = false) => {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!active) return;
        let t0 = null;
        let raf;
        const tick = (ts) => {
            if (!t0) t0 = ts;
            const p = Math.min((ts - t0) / dur, 1);
            setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to, dur, active]);
    return n;
};

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
};

/* ─── REVEAL ────────────────────────────────────────────────── */
const R = ({ children, d = 0, y = 20, className = "" }) => {
    const [ref, vis] = useInView();
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return <div ref={ref} className={className} style={{ opacity: 1, transform: "none" }}>{children}</div>;
    return (
        <div ref={ref} className={className} style={{
            opacity: vis ? 1 : 0,
            transform: vis ? "none" : `translateY(${y}px)`,
            transition: `opacity .65s cubic-bezier(.22,1,.36,1) ${d}s, transform .65s cubic-bezier(.22,1,.36,1) ${d}s`,
        }}>{children}</div>
    );
};

/* ─── SCROLL PROGRESS ──────────────────────────────────────── */
const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const h = () => {
            const total = document.documentElement.scrollHeight - window.innerHeight;
            setProgress((window.scrollY / total) * 100);
        };
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, zIndex: 300,
            width: `${progress}%`, height: 3,
            background: "#1A1612",
            transition: "width 0.1s linear",
            pointerEvents: "none",
        }} />
    );
};

/* ─── NAV ───────────────────────────────────────────────────── */
const NAV_LINKS = [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Process", href: "#process" },
    { label: "About", href: "#about" },
];

const AvailabilityDot = ({ small }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <div style={{
            width: small ? 6 : 7, height: small ? 6 : 7, borderRadius: "50%",
            background: SITE_CONFIG.available ? "#16A34A" : "#E5534B",
            animation: SITE_CONFIG.available ? "availPulse 2s ease-in-out infinite" : "none",
            flexShrink: 0,
        }} />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: SITE_CONFIG.available ? "#16A34A" : "#6B6460", letterSpacing: ".02em" }}>
            {SITE_CONFIG.available ? SITE_CONFIG.availabilityText : SITE_CONFIG.unavailableText}
        </span>
    </div>
);

const Nav = () => {
    const [solid, setSolid] = useState(false);
    const [hoveredNav, setHoveredNav] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const h = () => setSolid(window.scrollY > 56);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, []);

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
            <div role="dialog" aria-modal="true" aria-label="Navigation menu" aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined} style={{
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
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" role="presentation">
                            <rect width="36" height="36" rx="8" fill="#1A1612" />
                            <path d="M11 10h7c2.2 0 4 1.8 4 4s-1.8 4-4 4h-7V10z M11 18l6 8" stroke="#F7F4EF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

/* ─── HERO PROOF PANEL ── */
const HeroProofPanel = () => {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);

    const projects = [
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

    const switchTo = (idx) => {
        if (idx === active) return;
        setFading(true);
        setTimeout(() => { setActive(idx); setFading(false); }, 200);
    };

    const p = projects[active];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.10)", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(26,22,18,0.08), 0 1px 4px rgba(26,22,18,0.04)" }}>
                <div style={{ background: "#F7F4EF", borderBottom: "1px solid rgba(26,22,18,0.08)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
                    {["#FF605C", "#FFBD44", "#00CA4E"].map(c => (
                        <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                    ))}
                    <span style={{ marginLeft: 10, fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#857F79" }}>rishi.jain/work</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                        {projects.map((proj, idx) => (
                            <button key={idx} onClick={() => switchTo(idx)}
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
                            <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: p.accent, marginBottom: 4 }}>{p.type}</div>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 500, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.2 }}>{p.name}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${p.accent}12`, border: `1px solid ${p.accent}28`, borderRadius: 100, padding: "3px 10px" }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A" }} />
                            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "#16A34A", fontWeight: 600 }}>LIVE</span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                        {[{ label: p.metric1Label, value: p.metric1Value }, { label: p.metric2Label, value: p.metric2Value }, { label: p.metric3Label, value: p.metric3Value }].map((m, i) => (
                            <div key={i} style={{ background: "#F7F4EF", border: "1px solid rgba(26,22,18,0.07)", borderRadius: 8, padding: "10px 10px 8px" }}>
                                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 700, color: p.accent, lineHeight: 1, marginBottom: 5 }}>{m.value}</div>
                                <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#857F79", lineHeight: 1.3, fontWeight: 500 }}>{m.label}</div>
                            </div>
                        ))}
                    </div>

                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: "#6B6460", lineHeight: 1.65, margin: "0 0 14px", borderLeft: `2px solid ${p.accent}`, paddingLeft: 10 }}>{p.outcome}</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                        {p.stack.map(t => (
                            <span key={t} style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 500, color: "#6B6460", background: "rgba(26,22,18,0.05)", border: "1px solid rgba(26,22,18,0.10)", padding: "2px 8px", borderRadius: 4 }}>{t}</span>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(26,22,18,0.06)", paddingTop: 12 }}>
                        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "#857F79" }}>→ {p.url}</span>
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 600, color: p.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "gap 0.15s ease" }}
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
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#857F79" }}>{active + 1} of {projects.length} live projects shown</span>
                <span style={{ color: "rgba(26,22,18,0.15)", fontSize: 12 }}>·</span>
                <a href="#work" style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#6B6460", textDecoration: "none", fontWeight: 500 }}>See all case studies →</a>
            </div>
        </div>
    );
};

/* ─── HERO ──── */
const Hero = () => {
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

/* ─── TRUST STRIP ──── */
const TrustStrip = () => {
    const isMobile = useIsMobile();
    return (
        <section style={{ background: "#1A1612", padding: isMobile ? "24px 20px" : "28px 32px" }}>
            <R>
                <p style={{
                    maxWidth: 760, margin: "0 auto", textAlign: "center",
                    fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 14 : 15.5, color: "#F7F4EF",
                    lineHeight: 1.65, fontWeight: 400,
                }}>
                    Most developers have only ever built software with someone else's money on the line.
                    I've done that — and I've also built a company where every decision was mine to get right or wrong.
                </p>
            </R>
        </section>
    );
};

/* ─── ABOUT SECTION ───────────────────────────────────────── */
const AboutSection = () => {
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
                                {[
                                    { dot: "#1A1612", text: "Specialist Programmer · Infosys (fintech)" },
                                    { dot: "#1A1612", text: "Founder & sole engineer · Sovva" },
                                    { dot: "rgba(26,22,18,0.35)", text: "Taking 1 freelance project at a time" },
                                    { dot: "rgba(26,22,18,0.25)", text: "Sholapur, Maharashtra · responds within 4 hours, weekdays" },
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
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

/* ─── CASE STUDY CARD ─── */
const CaseStudyCard = ({ project, i }) => {
    const [mediaTab, setMediaTab] = useState("overview");
    const [mediaPanelVisible, setMediaPanelVisible] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(null);
    const isMobile = useIsMobile();
    const [cardRef, cardVis] = useInView();

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

    const switchTab = (tab) => {
        setMediaPanelVisible(false);
        setTimeout(() => { setMediaTab(tab); setMediaPanelVisible(true); }, 80);
    };

    const availableTabs = ['overview', 'video', 'screenshots'];
    const tabConfig = {
        overview: { label: 'Overview' },
        video: { label: 'Demo' },
        screenshots: { label: 'Screenshots' },
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
                        {availableTabs.map(tab => (
                            <button
                                key={tab}
                                role="tab"
                                aria-label={`Show ${tabConfig[tab]?.label || tab} for ${project.name}`}
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
                                {tabConfig[tab]?.label || tab}
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
                                            {project.metrics.map((m, j) => (
                                                <div key={j} style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(26,22,18,0.06)", flex: isMobile ? "1 1 calc(50% - 8px)" : "0 1 auto", minWidth: isMobile ? "calc(50% - 8px)" : 120, maxWidth: isMobile ? "100%" : 180 }}>
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
                                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#857F79", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>Demo video coming soon. <a href="#contact" style={{ color: "#1B4FD8", textDecoration: "underline" }}>Request a walkthrough →</a></p>
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
                                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#857F79", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>Screenshots coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 0, padding: isMobile ? "18px 20px" : "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
                    {[{ label: "The Problem", content: project.problem }, { label: "The Decision", content: project.solution }, { label: "Key Outcomes", isOutcomes: true, outcomes: project.outcomes }].map((col, j) => (
                        <div key={j} style={{ paddingRight: isMobile ? 0 : (j < 2 ? 28 : 0), paddingLeft: isMobile ? 0 : (j > 0 ? 28 : 0), borderRight: isMobile ? "none" : (j < 2 ? "1px solid rgba(26,22,18,0.10)" : "none"), borderBottom: isMobile && j < 2 ? "1px solid rgba(26,22,18,0.10)" : "none", paddingBottom: isMobile && j < 2 ? 20 : 0, paddingTop: isMobile && j > 0 ? 20 : 0 }}>
                            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#857F79", marginBottom: 12 }}>{col.label}</div>
                            {col.isOutcomes
                                ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{col.outcomes.map((o, k) => (<div key={k} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: project.accent, marginTop: 6, flexShrink: 0 }} /><span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", lineHeight: 1.6 }}>{o}</span></div>))}</div>
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

/* ─── WORK SECTION ─────────────────────────────────────────── */
const Work = () => {
    const isMobile = useIsMobile();
    const sectionPadding = isMobile ? "56px 20px 72px" : "72px 32px 100px";
    const [activeFilter, setActiveFilter] = useState("all");

    const projects = [
        {
            name: "Sovva", type: "Subscription & Operations Platform · Built and still run by Rishi", url: "sovva.io",
            category: "saas", flagship: true,
            stat: "His own company, his own risk", accent: "#1B4FD8", videoUrl: "/sovva-demo.webm", loomUrl: null, screenshots: [
                { src: "/sovva-mobile-ss.png", caption: "Mobile-Responsive Operations & Customer Dashboard", type: "mobile" },
                { src: "/sovva-mobile-ss2.png", caption: "Live Subscription Billing & Meal Customization Flow", type: "mobile" },
                { src: "/sovva-mobile-ss3.png", caption: "Real-Time Order Schedule & Delivery Management", type: "mobile" }
            ],
            problem: "Every day the business grew, the manual coordination grew faster. A missed step in order generation meant a customer didn't get their meal. There was no version of \"scale this business\" that survived doing it by hand.",
            solution: "I chose to build one consolidated system rather than stitch together off-the-shelf tools, because subscription billing, daily order generation, and customer records all had to agree with each other — no combination of existing tools did that without constant manual reconciliation. Background job scheduling now handles order generation automatically every day.",
            outcomes: ["Daily order generation fully automated — zero manual scheduling", "Subscription billing and invoicing handled end-to-end", "Replaced multiple disconnected tools with one purpose-built system", "Real-time pipeline and delivery visibility for leadership"],
            lesson: "Building this for my own company changed how I build for clients. When the risk is yours, you stop cutting corners you might have justified on someone else's project.",
            stack: [".NET 8", "Angular", "PostgreSQL", "EF Core", "Hangfire", "Stripe", "Azure", "JWT Auth"],
            metrics: [{ label: "Manual Tasks", value: "Automated" }, { label: "Hours Saved/Wk", value: "10+" }, { label: "Modules", value: "5" }],
            bars: [.35, .5, .6, .72, .8, .88, .92, .95],
        },
        {
            name: "Mechanical Bazaar", type: "B2B Industrial · Procurement", url: "mechanicalbazaar.in",
            category: "web",
            stat: "Built for bulk buyers", accent: "#065F46", videoUrl: "/mechanical-bazaar-demo.mp4", loomUrl: null, embedUrl: null, screenshots: [
                { src: "/ss-mechanical-bazar.png", caption: "Full Landing Page & Industrial Catalogue (Desktop)", type: "desktop" },
                { src: "/mechanical-bazaar-mobile-ss.png", caption: "Mobile-Responsive Marketplace Experience", type: "mobile" }
            ],
            problem: "A mechanical components business supplying bolts, nuts, and solar mounting hardware was losing potential bulk buyers — the business had no professional digital presence to support a B2B sales cycle.",
            solution: "Built a structured B2B site with product catalogue, category filtering, spec pages, and 'Request a Quote' flows via web form and WhatsApp.",
            outcomes: ["A digital storefront credible enough to anchor B2B procurement conversations", "Quote turnaround shortened by removing the phone-call step entirely", "A catalogue structure built to scale as the product range grows"],
            stack: ["HTML5", "CSS3", "Vanilla JavaScript"],
            metrics: [{ label: "Product Categories", value: "8+" }, { label: "Quote Channels", value: "2" }, { label: "Dependencies", value: "Zero" }],
            bars: [.28, .42, .55, .62, .7, .75, .8, .85],
        },
        {
            name: "Parsec Power Engineers", type: "Corporate · Energy · B2B", url: "parsecpower.in",
            category: "web",
            stat: "30-year company, digital presence built from zero", accent: "#92400E", videoUrl: "/parsec-power-demo.mp4", loomUrl: null, embedUrl: null, screenshots: [
                { src: "/parsec-power-ss-web-view.png", caption: "Corporate Portal Architecture (Desktop)", type: "desktop" },
                { src: "/parsec-power-mobile-view.png", caption: "Mobile-Responsive Solar Savings Calculator & Portal", type: "mobile" }
            ],
            problem: "A 30-year-old power engineering company had no digital presence — creating a credibility gap in a high-value B2B sales cycle where prospects expect to verify a vendor online before a first call.",
            solution: "Built a full corporate website: services, leadership, client logos, project portfolio, and a custom Solar Savings Calculator that pre-qualifies inbound leads.",
            outcomes: ["A 30-year track record now has a digital anchor that matches the company's real credibility", "Inbound leads now arrive pre-qualified through the Solar Savings Calculator", "Technical SEO copy written for an industrial procurement audience, not a general one", "Design, development, content, and SEO delivered end-to-end by one person"],
            stack: ["WordPress", "Elementor", "Custom JS", "SEO", "Photoshop", "Technical Copywriting"],
            metrics: [{ label: "Years Established", value: "30+" }, { label: "Services Covered", value: "8" }, { label: "Content Written", value: "100%" }],
            bars: [.3, .45, .55, .65, .72, .8, .85, .9],
        },
        {
            name: "Smile Your Confidence", type: "Healthcare · Dental · Booking", url: "smileyourconfidence.in",
            category: "web",
            stat: "Phone-only booking → self-serve, online",
            accent: "#0E7490", videoUrl: "/smile-your-confidence-demo.mp4", loomUrl: null, embedUrl: null, screenshots: [
                { src: "/smileyourconfidence-web.png", caption: "Healthcare Landing Page & Treatment Booking (Desktop)", type: "desktop" },
                { src: "/smile-your-confidence-mobile-ss.png", caption: "Mobile Appointment Booking Flow & Gallery", type: "mobile" }
            ],
            problem: "A specialist dental clinic in Jaipur had no structured online presence. Prospective patients couldn't find service details or book consultations, so the clinic was losing patients to competitors with a basic web presence.",
            solution: "Built a complete dental website: treatment pages with before/after gallery, doctor profile, clinic overview, and an online appointment booking system that replaced phone-only scheduling.",
            outcomes: ["Patients now discover, evaluate, and book a consultation without calling the clinic", "A before/after gallery does the trust-building work a sales call used to do", "On-page SEO built specifically for dental searches in Jaipur", "Requirement gathering through launch handled solo, start to finish"],
            stack: ["WordPress", "Elementor", "Booking Plugin", "SEO", "Medical Copywriting", "Photoshop"],
            metrics: [
                { label: "Treatments listed", value: "12+" },
                { label: "Online booking", value: "Live" },
                { label: "Solo delivery", value: "100%" },
            ],
            bars: [.28, .42, .55, .62, .7, .75, .8, .88],
        },
    ];

    const filteredProjects = activeFilter === "all" ? projects
        : activeFilter === "saas" ? projects.filter(p => p.category === "saas")
            : projects.filter(p => p.category === "web");

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

/* ─── PROCESS ──── */
const PROCESS_STEPS = [
    { title: "Understand the problem", body: "We talk before anything is built. I ask about the business, not just the feature — what's actually breaking, and what \"fixed\" would look like in three months." },
    { title: "Propose an approach", body: "You get a clear, specific plan before any money changes hands — what gets built, in what order, and roughly how long it takes." },
    { title: "Build in visible increments", body: "You see working pieces as they're built, not a single reveal at the end. If something needs to change, we catch it early, not after launch." },
    { title: "Test against the real thing", body: "Before anything ships, it's tested against how your business actually uses it — not just whether the code runs." },
    { title: "Hand off cleanly", body: "You get documentation written for a human, not just comments in code — so you're never dependent on me being reachable to understand your own system." },
    { title: "Stay reachable after launch", body: "Most relationships don't end at deployment. I respond to existing clients the same day, for as long as you need me to." },
];

const Process = () => {
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
                        <R key={i} d={i * 0.06}>
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

/* ─── SERVICES SECTION ────── */
const SERVICES = [
    { name: "Launch Your Product", body: "For founders with an idea and no working software yet. I take it from a whiteboard sketch to something real users can put their hands on — built so it doesn't need a rewrite the moment it gets traction." },
    { name: "Replace the Spreadsheets", body: "For businesses running on manual coordination. I build the internal tool that matches how your team actually works, so people stop working around the system and start working through it." },
    { name: "Get Found, Get Quotes", body: "For businesses with a weak or nonexistent online presence. A site built for commercial intent — lead capture, quoting, credibility — not a digital business card." },
    { name: "Automate the Repeat Work", body: "For any recurring manual task quietly costing your team hours every week. I build the automation into your existing workflow, with failures that are visible, not silent." },
    { name: "Take Over a Fragile System", body: "Available for businesses that inherited fragile code or were left by a previous developer. I audit carefully and stabilize incrementally — ask me, I'll tell you honestly if it's a fit." },
    { name: "AI, Applied With Restraint", body: "For businesses asking \"should we have AI\" without a clear answer yet. I integrate it only where it measurably improves something you already do — not because it's expected." },
];

const ServicesSection = () => {
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

/* ─── TESTIMONIALS ──── */
const TESTIMONIALS = [
    // { quote: "...", name: "First Name", role: "Company / Role" },
];

const Testimonials = () => {
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
                            <R key={i} d={i * 0.05}>
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

/* ─── FAQ ──── */
const FAQ_ITEMS = [
    { q: "How much does this cost?", a: `It depends on scope, but ${SITE_CONFIG.priceRangeText} I'll give you a specific number after we talk, not before.` },
    { q: "How long does a project take?", a: "A focused MVP is usually weeks, not months. A larger internal system or full business website is closer to 4–8 weeks. You'll get a specific timeline in the proposal, before anything starts." },
    { q: "How do we communicate during the project?", a: "Directly, with me — not an account manager. Email or WhatsApp, whichever you prefer, and you'll see working pieces as they're built, not just a status update." },
    { q: "Who owns the code and the system once it's built?", a: "You do. Full ownership transfers at handoff, along with documentation written so someone other than me could maintain it if needed." },
    { q: "What happens after launch — do you disappear?", a: "No. Existing clients get the same response time as during the project. Ongoing support is available, either as-needed or as a lighter retained arrangement, depending on what you need." },
    { q: "What if it's not working out partway through?", a: "Work is scoped and delivered in visible milestones, not one long lock-in. If something isn't a fit, we say so early — you're never stuck paying for the rest of a plan that's stopped making sense." },
    { q: "Is it risky to work with one person instead of a team?", a: "It's a different kind of risk, not a bigger one. No handoffs between people, no diffusion of who's responsible — you always know exactly who's accountable for the work." },
    { q: "Will this still work if my business grows?", a: "That's specifically what I design for — Sovva, my own company's system, has scaled with the business without needing a rewrite, and I build client systems the same way." },
    { q: "Are you available right now?", a: "Check the badge at the top of the page — it's kept current. If I'm booked, I'll tell you honestly and point you to the next opening." },
];

const FAQItem = ({ item, isOpen, onToggle, idx }) => (
    <div style={{ borderBottom: "1px solid rgba(26,22,18,0.08)" }}>
        <button
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={`faq-panel-${idx}`}
            id={`faq-trigger-${idx}`}
            style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none", cursor: "pointer", padding: "18px 4px", textAlign: "left",
                fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: "#1A1612", gap: 16,
            }}
        >
            <span>{item.q}</span>
            <span aria-hidden="true" style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: "50%", border: "1px solid rgba(26,22,18,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#6B6460",
                transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s ease",
            }}>+</span>
        </button>
        <div
            id={`faq-panel-${idx}`}
            role="region"
            aria-labelledby={`faq-trigger-${idx}`}
            aria-hidden={!isOpen}
            style={{
                maxHeight: isOpen ? 320 : 0, overflow: "hidden", transition: "max-height 0.3s ease",
            }}
        >
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6460", lineHeight: 1.72, margin: "0 0 18px", maxWidth: 640 }}>{item.a}</p>
        </div>
    </div>
);

const FAQ = () => {
    const isMobile = useIsMobile();
    const [openIdx, setOpenIdx] = useState(null);
    return (
        <section id="faq" style={{ background: "#FFFFFF", padding: isMobile ? "56px 20px" : "80px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
                <R>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>Before you reach out</span>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,5vw,40px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 24 }}>The questions everyone asks, answered honestly.</h2>
                </R>
                <R d={0.06}>
                    <div>
                        {FAQ_ITEMS.map((item, i) => (
                            <FAQItem key={i} item={item} idx={i} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
                        ))}
                    </div>
                </R>
            </div>
        </section>
    );
};

/* ─── CONTACT / CTA ─────────────────────────────────────────── */
const CTA = () => {
    const isMobile = useIsMobile();
    const sectionPadding = isMobile ? "72px 20px 80px" : "100px 32px 120px";

    const [formState, setFormState] = useState({ name: "", email: "", message: "", website: "" });
    const [projectType, setProjectType] = useState("");
    const [focusedField, setFocusedField] = useState(null);
    const [errors, setErrors] = useState({ name: false, email: false, message: false, submit: false });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputStyle = (field) => ({
        background: "#FFFFFF",
        border: `1px solid ${errors[field] ? "#E5534B" : focusedField === field ? "#1A1612" : "rgba(26,22,18,0.15)"}`,
        boxShadow: errors[field] ? "0 0 0 3px rgba(229,83,75,0.1)" : focusedField === field ? "0 0 0 3px rgba(26,22,18,0.1)" : "none",
        borderRadius: 8, padding: "14px 16px", width: "100%",
        fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#1A1612", outline: "none",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease", boxSizing: "border-box",
    });

    const handleSubmit = async () => {
        const newErrors = {
            name: !formState.name.trim(),
            email: !formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email),
            message: !formState.message.trim(),
            submit: false,
        };
        setErrors(newErrors);
        if (newErrors.name || newErrors.email || newErrors.message) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formState.name, email: formState.email, message: formState.message, website: formState.website, projectType }),
            });
            if (!res.ok) throw new Error("Failed");
            track("form_submit", { source: "contact_form" });
            setSubmitted(true);
            setFormState({ name: "", email: "", message: "", website: "" });
        } catch {
            setErrors(prev => ({ ...prev, submit: true }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" style={{ background: "#F7F4EF", padding: sectionPadding, borderTop: "1px solid rgba(26,22,18,0.06)" }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
                <R>
                    <div style={{ textAlign: "left", marginBottom: isMobile ? 40 : 64 }}>
                        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,7vw,56px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.02em", lineHeight: 1.08, marginBottom: 22 }}>
                            Tell me what you're trying to build.
                        </h2>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: isMobile ? 16 : 18, color: "#6B6460", lineHeight: 1.72, maxWidth: isMobile ? "100%" : 480, margin: "0" }}>
                            No pitch, no pressure — just a real conversation about whether I'm the right fit. I respond within {SITE_CONFIG.responseTime} on weekdays.
                        </p>
                    </div>
                </R>
                <R d={0.1}>
                    <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 20, padding: isMobile ? "28px 20px" : 40, boxShadow: "0 4px 24px rgba(26,22,18,0.06)" }}>
                        {submitted ? (
                            <div role="status" aria-live="polite" style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 16, padding: isMobile ? "36px 24px" : "48px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="22" height="22" fill="none" stroke="#16A34A" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,5vw,30px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                                    Got it — thank you.
                                </div>
                                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6B6460", lineHeight: 1.7, maxWidth: 360, margin: 0 }}>
                                    I'll read this properly and reply within {SITE_CONFIG.responseTime} on weekdays. If it's urgent, WhatsApp is faster.
                                </p>
                                <button onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "", website: "" }); }} style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", background: "none", border: "none", cursor: "pointer", marginTop: 8, textDecoration: "underline", textUnderlineOffset: 3 }}>
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {/* Honeypot */}
                                <input type="text" name="website" value={formState.website} onChange={e => setFormState(s => ({ ...s, website: e.target.value }))} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0, pointerEvents: "none" }} tabIndex={-1} aria-hidden="true" autoComplete="off" />

                                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460", display: "block", marginBottom: 8 }}>Name</label>
                                        <input type="text" value={formState.name} onChange={e => { setFormState(s => ({ ...s, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: false })); }} placeholder="Your name" style={inputStyle("name")} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} aria-invalid={errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
                                        {errors.name && <span id="name-error" role="alert" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E5534B", marginTop: 4, display: "block" }}>What should I call you?</span>}
                                    </div>
                                    <div>
                                        <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460", display: "block", marginBottom: 8 }}>Email</label>
                                        <input type="email" value={formState.email} onChange={e => { setFormState(s => ({ ...s, email: e.target.value })); if (errors.email) setErrors(p => ({ ...p, email: false })); }} placeholder="your@email.com" style={inputStyle("email")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} aria-invalid={errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
                                        {errors.email && <span id="email-error" role="alert" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E5534B", marginTop: 4, display: "block" }}>That email doesn't look quite right</span>}
                                    </div>
                                </div>

                                {/* P1.7 — Dropdown with visible chevron affordance. appearance:none kept; SVG chevron positioned absolutely. */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <label htmlFor="projectType" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460" }}>Project type</label>
                                    <div style={{ position: "relative" }}>
                                        <select id="projectType" value={projectType} onChange={e => setProjectType(e.target.value)}
                                            style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: projectType ? "#1A1612" : "#857F79", background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.15)", borderRadius: 8, padding: "12px 40px 12px 16px", outline: "none", appearance: "none", cursor: "pointer", transition: "border-color 0.18s ease", width: "100%" }}
                                            onFocus={e => { e.currentTarget.style.borderColor = "#1A1612"; }}
                                            onBlur={e => { e.currentTarget.style.borderColor = "rgba(26,22,18,0.15)"; }}
                                        >
                                            <option value="" disabled>Select what's closest</option>
                                            <option value="launch">Launching a new product</option>
                                            <option value="replace">Replacing manual processes</option>
                                            <option value="website">A business website that wins deals</option>
                                            <option value="automate">Automating repeat work</option>
                                            <option value="takeover">Taking over an existing system</option>
                                            <option value="unsure">Not sure yet — let's talk</option>
                                        </select>
                                        {/* Chevron indicator — purely decorative, pointer-events:none so clicks pass through to select */}
                                        <svg aria-hidden="true" width="16" height="16" fill="none" stroke="#857F79" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"
                                            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460", display: "block", marginBottom: 8 }}>
                                        What's the situation?
                                    </label>
                                    <textarea value={formState.message} onChange={e => { setFormState(s => ({ ...s, message: e.target.value })); if (errors.message) setErrors(p => ({ ...p, message: false })); }} placeholder="Tell me what's working, what isn't, and what you're hoping changes." rows={5} style={{ ...inputStyle("message"), resize: "vertical" }} onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} aria-invalid={errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
                                    {errors.message && <span id="message-error" role="alert" style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E5534B", marginTop: 4, display: "block" }}>Even a couple of sentences helps</span>}
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#6B6460" }}>⚡ Responds within {SITE_CONFIG.responseTime} on weekdays</span>
                                    <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                                        style={{ background: "#1A1612", color: "#F7F4EF", padding: "15px 32px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 2px 8px rgba(26,22,18,0.15)", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, pointerEvents: isSubmitting ? "none" : "auto", width: isMobile ? "100%" : "auto", boxSizing: "border-box" }}
                                        onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.background = "#1B4FD8"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,79,216,0.28)"; } }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,22,18,0.15)"; }}
                                        onMouseDown={e => { if (!isSubmitting) e.currentTarget.style.transform = "translateY(0) scale(0.98)"; }}
                                        onMouseUp={e => { if (!isSubmitting) e.currentTarget.style.transform = "translateY(-2px) scale(1)"; }}
                                    >
                                        {isSubmitting ? "Sending…" : (<>Send This to Rishi <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>)}
                                    </button>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#857F79", textAlign: "center", marginTop: 10 }}>
                                        No automated reply. I read every message myself.
                                    </p>
                                    {errors.submit && <span role="alert" aria-live="polite" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E5534B", marginTop: 4, display: "block", textAlign: "center" }}>Something didn't go through on my end. Email me directly at <a href="mailto:jainnrishii21@gmail.com" style={{ color: "#E5534B" }}>jainnrishii21@gmail.com</a>.</span>}
                                    <a href="mailto:jainnrishii21@gmail.com" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", textDecoration: "none", display: "block", textAlign: "center", marginTop: 4, transition: "color 0.18s ease" }} onMouseEnter={e => e.currentTarget.style.color = "#6B6460"} onMouseLeave={e => e.currentTarget.style.color = "#857F79"}>or email jainnrishii21@gmail.com directly</a>
                                </div>

                                <div style={{ borderTop: "1px solid rgba(26,22,18,0.08)", paddingTop: 24, marginTop: 4, textAlign: "center" }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", marginBottom: 12 }}>Prefer to skip the form?</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center" }}>
                                        <a href="mailto:jainnrishii21@gmail.com" style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: "#1B4FD8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(27,79,216,0.3)", paddingBottom: 2 }}>Email me directly →</a>
                                        {/* WhatsApp CTA is only rendered when a real number is configured in SITE_CONFIG */}
                                        {SITE_CONFIG.whatsappNumber && (
                                            <a href={`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent("Hi Rishi, I found your portfolio and wanted to discuss a project.")}`} target="_blank" rel="noopener noreferrer"
                                                style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#16A34A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(22,163,74,0.3)", paddingBottom: 2 }}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.2-.7.9-1 1.1-.2.2-.4.2-.7.1-1-.4-2.7-1.5-3.6-2.9-.3-.4 0-.6.3-.9.3-.3.4-.5.5-.7.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.2.2 2.5 3.8 6 5.2 3 1.2 3.6.9 4.2.9.7-.1 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.1-.2-.2-.2-.4-.3z" /><path d="M12 2a10 10 0 0 0-8.5 15.4L2 22l4.7-1.5A10 10 0 1 0 12 2z" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                                                Prefer WhatsApp? Message me →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </R>
            </div>
        </section>
    );
};

/* ─── MOBILE STICKY BAR ────────────────────────────────────── */
const MobileStickyBar = () => {
    const isMobile = useIsMobile();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (!isMobile) return;
        const h = () => setVisible(window.scrollY > window.innerHeight * 0.5);
        window.addEventListener("scroll", h, { passive: true });
        return () => window.removeEventListener("scroll", h);
    }, [isMobile]);
    if (!isMobile) return null;
    return (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 180, padding: "12px 16px 20px", background: "rgba(247,244,239,0.96)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(26,22,18,0.08)", transform: visible ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)", pointerEvents: visible ? "auto" : "none" }}>
            <a href="#contact" onClick={() => track("cta_click", { location: "mobile_sticky", cta: "tell_me_about_project" })}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#1A1612", color: "#F7F4EF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 24px", borderRadius: 10, textDecoration: "none", width: "100%", boxSizing: "border-box" }}
            >
                Tell Me About Your Project
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#857F79", textAlign: "center", marginTop: 8 }}>
                {SITE_CONFIG.available ? SITE_CONFIG.availabilityText : SITE_CONFIG.unavailableText}
            </p>
        </div>
    );
};

/* ─── FOOTER ────────────────────────────────────────────────── */
const Footer = () => {
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
                        ].filter(Boolean).map(l => (
                            <a key={l.label} href={l.href} target={l.href.startsWith("#") ? undefined : "_blank"} rel={l.href.startsWith("#") ? undefined : "noopener noreferrer"}
                                style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: hoveredLink === l.label ? "#F7F4EF" : "rgba(247,244,239,0.65)", textDecoration: "none", transition: "color 0.18s ease", display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 44, padding: isMobile ? "0 8px" : 0 }}
                                onMouseEnter={() => setHoveredLink(l.label)}
                                onMouseLeave={() => setHoveredLink(null)}
                            >{l.label}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

/* ─── ROOT ──────────────────────────────────────────────────── */
export default function RishiJainPortfolio() {
    useEffect(() => {
        // CSS handles scroll-behavior: smooth and correctly respects prefers-reduced-motion.
        // No JS override applied here.
        document.title = "Rishi Jain — Technology Partner for Founders & Growing Businesses";
        const setMeta = (name, content, prop = false) => {
            const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let el = document.querySelector(sel);
            if (!el) { el = document.createElement("meta"); prop ? el.setAttribute("property", name) : el.setAttribute("name", name); document.head.appendChild(el); }
            el.setAttribute("content", content);
        };
        setMeta("description", "Rishi Jain is a Technology Partner for founders and small businesses — building the systems your business actually runs on, backed by production fintech experience and his own SaaS company, Sovva.");
        setMeta("author", "Rishi Jain");
        setMeta("robots", "index, follow");
        setMeta("og:title", "Rishi Jain — Technology Partner for Founders & Growing Businesses", true);
        setMeta("og:description", "I build the systems your business actually runs on — backed by production fintech work and my own SaaS company.", true);
        setMeta("og:type", "website", true);
        setMeta("og:url", "https://rishijain.dev", true);
        // TODO (P0.2): Create og-preview.png (1200×630px) and deploy to https://rishijain.dev/og-preview.png
        // before launch. The tag is intentionally omitted until the asset is confirmed live to avoid
        // broken social card previews. Uncomment both lines below once deployed:
        // setMeta("og:image", "https://rishijain.dev/og-preview.png", true);
        // setMeta("twitter:image", "https://rishijain.dev/og-preview.png");
        setMeta("twitter:card", "summary_large_image");
        setMeta("twitter:title", "Rishi Jain — Technology Partner for Founders & Growing Businesses");
        setMeta("twitter:description", "I build the systems your business actually runs on — backed by production fintech work and my own SaaS company.");

        let canon = document.querySelector('link[rel="canonical"]');
        if (!canon) { canon = document.createElement("link"); canon.setAttribute("rel", "canonical"); document.head.appendChild(canon); }
        canon.setAttribute("href", "https://rishijain.dev");

        let schemaTag = document.querySelector('script[data-schema="rj-person"]');
        if (!schemaTag) {
            schemaTag = document.createElement("script");
            schemaTag.type = "application/ld+json";
            schemaTag.setAttribute("data-schema", "rj-person");
            document.head.appendChild(schemaTag);
        }
        schemaTag.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Rishi Jain",
            jobTitle: "Technology Partner",
            url: "https://rishijain.dev",
            sameAs: ["https://www.linkedin.com/in/rishi-jainn/", "https://github.com/rishijain21"],
            knowsAbout: [".NET", "Angular", "PostgreSQL", "SaaS architecture", "business automation"],
        });

        if (!document.querySelector('link[data-fonts="rj"]')) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.setAttribute("data-fonts", "rj");
            link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap";
            document.head.appendChild(link);
        }
    }, []);

    return (
        <div style={{ background: "#F7F4EF", minHeight: "100vh", overflowX: "hidden" }}>
            <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; overflow-x: hidden; }
        body { overflow-x: hidden; }
        .hero-visual-r { display: flex; flex-direction: column; min-width: 0; padding-top: 8px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F7F4EF; }
        ::-webkit-scrollbar-thumb { background: rgba(26,22,18,0.14); border-radius: 3px; }
        ::selection { background: rgba(26,22,18,0.12); }
        input::placeholder, textarea::placeholder { color: #857F79; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes availPulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(22,163,74,0.4)} 50%{opacity:0.7;box-shadow:0 0 0 5px rgba(22,163,74,0)} }
        .grain-overlay { position: relative; }
        .grain-overlay::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:1; opacity:0.018; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-repeat:repeat; background-size:128px 128px; }
        @media (max-width: 374px) { .hero-visual-r > div { padding: 12px !important; } }
        a:focus-visible, button:focus-visible { outline: 2px solid #1A1612; outline-offset: 3px; border-radius: 6px; }
        a[href="#main-content"] { position: absolute; left: -9999px; top: 0; z-index: 999; background: #1A1612; color: #F7F4EF; padding: 12px 20px; border-radius: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 14px; text-decoration: none; }
        a[href="#main-content"]:focus { left: 0; }
        section[id] { scroll-margin-top: 84px; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
            <a href="#main-content">Skip to content</a>
            <ScrollProgress />
            <Nav />
            <main id="main-content">
                <Hero />
                <TrustStrip />
                <Work />
                <Process />
                <ServicesSection />
                <AboutSection />
                <Testimonials />
                <FAQ />
                <CTA />
            </main>
            <Footer />
            <MobileStickyBar />
        </div>
    );
}