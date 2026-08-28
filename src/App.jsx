import { useState, useEffect, useRef } from "react";

/* ─── HOOKS ──────────────────────────────────────────────── */
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
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, dur, active]);
  return n;
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
};

/* ─── REVEAL ─────────────────────────────────────────────── */
const R = ({ children, d = 0, y = 20, className = "" }) => {
  const [ref, vis] = useInView();
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    return <div ref={ref} className={className} style={{ opacity: 1, transform: "none" }}>{children}</div>;
  }
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : `translateY(${y}px)`,
      transition: `opacity .65s cubic-bezier(.22,1,.36,1) ${d}s, transform .65s cubic-bezier(.22,1,.36,1) ${d}s`,
    }}>{children}</div>
  );
};

/* ─── SCROLL PROGRESS ────────────────────────────────────── */
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
      width: `${progress}%`, height: 2,
      background: "linear-gradient(90deg, #0891B2, #1B4FD8)",
      transition: "width 0.1s linear",
      pointerEvents: "none",
    }} />
  );
};

/* ─── NAV ─────────────────────────────────────────────────── */
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

  return (
    <>
      {isMobile && (
        <div
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 249,
            background: "rgba(26,22,18,0.4)",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            transition: "opacity 0.25s ease",
            backdropFilter: menuOpen ? "blur(2px)" : "none",
          }}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 250,
        background: "#F7F4EF",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 40px rgba(26,22,18,0.12)",
        border: "1px solid rgba(26,22,18,0.08)",
        borderBottom: "none",
        transform: menuOpen ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
        padding: "40px 32px 48px",
        minHeight: "60vh",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(26,22,18,0.15)", marginBottom: 8, alignSelf: "center" }} />
        <button onClick={() => setMenuOpen(false)} style={{
          position: "absolute", top: 24, right: 24,
          background: "none", border: "none", color: "#6B6460", fontSize: 24, cursor: "pointer",
        }}>✕</button>
        {["Work", "Services", "Testimonials", "Process", "Partners"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{
            fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 600,
            color: "#1A1612", textDecoration: "none",
          }}>{l}</a>
        ))}
        <a href="#contact" onClick={() => setMenuOpen(false)} style={{
          background: "#1A1612", color: "#F7F4EF",
          fontFamily: "'Inter', sans-serif", fontWeight: 600,
          fontSize: 16, padding: "12px 28px", borderRadius: 6, textDecoration: "none", marginTop: 8,
        }}>Book a Discovery Call</a>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: "#1A1612",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 16, color: "#F7F4EF", fontWeight: 400 }}>Rj</span>
            </div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#1A1612", letterSpacing: "-.02em" }}>Rishi Jain</span>
          </div>

          {isMobile ? (
            <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", color: "#6B6460", fontSize: 22, cursor: "pointer" }}>☰</button>
          ) : (
            <nav style={{ display: "flex", gap: 36, alignItems: "center" }}>
              {["Work", "Services", "Testimonials", "Process", "Partners"].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: hoveredNav === l ? "#1A1612" : "#6B6460", textDecoration: "none", transition: "color 0.18s ease" }}
                  onMouseEnter={() => setHoveredNav(l)} onMouseLeave={() => setHoveredNav(null)}
                >
                  <span style={{ position: "relative", display: "inline-block" }}>
                    {l}
                    <span style={{ position: "absolute", bottom: -2, left: 0, width: hoveredNav === l ? "100%" : "0%", height: 1, background: "#1A1612", transition: "width 0.2s ease", display: "block" }} />
                  </span>
                </a>
              ))}
              <a href="#contact" style={{ background: "#1A1612", color: "#F7F4EF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, padding: "10px 20px", borderRadius: 6, textDecoration: "none", transition: "background 0.2s ease, transform 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1B4FD8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; }}
              >Book a Discovery Call</a>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

/* ─── SYSTEM VISUAL ──────────────────────────────────────── */
const SystemVisual = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const nodes = [
    { id: "founder", x: 55,  y: 70,  label: "Founder",    sub: "vision",      color: "#1B4FD8" },
    { id: "rishi",   x: 200, y: 148, label: "Rishi Jain", sub: "architect",   color: "#0891B2", large: true },
    { id: "saas",    x: 360, y: 48,  label: "SaaS MVP",   sub: "product",     color: "#16A34A" },
    { id: "auto",    x: 378, y: 140, label: "Automation", sub: "system",      color: "#16A34A" },
    { id: "ai",      x: 368, y: 228, label: "AI Layer",   sub: "integration", color: "#16A34A" },
    { id: "cloud",   x: 258, y: 264, label: "Cloud Infra", sub: "azure",      color: "#9CA3AF" },
  ];
  const edges = [["founder","rishi"],["rishi","saas"],["rishi","auto"],["rishi","ai"],["rishi","cloud"],["cloud","saas"]];
  const activeEdge = tick % edges.length;
  const pos = (id) => nodes.find(n => n.id === id);

  return (
    <svg viewBox="0 0 440 300" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
      {Array.from({ length: 9 }).map((_, i) => (<line key={`h${i}`} x1={0} y1={i*34} x2={440} y2={i*34} stroke="rgba(26,22,18,0.04)" strokeWidth={1} />))}
      {Array.from({ length: 13 }).map((_, i) => (<line key={`v${i}`} x1={i*34} y1={0} x2={i*34} y2={300} stroke="rgba(26,22,18,0.04)" strokeWidth={1} />))}
      {edges.map(([a,b],i) => { const p1=pos(a),p2=pos(b),active=i===activeEdge; return (<line key={`${a}-${b}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={active?"#1B4FD8":"rgba(26,22,18,0.12)"} strokeWidth={active?1.5:1} strokeDasharray={active?"4 3":"none"} style={{transition:"stroke .4s, stroke-width .4s"}} />); })}
      {edges.map(([a,b],i) => { const p1=pos(a),p2=pos(b),active=i===activeEdge; if(!active)return null; return (<circle key={`dot-${i}`} r={3} fill="#0891B2"><animateMotion dur="1.4s" repeatCount="indefinite" path={`M${p1.x},${p1.y} L${p2.x},${p2.y}`} /></circle>); })}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={n.large?28:20} fill={`${n.color}15`} stroke={n.color} strokeWidth={n.large?1.5:1} />
          {n.large && (<circle cx={n.x} cy={n.y} r={34} fill="none" stroke={`${n.color}22`} strokeWidth={1} strokeDasharray="3 4"><animateTransform attributeName="transform" type="rotate" from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`} dur="20s" repeatCount="indefinite" /></circle>)}
          <text x={n.x} y={n.y+1} textAnchor="middle" dominantBaseline="middle" fill={n.color} fontSize={n.large?9:8} fontFamily="Inter,monospace" fontWeight="700">{n.label}</text>
          <text x={n.x} y={n.y+(n.large?14:12)} textAnchor="middle" fill="rgba(26,22,18,0.35)" fontSize={6.5} fontFamily="Inter,monospace">{n.sub}</text>
        </g>
      ))}
    </svg>
  );
};

