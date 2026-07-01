export const FAQItem = ({ item, isOpen, onToggle, idx }) => (
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
