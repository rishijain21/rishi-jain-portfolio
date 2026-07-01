import { useState } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { FAQ_ITEMS } from "../../data/faqItems";
import { R } from "../ui/R";
import { FAQItem } from "../ui/FAQItem";

export const FAQ = () => {
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
                            <FAQItem key={item.q} item={item} idx={i} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
                        ))}
                    </div>
                </R>
            </div>
        </section>
    );
};