/* ─── HERO ───────────────────────────────────────────────── */
function getDaysUntil(targetDateStr) {
  const now = new Date();
  const target = new Date(targetDateStr);
  const diffMs = target - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

const Hero = () => {
  const [ref, vis] = useInView({ threshold: 0.5 });
  const isMobile = useIsMobile();
  const y6   = useCounter(6,   1400, vis);
  const y30  = useCounter(30,  1600, vis);
  const y100 = useCounter(100, 1600, vis);

  const Q3_END = "2026-09-30";
  const daysLeft = getDaysUntil(Q3_END);
  const urgencyText = daysLeft > 30
    ? `Taking on 1 new build · Q3 2026`
    : daysLeft > 0
    ? `1 slot open · ${daysLeft} days left in Q3`
    : `Q4 2026 slots now open`;

  const [cursorVisible, setCursorVisible] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = "avail-pulse-style";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id;
      el.textContent = `
        @keyframes availPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(27,79,216,0.4); }
          50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(27,79,216,0); }
        }
      `;
      document.head.appendChild(el);
    }
    return () => {};
  }, []);

  return (
    <section className="grain-overlay" style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
      padding: isMobile ? "100px 20px 60px" : "120px 32px 80px",
      background: "#F7F4EF", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 900, height: 700, background: "radial-gradient(ellipse at 50% 30%, rgba(27,79,216,0.04) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 48, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <R>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(27,79,216,0.07)", border: "1px solid rgba(27,79,216,0.18)", borderRadius: 100, padding: "6px 16px", marginBottom: 36 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#1B4FD8", animation: "availPulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, color: "#1B4FD8", letterSpacing: ".06em", textTransform: "uppercase" }}>{urgencyText}</span>
            </div>
          </R>

          <R d={0.08}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(44px, 5.5vw, 76px)", fontWeight: 400, color: "#1A1612", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 28px" }}>
              Your idea deserves an engineer<br />
              <span style={{ fontStyle: "italic", color: "#1B4FD8" }}>
                who also understands
                <span style={{ display: "inline-block", width: 3, height: "0.85em", background: "#1B4FD8", marginLeft: 3, verticalAlign: "middle", opacity: cursorVisible ? 1 : 0, transition: "opacity 0.1s ease" }} />
              </span><br />
              how businesses work.
            </h1>
          </R>

          <R d={0.16}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#6B6460", lineHeight: 1.72, maxWidth: 480, margin: "0 0 12px" }}>
              Most developers build what you ask for. I build what you actually need — after asking the questions your last developer never did. From the first call to launch day: SaaS products, internal tools, automation pipelines, and AI-powered systems that run in the real world without falling over.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#B5AFA9", lineHeight: 1.6, maxWidth: 480, margin: "0 0 40px" }}>
              Ex-Infosys&nbsp;·&nbsp;3 live production systems&nbsp;·&nbsp;Full-stack: .NET, Angular, Azure, PostgreSQL&nbsp;·&nbsp;Based in Pune, available globally
            </p>
          </R>

          <R d={0.22}>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16, position: "relative", zIndex: 2 }}>
              <a href="#contact" style={{ background: "#1A1612", color: "#F7F4EF", padding: "15px 32px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 2px 8px rgba(26,22,18,0.15)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#1B4FD8"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,79,216,0.28)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,22,18,0.15)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              >
                Book a Free 30-Min Call
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="#work" style={{ background: "transparent", color: "#6B6460", border: "1px solid rgba(26,22,18,0.2)", padding: "15px 32px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 15, textDecoration: "none", transition: "color 0.2s ease, border-color 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#1A1612"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#6B6460"; e.currentTarget.style.borderColor = "rgba(26,22,18,0.2)"; }}
                onMouseDown={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              >See What I've Built</a>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#B5AFA9", marginBottom: 48 }}>
              No pitch deck. No invoice. Just a 30-min conversation — you'll leave knowing exactly what to build and how.
            </p>
          </R>

          <R d={0.28}>
            <div ref={ref} style={{ display: "flex", gap: isMobile ? 24 : 40, paddingTop: 32, borderTop: "1px solid rgba(26,22,18,0.1)", position: "relative", zIndex: 2 }}>
              {[
                { n: y6,   suf: "+", label: "Years building"            },
                { n: y30,  suf: "+", label: "Systems in production"     },
                { n: y100, suf: "%", label: "Uptime across live systems" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 400, color: "#1A1612", letterSpacing: "-0.02em", lineHeight: 1 }}>{s.n}{s.suf}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </R>

          <R d={0.34}>
            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex" }}>
                {["S","A","M"].map((init, i) => (
                  <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: ["#1B4FD8","#0891B2","#16A34A"][i], border: "2px solid #F7F4EF", marginLeft: i > 0 ? -8 : 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#fff" }}>{init}</div>
                ))}
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460" }}>
                <strong style={{ color: "#1A1612", fontWeight: 600 }}>3 live systems</strong> running in production today — healthcare, B2B &amp; food logistics
              </span>
            </div>
          </R>
        </div>

        <R d={0.12} className="hero-visual-r">
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 20, padding: 24, position: "relative", overflow: "hidden", boxShadow: "0 4px 24px rgba(26,22,18,0.06), 0 1px 4px rgba(26,22,18,0.04)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
              {["#FF605C","#FFBD44","#00CA4E"].map(c => (<div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />))}
              <div style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#B5AFA9" }}>rishi.jain/architecture</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 20 }}>
              <SystemVisual />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(transparent, #FFFFFF)", display: "flex", alignItems: "flex-end", padding: "0 20px 16px", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#B5AFA9" }}><span style={{ color: "#1B4FD8" }}>→</span> mapping business requirements to system design</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#16A34A", animation: "availPulse 2s ease-in-out infinite" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#16A34A" }}>LIVE</span>
              </div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
};

/* ─── PROBLEM SECTION ─────────────────────────────────────── */
const ProblemSection = () => (
  <section style={{ background: "#1A1612", padding: "80px 32px", borderTop: "1px solid rgba(247,244,239,0.06)" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <R>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", marginBottom: 20 }}>What founders tell me after a bad hire</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 42px)", fontWeight: 400, color: "#F7F4EF", lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 20 }}>
            The code shipped. The business didn't move.<br />
            <span style={{ color: "#6B6460", fontWeight: 400, fontStyle: "italic" }}>That's the gap nobody talks about.</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, marginTop: 8 }}>
            {[
              "You explained the business five times. The developer built what was in the ticket.",
              "It launched. Your ops team still couldn't use it. Nobody called it a failure.",
              "You got a working system you don't understand, can't hand off, and can't change.",
              "Six months later, a new developer said: 'this will need a rewrite before we can add anything.'",
            ].map((line, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: "rgba(247,244,239,0.40)", fontSize: 14, lineHeight: 1.6, flexShrink: 0, marginTop: 2 }}>—</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "rgba(247,244,239,0.72)", lineHeight: 1.6 }}>{line}</span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "rgba(247,244,239,0.65)", lineHeight: 1.7 }}>
            The failure pattern is always the same: a developer who optimises for code quality and ignores the business. Features get built. Systems get shipped. But the ops team is still working around the software instead of with it — and leadership has no idea what's running or why. I've inherited three systems like this from previous developers. The cost to fix them was higher than building from scratch. I start every engagement by asking about your business — not your stack. What does the business do? What breaks when the system doesn't work? What does success look like in 90 days? The technology comes after those answers. That order changes everything.
          </p>
        </div>
      </R>
    </div>
  </section>
);

/* ─── SERVICES (WHAT I BUILD) ─────────────────────────────── */
const WhatIBuild = () => {
  const isMobile = useIsMobile();
  const services = [
    {
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>),
      title: "SaaS Product Development",
      desc: "You get a production-ready product — not a prototype that breaks at 100 users. Auth, billing, subscription management, and a data model built to scale. The kind of system a CTO reviews and doesn't need to rewrite.",
      tags: ["MVP", "Full-Stack", "Stripe", "Auth", "PostgreSQL"],
    },
    {
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></svg>),
      title: "Internal Business Systems & Tools",
      desc: "Your ops team is working around a spreadsheet right now. I build the system that replaces it — purpose-built for how your business actually runs, not a SaaS template your team has to adapt to.",
      tags: ["Internal Tools", "Operations", "CRM", "Dashboards"],
    },
    {
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2m-4.22-7.78-1.42 1.42M7.64 16.36l-1.42 1.42m9.9 0-1.42-1.42M7.64 7.64 6.22 6.22" /></svg>),
      title: "Automation & AI Integrations",
      desc: "The manual work your team does every day — data entry, scheduling, routing, reconciliation — most of it shouldn't be manual. I automate the real workflows. AI gets added when it serves a genuine operational function, not to say you have AI.",
      tags: ["Automation", "OpenAI", "Hangfire", "Pipelines", "APIs"],
    },
    {
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M3 12h4l3-9 4 18 3-9h4" /></svg>),
      title: "Analytics & Dashboards",
      desc: "The numbers that run your business are currently split across three tools, two spreadsheets, and someone's memory. I build the dashboard that puts them in one place — updated in real time, designed around the decisions you actually need to make.",
      tags: ["Dashboards", "Analytics", "Real-time", "Reporting"],
    },
    {
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L11 3l-3 9H2" /></svg>),
      title: "Business Platform Engineering",
      desc: "When your business has outgrown the stack of disconnected tools — CRM here, billing there, delivery somewhere else — I build the platform that consolidates it. One system your team actually uses. One source of truth for leadership.",
      tags: ["Platform", "Integration", "Workflow", "Multi-module"],
    },
    {
      icon: (<svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>),
      title: "Cloud Architecture & DevOps",
      desc: "The infrastructure decisions made at the start determine whether you're debugging production at 3am six months later. Azure-native setup, CI/CD pipelines, containerisation — built so your system keeps running when it matters most.",
      tags: ["Azure", "Docker", "DevOps", "CI/CD", "Scaling"],
    },
  ];

  return (
    <section id="services" style={{ background: "#F7F4EF", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 14 }}>What I build</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 14 }}>Outcomes first.<br />Technology second.</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#6B6460", maxWidth: 520, lineHeight: 1.72, marginBottom: 60 }}>Every engagement starts with understanding what you need to achieve — not which framework to reach for.</p>
        </R>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 1, background: "rgba(26,22,18,0.06)", borderRadius: 16, overflow: "hidden" }}>
          {services.map((s, i) => (
            <R key={i} d={i * 0.06}>
              <div style={{ background: "#F7F4EF", padding: "40px 32px", height: "100%", boxSizing: "border-box", cursor: "default", transition: "background 0.2s ease, box-shadow 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FFFFFF"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(27,79,216,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#F7F4EF"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ color: "#1B4FD8", marginBottom: 24 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, fontWeight: 500, color: "#1A1612", marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6460", lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {s.tags.map(t => (<span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: "#6B6460", background: "rgba(26,22,18,0.06)", border: "1px solid rgba(26,22,18,0.1)", padding: "3px 9px", borderRadius: 4 }}>{t}</span>))}
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── COMPARISON SECTION ────────────────────────────────────── */
const ComparisonSection = () => {
  const comparisons = [
    { bad: "Ships code. Calls it done.", good: "Ships code + documentation + handoff so your team can take it forward." },
    { bad: "Disappears after a blocker. Reappears with excuses.", good: "Flags risks before they become blockers. Weekly call, always." },
    { bad: "Estimates based on hope. Bills based on reality.", good: "Fixed-price milestones. You know the cost before work begins." },
    { bad: "Uses the framework they like, not the one you need.", good: "Stack is chosen after understanding your constraints — not before." },
    { bad: "Builds something technically elegant that nobody uses.", good: "Builds what the business actually needs to operate." },
  ];

  return (
    <section id="comparison" style={{ background: "#FFFFFF", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <R>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 14 }}>The difference</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 16 }}>
            You've probably experienced the left column.<br />
            <span style={{ fontStyle: "italic", color: "#6B6460" }}>Here's what the right one feels like.</span>
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#6B6460", maxWidth: 480, lineHeight: 1.72, marginBottom: 56 }}>
            This isn't a features list. It's a description of two completely different working relationships — and how to tell which one you're in before it's too late.
          </p>
        </R>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(26,22,18,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#F7F4EF", borderBottom: "1px solid rgba(26,22,18,0.08)" }}>
            <div style={{ padding: "14px 24px", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#B5AFA9", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#E5534B" }}>✕</span> What goes wrong (and why it keeps happening)
            </div>
            <div style={{ padding: "14px 24px", fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#B5AFA9", borderLeft: "1px solid rgba(26,22,18,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#16A34A" }}>✓</span> What working with me actually looks like
            </div>
          </div>
          {comparisons.map((row, i) => (
            <R key={i} d={i * 0.05}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: i < comparisons.length - 1 ? "1px solid rgba(26,22,18,0.06)" : "none", transition: "background 0.15s ease", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,22,18,0.015)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ padding: "18px 24px", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#B5AFA9", lineHeight: 1.6 }}>{row.bad}</div>
                <div style={{ padding: "18px 24px", fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#1A1612", lineHeight: 1.6, fontWeight: 500, borderLeft: "1px solid rgba(26,22,18,0.06)", background: "rgba(27,79,216,0.04)" }}>{row.good}</div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── CASE STUDY CARD ─────────────────────────────────────── */
const CaseStudyCard = ({ project, i }) => {
  const [mediaTab, setMediaTab] = useState("overview");
  const [mediaPanelVisible, setMediaPanelVisible] = useState(true);
  const isMobile = useIsMobile();
  const [cardRef, cardVis] = useInView();

  const switchTab = (tab) => {
    setMediaPanelVisible(false);
    setTimeout(() => { setMediaTab(tab); setMediaPanelVisible(true); }, 80);
  };

  const availableTabs = ['overview', 'video', 'screenshots'];

  const tabConfig = {
    overview:    { label: '◎ Overview' },
    video:       { label: '▶ Demo Video' },
    screenshots: { label: '🖼 Screenshots' },
  };

  return (
    <R d={i * 0.08}>
      <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(26,22,18,0.05)", marginBottom: 24, transition: "border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = `${project.accent}35`; e.currentTarget.style.boxShadow = "0 8px 32px rgba(26,22,18,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.willChange = "transform"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,22,18,0.08)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(26,22,18,0.05)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.willChange = "auto"; }}
      >
        <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)", display: "flex", flexWrap: "wrap", gap: 16, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: project.accent, display: "block", marginBottom: 6 }}>{project.type}</span>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 500, color: "#1A1612", letterSpacing: "-0.01em", margin: 0 }}>{project.name}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: `${project.accent}12`, border: `1px solid ${project.accent}25`, borderRadius: 8, padding: "8px 16px" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: project.accent }}>{project.stat}</span>
            </div>

          </div>
        </div>

        <div style={{ borderBottom: "1px solid rgba(26,22,18,0.06)", background: 'rgba(26,22,18,0.018)' }}>
          <div style={{ display: "flex", padding: "0 28px", overflowX: isMobile ? "auto" : "visible", whiteSpace: isMobile ? "nowrap" : "normal", alignItems: "center" }}>
            {availableTabs.map(tab => (
              <button key={tab} onClick={() => switchTab(tab)} style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                fontWeight: mediaTab === tab ? 600 : 500,
                color: mediaTab === tab ? project.accent : '#B5AFA9',
                background: mediaTab === tab ? `${project.accent}0f` : 'none',
                border: mediaTab === tab ? `1px solid ${project.accent}25` : '1px solid transparent',
                padding: '6px 14px',
                marginRight: 8,
                marginTop: 10,
                marginBottom: 10,
                borderRadius: 100,
                cursor: 'pointer',
                transition: 'color 0.15s ease, background 0.15s ease, border-color 0.15s ease',
                textTransform: 'capitalize',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}>
                {tabConfig[tab]?.label || tab}
              </button>
            ))}
            <span style={{
              marginLeft: 'auto',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: '#B5AFA9',
              display: 'flex',
              alignItems: 'center',
              paddingRight: 4,
              flexShrink: 0,
            }}>
              3 min read
            </span>
          </div>
        </div>

        <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
          <div style={{ opacity: mediaPanelVisible ? 1 : 0, transform: mediaPanelVisible ? "translateY(0)" : "translateY(6px)", transition: "opacity 0.16s ease, transform 0.16s ease" }}>
            {mediaTab === "overview" && (
              <div style={{ background: "#F7F4EF", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(26,22,18,0.08)" }}>
                <div style={{ background: "#EDE9E3", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
                  {["#FF605C","#FFBD44","#00CA4E"].map(c => (<div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />))}
                  <span style={{ marginLeft: 10, fontSize: 11, color: "#B5AFA9", fontFamily: "'JetBrains Mono', monospace" }}>{project.url}</span>
                </div>
                <div style={{ padding: 12 }}>
                  <div ref={cardRef} style={{ opacity: cardVis ? 1 : 0, transform: cardVis ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 10 }}>
                      {project.metrics.map((m, j) => (
                        <div key={j} style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 14px", border: "1px solid rgba(26,22,18,0.06)" }}>
                          <div style={{ fontSize: 10, color: "#B5AFA9", fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>{m.label}</div>
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
            {mediaTab === "video" && (
              project.loomUrl
                ? (
                  <div style={{ background: "#F7F4EF", borderRadius: 12, border: "1px solid rgba(26,22,18,0.08)", overflow: "hidden" }}>
                    <iframe src={project.loomUrl} frameBorder="0" allowFullScreen style={{ width: "100%", height: 360, borderRadius: 8 }} />
                  </div>
                )
                : (
                  <div style={{
                    background: "#F7F4EF",
                    borderRadius: 12,
                    border: "1px solid rgba(26,22,18,0.08)",
                    padding: "48px 24px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `${project.accent}12`,
                      border: `1px solid ${project.accent}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="18" height="18" fill="none" stroke={project.accent} strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6460", margin: 0, lineHeight: 1.6 }}>
                      Walkthrough video coming soon.<br />
                      <span style={{ fontSize: 12, color: "#B5AFA9" }}>Add a <code>loomUrl</code> to the project data to embed it here.</span>
                    </p>
                  </div>
                )
            )}

            {mediaTab === "screenshots" && (
              (project.screenshots && project.screenshots.length > 0)
                ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {project.screenshots.map((src, j) => (
                      <img key={j} src={src} alt={`${project.name} screenshot ${j + 1}`}
                        style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(26,22,18,0.08)" }}
                        loading="lazy" />
                    ))}
                  </div>
                )
                : (
                  <div style={{
                    background: "#F7F4EF",
                    borderRadius: 12,
                    border: "1px solid rgba(26,22,18,0.08)",
                    padding: "48px 24px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `${project.accent}12`,
                      border: `1px solid ${project.accent}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="18" height="18" fill="none" stroke={project.accent} strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6460", margin: 0, lineHeight: 1.6 }}>
                      UI screenshots coming soon.<br />
                      <span style={{ fontSize: 12, color: "#B5AFA9" }}>Add a <code>screenshots</code> array to the project data.</span>
                    </p>
                  </div>
                )
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 0, padding: "20px 28px", borderBottom: "1px solid rgba(26,22,18,0.06)" }}>
          {[{ label: "Challenge", content: project.problem }, { label: "Solution", content: project.solution }, { label: "Key Outcomes", isOutcomes: true, outcomes: project.outcomes }].map((col, j) => (
            <div key={j} style={{ paddingRight: isMobile ? 0 : (j < 2 ? 28 : 0), paddingLeft: isMobile ? 0 : (j > 0 ? 28 : 0), borderRight: isMobile ? "none" : (j < 2 ? "1px solid rgba(26,22,18,0.06)" : "none"), borderBottom: isMobile && j < 2 ? "1px solid rgba(26,22,18,0.06)" : "none", paddingBottom: isMobile && j < 2 ? 20 : 0, paddingTop: isMobile && j > 0 ? 20 : 0 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#B5AFA9", marginBottom: 12 }}>{col.label}</div>
              {col.isOutcomes ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.outcomes.map((o, k) => (<div key={k} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><div style={{ width: 5, height: 5, borderRadius: "50%", background: project.accent, marginTop: 6, flexShrink: 0 }} /><span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", lineHeight: 1.6 }}>{o}</span></div>))}
                </div>
              ) : (<p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", lineHeight: 1.68, margin: 0 }}>{col.content}</p>)}
            </div>
          ))}
        </div>

        <div style={{ padding: "14px 28px", display: "flex", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.stack.map(t => (<span key={t} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: "#6B6460", background: "rgba(26,22,18,0.05)", border: "1px solid rgba(26,22,18,0.1)", padding: "3px 9px", borderRadius: 4 }}>{t}</span>))}
          </div>
          {project.url && (<a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: project.accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, transition: "gap 0.15s ease" }} onMouseEnter={e => { e.currentTarget.style.gap = "8px"; }} onMouseLeave={e => { e.currentTarget.style.gap = "5px"; }}>View live site →</a>)}
        </div>
      </div>
    </R>
  );
};

/* ─── WORK SECTION ──────────────────────────────────────────── */
const Work = () => {
  const projects = [
    { name: "Sovva", type: "Meal Subscription · Business Platform", url: "sovva.io", stat: "Zero manual scheduling", accent: "#1B4FD8", loomUrl: null, screenshots: [], problem: "A meal subscription business was operating with no unified system — subscription management, daily order generation, CRM, invoicing, and client communication were handled across disconnected tools. The ops team was doing manual reconciliation every day; leadership had no real-time view of the business.", solution: "Built a consolidated platform covering the full client lifecycle: user-facing meal plan builder and subscription management, automated daily order generation via background jobs, CRM and pipeline tracking, automated invoicing, and a real-time reporting dashboard giving leadership visibility across every workstream.", outcomes: ["Daily order generation fully automated — zero manual scheduling","Subscription billing and invoicing handled end-to-end with no manual reconciliation","Replaced multiple disconnected tools with one purpose-built system","Real-time pipeline and delivery visibility for leadership"], stack: [".NET 8","Angular","PostgreSQL","EF Core","Hangfire","Stripe","Azure","JWT Auth"], metrics: [{label:"Manual Tasks",value:"Automated"},{label:"Hours Saved/Wk",value:"10+"},{label:"Modules",value:"5"}], bars: [.35,.5,.6,.72,.8,.88,.92,.95] },
    { name: "Smile Your Confidence", type: "Healthcare · Lead Generation", url: "smileyourconfidence.in", stat: "Live with patients", accent: "#0891B2", loomUrl: null, screenshots: [], problem: "A specialist dental clinic in Jaipur had no meaningful online presence. Prospective patients couldn't understand the services available, and the practice had no structured way to capture enquiries or build trust before a patient walked in.", solution: "Designed and built a clean, professional site covering the full treatment range — structured service pages, an appointment request form, clear trust signals, and a responsive layout aligned with the clinic's brand.", outcomes: ["Treatment and pricing clearly communicated online for the first time","Structured enquiry flow reducing friction for new patient conversions","Foundation laid for expanding into dental education and training content"], stack: ["HTML5","CSS3","JavaScript","WordPress"], metrics: [{label:"Services Listed",value:"12+"},{label:"Enquiry Forms",value:"Live"},{label:"Mobile Ready",value:"100%"}], bars: [.3,.45,.6,.65,.72,.78,.82,.88] },
    { name: "Mechanical Bazaar", type: "B2B Industrial · Procurement", url: "mechanicalbazaar.in", stat: "Built for bulk buyers", accent: "#7C3AED", loomUrl: null, screenshots: [], problem: "A mechanical components business supplying bolts, nuts, and solar mounting hardware was losing potential bulk buyers because it had no professional digital presence. Buyers couldn't browse specifications or initiate a quote without calling.", solution: "Built a structured B2B site with a clean product catalogue, category filtering, specification pages, and clear 'Request a Quote' flows via web form and WhatsApp — designed to communicate reliability to industrial procurement teams.", outcomes: ["Professional digital storefront suited to B2B procurement expectations","Simplified quote workflow — less friction, faster response times","Catalogue structure that scales cleanly as product lines expand"], stack: ["HTML5","CSS3","Vanilla JavaScript"], metrics: [{label:"Product Categories",value:"8+"},{label:"Quote Channels",value:"2"},{label:"Dependencies",value:"Zero"}], bars: [.28,.42,.55,.62,.7,.75,.8,.85] },
  ];

  return (
    <section id="work" style={{ background: "#FFFFFF", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 14 }}>Selected work</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 16 }}>Real businesses.<br /><span style={{ fontStyle: "italic", color: "#6B6460" }}>Real outcomes.</span></h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#6B6460", maxWidth: 500, lineHeight: 1.72, marginBottom: 60 }}>Three of the products I've built end-to-end. Each one is in production, used daily by real people, and still running without maintenance calls.</p>
        </R>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {projects.map((p, i) => <CaseStudyCard key={p.name} project={p} i={i} />)}
        </div>
      </div>
    </section>
  );
};

/* ─── TESTIMONIALS SECTION ─────────────────────────────────── */
const TestimonialsSection = () => {
  const testimonials = [
    { quote: "Rishi didn't just build what we asked for — he asked the questions that made us realise what we actually needed. The platform replaced three tools we were paying for and our ops team stopped doing manual work overnight.", author: "Founder, Meal Subscription Business", company: "Sovva", industry: "Food & Logistics", initial: "S", color: "#1B4FD8" },
    { quote: "I've worked with developers who disappear after onboarding. Rishi was the opposite — weekly demos, clear communication, and a staging environment from day one. We always knew what was happening.", author: "Director", company: "Healthcare Clinic", industry: "Healthcare", initial: "A", color: "#0891B2" },
    { quote: "He explained every technical decision in plain English. I'm not a technical person, but I understood exactly what was being built and why. That's rare.", author: "Owner", company: "B2B Industrial Business", industry: "B2B / Procurement", initial: "M", color: "#16A34A" },
  ];

  return (
    <section id="testimonials" style={{ background: "#F0EDE8", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 14 }}>Client feedback</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 16 }}>In their words,<br /><span style={{ fontStyle: "italic", color: "#6B6460" }}>not mine.</span></h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#6B6460", maxWidth: 480, lineHeight: 1.72, marginBottom: 60 }}>Clients describe the experience — not the features.</p>
        </R>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24, alignItems: "start" }}>
          {testimonials.map((t, i) => (
            <R key={i} d={i * 0.08} className="testimonial-r">
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 16, padding: "32px 28px", boxShadow: "0 2px 12px rgba(26,22,18,0.04)", display: "flex", flexDirection: "column", gap: 24, transition: "box-shadow 0.2s ease, transform 0.2s ease" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 8px 28px rgba(26,22,18,0.08), inset 0 0 0 1px rgba(26,22,18,0.12)`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,22,18,0.04)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, lineHeight: 0.8, color: `${t.color}20`, fontWeight: 400, userSelect: "none", marginTop: -8, position: "relative" }}>"</div>
                <div style={{ width: 28, height: 3, borderRadius: 2, background: t.color, marginTop: -8, opacity: 0.7 }} />
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 400, fontStyle: "italic", color: "#1A1612", lineHeight: 1.68, margin: 0, marginTop: -20 }}>"{t.quote}"</p>
                <div style={{ borderTop: "1px solid rgba(26,22,18,0.07)" }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{t.initial}</div>
                  <div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#1A1612" }}>{t.author}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#B5AFA9", marginTop: 2 }}>{t.company} · {t.industry}</div>
                  </div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── RISK REVERSAL SECTION ────────────────────────────────── */
const RiskReversalSection = () => (
  <section style={{ background: "#1A1612", padding: "80px 32px", borderTop: "1px solid rgba(247,244,239,0.06)" }}>
    <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
      <R>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 100, padding: "5px 16px", marginBottom: 28 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#16A34A", letterSpacing: ".06em", textTransform: "uppercase" }}>Zero-risk first step</span>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,4vw,48px)", fontWeight: 400, color: "#F7F4EF", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 24 }}>
          If the discovery call isn't useful,<br /><span style={{ fontStyle: "italic", color: "rgba(247,244,239,0.45)" }}>I'll tell you first.</span>
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "rgba(247,244,239,0.6)", lineHeight: 1.72, maxWidth: 600, margin: "0 auto 40px" }}>
          The discovery call exists to figure out whether we're a good match — not to sell you something. If your problem isn't one I can solve well, I'll say so directly and recommend who can. You leave with a useful technical perspective either way.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[
            { title: "No contract to sign", desc: "Nothing to commit to before we talk." },
            { title: "No invoice after the call", desc: "Discovery is always free. No exceptions." },
            { title: "Honest fit assessment", desc: "I'll tell you if I'm the wrong choice." },
            { title: "Useful either way", desc: "You leave with a clearer technical direction." },
          ].map((item, i) => (
            <div key={i} style={{ background: "rgba(247,244,239,0.04)", border: "1px solid rgba(247,244,239,0.08)", borderRadius: 12, padding: "20px 20px", textAlign: "left" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width="14" height="14" fill="none" stroke="#16A34A" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "rgba(247,244,239,0.85)", marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(247,244,239,0.4)", lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <a href="#contact" style={{ background: "#1A1612", color: "#F7F4EF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 32px", borderRadius: 8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 2px 8px rgba(26,22,18,0.15)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#1B4FD8"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,79,216,0.28)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,22,18,0.15)"; }}
          onMouseDown={e => { e.currentTarget.style.transform = "translateY(0)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        >
          Book the free discovery call
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </R>
    </div>
  </section>
);

/* ─── PROCESS ───────────────────────────────────────────────── */
const Process = () => {
  const [active, setActive] = useState(0);
  const [displayActive, setDisplayActive] = useState(0);
  const [panelVisible, setPanelVisible] = useState(true);
  const isMobile = useIsMobile();

  const handleStepClick = (i) => {
    setPanelVisible(false);
    setTimeout(() => { setDisplayActive(i); setPanelVisible(true); }, 80);
    setActive(i);
  };

  const steps = [
    { n: "01", title: "Discovery", time: "60 minutes", outcome: "You leave knowing exactly what to build and how.", desc: "A structured conversation about your business — not a requirements dump. I ask about your model, constraints, operations, timeline, and what success looks like in 90 days. You'll leave with a clear picture of the recommended approach, not a proposal to ignore.", deliverable: "Problem definition · Opportunity map · Recommended approach" },
    { n: "02", title: "Architecture & Scope", time: "3–5 days", outcome: "A document your whole team can read and act on.", desc: "I produce a technical scope document built to a standard a CTO would expect: system architecture, data model, API contracts, infrastructure plan, risk register, and a milestone-based breakdown tied to a fixed-price proposal. No vague estimates. No hourly-rate surprises.", deliverable: "Technical specification · Fixed-price milestone proposal" },
    { n: "03", title: "Build", time: "Agreed timeline", outcome: "Weekly demos. You always know what's done and what's next.", desc: "Weekly demo calls, staging environment from day one, and every commit tied to a milestone. You always know what's built, what's next, and what might be a risk — before it becomes a problem.", deliverable: "Weekly demos · Staging access from day one · Milestone-tracked commits" },
    { n: "04", title: "Launch", time: "Launch week", outcome: "Live in production, stable, supported for the first two weeks.", desc: "Production deployment, smoke testing, performance review, and documentation. I stay on call for the first two weeks post-launch to handle anything that surfaces in the real world. The finish line isn't the deploy — it's a stable, live product.", deliverable: "Live production system · Technical docs · Two-week launch support" },
    { n: "05", title: "Support & Scale", time: "Ongoing", outcome: "You own the system completely — with or without me.", desc: "After launch, you choose: a monthly retainer for ongoing maintenance and feature development, or a clean handoff package so your team or another developer can take it forward without friction. Either way, the system is fully yours.", deliverable: "Monthly retainer · or · Full handoff package with documentation" },
  ];

  return (
    <section id="process" style={{ background: "#F0EDE8", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 14 }}>How I work</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,4vw,50px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 14 }}>No black boxes.<br />No surprises.</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, color: "#6B6460", maxWidth: 500, lineHeight: 1.72, marginBottom: 64 }}>Every engagement follows a structured process with defined deliverables at each stage. You'll always know what's being built, when it will be ready, and what decisions are coming — before they arrive.</p>
        </R>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.3fr", gap: 48 }}>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 3 }}>
            {!isMobile && (
              <div style={{ position: "absolute", left: 37, top: 48, bottom: 16, width: 1, background: "rgba(26,22,18,0.08)", zIndex: 0 }} />
            )}
            {steps.map((s, i) => (
              <R key={i} d={i * 0.06}>
                <div onClick={() => handleStepClick(i)} style={{ padding: "18px 22px", borderRadius: 10, cursor: "pointer", background: active === i ? "#FFFFFF" : "transparent", border: `1px solid ${active === i ? "rgba(27,79,216,0.15)" : "transparent"}`, boxShadow: active === i ? "0 2px 8px rgba(26,22,18,0.06)" : "none", transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease", position: "relative", zIndex: 1 }}
                  onMouseEnter={e => { if (active !== i) e.currentTarget.style.background = "rgba(26,22,18,0.03)"; }}
                  onMouseLeave={e => { if (active !== i) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: active === i ? "#1B4FD8" : "rgba(26,22,18,0.07)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s ease, color 0.2s ease", position: "relative", zIndex: 1 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 12, color: active === i ? "#FFFFFF" : "#6B6460" }}>{s.n}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: active === i ? 600 : 400, fontSize: 15, color: active === i ? "#1A1612" : "#6B6460", transition: "color 0.2s ease, font-weight 0.2s ease", marginBottom: 3 }}>{s.title}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#B5AFA9", marginTop: 2 }}>{s.time}</div>
                    </div>
                  </div>
                </div>
              </R>
            ))}
          </div>

          <R>
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 16, padding: 36, minHeight: 280, position: isMobile ? "static" : "sticky", top: isMobile ? "auto" : 88, boxShadow: "0 4px 20px rgba(26,22,18,0.06)" }}>
              <div style={{ opacity: panelVisible ? 1 : 0, transform: panelVisible ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.16s ease, transform 0.16s ease" }}>
                <div style={{ display: "inline-block", background: "rgba(27,79,216,0.08)", border: "1px solid rgba(27,79,216,0.15)", borderRadius: 6, padding: "4px 12px", marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 700, color: "#1B4FD8" }}>Step {steps[displayActive].n}</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#1B4FD8", letterSpacing: ".02em", marginBottom: 12, marginTop: 4 }}>
                  {steps[displayActive].outcome}
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 500, color: "#1A1612", letterSpacing: "-0.01em", marginBottom: 16 }}>{steps[displayActive].title}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6B6460", lineHeight: 1.7, marginBottom: 28 }}>{steps[displayActive].desc}</p>
                <div style={{ borderTop: "1px solid rgba(26,22,18,0.08)", paddingTop: 20 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#B5AFA9", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>Deliverable</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1B4FD8", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500, color: "#6B6460" }}>{steps[displayActive].deliverable}</span>
                  </div>
                </div>
              </div>
            </div>
          </R>
        </div>
      </div>
    </section>
  );
};

/* ─── WHY ME ─────────────────────────────────────────────── */
const WhyMe = () => {
  const reasons = [
    { icon: "→", title: "You'll never wonder what's happening.", desc: "Every week you get a demo, a staging URL, and a plain-English summary of what was built and what's next. No chasing. No radio silence. If something's at risk, you hear it from me before it becomes a problem." },
    { icon: "↑", title: "Enterprise discipline on a founder's timeline.", desc: "I spent years at Infosys working on financial data platforms with real consequences for cutting corners. I brought that discipline to every small build I've done since. Proper documentation, proper security thinking, proper architecture — not because it's optional, but because it's what makes software last." },
    { icon: "◉", title: "I won't build something you can't use.", desc: "Every technical decision I make gets filtered through one question: does this serve what the business needs to do right now? Elegant architecture that delays your launch or confuses your team isn't cleverness — it's a failure. I measure success by what the system makes possible for you, not how it reads on GitHub." },
    { icon: "◻", title: "The uncomfortable conversation happens in week two, not week eight.", desc: "Scope changes and surprise invoices are almost always caused by information that wasn't shared early enough. I would rather have an awkward conversation about risk or scope in the second week than let it become a crisis in the eighth. I flag things. It's a habit." },
    { icon: "⟳", title: "When we're done, the system is yours — completely.", desc: "Every project is documented, tested, and handed over so your team — or any competent developer — can take it forward without me in the loop. I actively avoid creating technical dependency on myself. Your business should grow after our engagement ends, not stall waiting for me to pick up the phone." },
  ];

  return (
    <section style={{ background: "#F7F4EF", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80 }}>
          <R>
            <div style={{ position: "sticky", top: 88 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 14 }}>How I actually work</span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 20 }}>Five commitments.<br />Not marketing copy.</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B6460", lineHeight: 1.72 }}>These are the things I've promised every client before we started — and the things I'd want a developer to promise me if I were hiring one.</p>
            </div>
          </R>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {reasons.map((r, i) => (
              <R key={i} d={i * 0.07}>
                <div style={{ display: "flex", gap: 20, padding: "28px 16px", borderBottom: i < reasons.length - 1 ? "1px solid rgba(26,22,18,0.08)" : "none", borderRadius: 10, transition: "background 0.2s ease" }}
                  onMouseEnter={e => {
                    const iw = e.currentTarget.querySelector(".icon-wrap");
                    if (iw) { iw.style.background = "#1B4FD8"; iw.style.color = "#F7F4EF"; }
                    e.currentTarget.style.background = "rgba(27,79,216,0.03)";
                    e.currentTarget.style.borderRadius = "10px";
                  }}
                  onMouseLeave={e => {
                    const iw = e.currentTarget.querySelector(".icon-wrap");
                    if (iw) { iw.style.background = "rgba(26,22,18,0.06)"; iw.style.color = "#6B6460"; }
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderRadius = "10px";
                  }}
                >
                  <div className="icon-wrap" style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(26,22,18,0.06)", color: "#6B6460", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, flexShrink: 0, transition: "background 0.2s ease, color 0.2s ease", marginTop: 2 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 500, color: "#1A1612", marginBottom: 8 }}>{r.title}</h3>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#6B6460", lineHeight: 1.7 }}>{r.desc}</p>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── TECH STACK ─────────────────────────────────────────────── */
const TechStack = () => {
  const isMobile = useIsMobile();
  const techs = [
    { name: ".NET / ASP.NET Core", role: "The backbone of every serious backend — APIs, business logic, background services", color: "#60A5FA" },
    { name: "Angular", role: "Enterprise-grade frontends and complex dashboard UIs that don't fall apart at scale", color: "#F87171" },
    { name: "React / Next.js", role: "Full-stack web apps and marketing sites — from MVP to production", color: "#67E8F9" },
    { name: "TypeScript", role: "Type-safe codebases that another developer can actually maintain", color: "#93C5FD" },
    { name: "Node.js", role: "Lightweight APIs, webhooks, and real-time services where speed matters", color: "#86EFAC" },
    { name: "PostgreSQL", role: "Primary relational database — robust, scalable, and battle-tested", color: "#93C5FD" },
    { name: "SQL Server", role: "Relational database for enterprise-scale data, reporting, and legacy system integration", color: "#FCA5A5" },
    { name: "MongoDB", role: "Flexible document storage where schema needs room to evolve", color: "#86EFAC" },
    { name: "Supabase", role: "Auth, database, and APIs for lean products and early-stage builds", color: "#6EE7B7" },
    { name: "Azure", role: "Cloud infrastructure, deployment pipelines, and scalable hosting", color: "#7DD3FC" },
    { name: "Docker", role: "Containerisation for consistent, predictable environments from dev to prod", color: "#67E8F9" },
    { name: "Redis", role: "Caching, queues, and session storage — keeps things fast under load", color: "#FCA5A5" },
    { name: "Hangfire", role: "Background jobs and scheduled tasks that run reliably without cron guesswork", color: "#C4B5FD" },
    { name: "OpenAI / LLMs", role: "AI features and intelligent automation that serve a genuine business function", color: "#6EE7B7" },
    { name: "Stripe", role: "Subscription billing, one-time payments, and invoicing — production-proven", color: "#A5B4FC" },
    { name: "Prisma", role: "Type-safe ORM that makes database access predictable and refactor-friendly", color: "#C4B5FD" },
    { name: "React Native", role: "Cross-platform mobile apps sharing logic with your existing web product", color: "#67E8F9" },
    { name: "WordPress / Shopify", role: "CMS and e-commerce platforms when the business need fits — no over-engineering", color: "#7DD3FC" },
  ];
  return (
    <section style={{ background: "#1A1612", padding: "80px 32px", borderTop: "1px solid rgba(247,244,239,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#6B6460", display: "block", marginBottom: 14 }}>Technical capabilities</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px,3vw,40px)", fontWeight: 400, color: "#F7F4EF", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 14 }}>The stack. Not the selling point.</h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "rgba(247,244,239,0.6)", maxWidth: 480, lineHeight: 1.72, marginBottom: 52 }}>Tools are chosen for the problem, not the other way around. Here's what I reach for most often.</p>
        </R>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
          {techs.map((t, i) => (
            <R key={t.name} d={i * 0.03}>
              <div style={{ background: "rgba(247,244,239,0.04)", border: "1px solid rgba(247,244,239,0.08)", borderRadius: 10, padding: "18px 20px", cursor: "default" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#1B4FD8", opacity: 0.4, marginBottom: 14 }} />
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(247,244,239,0.8)", marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "rgba(247,244,239,0.4)" }}>{t.role}</div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── PARTNER SECTION ────────────────────────────────────────── */
const PartnerSection = () => {
  const isMobile = useIsMobile();
  return (
    <section id="partners" style={{ background: "#F7F4EF", padding: "100px 32px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <R>
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 20, padding: isMobile ? "40px 24px" : "72px 64px", position: "relative", overflow: "hidden", boxShadow: "0 4px 24px rgba(26,22,18,0.06)" }}>
            <div style={{ position: "absolute", top: -120, right: -80, width: 400, height: 400, background: "radial-gradient(circle, rgba(27,79,216,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", background: "rgba(27,79,216,0.07)", border: "1px solid rgba(27,79,216,0.15)", borderRadius: 100, padding: "5px 14px", marginBottom: 28 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, color: "#1B4FD8", letterSpacing: ".08em", textTransform: "uppercase" }}>For agencies &amp; consultants</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 32 : 60, alignItems: "center" }}>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(26px,3.5vw,44px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 20 }}>When your clients need<br />software built —<br /><span style={{ fontStyle: "italic", color: "#1B4FD8" }}>I'm the person you call.</span></h2>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B6460", lineHeight: 1.72, marginBottom: 16 }}>I work as a technical implementation partner for agencies and consultants who need reliable software delivery without building an in-house engineering team. You keep the client relationship and the margin. I handle the architecture, build, and delivery — under your brand, to your standard.</p>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, color: "#6B6460", lineHeight: 1.72, marginBottom: 36 }}>I can operate entirely in the background or join client calls as your technical partner when a conversation needs engineering credibility in the room. The engagement is structured around how your firm works, not the other way around.</p>
                  <a href="#contact" style={{ background: "#1A1612", color: "#F7F4EF", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, padding: "13px 24px", borderRadius: 8, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.2s ease, transform 0.2s ease", boxShadow: "0 2px 8px rgba(26,22,18,0.15)" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1B4FD8"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; }}
                    onMouseDown={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                    onMouseUp={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                  >Start a partner conversation<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg></a>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { t: "White-label engagements", d: "I operate under your brand. Your client never needs to know the arrangement — unless you want them to." },
                    { t: "Technical credibility when you need it", d: "I can join discovery calls or client presentations as your engineering partner — adding credibility without adding overhead." },
                    { t: "Flexible engagement models", d: "Project-based for defined scopes, or retainer for ongoing client accounts. Structured around how your pipeline works." },
                    { t: "No client poaching — ever", d: "Explicit non-solicitation as standard. Your client relationship is yours. No ambiguity, no grey area, no exceptions." },
                  ].map((item, i) => (
                    <div key={i} style={{ background: "#F7F4EF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 10, padding: "16px 20px" }}>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: "#1A1612", marginBottom: 5 }}>{item.t}</div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6B6460", lineHeight: 1.6 }}>{item.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
};

/* ─── CONTACT / CTA ──────────────────────────────────────────── */
const CTA = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "", botcheck: false });
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const inputStyle = (field) => ({
    background: "#FFFFFF",
    border: `1px solid ${errors[field] ? "#E5534B" : focusedField === field ? "#1B4FD8" : "rgba(26,22,18,0.15)"}`,
    boxShadow: errors[field] ? "0 0 0 3px rgba(229,83,75,0.1)" : focusedField === field ? "0 0 0 3px rgba(27,79,216,0.1)" : "none",
    borderRadius: 8, padding: "14px 16px", width: "100%",
    fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#1A1612", outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease", boxSizing: "border-box",
  });

  const handleSubmit = async () => {
    setSubmitError("");
    const newErrors = {
      name: !formState.name.trim(),
      email: !formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email),
      message: !formState.message.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "74311a31-382d-47ee-817f-b09ec8055c85",
          name: formState.name,
          email: formState.email,
          message: formState.message,
          botcheck: formState.botcheck,
          subject: "New Discovery Call Request from Portfolio",
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormState({ name: "", email: "", message: "", botcheck: false });
      } else {
        setSubmitError("Form submission failed. Please try again.");
      }
    } catch (error) {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{ background: "#F7F4EF", padding: "100px 32px 120px", borderTop: "1px solid rgba(26,22,18,0.06)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <R>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "#1B4FD8", display: "block", marginBottom: 24 }}>Start here</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(36px,6vw,68px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.02em", lineHeight: 1.04, marginBottom: 22 }}>
              Still figuring out<br /><span style={{ fontStyle: "italic", color: "#1B4FD8" }}>what to build first?</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: "#6B6460", lineHeight: 1.72, maxWidth: 560, margin: "0 auto 16px" }}>
              Most founders I talk to have a rough idea and a growing list of questions. The 30-minute call is built to answer them — not to pitch you. You leave with a clear direction. Whether we work together or not.
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#B5AFA9", maxWidth: 500, margin: "0 auto" }}>
              I take 1–2 new projects per quarter. If your timeline doesn't fit or your scope isn't right for me, I'll say so clearly and recommend someone who's a better match.
            </p>
          </div>
        </R>

        <R d={0.1}>
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(26,22,18,0.08)", borderRadius: 20, padding: 40, boxShadow: "0 4px 24px rgba(26,22,18,0.06)" }}>
            {submitted ? (
              <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 16, padding: "48px 40px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" fill="none" stroke="#16A34A" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 400, color: "#1A1612", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  Request Received.
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: "#6B6460", lineHeight: 1.7, maxWidth: 360, margin: 0 }}>
                  Thanks for sharing the details of your project. I personally review all inquiries to ensure a strong mutual fit, and I will be in touch within 24 hours to outline our next steps.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormState({ name: "", email: "", message: "" }); }}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#B5AFA9", background: "none", border: "none", cursor: "pointer", marginTop: 8, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460", display: "block", marginBottom: 8 }}>Name</label>
                    <input type="text" value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))} placeholder="Your name" style={inputStyle("name")} onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)} />
                    {errors.name && (<span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E5534B", marginTop: 4, display: "block" }}>Please enter your name</span>)}
                  </div>
                  <div>
                    <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460", display: "block", marginBottom: 8 }}>Email</label>
                    <input type="email" value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))} placeholder="your@email.com" style={inputStyle("email")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)} />
                    {errors.email && (<span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E5534B", marginTop: 4, display: "block" }}>Please enter a valid email address</span>)}
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: "#6B6460", display: "block", marginBottom: 8 }}>Tell me what you're trying to build</label>
                  <textarea value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))} placeholder="Rough ideas, half-formed thoughts, urgent problems — all welcome. What's the situation? What's broken or missing? What does a win look like?" rows={5} style={{ ...inputStyle("message"), resize: "vertical" }} onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)} />
                  {errors.message && (<span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#E5534B", marginTop: 4, display: "block" }}>Tell me a little about your project</span>)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {submitError && (<span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E5534B", background: "rgba(229,83,75,0.08)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(229,83,75,0.2)" }}>{submitError}</span>)}
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: "#6B6460" }}>⚡ Responds within 4 hours — usually same day</span>
                  <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                    <input type="checkbox" name="botcheck" style={{ display: "none" }} checked={formState.botcheck} onChange={e => setFormState(s => ({ ...s, botcheck: e.target.checked }))} />
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      style={{ background: "#1A1612", color: "#F7F4EF", padding: "15px 32px", borderRadius: 8, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 9, transition: "background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease", boxShadow: "0 2px 8px rgba(26,22,18,0.15)", border: "none", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                      onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.background = "#1B4FD8"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(27,79,216,0.28)"; }}}
                      onMouseLeave={e => { e.currentTarget.style.background = "#1A1612"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(26,22,18,0.15)"; }}
                      onMouseDown={e => { if (!isSubmitting) e.currentTarget.style.transform = "translateY(0)"; }}
                      onMouseUp={e => { if (!isSubmitting) e.currentTarget.style.transform = "translateY(-2px)"; }}
                    >
                      {isSubmitting ? (
                        <>
                          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Book a Free 30-Min Call
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </>
                      )}
                    </button>
                  </div>
                  <a href="mailto:hello@rishijain.dev" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#B5AFA9", textDecoration: "none", display: "block", textAlign: "center", marginTop: 4, transition: "color 0.18s ease" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#6B6460"}
                    onMouseLeave={e => e.currentTarget.style.color = "#B5AFA9"}
                  >or email hello@rishijain.dev directly</a>
                </div>
              </div>
            )}
          </div>
        </R>
      </div>
    </section>
  );
};

/* ─── FOOTER ─────────────────────────────────────────────────── */
const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  return (
    <footer style={{ background: "#1A1612", borderTop: "1px solid rgba(247,244,239,0.06)", padding: "36px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "rgba(247,244,239,0.12)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: "#F7F4EF", fontWeight: 400 }}>Rj</span>
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "rgba(247,244,239,0.4)" }}>
            © 2026 Rishi Jain &nbsp;·&nbsp; Technical Implementation Partner &nbsp;·&nbsp; Pune, India
          </span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[
            { label: "LinkedIn",    href: "https://linkedin.com/in/rishijain" },
            { label: "GitHub",      href: "https://github.com/rishijain" },
            { label: "Email",       href: "mailto:hello@rishijain.dev" },
            { label: "Book a Call", href: "#contact" },
          ].map(l => (
            <a key={l.label} href={l.href}
              target={l.href.startsWith("#") ? undefined : "_blank"}
              rel={l.href.startsWith("#") ? undefined : "noopener noreferrer"}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 500, color: hoveredLink === l.label ? "#F7F4EF" : "rgba(247,244,239,0.6)", textDecoration: "none", transition: "color 0.18s ease" }}
              onMouseEnter={() => setHoveredLink(l.label)}
              onMouseLeave={() => setHoveredLink(null)}
              onClick={e => { if (l.href.startsWith('#')) { e.preventDefault(); const el = document.querySelector(l.href); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }}
            >{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

/* ─── ROOT ───────────────────────────────────────────────────── */
export default function RishiJainPortfolio() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.title = "Rishi Jain — Technical Implementation Partner";
    if (!document.querySelector('link[data-fonts="rj"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-fonts", "rj");
      link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300..700&family=JetBrains+Mono:wght@400;500&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div style={{ background: "#F7F4EF", minHeight: "100vh" }}>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .hero-visual-r { display: flex; flex-direction: column; }
        .testimonial-r { height: 100%; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F7F4EF; }
        ::-webkit-scrollbar-thumb { background: rgba(26,22,18,0.14); border-radius: 3px; }
        ::selection { background: rgba(27,79,216,0.2); }
        input::placeholder, textarea::placeholder { color: #B5AFA9; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes grainMove { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-1%,1%)} 50%{transform:translate(1%,-1%)} 75%{transform:translate(-1%,-1%)} }
        .grain-overlay { position: relative; }
        .grain-overlay::after { content:''; position:absolute; inset:0; pointer-events:none; z-index:1; opacity:0.018; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); background-repeat:repeat; background-size:128px 128px; }
      `}</style>
      <ScrollProgress />
      <Nav />
      <Hero />
      <ProblemSection />
      <WhatIBuild />
      <ComparisonSection />
      <Work />
      <TestimonialsSection />
      <RiskReversalSection />
      <Process />
      <WhyMe />
      <TechStack />
      <PartnerSection />
      <CTA />
      <Footer />
    </div>
  );
}