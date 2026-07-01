import { SITE_CONFIG } from "../../config/site";

export const AvailabilityDot = ({ small }) => (
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
