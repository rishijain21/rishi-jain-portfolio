import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { SITE_CONFIG } from "../../config/site";
import { R } from "../ui/R";
import { track } from "../../utils/track";

export const CTA = () => {
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
                                    {errors.submit && <span role="alert" aria-live="polite" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#E5534B", marginTop: 4, display: "block", textAlign: "center" }}>Something didn't go through on my end. Email me directly at <a href="mailto:hello@rishijain.dev" style={{ color: "#E5534B" }}>hello@rishijain.dev</a>.</span>}
                                    <a href="mailto:hello@rishijain.dev" style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", textDecoration: "none", display: "block", textAlign: "center", marginTop: 4, transition: "color 0.18s ease" }} onMouseEnter={e => e.currentTarget.style.color = "#6B6460"} onMouseLeave={e => e.currentTarget.style.color = "#857F79"}>or email hello@rishijain.dev directly</a>
                                </div>

                                <div style={{ borderTop: "1px solid rgba(26,22,18,0.08)", paddingTop: 24, marginTop: 4, textAlign: "center" }}>
                                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#857F79", marginBottom: 12 }}>Prefer to skip the form?</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", alignItems: "center" }}>
                                        <a href="mailto:hello@rishijain.dev" style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600, color: "#1B4FD8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, borderBottom: "1px solid rgba(27,79,216,0.3)", paddingBottom: 2 }}>Email me directly →</a>
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
