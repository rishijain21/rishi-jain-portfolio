import { useIsMobile } from "../../hooks/useIsMobile";
import { R } from "../ui/R";

export const TrustStrip = () => {
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
